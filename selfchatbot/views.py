from django.shortcuts import render, redirect
from django.utils import timezone
from .models import Chatbot
import logging
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.memory import ConversationBufferMemory
import os
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework_simplejwt.authentication import JWTAuthentication

logger = logging.getLogger(__name__)

openai_api_key = os.getenv("OPENAI_API_KEY")
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
database = Chroma(persist_directory="./database", embedding_function=embeddings)
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
chat = ChatOpenAI(api_key=openai_api_key, model="gpt-3.5-turbo")

qa_chain = ConversationalRetrievalChain.from_llm(
    llm=chat,
    retriever=database.as_retriever(search_kwargs={"k": 3}),
    memory=memory
)

def get_user_from_token(request):
    jwt_auth = JWTAuthentication()
    header = jwt_auth.get_header(request)
    raw_token = jwt_auth.get_raw_token(header)
    validated_token = jwt_auth.get_validated_token(raw_token)
    user = jwt_auth.get_user(validated_token)
    return user

@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get('question')
            session_id = data.get('session_id')
            if query and session_id:
                try:
                    user = get_user_from_token(request)
                    user_id = user.id if user else None

                    try:
                        chat_history = memory.load()
                    except Exception as e:
                        logger.error(f"Error loading memory: {e}")
                        chat_history = []

                    result = qa_chain({"question": query, "chat_history": chat_history})
                    answer = result['answer']

                    timestamp = timezone.now()

                    Chatbot.objects.create(
                        user_id=user_id,
                        session_id=session_id,
                        question_content=query,
                        answer_content=answer,
                        created_at=timestamp
                    )

                    return JsonResponse({
                        'question': query,
                        'answer': answer,
                        'timestamp': timestamp
                    })

                except Exception as e:
                    logger.error(f"Error during chat processing: {e}")
                    return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
            else:
                logger.warning("No question or session_id provided.")
                return JsonResponse({'status': 'error', 'message': 'No question or session_id provided'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

def chat_sessions(request):
    user = get_user_from_token(request)
    user_id = user.id if user else None
    sessions = Chatbot.objects.filter(user_id=user_id).values('session_id').distinct()
    return JsonResponse(list(sessions), safe=False)

def chat_history(request, session_id):
    user = get_user_from_token(request)
    user_id = user.id if user else None
    chats = Chatbot.objects.filter(user_id=user_id, session_id=session_id).order_by('created_at')
    chat_data = [
        {
            'question': chat.question_content,
            'answer': chat.answer_content,
            'timestamp': chat.created_at
        }
    for chat in chats]
    return JsonResponse(chat_data, safe=False)

def error_page(request):
    return render(request, 'error_page.html')

def chat_clear_logs(request):
    if request.method == 'POST':
        Chatbot.objects.filter(session_id=request.session.session_key).delete()
        return redirect('selfchatbot:chat_page')
    else:
        return HttpResponse(status=405)
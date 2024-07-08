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
from django.contrib.auth.decorators import login_required

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

@csrf_exempt
@login_required
def chatbot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get('question')
            session_id = data.get('session_id')
            session_name = data.get('session_name')
            if query and session_id:
                user = request.user
                user_id = user.id

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
                    session_name=session_name,
                    question_content=query,
                    answer_content=answer,
                    created_at=timestamp
                )

                return JsonResponse({
                    'question': query,
                    'answer': answer,
                    'timestamp': timestamp
                })

            else:
                logger.warning("No question or session_id provided.")
                return JsonResponse({'status': 'error', 'message': 'No question or session_id provided'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@login_required
def chat_sessions(request):
    user_id = request.user.id
    sessions = Chatbot.objects.filter(user_id=user_id).values('session_id', 'session_name').distinct()
    return JsonResponse(list(sessions), safe=False)

@login_required
def chat_history(request, session_id):
    user_id = request.user.id
    # session_name을 쿼리 파라미터로 받음
    session_name = request.GET.get('session_name', '')
    # session_id로 필터링
    chats = Chatbot.objects.filter(user_id=user_id, session_id=session_id).order_by('created_at')
    chat_data = [
        {
            'question': chat.question_content,
            'answer': chat.answer_content,
            'timestamp': chat.created_at,
            'session_name': chat.session_name  # session_name을 포함
        }
    for chat in chats]
    return JsonResponse(chat_data, safe=False)

def error_page(request):
    return render(request, 'error_page.html')

@login_required
def chat_clear_logs(request):
    if request.method == 'POST':
        Chatbot.objects.filter(session_id=request.session.session_key).delete()
        return redirect('selfchatbot:chat_page')
    else:
        return HttpResponse(status=405)

@csrf_exempt
@login_required
def delete_session(request, session_id):
    if request.method == 'DELETE':
        Chatbot.objects.filter(session_id=session_id).delete()
        return JsonResponse({'status': 'success', 'message': 'Chat session deleted successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

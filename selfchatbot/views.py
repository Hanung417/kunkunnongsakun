from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from aivle_big.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Chatbot
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError, InvalidRequestError
import logging
import json
import os

from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.memory import ConversationBufferMemory

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
    if request.method != "POST":
        raise InvalidRequestError("Only POST method is allowed.", code=405)

    try:
        data = json.loads(request.body)
        query = data.get('question')
        session_id = data.get('session_id')

        if not query or not session_id:
            raise ValidationError("Both question and session ID must be provided.", code=400)

        user = request.user
        chat_history = load_chat_history()

        result = qa_chain({"question": query, "chat_history": chat_history})
        answer = result['answer']
        timestamp = timezone.now()

        Chatbot.objects.create(
            user_id=user.id,
            session_id=session_id,
            session_name=data.get('session_name', ''),
            question_content=query,
            answer_content=answer,
            created_at=timestamp
        )

        return JsonResponse({
            'question': query,
            'answer': answer,
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format.", code=400)
    except Exception as e:
        logger.error(f"Unhandled exception in chatbot: {str(e)}")
        raise InternalServerError("An unexpected error occurred in the chatbot processing.", code=500)

def load_chat_history():
    try:
        return memory.load()
    except Exception as e:
        logger.error(f"Error loading chat history: {str(e)}")
        return []

@login_required
def chat_sessions(request):
    user_id = request.user.id
    sessions = Chatbot.objects.filter(user_id=user_id).values('session_id', 'session_name').distinct()
    return JsonResponse(list(sessions), safe=False)

@login_required
def chat_history(request, session_id):
    if not session_id:
        raise ValidationError("Session ID is required for fetching chat history.", code=400)

    user_id = request.user.id
    session_name = request.GET.get('session_name', '')
    chats = Chatbot.objects.filter(user_id=user_id, session_id=session_id).order_by('created_at')
    chat_data = [
        {
            'question': chat.question_content,
            'answer': chat.answer_content,
            'timestamp': chat.created_at,
            'session_name': session_name
        } for chat in chats
    ]

    return JsonResponse(chat_data, safe=False)

@login_required
def chat_clear_logs(request):
    if request.method != 'POST':
        raise InvalidRequestError("Only POST method is allowed for clearing logs.", code=405)

    Chatbot.objects.filter(session_id=request.session.session_key).delete()
    return redirect('selfchatbot:chat_page')

@csrf_exempt
@login_required
def delete_session(request, session_id):
    if request.method != 'DELETE':
        raise InvalidRequestError("Only DELETE method is allowed.", code=405)

    Chatbot.objects.filter(session_id=session_id).delete()
    return JsonResponse({'status': 'success', 'message': 'Chat session deleted successfully'})

def error_page(request):
    return render(request, 'error_page.html')

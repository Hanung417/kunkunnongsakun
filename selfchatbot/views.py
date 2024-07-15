from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from aivle_big.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.utils import timezone
from .models import Chatbot
from aivle_big.exceptions import ValidationError, NotFoundError, InternalServerError, InvalidRequestError
import logging
import json
import os
from django.views.decorators.http import require_http_methods
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
chat = ChatOpenAI(api_key=openai_api_key, model="gpt-4o-2024-05-13")
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=chat,
    retriever=database.as_retriever(search_kwargs={"k": 3}),
    memory=memory
)

@csrf_exempt
def chatbot(request):
    try:
        data = json.loads(request.body)
        query = data.get('question')

        if not query:
            return JsonResponse({'error': 'Question must be provided.'}, status=400)

        chat_history = load_chat_history(request)  # Updated to pass request

        result = qa_chain({"question": query, "chat_history": chat_history})
        answer = result['answer']
        timestamp = timezone.now()

        if request.user.is_authenticated:
            session_id = data.get('session_id', 'default')
            session_name = data.get('session_name', 'Default Session')

            Chatbot.objects.create(
                user=request.user,
                session_id=session_id,
                session_name=session_name,
                question_content=query,
                answer_content=answer,
                created_at=timezone.now()
            )

        return JsonResponse({
            'question': query,
            'answer': answer,
            'timestamp': timestamp.now()
        })
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    except Exception as e:
        logger.error(f"Unhandled exception in chatbot: {str(e)}")
        return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

    
def load_chat_history(request):
    if not request.user.is_authenticated:
        return []
    try:
        # This is a placeholder; replace 'retrieve' with the actual method name
        return memory.retrieve()  # Adjust according to actual API
    except Exception as e:
        logger.error(f"Error loading chat history: {str(e)}")
        return []

@login_required
def chat_sessions(request):
    sessions = Chatbot.objects.filter(user=request.user).values('session_id', 'session_name').distinct()
    return JsonResponse(list(sessions), safe=False)

@login_required
def chat_history(request, session_id):
    if not session_id:
        raise ValidationError("Session ID is required for fetching chat history.", code=400)

    chats = Chatbot.objects.filter(user=request.user, session_id=session_id).order_by('created_at')
    chat_data = [
        {
            'question': chat.question_content,
            'answer': chat.answer_content,
            'timestamp': chat.created_at.now(),
            'session_name': chat.session_name
        } for chat in chats
    ]

    return JsonResponse(chat_data, safe=False)

@login_required
def chat_clear_logs(request):
    if request.method != 'POST':
        raise InvalidRequestError("Only POST method is allowed for clearing logs.", code=405)

    Chatbot.objects.filter(user=request.user).delete()
    return redirect('selfchatbot:chat_page')

@csrf_exempt
@login_required
def delete_session(request, session_id):
    if request.method != 'DELETE':
        raise InvalidRequestError("Only DELETE method is allowed.", code=405)

    Chatbot.objects.filter(user=request.user, session_id=session_id).delete()
    return JsonResponse({'status': 'success', 'message': 'Chat session deleted successfully'})

def error_page(request):
    return render(request, 'error_page.html')

@csrf_exempt
@login_required
@require_http_methods(["PATCH"])
def update_session_name(request, session_id):
    try:
        data = json.loads(request.body)
        new_session_name = data.get('session_name')

        if not new_session_name:
            raise ValidationError("New session name is required", code=400)

        sessions = Chatbot.objects.filter(session_id=session_id, user_id=request.user.id)
        if not sessions.exists():
            raise NotFoundError("Session not found", code=404)

        sessions.update(session_name=new_session_name)

        return JsonResponse({'status': 'success', 'message': 'Session name updated successfully'})
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format", code=400)
    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    except NotFoundError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=404)
    except Exception as e:
        logger.error(f"Error updating session name: {str(e)}")
        raise InternalServerError("Failed to update session name", code=500)


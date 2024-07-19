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

from langchain.chains import (
    create_history_aware_retriever,
    create_retrieval_chain,
)
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.memory import ConversationBufferMemory

logger = logging.getLogger(__name__)
# 설정
openai_api_key = os.getenv("OPENAI_API_KEY")
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
retriever = Chroma(persist_directory="./database", embedding_function=embeddings).as_retriever(search_kwargs={"k": 3})
llm = ChatOpenAI(api_key=openai_api_key, model="gpt-4o-2024-05-13")

# 독립형 질문 생성
contextualize_q_system_prompt = (
    "대화 기록과 최신 사용자 질문을 기반으로, "
    "대화 기록 없이도 이해할 수 있는 독립형 질문을 작성하세요. "
    "질문에 답하지 말고, 필요할 때만 질문을 재구성하고 그렇지 않으면 그대로 반환하세요."
)
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

# 질문에 답변 생성
qa_system_prompt = (
    "당신은 질문에 답변하는 작업을 돕는 어시스턴트입니다. "
    "다음의 검색된 문맥을 사용하여 질문에 답변하세요. "
    "답을 모른다면 모른다고 말하세요. "
    "농사에 관련된 질문은 세 문장 이상으로 답변을 구체적으로 유지하세요."
    "\n\n"
    "{context}"
)
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

# 전체 체인 생성
rag_chain = create_retrieval_chain(
    history_aware_retriever, question_answer_chain
)

# Django 뷰 설정
@csrf_exempt
def chatbot(request):
    try:
        data = json.loads(request.body)
        query = data.get('question')
        session_id = data.get('session_id', 'default')
        if not query:
            return JsonResponse({'error': 'Question must be provided.'}, status=400)

        chat_history = load_chat_history(request, session_id)
        formatted_chat_history = [{"role": message['role'], "content": message['content']} for message in chat_history]

        # 체인 호출
        result = rag_chain.invoke({"input": query, "chat_history": formatted_chat_history})
        answer = result['answer']
        timestamp = timezone.now()

        # 응답 포맷팅
        formatted_answer = format_answer(answer)

        # DB에 대화 기록 저장
        if request.user.is_authenticated:
            session_name = data.get('session_name', 'Default Session')
            Chatbot.objects.create(
                user=request.user,
                session_id=session_id,
                session_name=session_name,
                question_content=query,
                answer_content=formatted_answer,
                created_at=timezone.now()
            )

        return JsonResponse({
            'question': query,
            'answer': formatted_answer,
            'timestamp': timestamp
        })
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    except Exception as e:
        logger.error(f"Unhandled exception in chatbot: {str(e)}")
        return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

def load_chat_history(request, session_id):
    if not request.user.is_authenticated:
        return []
    try:
        chats = Chatbot.objects.filter(user=request.user, session_id=session_id).order_by('created_at')
        chat_data = []
        for chat in chats:
            chat_data.append({'role': 'user', 'content': chat.question_content})
            chat_data.append({'role': 'assistant', 'content': chat.answer_content})
        return chat_data
    except Exception as e:
        logger.error(f"Error loading chat history: {str(e)}")
        return []

def format_answer(answer):
    # 여기서 응답 내용을 포맷팅합니다.
    formatted_answer = answer.replace('\n', '<br>')
    
    # **로 감싸진 부분을 <b></b> 태그로 변경
    while '**' in formatted_answer:
        start = formatted_answer.find('**')
        end = formatted_answer.find('**', start + 2)
        if end == -1:  # Closing ** not found, break the loop
            break
        formatted_answer = formatted_answer[:start] + '<b>' + formatted_answer[start+2:end] + '</b>' + formatted_answer[end+2:]

    return f"{formatted_answer}"

@login_required
def chat_sessions(request):
    sessions = Chatbot.objects.filter(user=request.user).values('session_id', 'session_name', 'created_at').distinct().order_by('-created_at')
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


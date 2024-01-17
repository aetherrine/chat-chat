from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from .models import Message, Vote


@csrf_exempt
@require_http_methods(["POST"])
def sign_up(request):
    try:
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Missing fields'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already taken'}, status=400)
        
        hashed_password = make_password(password)
        user = User(username=username, password=hashed_password)
        user.save()
        return JsonResponse({'success': 'User created'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["POST"])
def log_in(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    if not username or not password:
        return JsonResponse({'error': 'Missing fields'}, status=400)
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Logged in successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    

def log_out(request):
    try:
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["POST"])
def save_message(request):
    username = request.user.username
    content = request.POST.get('content')
    timestamp = request.POST.get('timestamp')

    if not username or not content:
        return JsonResponse({'error': 'Username or content is missing.'}, status=400)
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist.'}, status=404)
    
    created_at = parse_datetime(timestamp) if timestamp else None

    message = Message(user=user, content=content)
    if created_at:
        message.created_at = created_at
    message.save()

    return JsonResponse({'message': 'Message saved successfully.'}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def vote(request):
    username = request.user.username
    message_id = int(request.POST.get('message_id'))
    vote_type = request.POST.get('vote_type')

    if not username or not message_id or not vote_type:
        return JsonResponse({'error': 'Missing fields'}, status=400)
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist.'}, status=404)
    
    try:
        message = Message.objects.get(id=message_id)
    except Message.DoesNotExist:
        return JsonResponse({'error': 'Message does not exist.'}, status=404)
    
    try:
        vote = Vote.objects.get(user=user, message=message)
        vote.value = 1 if vote_type == 'upvote' else -1
        vote.save()
    except Vote.DoesNotExist:
        vote = Vote(user=user, message=message, value=1 if vote_type == 'upvote' else -1)
        vote.save()
    
    return JsonResponse({'message': 'Vote saved successfully.'}, status=201)


def show_message(request):
    messages = Message.objects.all().prefetch_related('votes')

    messages_data = []
    for message in messages:
        messages_data.append({
            'id': message.id,
            'user': message.user.username,
            'content': message.content,
            'created_at': message.created_at,
            'votes': sum(vote.value for vote in message.votes.all()),
        })

    return JsonResponse({'messages': messages_data})


def check_authentication(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    else:
        return JsonResponse({'authenticated': False})
    

def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username})
    else:
        return JsonResponse({'username': None})
import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from datetime import datetime


from .models import User, Comments, Posts


def index(request):
    if request.method == "POST":
        creator = request.user
        date = datetime.now()
        text = request.POST.get('post_content', '')

        new_post = Posts(creator=creator, date=date, post_text=text)
        new_post.save()

        return HttpResponseRedirect(reverse("index"))
    else:
        posts = Posts.objects.all()
        return render(request, "network/index.html", {
            'posts':posts,
        })

def follow(request, user_id):
    if request.method == "POST":
        user_to_follow = User.objects.get(id=user_id)
        request.user.subscriptions.add(user_to_follow)
        request.user.save()

        return redirect(request.META['HTTP_REFERER'])

def unfollow(request, user_id):
    if request.method == "POST":
        user_to_unfollow = User.objects.get(id=user_id)
        request.user.subscriptions.remove(user_to_unfollow)
        request.user.save()

        return redirect(request.META['HTTP_REFERER'])

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def display_followings(request):
    followings = request.user.subscriptions.all()
    posts = Posts.objects.filter(creator__in=followings)
    return render(request, "network/followings.html", {
        'posts' : posts
    })


def display_profile(request, user_id):
    user_data = User.objects.get(id=user_id)
    posts = Posts.objects.filter(creator_id = user_id)
    return render(request, "network/profile.html", {
        'posts': posts,
        'user_data': user_data
    })


def save_edit(request, post_id):
    if request.method == 'POST':
        # Get the raw JSON data from the request body
        try:
            data = json.loads(request.body)
            edited_content = data.get('edited_content')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        # Update the post content in the database
        try:
            post = Posts.objects.get(pk=post_id)
            post.post_text = edited_content
            post.save()

            # Return a JSON response with the updated content
            return JsonResponse({'updated_content': edited_content})
        except Posts.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
    else:
        # Return a 405 Method Not Allowed response for non-POST requests
        return JsonResponse({'error': 'Method Not Allowed'}, status=405)

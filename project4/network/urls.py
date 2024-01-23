
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('follow_user/<int:user_id>', views.follow, name='follow_user'),
    path('unfollow_user/<int:user_id>', views.unfollow, name='unfollow_user'),
    path('my_followings', views.display_followings, name='my_followings')
]

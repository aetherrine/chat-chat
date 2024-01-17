from django.urls import path

from . import views
from . import chatapp

urlpatterns = [
    path("login", chatapp.log_in, name="login"),
    path("signup", chatapp.sign_up, name="signup"),
    path("logout", chatapp.log_out, name="logout"),
    path("vote", chatapp.vote, name="vote"),
    path("save_message", chatapp.save_message, name="save_message"),
    path("show_message", chatapp.show_message, name="show_message"),
    path("check_authentication", chatapp.check_authentication, name="check_authentication"),
    path("current_user", chatapp.current_user, name="current_user"),
    path("", views.index, name="index"),
]
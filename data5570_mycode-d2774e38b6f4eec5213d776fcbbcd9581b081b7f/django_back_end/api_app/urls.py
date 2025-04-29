from django.urls import path
from .views import (
    UserListCreateAPIView, 
    UserRetrieveUpdateDestroyAPIView,
    GameListAPIView,
    GameRetrieveAPIView
)

urlpatterns = [
    # User URLs
    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserRetrieveUpdateDestroyAPIView.as_view(), name='user-retrieve-update-destroy'),
    
    # Game URLs
    path('games/', GameListAPIView.as_view(), name='game-list'),
    path('games/<int:pk>/', GameRetrieveAPIView.as_view(), name='game-detail'),
]
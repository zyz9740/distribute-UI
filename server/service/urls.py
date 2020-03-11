from django.urls import path

from . import views

urlpatterns = [
    path('result/<int:content_id>/', views.result, name='result'),
    path('receiver/', views.receiver, name='receiver')
]
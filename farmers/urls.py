from django.urls import path

from . import views

app_name = 'farmers'

urlpatterns = [
    path('', views.home, name='home'),
    path('stages/', views.stages, name='stages'),
    path('checklist/', views.checklist, name='checklist'),
]

from django.urls import path
from . import views

# URLConf
urlpatterns = [
   path('', views.turkish_display)
]
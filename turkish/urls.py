from django.urls import path
from . import views

# URLConf
urlpatterns = [
   path('', views.turkish_display),
   path('father', views.father_display),
   path('father/test', views.father_test_display)
]

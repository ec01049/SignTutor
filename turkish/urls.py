
from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('', views.turkish_display),
    path('<str:sign>', views.sign_display),
    path('<str:sign>/test', views.test_display),
    #url(r'^turkish/recognise/$', views.recognise, name='recognise'),
]

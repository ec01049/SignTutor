from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('', views.turkish_display),
    path('<str:sign>', views.sign_display),
    path('<str:sign>/test', views.test_display),
    # path('father', views.father_display),
    # path('father/test', views.father_test_display)
]

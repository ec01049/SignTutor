from django.shortcuts import render
from keras.models import load_model
from requests import Response
from . import prediction


def recognise(request):
    if request.method == 'POST':
        video = request.POST.get('video')
        result = prediction.predict(video)

    return result


# Create your views here.
def turkish_display(request):
    return render(request, 'turkish/turkish.html', {
        "signs": ["father", "mother", "brother", "sister", "child", "baby", "grandmother", "grandfather", "family",
                  "friend", "house"]
    })


def sign_display(request, sign):
    return render(request, "turkish/sign.html", {"sign": sign})


def test_display(request, sign):
    return render(request, "turkish/test.html", {"sign": sign})

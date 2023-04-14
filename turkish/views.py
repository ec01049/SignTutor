from django.shortcuts import render


# Create your views here.
def turkish_display(request):
    return render(request, 'turkish/turkish.html', {
        "signs": ["father", "mother", "brother", "sister", "child", "baby", "grandmother", "grandfather", "family", "friend", "house"]
    })


def sign_display(request, sign):
    return render(request, "turkish/sign.html", {"sign": sign})


def test_display(request, sign):
    return render(request, "turkish/test.html", {"sign": sign})


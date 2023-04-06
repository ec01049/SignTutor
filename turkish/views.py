from django.shortcuts import render


# Create your views here.
def turkish_display(request):
    return render(request, 'turkish/turkish.html', {
        "signs": ["father", "mother", "brother", "sister", "child", "baby", "grandmother", "family", "friend", "house"]
    })


def father_display(request):
    return render(request, 'turkish/father.html')

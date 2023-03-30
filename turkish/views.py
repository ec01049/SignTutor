from django.shortcuts import render


# Create your views here.
def turkish_display(request):
    return render(request, 'turkish/turkish.html')

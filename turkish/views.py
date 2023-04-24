import tempfile
import base64
from django.shortcuts import render
from . import prediction
from django.http import JsonResponse


def recognise(request):
    if request.method == 'POST':
        video_base64 = request.POST.get('video')  # get the video data from the request

        # Decode the base64 encoded blob file
        video = base64.b64decode(video_base64)

        # Save decoded blob to temporary file
        # Create a temporary file
        with tempfile.NamedTemporaryFile() as temp_file:
            # Write the decoded data to the temporary file
            temp_file.write(video)

        print(temp_file.name)
        temp_file.seek(0)
        contents = temp_file.read()
        print(contents)

        # Make prediction
        # result = prediction.predict(video)

        # Close the file and thus delete the data
        temp_file.close()

        response_data = {'message': 'Video uploaded successfully!'}
        return JsonResponse(response_data, status=200)
    else:
        response_data = {'message': 'Invalid request method.'}
        return JsonResponse(response_data, status=405)


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

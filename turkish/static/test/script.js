
// Video Dimensions
const VIDEO_HEIGHT = 512;
const VIDEO_WIDTH = 512;
const FRAME_RATE = 30;

// Video Duration (2 seconds)
const VIDEO_LENGTH_MILLISECONDS = 2 * 1000;

// Modal
const modal = document.getElementById("popup");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

const btn = document.getElementById("again-btn");

// When the user clicks on <span> (x) or try again button, close the modal
span.onclick = function() {
  modal.style.display = "none";
}


btn.click = function() {
  modal.style.display = "none";
}

function closeModal(){
  modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Helper functions.
// Simple aliases for frequently used functions.
const $ = (selector) => document.querySelector(selector);

const $$ = (selector) =>
document.querySelectorAll(selector);


// Utility functions.
// Extract complex/convoluted, relevant, operations into
// single functions.

/**
 * Checks whether the user's browser supports camera
 * capture. Returns true if it does, otherwise false.
 */
function checkBrowserWebcamSupport() {
  return !!navigator.mediaDevices.getUserMedia;
}

async function base64EncodeBlob(blob) {

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    }

    reader.readAsDataURL(blob);
  });

}

async function makeDetection(blob) {
  const payload = (await base64EncodeBlob(blob)).split(',')[1];

  return await new Promise((resolve, reject) => {
    // Fetch CSRF token from page.
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/turkish/recognise/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken); // Include the CSRF token

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // handle the response from the server
          console.log(xhr.responseText);

          let prediction = xhr.responseText;
          resolve(prediction);
        } else {
          alert("The server encountered a problem. Please try again later.");
          reject();
        }
      }
    };

    xhr.onerror = function(error) {
      alert("There was a problem contacting the server. Please try again later.");
      reject(error);
    }

    const data = {payload};
    xhr.send(JSON.stringify(data));
  });

}

  /**
   * Triggers the browser to download a Blob object.
   */
  function downloadFile(blob, filename) {

    const url = window.URL.createObjectURL(blob, {
      type: 'application/octet-stream'
    });

    const link = document.createElement('a');
    link.style = 'display: none';
    document.body.appendChild(link);

    link.href = url;
    if (filename) link.download = filename;

    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  /**
   * Handles errors that prevent the application
   * from working.
   */
  function handleFatalError(message) {
    $('#renderWrapper').innerHTML = (`<pre>[ERROR] ${message}</pre><p><a href="">Try Again</a></p>`);
  }

//////////////////////////////////////////////////////////////

// Singleton Media Recorder: once the application initializes,
// and the stream has been prepared, the media recorder will
// be initialized.
  let sMediaRecorder = null;
  let isRecording = false;

  /**
   * Register event handlers (e.g., to start recording).
   */
  function registerEventHandlers() {
    $("#startButton").addEventListener('click', (event) => {
      event.preventDefault();

      if (!isRecording) {
        // Start recording, and change button to display 'stop
        // recording'.
        if (!sMediaRecorder) {
          alert("Error! Your camera isn't set up.");
          return;
        }


        $("#startButton").textContent = "Waiting...";
        $("#startButton").disabled = true;

        function startRecording() {
          $("#startButton").textContent = "Recording...";

          // Starts recording in VIDEO_LENGTH_MILLISECONDS
          // chunks. We'll just wait for the first chunk
          // and then stop recording immediately.
          // (dataavailable is fired as soon as a chunk is
          // available, so stopping the first time we get
          // one of these events, will give us a correctly
          // sized video).
          sMediaRecorder.start(VIDEO_LENGTH_MILLISECONDS);

          const onChunk = async (event) => {

            $("#startButton").textContent = "Loading...";

            $("#renderOverlay").classList.add('show');
            $("#loaderWrapper").classList.add('show');

            sMediaRecorder.stop();
            sMediaRecorder.removeEventListener('dataavailable', onChunk);

            const rawVideoBlob = event.data;
            const videoBlob = new Blob([rawVideoBlob], {
              type: 'video/webp'

            });



            try {

              let json = await makeDetection(videoBlob);
              let predictionMessage = JSON.parse(json);
              let prediction = predictionMessage.message;

              modal.style.display = "block";

              $("#renderOverlay").classList.remove('show');
              $("#loaderWrapper").classList.remove('show');

              let example = document.getElementById('grid-child-example');
              let user = document.getElementById('grid-child-user');

              if (prediction === pageData.sign) {
                empty(example);
                empty(user);
                $("#feedback").textContent = "Well done, You performed '" + pageData.sign + "' correctly!"

                // User performed the expected sign correctly.
              } else if (prediction === null){
                empty(example);
                empty(user);
                $("#feedback").textContent = "We couldn't detect you. Make sure you're positioned in the camera and try again."


              } else {
                empty(example);
                empty(user);
                // They did a different sign (or none was detected).
                $("#feedback").textContent = "Not quite! You didn't perform '" + pageData.sign + "' correctly. We predicted '" + prediction + "'. Lets see the difference..."

                let exampleSrc = "/static/" + pageData.sign + "/videos/webm/0.webm";
                //let userSrc = base64EncodeBlob(videoBlob);
                const userSrc = window.URL.createObjectURL(videoBlob, {
                  type: 'application/octet-stream'
                });

                //# create video element to append into above <a> tag
                let exampleElement = document.createElement("video");
                exampleElement.setAttribute("controls", "true");
                exampleElement.setAttribute("width", "384");
                exampleElement.setAttribute("src", exampleSrc);

                //# create video element to append into above <a> tag
                let userElement = document.createElement("video");
                userElement.setAttribute("controls", "true");
                userElement.setAttribute("width", "384");
                userElement.setAttribute("src", userSrc);

                //# append the dynamically created element...
                example.appendChild(exampleElement);
                user.appendChild(userElement);


              }

              function empty(element) {
                  while(element.firstElementChild) {
                   element.firstElementChild.remove();
                  }
                }
            } catch(_) {
              // do nothing on error
            }
            // downloadFile(videoBlob, 'video.webm');

            $("#startButton").textContent = "Start Recording";
            $("#startButton").disabled = false;
            isRecording = false;
          };
          sMediaRecorder.addEventListener('dataavailable', onChunk);

          // When done, update recording status.
          isRecording = true;
        }

        // Start countdown
        $("#renderOverlay").classList.add('show');
        $("#countdownWrapper").classList.add('show');

        let timeout = 3;

        function handleCounterTick() {
          $("#renderCounter").textContent = timeout;
          timeout--;

          if (timeout < 0) {
            $("#countdownWrapper").classList.remove('show');
            $("#renderOverlay").classList.remove('show');
            // Start recording after the animation has finished.
            setTimeout(startRecording, 200);
            return;
          }

          // Then tick the counter until completion.
          setTimeout(handleCounterTick, 1000);
        }

        // Initialize counter.
        handleCounterTick();
      }

    });
  }

// Initialize code to render video.
  (async () => {

    // Stop executing if webcam not supported.
    if (!checkBrowserWebcamSupport()) return;

    // Register event handlers.
    registerEventHandlers();

    // Request video from the browser.
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        facingMode: "user",
        frameRate: FRAME_RATE,
      },
      audio: false
    });

    $('#render').srcObject = stream;

    sMediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });

  })().catch((error) => {
    handleFatalError(error);
    console.error(error);
  });


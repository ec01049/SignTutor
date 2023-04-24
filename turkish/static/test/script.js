
    // Video Dimensions
const VIDEO_HEIGHT = 512;
const VIDEO_WIDTH = 512;
const FRAME_RATE = 30;

// Video Duration (2 seconds)
const VIDEO_LENGTH_MILLISECONDS = 2 * 1000;

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

function makeDetection(blob) {

  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  const reader = new FileReader();
  reader.onload = function() {
    const base64 = btoa(reader.result);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/turkish/recognise/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', csrftoken); // Include the CSRF token
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // handle the response from the server
        console.log(xhr.responseText);
      }
    };
    const data = { data: base64 };
     xhr.send(JSON.stringify(data));
  };

  reader.readAsArrayBuffer(blob);


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
          alert("Error!");
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
          const onChunk = (event) => {
            $("#startButton").textContent = "Processing...";
            sMediaRecorder.stop();
            sMediaRecorder.removeEventListener('dataavailable', onChunk);

            const rawVideoBlob = event.data;
            const videoBlob = new Blob([rawVideoBlob], {
              type: 'video/webp'
            });

            makeDetection(videoBlob);
            downloadFile(videoBlob, 'video.webm');

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

        let timeout = 3;

        function handleCounterTick() {
          $("#renderCounter").textContent = timeout;
          timeout--;

          if (timeout < 0) {
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




    // Get the modal
    const modal = document.getElementById("popup");
    // Get the button that opens the modal
    const btn = document.getElementById("test");
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }

    function checkAgree() {
        var check = document.getElementById("checkboxAgree").checked;

        if (check === true) { //checkbox is checked
           location.href = "father/test"; //load the next page.
        } else {
            alert("You need to check the box before continuing")
        }
    }
    //document.getElementById("proceed-btn").addEventListener("click", checkAgree , false);

    function refreshVideos() {

        // Three random videos
        const exampleVideos = ['video1', 'video2', 'video3'];
        let videos = Array(0, 1, 2, 3, 4, 5, 6, 7, 8);

        let container = "";
        // Generate random video for each video div
        exampleVideos.forEach(randomFunction);


        function randomFunction(value) {
            // get random index value

            container = document.getElementById(value);
            empty(container);

            const randomIndex = Math.floor(Math.random() * videos.length);

            //# generate random number
            //let number = Math.floor(Math.random() * 9);
            let number = videos[randomIndex];
            videos.splice(randomIndex, 1);
            let mySrc = "/static/father/videos/webm/" + number + ".webm";

            //# create video element to append into above <a> tag
            let tmpElement = document.createElement("video");
            tmpElement.setAttribute("controls", "true");
            tmpElement.setAttribute("width", "384");
            tmpElement.setAttribute("src", mySrc);

            //# append the dynamically created element...
            container = document.getElementById(value);
            container.appendChild(tmpElement);
        }

        function empty(element) {
                while(element.firstElementChild) {
                 element.firstElementChild.remove();
                }
            }
    }

//# generate random number
//let number = Math.floor(Math.random() * 9);
//let mySrc = "/static/father/videos/webm/" + number + ".webm";

//# create video element to append into above <a> tag
//tmpElement = document.createElement( "video");
//tmpElement.setAttribute("controls", "true" );
//tmpElement.setAttribute("width", "384");
//tmpElement.setAttribute("src", mySrc);

//# append the dynamically created element...
// container = document.getElementById("video1");
// container.appendChild(tmpElement);

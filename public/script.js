(function() {
    let theBox = document.querySelector("#canvas");
    let mouseX = 0;
    let mouseY = 0;
    let drawing = false;

    let c = theBox.getContext("2d");
    c.strokeStyle = "black";
    c.lineWidth = 2;

    theBox.addEventListener("mousedown", function(e) {
        mouseX = e.clientX - theBox.offsetLeft;
        mouseY = e.clientY - theBox.offsetTop;
        drawing = true;
        c.beginPath();
        c.moveTo(mouseX, mouseY);
        theBox.addEventListener("mousemove", function(e) {
            if (drawing === true) {
                mouseX = e.clientX - theBox.offsetLeft;
                mouseY = e.clientY - theBox.offsetTop;
                c.lineTo(mouseX, mouseY);
                c.stroke();
            }
            theBox.addEventListener("mouseup", function() {
                if (drawing === true) {
                    mouseX = e.clientX - theBox.offsetLeft;
                    mouseY = e.clientY - theBox.offsetTop;

                    drawing = false;
                }
                let dataURL = theBox.toDataURL();
                console.log(dataURL);
            });
        });
    });
})();

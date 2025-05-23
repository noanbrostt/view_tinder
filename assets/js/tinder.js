// Gets the photo element
var el = document.querySelector(".photo");
var girlCount = 0;
var girlLast = 5;
// Creates the object
var hammerTime = new Hammer(el);
// Unlocks vertical pan and pinch
hammerTime.get("pan").set({ direction: Hammer.DIRECTION_ALL });
hammerTime.get("pinch").set({ enable: true });

// When user grabs the photo..
hammerTime.on("pan", function (ev) {
    // When the photo start moving, the transition become "none" to avoid delay while dragging
    el.classList.add("moving");
    // If the photo go 80px left/right, the "nope"/"like" stamp appears using css::after
    el.classList.toggle("nope", ev.deltaX < -80);
    el.classList.toggle("like", ev.deltaX > 80);
    el.classList.toggle(
        "super_like",
        (ev.deltaY < -72) & (Math.abs(ev.deltaX) < 80)
    );
    // Calculates photo rotation based on offset
    var rotate = ev.deltaX * ev.deltaY * 4e-4;
    // And applies the movement
    el.style.transform =
        "translate(" +
        ev.deltaX +
        "px, " +
        ev.deltaY +
        "px) rotate(" +
        rotate +
        "deg)";
});

// When user releases the photo..
hammerTime.on("panend", function (ev) {
    // Gets the positive value of velocity and X-deslocation
    var absVel = Math.abs(ev.velocity);
    var absDelX = Math.abs(ev.deltaX);
    // Removes the stamps and retrieve the 300ms transition
    el.classList.remove("nope", "like", "super_like", "oops", "moving");
    if (absDelX > 80) {
        // If the photo had a "like"/"dislike" reaction
        // Photo fades faster if dragged faster, beetwen 400 and 150ms
        var transitionDuration =
            250 / (absVel + 0.4) > 150
                ? 250 / (absVel + 0.4) > 400
                    ? 400
                    : 250 / (absVel + 0.4)
                : 150;
        el.style.transitionDuration = transitionDuration + "ms";
        var rotate = ev.deltaX * ev.deltaY * 4e-4;
        // And is thrown farther too
        var mult = absVel > 1.4 ? absVel : 1.4;
        el.style.transform =
            "translate(" +
            ev.deltaX * 1.4 * mult +
            "px, " +
            ev.deltaY * mult +
            "px) rotate(" +
            rotate * mult +
            "deg)";
        // Fade out
        el.style.opacity = 0;
        // And the photo returns
        repeat(transitionDuration);
    } else if (ev.deltaY < -72) {
        // If the photo had a "super like" reaction, very similar code to the previous one
        var transitionDuration =
            250 / (absVel + 0.4) > 150
                ? 250 / (absVel + 0.4) > 400
                    ? 400
                    : 250 / (absVel + 0.4)
                : 150;
        el.style.transitionDuration = transitionDuration + "ms";
        var mult = absVel > 2 ? absVel : 2;
        el.style.transform = "translate( 0px, " + ev.deltaY * mult + "px)";
        el.style.opacity = 0;
        repeat(transitionDuration);
    } else {
        // If the photo didn't have a reaction, it goes back to the middle
        el.style.transform = "";
    }
});

hammerTime.on("pinch", function (ev) {
    el.style.transitionDuration = "0ms";
    el.style.transform = "scale(" + ev.scale + ")";
});

hammerTime.on("pinchend", function () {
    el.style.transform = "scale(1)";
});

// The function that brings back the photo
function repeat(transitionDuration = 350) {
    setTimeout(function () {
        el.style.transform = "";
        setTimeout(function () {
            el.classList.remove("nope", "like", "super_like", "oops", "moving");
            el.style.opacity = 1;
            setTimeout(function () {
                // Reactivates the buttons with a slight delay so that the photo has time to be recognized
                document
                    .querySelector(".commands")
                    .classList.remove("events-none");
            }, 140);
        }, transitionDuration);
        switchingPeople();
    }, transitionDuration);
}

function switchingPeople() {
    girlCount == girlLast ? (girlCount = 1) : girlCount++;
    document.querySelector(".photo").style.background =
        "url('../assets/tinderImgs/girl" + girlCount + ".jpeg') center center/cover";
    switch (girlCount) {
        case 1:
            document.querySelector(".name").innerHTML = "Lorem";
            document.querySelector(".age").innerHTML = "26";
            document.querySelector(".ocupation").innerHTML = "Designer";
            document.querySelector(".work").innerHTML = "Stanford University";
            document.querySelector(".distance").innerHTML = "3 miles away";
            break;
        case 2:
            document.querySelector(".name").innerHTML = "Ipsum";
            document.querySelector(".age").innerHTML = "31";
            document.querySelector(".ocupation").innerHTML = "Lawyer";
            document.querySelector(".work").innerHTML = "Stanford University";
            document.querySelector(".distance").innerHTML = "4 miles away";
            break;
        case 3:
            document.querySelector(".name").innerHTML = "Dolor";
            document.querySelector(".age").innerHTML = "32";
            document.querySelector(".ocupation").innerHTML = "Engineer";
            document.querySelector(".work").innerHTML = "Stanford Engineering";
            document.querySelector(".distance").innerHTML = "4 miles away";
            break;
        case 4:
            document.querySelector(".name").innerHTML = "Sit";
            document.querySelector(".age").innerHTML = "29";
            document.querySelector(".ocupation").innerHTML = "Doctor";
            document.querySelector(".work").innerHTML = "Stanford Medicine";
            document.querySelector(".distance").innerHTML = "5 miles away";
            break;
    }
}

// The reactions animation
function buttonEvent(reaction) {
    // Random transition duration beetwen 300ms and 600ms
    var transitionDuration = Math.random() * 300 + 300;
    // Random X-deslocation beetwen 100px and 400px
    var x = Math.random() * 300 + 100;
    // Random Y-deslocation beetwen -200px and 200px
    var y = Math.random() * 400 - 200;
    var rotate = x * y * 4e-4;
    // Prevents giving new command before current one is finished
    document.querySelector(".commands").classList.add("events-none");
    if (reaction == "like") {
        // If the reaction was a "like", stamps "like"
        el.classList.add("like");
    } else if (reaction == "dislike") {
        // If the reaction was a "dislike", stamps "nope" and moves the photo to the left
        el.classList.add("nope");
        x *= -1;
    }

    el.style.transitionDuration = transitionDuration + "ms";
    el.style.transform =
        "translate(" + x + "px, " + y + "px) rotate(" + rotate + "deg)";
    el.style.opacity = 0;
    repeat(transitionDuration * 0.8);
}

// Creates button actions
document
    .querySelector(".fa-forward")
    .parentNode.addEventListener("click", function () {
        buttonEvent("dislike");
    });

document
    .querySelector(".fa-heart")
    .parentNode.addEventListener("click", function () {
        buttonEvent("like");
    });

// Clock
var clockTicking = setInterval(clock, 1000);
function clock() {
    var d = new Date(),
        displayDate;
    displayDate = d.toLocaleTimeString();
    document.querySelector(".clock").innerHTML = displayDate.substring(0, 5);
}

switchingPeople();
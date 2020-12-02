"use strict";

function getLength() {
    length = 16;
    if (document.getElementById("16Length").checked) { length = 16; }
    else if (document.getElementById("20Length").checked) { length = 20; }
    else if (document.getElementById("32Length").checked) { length = 32; }
    else if (document.getElementById("otherLength").checked) {
        if (!document.getElementById("inputOtherLength").value > 0) { length = 16; }
        else { length = document.getElementById("inputOtherLength").value; }
    }
    else { console.error("getLength() error."); }
    console.log("Length: " + length);
    return length;
}

function formValidate() {
    length = getLength();
    document.getElementById("result").innerHTML = "Hi.";
    //document.getElementById("result").style.color = 'red'; // Changes text to red.
}

window.onload = function() {
    document.getElementById("generate").onclick = formValidate;
}

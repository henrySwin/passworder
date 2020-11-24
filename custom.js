"use strict";

function formValidate() {
    document.getElementById("result").value = "Hi.";
}

window.onload = function() {
    document.getElementById("form").onclick = formValidate;
}

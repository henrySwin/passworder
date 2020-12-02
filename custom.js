"use strict";

function smartSymbols() {
    const at = document.getElementById("symbol_at");
    const dot = document.getElementById("symbol_dot");

    if (this.checked) { // Enable @ and . checkboxes.
        at.disabled = false;
        dot.disabled = false;
    }
    else { // Disable @ and . checkboxes, and uncheck them.
        at.disabled = true;
        dot.disabled = true;

        at.checked = false;
        dot.checked = false;
    }
}


function getLength() {
    var length = 32;

    if (document.getElementById("16Length").checked) { length = 16; }
    else if (document.getElementById("20Length").checked) { length = 20; }
    else if (document.getElementById("32Length").checked) { length = 32; }
    else if (document.getElementById("otherLength").checked) {
        if (document.getElementById("inputOtherLength").value <= 0) {
            length = 32;
            document.getElementById("inputOtherLength").value = 32;
        }
        else { length = document.getElementById("inputOtherLength").value; }
    }
    else { console.error("getLength() error."); }

    console.info("Length: " + length); // e.g. "Length: 32".
    return length;
}


function getTypes() {
    var types = new Array(6);
    const checkboxes = ["lowercase","uppercase","numbers","symbols","symbol_at","symbol_dot"];

    for (var i = 0; i < types.length; i++) {
        types[i] = document.getElementById(checkboxes[i]).checked;
        console.info(checkboxes[i] + ": " + types[i]); // e.g. "lowercase: true".
    }
    return types;
}


function validate() {
    const length = getLength();
    const types = getTypes();

    // Check for when all checkboxes are unselected, and select something by default.

    document.getElementById("result").innerHTML = "Hi.";
    //document.getElementById("result").style.color = 'red'; // Changes text to red.
}


window.onload = function() {
    document.getElementById("symbols").addEventListener('change', smartSymbols);

    document.getElementById("generate").onclick = validate;
}

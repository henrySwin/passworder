"use strict"; // Enable strict mode.


/* Check/uncheck and enable/disable the @ and . CheckBoxes. */
function smartSymbols() {
    const at = document.getElementById("symbol_at");
    const dot = document.getElementById("symbol_dot");

    if (document.getElementById("symbols").checked) {
        // Enable @ and . CheckBoxes.
        at.disabled = false;
        dot.disabled = false;
    }
    else { // Disable @ and . CheckBoxes, and uncheck them.
        at.disabled = true;
        dot.disabled = true;

        at.checked = false;
        dot.checked = false;
    }
}


/* Retrieve the user-inputted password length. */
function getLength() {
    var length = 32;
    // Constants to refer to these elements because they're long.
    const otherLength = document.getElementById("otherLength");
    const inputOtherLength = document.getElementById("inputOtherLength");

    if (document.getElementById("16Length").checked) length = 16;
    else if (document.getElementById("20Length").checked) length = 20;
    else if (document.getElementById("32Length").checked) length = 32;
    else if (otherLength.checked) length = inputOtherLength.value;

    // Clear "other: " TextBox if RadioButton is not selected.
    if (inputOtherLength.value !== "" && !otherLength.checked)
        inputOtherLength.value = "";

    // Ensure that a length greater than 0 has been inputted by user.
    if (inputOtherLength.value !== "" && inputOtherLength.value <= 0) {
        length = 32;
        inputOtherLength.value = "";
        otherLength.checked = false;
        document.getElementById("32Length").checked = true;
    }

    // Enforce the maximum length of 4096.
    if (inputOtherLength.value > 4096) {
        inputOtherLength.value = 4096;
        length = 4096;
    }

    return length;
}


/* Fix for if the user selected no character types. */
function fixTypes(aTypes, aCheckboxes) {
    // Re-enable the @ and . CheckBoxes.
    document.getElementById("symbol_at").disabled = false;
    document.getElementById("symbol_dot").disabled = false;

    for (var i = 0; i < 4; i++) {
        aTypes[i] = true;
        document.getElementById(aCheckboxes[i]).checked = true;
    }
    return aTypes;
}


/* Retrieve the desired character types. */
function getTypes() {
    var types = new Array(6);
    const checkboxes = ["lowercase","uppercase",
    "numbers","symbols","symbol_at","symbol_dot"];

    for (var j = 0; j < types.length; j++)
        types[j] = document.getElementById(checkboxes[j]).checked;

    // Ensure that some characters have been selected for generation.
    // If no CheckBoxes have been selected, expression === 0.
    if (types[0] + types[1] + types[2] + types[3] === 0)
        types = fixTypes(types, checkboxes);
    return types;
}


/* Generate a random single-digit number. 0-(max - 1). */
function generateNumber(max) { return Math.floor(Math.random()*max); }


/* Generate a random lowercase letter. */
function generateLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"; // 26 letters.
    return alphabet[generateNumber(alphabet.length)]; // 0-25.
}


/* Generate a random symbol. */
function generateSymbol(aTypes) {
    // Assemble the list of symbols the user selected.
    // ` @ \ " ' < > . are not included in the default list.
    var symbols = "~!#$%^&*()_-+={[}]|:;,?/"; // 24 symbols.
    if (aTypes[4]) symbols += "@"; // Include @
    if (aTypes[5]) symbols += "."; // Include .

    // Choose a random symbol from the assembled list.
    return symbols[generateNumber(symbols.length)]; // 0-23/24/25.
}


/* Check if the password has at least one of each desired type. */
function isPerfect(aPassword, aTypes) {
    if ( (aTypes[0] && !aPassword.match(/[a-z]/)) ||
        (aTypes[1] && !aPassword.match(/[A-Z]/)) ||
        (aTypes[2] && !aPassword.match(/[0-9]/)) ||
        (aTypes[3] && !aPassword.match(/[^a-zA-Z0-9]/))
        ) return false;
    else return true;
}


/* Replace one character at a random position. */
function replaceChar(aLength, p, charType, aTypes) {
    const c = generateNumber(aLength); // 0-(aLength - 1).

    if (charType === "lowercase")
        p=p.substring(0,c)+generateLetter()+p.substring(c+1);
    else if (charType === "UPPERCASE")
        p=p.substring(0,c)+generateLetter().toUpperCase()+p.substring(c+1);
    else if (charType === "numb3rs")
        p=p.substring(0,c)+generateNumber(10)+p.substring(c+1);
    else if (charType === "$ymbol$")
        p=p.substring(0,c)+generateSymbol(aTypes)+p.substring(c+1);

    return p;
}


/* Ensure the password has at least 1 of each desired character type. */
function validatePassword(p, aLength, aTypes) {
    var type = "";

    if (aTypes[0] && !p.match(/[a-z]/)) type = "lowercase";
    else if (aTypes[1] && !p.match(/[A-Z]/)) type = "UPPERCASE";
    else if (aTypes[2] && !p.match(/[0-9]/)) type = "numb3rs";
    else if (aTypes[3] && !p.match(/[^a-zA-Z0-9]/)) type = "$ymbol$";

    p = replaceChar(aLength, p, type, aTypes);
    return p;
}


/* Generate the password itself (a string). */
function generatePassword(aLength, aTypes) {
    var password = "";

    for (var k = 0; k < aLength; k++) {
        // Loop until a desired character type is chosen.
        var type = 0;
        do type = generateNumber(4); // 0-3.
        while (!aTypes[type]); // Checkbox was not selected (false).

        var character = "";
        
        if (type === 0) character = generateLetter();
        else if (type === 1) character = generateLetter().toUpperCase();
        else if (type === 2) character = generateNumber(10); // 0-9.
        else if (type === 3) character = generateSymbol(aTypes);

        password += character;
    }

    var charTypes = new Array(4); // Remove @ and . from array.
    var variety = 0;
    for (var l = 0; l < 4; l++) {
        charTypes[l] = aTypes[l];
        if (charTypes[l]) variety++;
    }

    // If password length is longer than amount of character types (normal)...
    if (aLength >= variety)
        // ...Call validatePassword() until isPerfect() returns true.
        while (!isPerfect(password, charTypes))
            password = validatePassword(password, aLength, charTypes);

    return password;
}


/* Called by the "generate" Button. */
function main() {
    const length = getLength();
    const types = getTypes();
    const password = generatePassword(length, types);
    
    // Display the password in the <p> tag.
    document.getElementById("result").value = password;
}


/* This function is called when the webpage loads. */
window.onload = function() {
    // If the "other:" TextBox is clicked, select its RadioButton.
    document.getElementById("inputOtherLength").addEventListener("click",
    function() {
        document.getElementById("otherLength").checked = true;
    });

    // If the "$ymbol$" CheckBox is selected, call smartSymbols().
    document.getElementById("symbols").addEventListener("change", smartSymbols);

    // If the "generate" Button is clicked, call main().
    document.getElementById("generate").addEventListener("click", main);

    // If the "copy to clipboard" Button is clicked, then copy the password!
    document.getElementById("clipboard").addEventListener("click",
    function() {
        var result = document.getElementById("result");
        result.select();
        result.setSelectionRange(0, 99999);
        document.execCommand("copy");

        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "copied!";
    });

    document.getElementById("clipboard").addEventListener("mouseout",
    function() {
        document.getElementById("myTooltip").innerHTML = "copy";
    });
};

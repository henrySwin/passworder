"use strict";


function smartSymbols() {
    const at = document.getElementById("symbol_at");
    const dot = document.getElementById("symbol_dot");

    if (this.checked) { // Enable @ and . CheckBoxes.
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


function getTypes(aCheckboxes) {
    var types = new Array(6);

    for (var i = 0; i < types.length; i++)
        types[i] = document.getElementById(aCheckboxes[i]).checked;

    return types;
}


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


// Generate a random lowercase letter.
function generateLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    return letter;
}


// Generate a random symbol.
function generateSymbol(aTypes) {
    // Assemble the list of symbols the user selected.
    var symbolList = "~!#$%^&*()_-+={[}]|:;<,>?/";  // Default list.
    if (aTypes[4]) { symbolList += "@"; }           // @
    if (aTypes[5]) { symbolList += "."; }           // .

    const symbol = symbolList[Math.floor(Math.random() * symbolList.length)];
    return symbol;
}


// Math.floor(Math.random() * 10);  ==  0 to 9.
function generatePassword(aLength, aTypes, aVariety) {
    var password = "";
    for (var i = 0; i < aLength; i++) {
        const type = Math.floor(Math.random() * aVariety) + 1; // 1 to aVariety, e.g. 1 to 3.
        
        var character = "";
        switch (type) {
            case 1: // lowercase
                character = generateLetter();
                break; 
            case 2: // UPPERCASE
                character = generateLetter().toUpperCase();
                break;
            case 3: // numb3rs
                character = Math.floor(Math.random() * 10).toString();
                break;
            case 4: // $ymbol$
                character = generateSymbol(aTypes);
                break;
        }
        password += character;
    }
    return password;
}


function main() {
    const checkboxes = ["lowercase","uppercase","numbers","symbols","symbol_at","symbol_dot"];
    const length = getLength();
    var types = getTypes(checkboxes);
    var variety = types[0] + types[1] + types[2] + types[3];

    // Ensure that some characters have been selected for generation.
    // If no CheckBoxes have been selected, variety == 0.
    if (variety == 0) {
        variety = 4;
        types = fixTypes(types, checkboxes);
    }
    
    const password = generatePassword(length, types, variety);

    // Delete logs when done.


    for (var i = 0; i < types.length; i++)
        console.info(checkboxes[i] + ": " + types[i]); // e.g. "lowercase: true".
    
    console.log("Variety: " + variety);

    document.getElementById("result").innerHTML = password;
    //document.getElementById("result").style.color = 'red'; // Changes text to red.
}


/* This function is called when the webpage loads. */
window.onload = function() {
    // If a length is manually inputted into the "other:" TextBox, select its RadioButton.
    document.getElementById("inputOtherLength").addEventListener('change', function() {
        document.getElementById("otherLength").checked = true;
    });

    // If the "$ymbol$" CheckBox is selected, call smartSymbols().
    document.getElementById("symbols").addEventListener('change', smartSymbols);

    // If the "generate" Button is clicked, call main().
    document.getElementById("generate").onclick = main;
}

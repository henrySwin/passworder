"use strict"; // Enable strict mode.


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


function getLength() {
    var length = 32;

    if (document.getElementById("16Length").checked) { length = 16; }
    else if (document.getElementById("20Length").checked) { length = 20; }
    else if (document.getElementById("32Length").checked) { length = 32; }
    else if (document.getElementById("otherLength").checked) {
        length = document.getElementById("inputOtherLength").value;
    }

    // Ensure that a length greater than 0 has been inputted by user.
    if (document.getElementById("inputOtherLength").value <= 0) {
        length = 32;
        document.getElementById("inputOtherLength").value ="";
        document.getElementById("otherLength").checked = false;
        document.getElementById("32Length").checked = true;
    }
    
    // Log the length of the password.
    console.info("Length: " + length); // e.g. "Length: 32".
    return length;
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


function getTypes() {
    var types = new Array(6);
    const checkboxes = ["lowercase","uppercase",
    "numbers","symbols","symbol_at","symbol_dot"];

    for (var i = 0; i < types.length; i++)
        types[i] = document.getElementById(checkboxes[i]).checked;

    // Ensure that some characters have been selected for generation.
    // If no CheckBoxes have been selected, expression === 0.
    if (types[0] + types[1] + types[2] + types[3] === 0)
        types = fixTypes(types, checkboxes);
    return types;
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
    // ` @ \ " ' < > . are not included in the default list.
    var symbolList = "~!#$%^&*()_-+={[}]|:;,?/";
    if (aTypes[4]) { symbolList += "@"; } // Include @
    if (aTypes[5]) { symbolList += "."; } // Include .

    // Choose a random symbol from the assembled list.
    const symbol = symbolList[Math.floor(Math.random() * symbolList.length)];
    return symbol;
}


/* Generate the password itself (a string). */
function generatePassword(aLength, aTypes) {
    var password = "";
    var stats = [0, 0, 0, 0];

    for (var i = 0; i < aLength; i++) {
        // Loop until a desired character type is chosen.
        var type = 0;
        do { type = Math.floor(Math.random() * 4); } // 0 to 3.
        while (!aTypes[type]); // Checkbox was not selected (false).
        
        stats[type] += 1; // Increment the stats array for the chosen type.

        var character = "";
        switch (type) {
            case 0: // lowercase
                character = generateLetter();
                break;
            case 1: // UPPERCASE
                character = generateLetter().toUpperCase();
                break;
            case 2: // numb3rs
                character = Math.floor(Math.random() * 10).toString(); // 0 to 9.
                break;
            case 3: // $ymbol$
                character = generateSymbol(aTypes);
                break;
        }        
        password += character;
    }

    // Log the password.
    console.log("Password: " + password);
    // Log the frequency of each character type.
    console.log("Password stats: " +
    "lowercase: " + stats[0].toString() + ", UPPERCASE: " + stats[1].toString() +
    ", numb3rs: " + stats[2].toString() +   ", $ymbol$: " + stats[3].toString());
    return password;
}


function main() {
    // Clear the console (removes logs from previous password).
    console.clear();

    const length = getLength();
    
    const types = getTypes();
    
    const password = generatePassword(length, types);
    
    // Display the password in the <p> tag.
    document.getElementById("result").innerHTML = password.toString();
    //document.getElementById("result").style.color = 'red'; // Changes text to red.
}


/* This function is called when the webpage loads. */
window.onload = function() {
    // If the "other:" TextBox is clicked, select its RadioButton.
    document.getElementById("inputOtherLength").addEventListener('click', function() {
        document.getElementById("otherLength").checked = true;
    });

    // If the "$ymbol$" CheckBox is selected, call smartSymbols().
    document.getElementById("symbols").addEventListener('change', smartSymbols);

    // If the "generate" Button is clicked, call main().
    document.getElementById("generate").onclick = main;
};

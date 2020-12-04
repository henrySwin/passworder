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
    
    // Log password length. e.g. "Length: 32".
    console.info("Length: " + length);
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

    for (var i = 0; i < types.length; i++)
        types[i] = document.getElementById(checkboxes[i]).checked;

    // Ensure that some characters have been selected for generation.
    // If no CheckBoxes have been selected, expression === 0.
    if (types[0] + types[1] + types[2] + types[3] === 0)
        types = fixTypes(types, checkboxes);
    return types;
}


/* Generate a random lowercase letter. */
function generateLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)]; // 0-26.
}


/* Generate a random symbol. */
function generateSymbol(aTypes) {
    // Assemble the list of symbols the user selected.
    // ` @ \ " ' < > . are not included in the default list.
    var symbols = "~!#$%^&*()_-+={[}]|:;,?/";
    if (aTypes[4]) symbols += "@"; // Include @
    if (aTypes[5]) symbols += "."; // Include .

    // Choose a random symbol from the assembled list.
    return symbols[Math.floor(Math.random() * symbols.length)]; // 0-24/25/26.
}


/* Generate the password itself (a string). */
function generatePassword(aLength, aTypes) {
    var password = "";
    var stats = [0,0,0,0];

    for (var i = 0; i < aLength; i++) {
        // Loop until a desired character type is chosen.
        var type = 0;
        do type = Math.floor(Math.random() * 4); // 0-3.
        while (!aTypes[type]); // Checkbox was not selected (false).
        
        stats[type] += 1; // Increment the stats array for the chosen type.

        var character = "";
        
        if (type === 0) character = generateLetter();
        else if (type === 1) character = generateLetter().toUpperCase();
        else if (type === 2) character = Math.floor(Math.random() * 10); // 0-9.
        else character = generateSymbol(aTypes);

        password += character;
    }

    console.log("Password: " + password); // Log the password.
    // Log the frequency of each character type.
    console.log("Password stats: " +
    "lowercase: " + stats[0] + ", UPPERCASE: " + stats[1] +
    ", numb3rs: " + stats[2] +   ", $ymbol$: " + stats[3]);
    return password;
}


/* Called by the "generate" Button. */
function main() {
    console.clear(); // Clear the console (removes logs from previous password).

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
        result.setSelectionRange(0, 99999)
        document.execCommand("copy");

        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "copied!";
    });

    document.getElementById("clipboard").addEventListener("mouseout",
    function() {
        document.getElementById("myTooltip").innerHTML = "copy";
    });
};

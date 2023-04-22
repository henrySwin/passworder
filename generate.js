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
    var length = 64;
    const otherLength = document.getElementById("otherLength");
    const inputOtherLength = document.getElementById("inputOtherLength");

    if (document.getElementById("40Length").checked) length = 40;
    else if (document.getElementById("64Length").checked) length = 64;
    else if (document.getElementById("128Length").checked) length = 128;
    else if (document.getElementById("255Length").checked) length = 255;
    else if (document.getElementById("256Length").checked) length = 256;
    else if (document.getElementById("512Length").checked) length = 512;
    else if (otherLength.checked && inputOtherLength.value !== "" &&
            inputOtherLength.value <= 4096 && inputOtherLength.value >= 1) {
                length = inputOtherLength.value; }
    else {
        otherLength.checked = false;
        inputOtherLength.value = "";
        document.getElementById("64Length").checked = true;
        length = 64; // Reset to 64 by default.
    }

    // Clear TextBox if otherLength is not selected.
    if (!otherLength.checked && inputOtherLength.value !== "")
        inputOtherLength.value = "";
    
    return length;
}


/* Fix for if the user selected no character types. */
function fixTypes(char_types, checkbox_names) {
    // Re-enable the @ and . CheckBoxes.
    document.getElementById("symbol_at").disabled = false;
    document.getElementById("symbol_dot").disabled = false;

    for (let box = 0; box < checkbox_names.length; box++) {
        char_types[box] = true;
        document.getElementById(checkbox_names[box]).checked = true;
    }
    return char_types;
}


/* Retrieve the desired character types. */
function getTypes() {
    const checkbox_names = [
        "lowercase",
        "uppercase",
        "numbers",
        "protonmail_symbols",
        "symbols",
        "symbol_at",
        "symbol_dot",
    ];

    // Boolean array which will know which checkboxes have been checked.
    let char_types = new Array(7);

    // Tell char_types array which checkboxes have been checked.
    for (let box = 0; box < checkbox_names.length; box++) {
        char_types[box] = document.getElementById(checkbox_names[box]).checked;
    }

    // Ensure that some characters have been selected for generation.
    if (char_types.some((x) => x === true)) { // There is at least 1 "true" in array.
        return char_types;
    }
    else {
        char_types = fixTypes(char_types, checkbox_names);
        return char_types;
    }
}


/* Generate a random single-digit number. 0-(max - 1). */
function generateNumber(max) { return Math.floor(Math.random()*max); }


/* Generate a random lowercase letter.
   'I' and 'L' are not included, as they look too similar. */
function generateLetter() {
    const alphabet = "abcdefghjkmnopqrstuvwxyz"; // 26 letters.
    return alphabet[generateNumber(alphabet.length)]; // 0-25.
}


/* Generate a random symbol. */
function generateSymbol(char_types) {
    // Assemble the list of symbols the user selected.
    // ` @ \ " ' < > . are not included in the default list.
    var symbols = "~!#$%^&*()_-+={[}]|:;,?/"; // 24 symbols.
    if (char_types[5]) symbols += "@"; // Include @
    if (char_types[6]) symbols += "."; // Include .

    // Choose a random symbol from the assembled list.
    return symbols[generateNumber(symbols.length)]; // 0-23/24/25.
}


/* Generate a random ProtonMail email symbol. */
function generateProtonSymbol() {
    // Assemble the list of symbols that ProtonMail emails can use.
    var symbols = "._-"; // 3 symbols.

    // Choose a random symbol from the assembled list.
    return symbols[generateNumber(symbols.length)]; // 0-3.
}


/* Check if the password has at least one of each desired type. */
function isPerfect(password, char_types) {
    if ( (char_types[0] && !password.match(/[a-z]/)) ||
        (char_types[1] && !password.match(/[A-Z]/)) ||
        (char_types[2] && !password.match(/[0-9]/)) ||
        (char_types[3] && !password.match(/[\.\_\-]/)) ||
        (char_types[4] && !password.match(/[^a-zA-Z0-9]/)))
    {
        return false;
    } 
    else {
        return true;
    }
}


/* Ensure the password has at least 1 of each desired character type. */
function validatePassword(p, length, char_types) {
    const pos = generateNumber(length);
    
    // If there are no characters of that type in the whole password,
    // then replace one character at a random position.
    if (char_types[0] && !p.match(/[a-z]/)) {
        p=p.substring(0,pos)+generateLetter()+p.substring(pos+1);
    }
    else if (char_types[1] && !p.match(/[A-Z]/)) {
        p=p.substring(0,pos)+generateLetter().toUpperCase()+p.substring(pos+1);
    }
    else if (char_types[2] && !p.match(/[0-9]/)) {
        p=p.substring(0,pos)+generateNumber(10)+p.substring(pos+1);
    }
    else if (char_types[3] && !p.match(/[\.\_\-]/)) {
        p=p.substring(0,pos)+generateProtonSymbol()+p.substring(pos+1);
    }
    else if (char_types[4] && !p.match(/[^a-zA-Z0-9]/)) {
        p=p.substring(0,pos)+generateSymbol(aTypes)+p.substring(pos+1);
    }

    return p;
}


/* Generate the password itself (a string). */
function generatePassword(length, char_types) {
    var password = "";

    for (var k = 0; k < length; k++) {
        // Loop until a desired character type is chosen.
        var char_type = 0;
        do char_type = generateNumber(5); // 0-4 (5 values).
        while (!char_types[char_type]); // Checkbox was not selected (false).

        var character = "";
        
        if (char_type === 0) character = generateLetter();
        else if (char_type === 1) character = generateLetter().toUpperCase();
        else if (char_type === 2) character = generateNumber(10); // 0-9.
        else if (char_type === 3) character = generateProtonSymbol();
        else if (char_type === 4) character = generateSymbol(char_types);

        password += character;
    }
    
    var variety = 0;
    for (let l = 0; l < 5; l++) {
        if (char_types[l]) variety++;
    }

    // If password length is longer than amount of character types (normal)...
    if (length >= variety) {
        // ...Call validatePassword() until isPerfect() returns true.
        while (!isPerfect(password, char_types)) {
            password = validatePassword(password, length, char_types);
        }
    }

    return password;
}


/* Called by the "generate" Button. */
function main() {
    const length = getLength(); // Integer from 1 to 4096.
    const char_types = getTypes(); // Boolean array which knows which checkboxes have been checked.
    const password = generatePassword(length, char_types);
    
    // Display the password in the <textarea> tag.
    document.getElementById("result").value = password;
}


/* Called by the "test string" Button. */
function stringTest() {
    const input = document.getElementById("string_test").value;
    const string_length = input.length;

    // Display the password in the <p> tag.
    document.getElementById("string_test_result").innerHTML = "Result: " + string_length.toString();
}


/* Called by the "reset test" Button. */
function resetStringTest() {
    document.getElementById("string_test").value = "";
    document.getElementById("string_test_result").innerHTML = "Result:";
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

    // If the "test" Button is clicked, call stringTest().
    document.getElementById("string_test_button").addEventListener("click", stringTest);

    // If the "reset" Button is clicked, call resetStringTest().
    document.getElementById("string_test_reset_button").addEventListener("click", resetStringTest);

    // If the "copy to clipboard" Button is clicked, then copy the password!
    document.getElementById("clipboard").addEventListener("click",
    function() {        
        document.getElementById("result").select();
        // Select 4096 characters (max length).
        document.getElementById("result").setSelectionRange(0, 4096);
        document.execCommand("copy");
        document.getElementById("myTooltip").innerHTML = "copied!";
    });

    document.getElementById("clipboard").addEventListener("mouseout",
    function() {
        document.getElementById("myTooltip").innerHTML = "copy";
    });
};

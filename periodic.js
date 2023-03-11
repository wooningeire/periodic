// the init function will be run once the document has loaded fully
function init() {
 // define canvas and context
 window.cv = document.querySelector("canvas");
 window.c = cv.getContext("2d");

 // define the main text field and change the text to a phrase able to be made out of legitimate elements
 window.textInput = document.querySelector(".inp-text");


 var placeholders = ["knockoff", "cringe", "flinch", "nephew", "iceberg", "britches", "frikkin mop", "fiery inferno of agony", "phosphorus", "relish sauce", "c/arykh"];
 textInput.value = placeholders[Math.floor(Math.random() * placeholders.length)];

 // generate when "Generate" button is clicked
 document.querySelector(".start").onclick = function() {
   generate();
 };

 // generate if enter is pressed while text field is focused
 textInput.onkeydown = function(e) {
   if (e.keyCode === 13)
     generate();
 };

 // define error div
 window.errorDiv = document.querySelector(".errors");

 // define settings div
 window.settingsDiv = document.querySelector(".settings");

 // setup settings menu collapse/open
 document.querySelector(".settings-button").onclick = function() {
   if (settingsDiv.getAttribute("data-hidden")) {
     settingsDiv.style.opacity = "1";
     settingsDiv.style.height = settingsDiv.scrollHeight + "px";
     settingsDiv.style.pointerEvents = "auto";

     clearTimeout(window.timeout);
     window.timeout = setTimeout(function() {
       settingsDiv.style.height = "auto";
     }, 1000);

     settingsDiv.removeAttribute("data-hidden");
   } else {
     settingsDiv.style.opacity = "0";
     settingsDiv.style.height = settingsDiv.scrollHeight + "px";
     settingsDiv.style.pointerEvents = "none";

     clearTimeout(window.timeout);
     window.timeout = setTimeout(function() {
       settingsDiv.style.height = "0";
     }, 50);

     settingsDiv.setAttribute("data-hidden", true);
   }
 }

 // simplifies the color menu
 window.colorSimpB = document.querySelector(".colors-simplify");
 colorSimpB.onchange = function() {
   var extras = document.querySelectorAll("label.sublabel, .settings-colors > .setting:not(:first-child)");
   var colorSettings0 = document.querySelectorAll(".settings-colors");
   var colorSettings1 = document.querySelectorAll(".settings-colors > .setting");

   for (var i = 0; i < extras.length; i++) { // makes all complex parts (sub-labels and extra color options) disappear
     if (colorSimpB.checked)
       extras[i].setAttribute("data-hidden", "true");
     else
       extras[i].removeAttribute("data-hidden");
   }

   for (var i = 0; i < colorSettings0.length; i++) { // lengthens all color groups
     if (colorSimpB.checked) {
       colorSettings0[i].style.display = "inline-block";
       colorSettings0[i].style.width = "18%";
     } else {
       colorSettings0[i].style.display = "flex";
       colorSettings0[i].style.width = "auto";
     }
   }
   for (var i = 0; i < colorSettings1.length; i++) {
     if (colorSimpB.checked) {
       colorSettings1[i].style.width = "100%";
     } else
       colorSettings1[i].style.width = "14%";
   }
 }

 // if a local storage entry of custom elements exists...
 if (localStorage["woonperiodicCustomElems"]) {
   // parse the entry from a string to an array
   customElems = JSON.parse(localStorage["woonperiodicCustomElems"]);

   // create element bars for each preexisting element
   for (var i in customElems) {
     var elem = customElems[i];

     addCustomElementBar(elem.sym, elem.name, elem.mass);
   }
 }

 // when a property of a custom element is changed through the settings menu...
 function updateElements() {
   // clear all existing custom elements and parse the entire ul
   clearCustomElements();

   var elems = document.querySelectorAll("li.customelement");
   for (var i = 0; i < elems.length; i++) {
     var inputs = getInputs(elems[i]);
     addCustomElement(inputs[0].value, inputs[1].value, inputs[2].value);
   }
 }

 var ul = document.querySelector(".settings-customelements > ul");
 ul.oninput = updateElements;
 ul.onchange = updateElements;

 // if "Add custom element" button is clicked, create a new bar
 document.querySelector(".customelements-add").onclick = function() {
   addCustomElementBar();
 };
}

/************/
/* GENERATE */
/************/

var maxSymLength = 3;

function generate(text) {
 // find all needed elements and generate an image on the canvas

 // if text argument is empty...
 if (!text) {
   if (!textInput.value) { // ...and text field is empty, then generate "no thonks"
     generate("no thonks");
     return;
   } else //...and text field contains something, then generate what is in the text field
     text = textInput.value;
 }
 text = text.toLowerCase(); // thank you endr dragon

 // empty the errorDiv
 errorDiv.innerText = "";

 // define settings for displayed tiles
 var settings = {
   width: 115,
   height: 138,
   padding: 4
 };
 for (var i in settings) {
   var v = parseInt(document.querySelector(".dimension-" + i).value);
   if (!isNaN(v))
     settings[i] = v;
 }

 // clear all characters except alphabetical letters, forward slashes, or spaces
 if (!document.querySelector(".elements-allowirregular").checked)
   text = text.replace(/[^a-z\/ ]/gi, "");

 // if custom element button is checked, add the custom elements to elems
 // otherwise, only use elems
 if (document.querySelector(".elements-allowcustom").checked)
   var elems = elements.concat(customElems);
 else
   var elems = elements;

 // if spaces are allowed, add space elements to elems
 if (document.querySelector(".elements-allowspaces").checked)
   elems = elems.concat(spacialElems);

 // if placeholder element button is checked, add placeholder elements to elems
 var placeholderElems = [];
 if (document.querySelector(".elements-allowplaceholder").checked) {
   for (var i in text) {
     var e = new Elem(text[i].toUpperCase(), false, false, -1);
     if (placeholderElems.indexOf(e) < 0 && text[i] != "/")
       placeholderElems.push(e);
   }

   elems = elems.concat(placeholderElems);
 }

 // order elems with longer symbols first
 var orderedElems = [];
 var points = new Array(maxSymLength).fill(0); // indexes at which to insert a multi-character element (all starting at 0)
 for (var i in elems) { // loop through all elements
   var success = false;
   for (var j = maxSymLength; j > 0; j--) { // j is the element length
     if (elems[i].sym.length == j) {
       orderedElems.splice(points[j - 1], 0, elems[i]);
       success = true;
     }
     if (success)
       points[j - 1]++; // increase the index point and those of elements with shorter symbols
   }
 }

 // define variables to be used for element searching
 var sym;

 var success;

 var displayedElems = [];

 // loop through each character in the provided text
 for (var i = 0; i < text.length; i++) {
   // loop through each element in the ordered element array
   for (var j = 0; j <= orderedElems.length; j++) {
     // get potential symbols of selected text point
     var strs = [];
     for (var k = 1; k <= maxSymLength; k++) {
       strs.push(text.substring(i, i + k));
     };

     // get symbol of current element
     sym = orderedElems[j].sym.toLowerCase();

     success = false;

     for (var k = strs.length - 1; k >= 0; k--) { // if a string finds a match, then set the success value to true and skip however many indexes necessary
       if (strs[k] == sym) {
         i += k;
         success = true;
         break;
       }
     }
     if (success) { // if success is true, record the element's index to be referenced later
       displayedElems.push(elems.indexOf(orderedElems[j]));
       break;
     }
     if (parseInt(j) >= elems.length - 1) { // otherwise, show a console info, add an entry to the errorDiv, and stop searching
       if (strs[0].indexOf(" ") < 0 && strs[0].indexOf("/") < 0) {
         let str = "\"" + strs[strs.length - 1] + "\" cannot represent any periodic table element."

         console.info("%cOh noes! %c" + str, "color: #e33; font-weight: 700;", "color: initial; font-weight: initial;");

         let p = document.createElement("p");
         p.innerHTML = str;
         errorDiv.appendChild(p);
       }
       break;
     }
   }
 }

 function trim(str) {
   var newStr = "";
   for (var i = 0; i < str.length; i++) {
     if (c.measureText(newStr + str[i]).width > settings.width - settings.padding * 2)
       break;
     newStr += str[i];
   }
   return newStr;
 }

 // if text is too large for a tile, decrease the font size by one pixel repeatedly until it fits
 function fit(str, size, bold) {
   function setFont() {
     c.font = size + "px Montserrat";
     if (bold)
       c.font = "bold " + c.font;
   }

   setFont();
   while (c.measureText(str).width > settings.width - settings.padding * 4 && size > 0) {
     size--;
     setFont();
   }
   return size;
 }

 // empty the current canvas
 c.clearRect(0, 0, cv.width, cv.height);

 // set the canvas' dimensions
 cv.width = displayedElems.length * (settings.width - settings.padding) + settings.padding;
 cv.height = settings.height;

 // set the border/background of the canvas
 c.fillStyle = "#000";
 c.fillRect(0, 0, cv.width, cv.height);

 // initialize the spacing variable
 var space = 0;

 // loop through the list of element indexes
 for (var i = 0; i < displayedElems.length; i++) {
   // define elem to avoid repition
   var elem = elems[displayedElems[i]];

   // get the color of the tile through HTML class names
   // if elem.cat is a whole number, floor to the nearest ten
   var colorInput = document.querySelector(".color-" + (elem.cat >= 0 && colorSimpB.checked ? Math.floor(elem.cat / 10) * 10 : elem.cat));
   var color = colorInput.value;
   if (!color) // if no color is in the field, get the color from its placeholder
     c.fillStyle = colorInput.getAttribute("placeholder");
   else
     c.fillStyle = color;

   // find the spacing variable's value
   space = settings.padding * i;

   // draw a rectanglular tile
   c.fillRect(settings.width * i + settings.padding - space, settings.padding, settings.width - settings.padding * 2, settings.height - settings.padding * 2);

   // depending on the bgcolor's brightness, set the font color to either black or white
   if (Color.fromFormatted(c.fillStyle).getLightness(true) > 255 / 2)
     c.fillStyle = "#000";
   else
     c.fillStyle = "#fff";

   // center the text
   c.textAlign = "center";

   // define the left text margin
   var leftTextMargin = settings.width * (i + .5) - space;

   // write the element's symbol
   fit(elem.sym, 54, true);
   c.fillText(elem.sym, leftTextMargin, settings.height * .55);

   // if the element is NOT a space or a placeholder...
   if (placeholderElems.indexOf(elem) < 0 && spacialElems.indexOf(elem) < 0) {
     // write the element's name and mass
     c.font = "14px Montserrat";
     c.fillText(trim(elem.name), leftTextMargin, settings.height * .75);
     c.fillText(elem.mass.toFixed(5), leftTextMargin, settings.height * .9);

     if (customElems.indexOf(elem) < 0) { // if the element is also NOT custom...
       // write the element's atomic number
       c.font = "20px Montserrat";
       c.fillText(displayedElems[i] + 1, leftTextMargin, settings.height * .2);
     }
   }
 }
}

/****************************/
/* CUSTOM ELEMENT FUNCTIONS */
/****************************/

function addCustomElement(sym, name, mass) {
 // if the symbol does not exist, do not add the element
 if (!sym)
   return;

 // if the mass is not a number, set it to 0
 if (isNaN(mass = parseFloat(mass)))
   mass = 0;

 // replace the existing element if there is one
 removeCustomElement(sym);

 // store in customElems and localStorage
 customElems.push(new Elem(upperFirst(sym.substring(0, maxSymLength).toLowerCase()), name, mass, -2));

 localStorage["woonperiodicCustomElems"] = JSON.stringify(customElems);
}

function addCustomElementBar(sym, name, mass) {
 // add a custom element BAR in the settings menu

 // define the list holding all bars
 var ul = document.querySelector(".settings-customelements > ul");

 // create a custom element entry to be visualized
 var li = document.createElement("li");
 li.className = "customelement";

 // create the close button
 var b = document.createElement("button");
 b.className = "customelement-remove";
 li.appendChild(b);

 b.onclick = function() {
   // remove the bar containing the button
   var parent = this.parentElement;
   removeCustomElement(getInputs(parent)[0].value);
   parent.parentElement.removeChild(parent);
 }

 // create the input fields and set their classes
 var attrs = ["sym", "name", "mass"];
 for (var i in attrs) {
   // create an input field
   var input = document.createElement("input");
   input.className = "customelement-" + attrs[i];
   input.setAttribute("type", "text");

   if (eval(attrs[i])) // if element property is already defined, use it
     input.value = eval(attrs[i]);

   if (attrs[i] == "sym") { // if field designated for symbol
     input.setAttribute("maxlength", maxSymLength);
     input.setAttribute("placeholder", "Symbol");
   } else if (attrs[i] == "name") {// if field designated for name
     input.setAttribute("placeholder", "Element name");
   } else if (attrs[i] == "mass") { // if field designated for mass
     input.setAttribute("type", "number");
     input.setAttribute("min", "0");
     input.setAttribute("placeholder", "Atmoic mass");
   }

   li.appendChild(input);
 }

 ul.appendChild(li);
}

function removeCustomElement(sym) {
 var success = false;

 // search for an element matching the symbol provided
 for (var i in customElems) {
   if (customElems[i].sym.toLowerCase() == sym.toLowerCase()) {
     // remove the matching element, if any, and set success to true
     customElems.splice(i, 1);
     success = true;
   }
 }

 if (!success)
   return false;

 // remove the localStorage entry if customElems is empty, or update it otherwise
 if (customElems.length <= 0)
   localStorage.removeItem("woonperiodicCustomElems");
 else
   localStorage["woonperiodicCustomElems"] = JSON.stringify(customElems);

 return true;
}

function clearCustomElements() {
 // clear all custom element entries: first clear customElems array, then remove the array from localStorage
 customElems = [];
 localStorage.removeItem("woonperiodicCustomElems");
}

/*****************************/
/* GENERAL PURPOSE FUNCTIONS */
/*****************************/

function getInputs(parent) {
 // get all direct children of type <input />
 var inputs = [];
 var children = parent.childNodes;
 for (var i = 0; i < children.length; i++) {
   if (children[i].tagName.toLowerCase() === "input")
     inputs.push(children[i]);
 }
 return inputs;
}

function upperFirst(str) {
 // uppercase the first letter of a string
 if (str)
   return str[0].toUpperCase() + str.substring(1);
 else
   return false;
}

// activate init function on page load
onload = init;
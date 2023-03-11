function randint(min, max) {
  return Math.floor((max - min) * Math.random()) + min;
}

function degToRad(deg) {
  return deg / Math.PI * 180;
}

function radToDeg(rad) {
  return rad / 180 * Math.PI;
}

function nodeToImg(node, onload) {
  var nodeCopy = node.cloneNode(true);
  if (!nodeCopy.getAttribute("xmlns"))
    nodeCopy.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

  var html = 
    "<svg xmlns=\"http://www.w3.org/2000/svg\"><foreignObject width=\"100%\" height=\"100%\">" +
    nodeCopy.outerHTML +
    "</foreignObject></svg>"; console.log(html);

  var img = new Image();
  var blob = new Blob([html], {type: "image/svg+xml"});
  var url = URL || webkitURL;
  var src = url.createObjectURL(blob);

  if (onload)
    img.onload = function() {
      onload(img);
      url.revokeObjectURL(src);
    };
  img.src = src;

  return img;
}

function moveInRange(num, min, max, defaultToMax) {
  if ((isNaN(num) && !defaultToMax) || num < min)
    num = min;
  else if (num > max)
    num = max;
  return num;
}

function plus(b) {
  if (Array.isArray(b)) {
    b.choose = function() {
      return this[randint(0, this.length)];
    };
  } else if (b instanceof Node) {
    b.remove = function() {
      this.parentElement.removeChild(this);
    };
    b.replace = function(node) {
      this.parentElement.replaceChild(node, this);
    };
  } else if (b instanceof NodeList) {
    b.each = function(func) {
      for (var i = 0; i < this.length; i++)
        func(this[i], i);
    };
  }
  return b;
}
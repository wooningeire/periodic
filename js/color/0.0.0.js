const HEXPERCENT = 1 / 51 * 20;

function Color(r, g, b, a) {
  if (isNaN(a))
    a = 255;

  var components = [r, g, b, a];
  for (var i in [r, g, b])
    components[i] = moveInRange(parseInt(components[i]), 0, 255);
  components[3] = moveInRange(parseFloat(components[3]), 0, 255);

  this.r = components[0];
  this.g = components[1];
  this.b = components[2];
  this.a = components[3];
}

Color.fromRGB = function(r, g, b, a) {
  return new Color(r, g, b, a);
};
Color.fromHex = function(r, g, b, a) {
  var components = [r, g, b, a];
  for (var i in components)
    components[i] = parseInt(components[i], 16);

  r = components[0];
  g = components[1];
  b = components[2];
  a = components[3];

  return new Color(r, g, b, a);
};
Color.fromHSL = function(h, s, l, a) {
  h = Math.abs(h) % 360;
  s = moveInRange(s, 0, 255) / 255;
  l = moveInRange(l, 0, 255) / 255;

  var c = s * (1 - Math.abs(2 * l -1));
  var x = c * (1 - Math.abs(h / 60 % 2 - 1));

  var primes;
  if (h < 60)
    primes = [c, x, 0];
  else if (h >= 60 && h < 120)
    primes = [x, c, 0];
  else if (h >= 120 && h < 180)
    primes = [0, c, x];
  else if (h >= 180 && h < 240)
    primes = [0, x, c];
  else if (h >= 240 && h < 300)
    primes = [x, 0, c];
  else
    primes = [c, 0, x];

  var m = l - c / 2;
  var r = (primes[0] + m) * 255
  var g = (primes[1] + m) * 255
  var b = (primes[2] + m) * 255

  return new Color(r, g, b, a);
};

Color.fromFormatted = function(base) {
  if (!base)
    base = "";

  if ((base.indexOf("rgb(") === 0 || base.indexOf("rgba(") === 0) && base.lastIndexOf(")") === base.length - 1) {
    let c = base.substring(base.indexOf("(") + 1, base.lastIndexOf(")")).split(",");
    return Color.fromRGB(c[0], c[1], c[2], c[3]);
  } else if (base.indexOf("#") === 0) {
    base = base.substring(1);
    let c;
    if (base.length === 3)
      c = [base[0] + base[0], base[1] + base[1], base[2] + base[2], "ff"];
    else if (base.length === 4)
      c = [base[0] + base[0], base[1] + base[1], base[2] + base[2], base[3] + base[3]];
    else
      c = [base.substring(0, 2), base.substring(2, 4), base.substring(4, 6), base.substring(6)];
    return Color.fromHex(c[0], c[1], c[2], c[3]);
  } else {
    return Color.fromRGB(0, 0, 0, 255);
  }
};

Color.prototype.format = function(type) {
  function decToHex(b) {
    b = b.toString(16);
    if (b.length < 2)
      b = "0" + b;
    return b;
  }

  if (type === "rgba")
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a / 255) + ")";
  else if (type === "hex")
    return "#" + decToHex(this.r) + decToHex(this.g) + decToHex(this.b);
  else if (type === "hex8")
    return "#" + decToHex(this.r) + decToHex(this.g) + decToHex(this.b) + decToHex(this.a);
  else if (type === "hsl")
    return "hsl(" + this.getHue() + "," + (this.getSaturation() * HEXPERCENT) + "%," + (this.getLightness() * HEXPERCENT) + "%)";
  else if (type === "hsla")
    return "hsla(" + this.getHue() + "," + (this.getSaturation() * HEXPERCENT) + "%," + (this.getLightness() * HEXPERCENT) + "%," + (this.a / 255) + ")";
  else
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};

Color.prototype.getHue = function() {
  var h;

  if (this.r >= this.g && this.g >= this.b)
    h = 60 * (this.g - this.b) / (this.r - this.b);
  else if (this.g > this.r && this.r >= this.b)
    h = 60 * (2 - (this.r - this.b) / (this.g - this.b));
  else if (this.g >= this.b && this.b > this.r)
    h = 60 * (2 + (this.b - this.r) / (this.g - this.r));
  else if (this.b > this.g && this.g > this.r)
    h = 60 * (4 - (this.g - this.r) / (this.b - this.r));
  else if (this.b > this.r && this.r >= this.g)
    h = 60 * (4 + (this.r - this.g) / (this.b - this.g));
  else if (this.r >= this.b && this.b > this.g)
    h = 60 * (6 - (this.b - this.g) / (this.r - this.g));

  if (isNaN(h))
    return 0;
  else
    return h;
};
Color.prototype.getSaturation = function() {
  var min = Math.min(this.r / 255, this.g / 255, this.b / 255);
  var max = Math.max(this.r / 255, this.g / 255, this.b / 255);

  if (max == min)
    return 0;
  else {
    var d = max - min;
    if (this.getLightness() > 255 / 2)
      return d / (2 - max - min) * 255;
    else
      return d / (max + min) * 255;
  }
};
Color.prototype.getLightness = function(perception) {
  if (perception)
    return ((3 * this.r + 4 * this.g + this.b) >>> 3);
  else
    return (Math.max(this.r, this.g, this.b) + Math.min(this.r, this.g, this.b)) / 2;
};

Color.prototype.shiftHue = function(deg) {
  if (isNaN(deg))
    return this;

  return Color.fromHSL(this.getHue() + deg, this.getSaturation(), this.getLightness());
};
Color.prototype.saturate = function(num) {
  if (isNaN(num))
    return this;

  return Color.fromHSL(this.getHue(), this.getSaturation() + num, this.getLightness());
};
Color.prototype.lighten = function(num) {
  if (isNaN(num))
    return this;

  return Color.fromHSL(this.getHue(), this.getSaturation(), this.getLightness() + num);
};

Color.prototype.filter = function(type) {
  switch(type) {
    case "invert":
      var r = moveInRange(255 - this.r, 0, 255);
      var g = moveInRange(255 - this.g, 0, 255);
      var b = moveInRange(255 - this.b, 0, 255);

      return new Color(r, g, b, this.a);

    case "grayscale":
      var avg = moveInRange(Math.round((this.r + this.g + this.b) / 3), 0, 255);
      var r = avg;
      var g = avg;
      var b = avg;

      return new Color(r, g, b, this.a);

    case "sepia":
      var l = this.getLightness(true);
      var r = moveInRange(l + 40, 0, 255);
      var g = moveInRange(l + 20, 0, 255);
      var b = moveInRange(l - 20, 0, 255);

      return new Color(r, g, b, this.a);
  }
};
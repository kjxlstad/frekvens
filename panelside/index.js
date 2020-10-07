const clockPin = 13;
const enablePin = 14;
const latchPin = 15;
const dataPin = 16;

const btn1Pin = 4;
const btn2Pin = 5;

var matrix = [];

var t = 0;

function setPixel(x, y, power) {
  matrix[y * 16 + x] = power;
}
function getPixel(x, y) {
  return matrix[y * 16 + x];
}
function fill(power) {
  for (var i = 0; i < 16 * 16; i++) { matrix[i] = power; }
}

function update() {
  for (var x = 0; x < 2; x++) {
    for (var y = 0; y < 16; y++) {
      var start = y * 16 + x * 8;
      var end = start + 8;
      var data = E.toUint8Array(matrix.slice(start, end));
      shiftOut(dataPin, {clk : clockPin}, data);
    }
  }
  digitalPulse(latchPin, 1, 1);
}

function setup() {
  pinMode(btn1Pin, 'input_pullup');
  pinMode(btn2Pin, 'input_pullup');
  digitalWrite(enablePin, 0);
  digitalWrite(clockPin, 0);
  digitalWrite(latchPin, 0);
  
  fill(0);
  
  setWatch(function(e) {
    console.log('pressed');
  }, btn1Pin, { edge: 'falling', repeat: true, debounce: 50 });
  
  setWatch(function(e) {
    console.log('pressed');
  }, btn2Pin, { edge: 'falling', repeat: true, debounce: 50 });
  
  setInterval(function() {
    fill(0);
    program();
    update();
  }, 10);
}

function program() {
  for (let x = 0; x < 16; x++) {
    setPixel(x, t % 16, 1);
  }
  t++;
}

setup();



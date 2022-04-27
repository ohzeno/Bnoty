const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const fontsize = document.getElementById("jsFontSize");
const fontstyle = document.getElementById("jsFont");
let hasInput = false;
let size = "20px";
let font = "sans-serif";
const bold = document.getElementById("jsBold");
const italic = document.getElementById("jsItalic");
let boldtext = "";
let italictext = "";

// 캔버스 관련 설정값들
const INITIAL_COLOR = "black";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

//배경색 설정 안해주면 투명임
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR; // 선 색
ctx.fillStyle = INITIAL_COLOR;
ctx.lieWidth = 2.5; // 선 굵기

let painting = false;
let filling = false;

/// 함수 및 기능들

// 캔버스 클릭이벤트
canvas.onclick = function (e) {
  // 값이 입력인 상태인가?
  if (hasInput) return;
  addInput(e.offsetX, e.offsetY);
};

// 텍스트 입력 관련 이벤트
function addInput(x, y) {
  var input = document.createElement("input");

  input.type = "text";
  input.style.position = "fixed";
  input.style.left = x + "px";
  input.style.top = y + "px";
  input.style.width = "1000px";
  input.style.outline = "none";
  input.style.border = "none";
  input.style.backgroundColor = "transparent";

  input.onkeydown = handleENTER;

  document.body.appendChild(input);

  input.focus();

  hasInput = true;
}

// 엔터치면 입력종료하고 글자 캔버스에 그리기
function handleENTER(e) {
  var keyCode = e.keyCode;
  if (keyCode === 13) {
    drawText(
      this.value,
      parseInt(this.style.left, 10),
      parseInt(this.style.top, 10)
    );
    document.body.removeChild(this);
    hasInput = false;
  }
}

// 캔버스에 글자 그리는 함수
function drawText(txt, x, y) {
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  // 폰트는 굵기, 기울이기, 크기, 폰트로 들어감
  ctx.font = boldtext + " " + italictext + " " + size + " " + font;
  ctx.fillText(txt, x, y);
}

// 폰트 사이즈 조절
function handleFontSizeChange() {
  size = document.getElementById("jsFontSize").value + "px";
}

// 폰트 변경
function handleFontChange() {
  font = document.getElementById("jsFont").value;
}

// 폰트 진하기
function handleBoldClick() {
  if (boldtext == "bold") {
    boldtext = "";
    bold.innerText = "진하게";
  } else {
    boldtext = "bold";
    bold.innerText = "연하게";
  }
}

// 폰트 기울이기
function handleItalicClick() {
  if (italictext == "italic") {
    italictext = "";
    italic.innerText = "기울이기";
  } else {
    italictext = "italic";
    italic.innerText = "기울이지 않기";
  }
}

function startPainting(event) {
  if (event.which === 1) {
    //좌클릭일 때만 그리기
    painting = true;
  }
}

function stopPainting() {
  painting = false;
}

function onMouseMove(event) {
  // clientX는 화면 전체에서 마우스 좌표, offsetX는 캔버스 내 좌표
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (!filling) {
    //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

function handleCM(event) {
  event.preventDefault();
}

function handleSaveClick() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "PaintJS";
  link.click();
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
); //Array.from(colors)로 컬러 div태그 목록 가져옴

if (range) {
  range.addEventListener("input", handleRangeChange);
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

if (fontsize) {
  fontsize.addEventListener("input", handleFontSizeChange);
}

if (fontstyle) {
  fontstyle.addEventListener("input", handleFontChange);
}

if (bold) {
  bold.addEventListener("click", handleBoldClick);
}

if (italic) {
  italic.addEventListener("click", handleItalicClick);
}

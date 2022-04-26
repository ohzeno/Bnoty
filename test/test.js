const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const font = "14px snas-serif";
const hasInput = false;

const INITIAL_COLOR = "black";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

canvas.onclick = function (e) {
  if (hasInput) return;
  addInput(e.clientX, e.clientY);
};

function addInput(x, y) {
  var input = document.createElement("input");

  input.type = "text";
  input.style.position = "fixed";
  input.style.left = x + "px";
  input.style.top = y + "px";
  input.style.width = "300px";
  input.style.outline = "none";
  input.style.border = "none";

  input.onkeydown = handleENTER;

  document.body.appendChild(input);

  input.focus();

  hasInput = true;
}

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

function drawText(txt, x, y) {
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = font;
  ctx.fillText(txt, x, y);
}

//배경색 설정 안해주면 투명임
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR; // 선 색
ctx.fillStyle = INITIAL_COLOR;
ctx.lieWidth = 2.5; // 선 굵기

let painting = false;
let filling = false;

function startPainting(event) {
  if (event.which === 1) {
    //좌클릭 일 때만 그리기
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

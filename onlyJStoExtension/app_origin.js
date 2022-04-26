const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

const INITIAL_COLOR = "black";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.strokeStyle = INITIAL_COLOR; // 선 색
ctx.lieWidth = 2.5; // 선 굵기

let painting = false;

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
  } else {
    //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
}

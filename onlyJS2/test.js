const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "blue"; // 선 색
ctx.lineWidth = 25; // 선 굵기
ctx.lineCap = "round"; // 선 끝 모양

canvas.width = 700;
canvas.height = 700;

let painting = false;

function startPainting(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  ctx.beginPath(); // 경로 초기화
  ctx.moveTo(x, y); // 출발점을 좌표로
  painting = true;
}

function stopPainting() {
  ctx.closePath(); // 하위 경로의 시작점과 연결
  painting = false;
}

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    return;
  }
  ctx.lineTo(x, y); // 도착점 설정
  ctx.stroke(); // 그리기
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting); //클릭
  canvas.addEventListener("mouseup", stopPainting); //클릭때기
  canvas.addEventListener("mouseleave", stopPainting);
}

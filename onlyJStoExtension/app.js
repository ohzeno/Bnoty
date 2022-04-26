console.log("app.js");
console.log("window", window);
const canvas = window.document.createElement("Canvas");
canvas.setAttribute("id", "bnoty");
window.document.body.appendChild(canvas);
const test = document.getElementById("bnoty");
const ctx = test.getContext("2d");
const INITIAL_COLOR = "black";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
//background: transparent; position: absolute; z-index: 2147483647; opacity: 1;
canvas.style = `height: ${CANVAS_SIZE}px; width: auto; background: skyblue; position: absolute; top: 0; left: 0; z-index: 2147483647;`;
// ctx.fillStyle = "skyblue";
// ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR; // 선 색
ctx.lieWidth = 2.5; // 선 굵기

let painting = false;

function startPainting(event) {
  if (event.which === 1) {
    //좌클릭 일 때만 그리기
    // console.log("start들어옴");
    painting = true;
  }
}

function stopPainting() {
  // console.log("stop들어옴");
  painting = false;
}

function onMouseMove(event) {
  // clientX는 화면 전체에서 마우스 좌표, offsetX는 캔버스 내 좌표
  const x = event.offsetX;
  const y = event.offsetY;
  // console.log("좌표", x, y);
  if (!painting) {
    // console.log("begin들어옴");
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
    // console.log("stroke들어옴");
    // console.log(ctx.strokeStyle);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

if (canvas) {
  console.log("이벤트리스너");
  test.addEventListener("mousemove", onMouseMove);
  test.addEventListener("mousedown", startPainting);
  test.addEventListener("mouseup", stopPainting);
  test.addEventListener("mouseleave", stopPainting);
}

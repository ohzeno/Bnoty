console.log("app.js");
console.log("window", window);
const canvas = window.document.createElement("Canvas");
canvas.setAttribute("id", "bnoty");
window.document.body.appendChild(canvas);

const test = document.getElementById("bnoty");
const ctx = test.getContext("2d");
const INITIAL_COLOR = "black";
const CANVAS_SIZE = 700;

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
//background: transparent; position: absolute; z-index: 2147483647; opacity: 1;
canvas.style = `height: 100%; width: 100%; background: rgba(0, 0, 0, 0.1); position: absolute; top: 0; left: 0; z-index: 2147483646;`;
// ctx.fillStyle = "skyblue";
// ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR; // 선 색
ctx.lieWidth = 2.5; // 선 굵기

let painting = false;

// 여기부터 테스트를 위해서 임시 UI 시작 ----------------------------------
var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("지우기");
button.appendChild(buttonText);
button.setAttribute("id", "delBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 0; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("펜");
button.appendChild(buttonText);
button.setAttribute("id", "penBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 50px; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("네모");
button.appendChild(buttonText);
button.setAttribute("id", "rectangleBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 100px; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("세모");
button.appendChild(buttonText);
button.setAttribute("id", "triangleBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 150px; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("동그라미");
button.appendChild(buttonText);
button.setAttribute("id", "circleBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 200px; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("직선");
button.appendChild(buttonText);
button.setAttribute("id", "lineBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 280px; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("곡선");
button.appendChild(buttonText);
button.setAttribute("id", "curveBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 330px; z-index: 2147483647;`;

var button = window.document.createElement("button");
var buttonText = window.document.createTextNode("화살표");
button.appendChild(buttonText);
button.setAttribute("id", "arrowBut");
window.document.body.appendChild(button);
button.style = `position: absolute; top: 0; left: 380px; z-index: 2147483647;`;


// 여기는 위에 버튼 클릭 이벤트
document.getElementById("delBut").addEventListener("click", function () {
  saveImage = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
});

document.getElementById("penBut").addEventListener("click", function () {
  activate = "pen";
});

document.getElementById("rectangleBut").addEventListener("click", function () {
  activate = "rectangle";
});

document.getElementById("triangleBut").addEventListener("click", function () {
  activate = "triangle";
});

document.getElementById("circleBut").addEventListener("click", function () {
  activate = "circle";
});

document.getElementById("lineBut").addEventListener("click", function () {
  activate = "line";
});

document.getElementById("curveBut").addEventListener("click", function () {
  activate = "curve";
});

document.getElementById("arrowBut").addEventListener("click", function () {
  activate = "arrow";
});

// ------------------------------------------------------------------- 임시 UI 종료

var activate = "pen"; // 지금 활성화된 도구 기본은 펜!
var saveImage = null; // 지금 까지 그린 이미지를 저장
var sX, sY, eX, eY, mX, mY;


function startPainting(event) {
  if (painting) {// 이부분은 곡선그리는 부분떄문에 사용
    painting = false;
    return;
  }
  if (event.which === 1) {
    //좌클릭 일 때만 그리기
    // console.log("start들어옴");
    painting = true;
    sX = event.offsetX;
    sY = event.offsetY;
  }
}

function stopPainting(event) {
  // console.log("stop들어옴");
  if (activate == "curve") {
    // 커브면 끝좌표 초기화 or 갱신
    if (mX == null && mY == null) {
      mX = event.offsetX;
      mY = event.offsetY;
      return; // 여기서는 끝좌표만 갱신하고 리턴해줘야 다음작업 가능
    } else {
      mX = null;
      mY = null;
    }
  }
  painting = false;
  saveImage = ctx.getImageData(0, 0, canvas.width, canvas.height); // 지금까지 그린 정보를 저장
}

function onMouseMove(event) {
  // clientX는 화면 전체에서 마우스 좌표, offsetX는 캔버스 내 좌표
  eX = event.offsetX;
  eY = event.offsetY;

  // console.log("좌표", x, y);
  if (!painting) {
    // console.log("begin들어옴");
    ctx.beginPath();
    ctx.moveTo(eX, eY);
  } else {
    //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
    // console.log("stroke들어옴");
    // console.log(ctx.strokeStyle);
    if (activate == "pen") {
      ctx.lineTo(eX, eY);
      ctx.stroke();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (saveImage)
      // 저장된 정보가 있으면 불러옴 이전에 그렸던 작업을 다시 불러옴
      ctx.putImageData(saveImage, 0, 0);
    if (activate == "rectangle")
      // 네모 그리는 부분 시작 좌표에서 해당 너비 높이만큼 그린다
      ctx.strokeRect(sX, sY, eX - sX, eY - sY);
    else if (activate == "triangle") {
      // 세모
      ctx.beginPath();
      ctx.moveTo((sX + eX) / 2, sY); // 시작점(x,y)
      ctx.lineTo(sX, eY);
      ctx.lineTo(eX, eY);
      ctx.lineTo((sX + eX) / 2, sY);
      ctx.stroke();
    } else if (activate == "circle") {
      // 동그라미
      var s = ((eX - sX) / 2) * 0.5522848,
        o = ((eY - sY) / 2) * 0.5522848,
        a = sX + eX - sX,
        r = sY + eY - sY,
        h = sX + (eX - sX) / 2,
        c = sY + (eY - sY) / 2;
        ctx.beginPath(); // 새로운 경로 시작함을 알림 약간 기존 저장된 시작점 그런거 초기화느낌?
        ctx.moveTo(sX, c); // 시작점(x,y)
        ctx.bezierCurveTo(sX, c - o, h - s, sY, h, sY); //곡선 그리는 부분 첫번째 제어점 (x,y), 두번째 제어점(x,y), 끝점x,y
        ctx.bezierCurveTo(h + s, sY, a, c - o, a, c);
        ctx.bezierCurveTo(a, c + o, h + s, r, h, r);
        ctx.bezierCurveTo(h - s, r, sX, c + o, sX, c);
        ctx.stroke(); // 이걸 해줌으로써 위에서 작성한 것들 화면에 뿌려줌?
    } else if (activate == "line") {
      // 직선
      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.lineTo(eX, eY);
      ctx.stroke();
    } else if (activate == "curve") {
      // 그 여기 들어온 수를 판단해서 점 찍고 하는식으로 해야할거 같은데?
      ctx.beginPath();
      if (mX == null && mY == null) {
        // 끝 좌표가 없으면 끝좌표를 저장하고 직선 그림
        ctx.moveTo(sX, sY);
        ctx.lineTo(eX, eY);
      } else {
        // 끝 좌표가 존재하면 마우스 이동좌표에 따른 곡선 그림
        ctx.moveTo(sX, sY);
        ctx.quadraticCurveTo(event.offsetX, event.offsetY, mX, mY);
      }
      ctx.stroke();
    } else if (activate == "arrow") {
      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.lineTo(eX, eY);
      ctx.stroke(); // 직선 그리기

      var aWidth = 5 + ctx.lineWidth;
      var aLength = 12 + ctx.lineWidth;
      var dx = eX - sX;
      var dy = eY - sY;
      var angle = Math.atan2(dy, dx);
      var length = Math.sqrt(dx * dx + dy * dy);

      // //두점 선긋기
      ctx.translate(sX, sY);
      ctx.rotate(angle);
      ctx.beginPath();

      //화살표 모양 만들기
      ctx.moveTo(length - aLength, -aWidth);
      ctx.lineTo(length, 0);
      ctx.lineTo(length - aLength, aWidth);

      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}

if (canvas) {
  console.log("이벤트리스너");
  test.addEventListener("mousemove", onMouseMove);
  test.addEventListener("mousedown", startPainting);
  test.addEventListener("mouseup", stopPainting);
  test.addEventListener("mouseleave", stopPainting);
}

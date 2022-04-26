// console.log("app.js");
// console.log(this === window);
// console.log("window", window);
let canvas;
let test;
let ctx;
let INITIAL_COLOR = "black";
let CANVAS_SIZE = 700;
let painting = false;
let paragraph;
let strokeStyle = "blue";
let lineWidth = 2.5;

function createCanvas() {
  canvas = window.document.createElement("Canvas");
  canvas.setAttribute("id", "bnoty");
  window.document.body.appendChild(canvas);
  test = window.document.getElementById("bnoty");
  ctx = test.getContext("2d");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  //background: transparent; position: absolute; z-index: 2147483647; opacity: 1;
  //height: ${CANVAS_SIZE}px; width: ${CANVAS_SIZE}px
  canvas.style = `height: ${CANVAS_SIZE}px; width: ${CANVAS_SIZE}px; background: skyblue; position: absolute; top: 0; left: 0; z-index: 2147483647; opacity: 0.4;`;
  // ctx.fillStyle = "skyblue";
  // ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  // ctx.strokeStyle = INITIAL_COLOR; // 선 색
  setCtxProp();

  if (canvas) {
    test.addEventListener("mousemove", onMouseMove);
    test.addEventListener("mousedown", startPainting);
    test.addEventListener("mouseup", stopPainting);
    test.addEventListener("mouseleave", stopPainting);
  }
}

function setCtxProp() {
  ctx.strokeStyle = strokeStyle; // 선 색
  ctx.lineWidth = lineWidth; // 선 굵기
}

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

// 윈도우 사이즈 변할때마다 작동
window.onresize = function (event) {
  handleResize();
};

function handleResize(t) {
  // 사이즈조절. 삼항, 콤마> if문으로 어느정도 변경
  // store, restore는 아직 없어서 주석해둠.
  // paragraph는 아직 해석못함.
  // console.log("resize");
  var e = !1,
    i = window.pageYOffset || document.documentElement.scrollTop,
    n =
      (window.innerHeight || document.documentElement.clientHeight,
      ctx.lineWidth),
    s = Math.max(
      document.documentElement.clientWidth,
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth
    ),
    o = Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    ),
    a = Math.min(o - canvas.offsetTop, 5e3);
  if (5e3 < i - canvas.offsetTop) {
    a = Math.min(o - i, 5e3);
    canvas.style.top = i + "px";
    e = !0;
  } else {
    if (i < canvas.offsetTop) {
      a = 5e3;
      canvas.style.top = Math.max(0, 5e3 * Math.floor(i / 5e3)) + "px";
      e = !0;
    }
  }
  if (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (paragraph) {
      // paragraph는 무슨 역할인지 아직 모름.
      paragraph.clearIntervals();
      paragraph = null;
    }
    // storeCanvas(!0);
  } else {
    // storeCanvas(t);
  }
  canvas.width = s; // 여기서 ctx 속성 처음 초기화됨.
  canvas.style.width = s + "px";
  canvas.height = a; // 여기서 ctx 속성 두번째 초기화됨. 없애면 마우스랑 그려지는 위치 어긋남. 그러니 ctx 속성 설정해주는 함수 따로 만듦.
  setCtxProp();
  ctx.strokeStyle = "blue";
  canvas.style.height = a + "px";
  // if (!e) {
  //   restoreCanvas();
  // }
  // updatePaintStyle();
  ctx.lineWidth = n;
}

createCanvas();
handleResize(); // 초기 캔버스 사이즈조절

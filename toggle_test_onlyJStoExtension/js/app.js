// console.log("app.js");
// console.log(this === window);
// console.log("window", window);
let canvas;
let test;
let ctx;
let INITIAL_COLOR = "red";
let CANVAS_SIZE = 700;
let painting = false;
let paragraph;
let strokeStyle = "rgb(0, 0, 0)"; // 선 색상
let lineWidth = 3; // 선 두께

var globalAlpha = 1; //투명도

var activate = "pen"; // 지금 활성화된 도구 기본은 펜!
var saveImage = null; // 지금 까지 그린 이미지를 저장
var sX, sY, eX, eY, mX, mY; //시작 좌표 끝좌표 중간좌표
var histories = null; // 여기에 이제 그 작업한거 저장함

var MAX_ITEMS; // 최대 저장 아이템
var currentIndex; // 지금 인덱스 위치
var array; // 데이터 저장 공간

var red = 0;
var green = 0;
var blue = 0;

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
  canvas.style = `height: ${CANVAS_SIZE}px; width: ${CANVAS_SIZE}px; position: absolute; top: 0; left: 0; z-index: 2147483647;`;
  // ctx.fillStyle = "skyblue";
  // ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  // ctx.strokeStyle = INITIAL_COLOR; // 선 색
  setCtxProp();

  // 여기부터 테스트를 위해서 임시 UI 시작 ----------------------------------
  var button = window.document.createElement("button");
  var buttonText = window.document.createTextNode("전체");
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

  var button = window.document.createElement("button");
  var buttonText = window.document.createTextNode("부분");
  button.appendChild(buttonText);
  button.setAttribute("id", "delPartBut");
  window.document.body.appendChild(button);
  button.style = `position: absolute; top: 30px; left: 0; z-index: 2147483647;`;

  var button = window.document.createElement("button");
  var buttonText = window.document.createTextNode("이전");
  button.appendChild(buttonText);
  button.setAttribute("id", "previousBut");
  window.document.body.appendChild(button);
  button.style = `position: absolute; top: 30px; left: 50px; z-index: 2147483647;`;

  var button = window.document.createElement("button");
  var buttonText = window.document.createTextNode("다음");
  button.appendChild(buttonText);
  button.setAttribute("id", "nextBut");
  window.document.body.appendChild(button);
  button.style = `position: absolute; top: 30px; left: 100px; z-index: 2147483647;`;

  var input = window.document.createElement("input");
  input.setAttribute("id", "inputColor");
  input.setAttribute("type", "color");
  input.setAttribute("placeholder", "색상");
  window.document.body.appendChild(input);
  input.style = `position: absolute; top: 30px; left: 150px; z-index: 2147483647; width:30px`;

  var input = window.document.createElement("input");
  input.setAttribute("id", "inputLineWidth");
  input.setAttribute("placeholder", "두께");
  window.document.body.appendChild(input);
  input.style = `position: absolute; top: 30px; left: 200px; z-index: 2147483647; width:30px`;

  var input = window.document.createElement("input");
  input.setAttribute("id", "inputTransparency");
  input.setAttribute("placeholder", "투명도");
  window.document.body.appendChild(input);
  input.style = `position: absolute; top: 30px; left: 250px; z-index: 2147483647; width:30px`;

  document.getElementById("delBut").addEventListener("click", function () {
    saveImage = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
  });

  document.getElementById("delPartBut").addEventListener("click", function () {
    activate = "eraser";
    // test.style.cursor = url(images/image38.png), 2,2, auto;
  });

  document.getElementById("penBut").addEventListener("click", function () {
    activate = "pen";
  });

  document
    .getElementById("rectangleBut")
    .addEventListener("click", function () {
      activate = "rectangle";
      test.style.cursor = "crosshair";
    });

  document.getElementById("triangleBut").addEventListener("click", function () {
    activate = "triangle";
    test.style.cursor = "crosshair";
  });

  document.getElementById("circleBut").addEventListener("click", function () {
    activate = "circle";
    test.style.cursor = "crosshair";
  });

  document.getElementById("lineBut").addEventListener("click", function () {
    activate = "line";
    test.style.cursor = "crosshair";
  });

  document.getElementById("curveBut").addEventListener("click", function () {
    activate = "curve";
    test.style.cursor = "crosshair";
  });

  document.getElementById("arrowBut").addEventListener("click", function () {
    activate = "arrow";
    test.style.cursor = "crosshair";
  });

  document.getElementById("previousBut").addEventListener("click", function () {
    if (histories.hasPrevious()) {
      ctx.putImageData(histories.previous(), 0, 0);
    }
  });

  document.getElementById("nextBut").addEventListener("click", function () {
    if (histories.hasNext()) {
      ctx.putImageData(histories.next(), 0, 0);
    }
  });

  document.getElementById("inputColor").addEventListener("input", function () {
    var color = document.getElementById("inputColor").value;
    // 헥사값을 rgb로 변경
    red = parseInt(color[1] + color[2], 16);
    green = parseInt(color[3] + color[4], 16);
    blue = parseInt(color[5] + color[6], 16);
    strokeStyle = "rgb(" + red + "," + green + "," + blue + ")";
    setCtxProp();
  });

  document
    .getElementById("inputLineWidth")
    .addEventListener("input", function () {
      lineWidth = document.getElementById("inputLineWidth").value;
      ctx.lineWidth = lineWidth;
    });

  document
    .getElementById("inputTransparency")
    .addEventListener("input", function () {
      globalAlpha = document.getElementById("inputTransparency").value;
      setCtxProp();
    });

  // ------------------------------------------------------------------- 임시 UI 종료

  if (canvas) {
    test.addEventListener("mousemove", onMouseMove);
    test.addEventListener("mousedown", startPainting);
    test.addEventListener("mouseup", stopPainting);
    test.addEventListener("mouseleave", leaveStopPainting);
  }
  Histories(); // 작업마다 저장한거 관리하는 부분 처음 초기화 및 프로퍼티 추가 객체 할당
}

// 작업마다 저장한거 관리하는 부분 시작 -----------------------------
function Histories() {
  // 최초 변수 초기화
  function historySave() {
    MAX_ITEMS = 50;
    currentIndex = 0;
    array = [];
  }

  histories = new historySave(); // 객체 할당

  // 프로토 타입 객체 생성. 다른 객체도 사용 가능
  historySave.prototype.add = function (t) {
    // 작업 저장하는 프로토타입
    if (
      (currentIndex < array.length - 1
        ? ((array[++currentIndex] = t),
          (array = array.slice(0, currentIndex + 1)))
        : (array.push(t), (currentIndex = array.length - 1)),
      array.length > MAX_ITEMS)
    ) {
      var e = array.length - MAX_ITEMS;
      (array = array.splice(-MAX_ITEMS)), (currentIndex = currentIndex - e);
    }
  };
  historySave.prototype.previous = function () {
    // 이전 작업 가져오는거
    return 0 === currentIndex ? null : array[--currentIndex];
  };
  historySave.prototype.next = function () {
    // 다음 작업 가져오는거
    return currentIndex === array.length - 1 ? null : array[++currentIndex];
  };
  historySave.prototype.hasPrevious = function () {
    //이전 저장값 있는지
    return 0 < currentIndex;
  };
  historySave.prototype.hasNext = function () {
    // 다음 저장값 있는지
    return currentIndex < array.length - 1;
  };
}
// 작업마다 저장한거 관리하는 부분 종료 -----------------------------

function addHistory() {
  histories.add(saveImage);
  // 여기서 버튼 디스에이블하는것도 해줘야함
}

function setCtxProp() {
  // 선색상 투명도 굵기 설정하는 부분
  ctx.strokeStyle = strokeStyle; // 선 색
  ctx.fillStyle = strokeStyle; // 채우기 색
  ctx.globalAlpha = globalAlpha; // 투명도
  ctx.lineWidth = lineWidth; // 선 굵기
}

function startPainting(event) {
  // 마우스 클릭버튼 누름
  if (painting) {
    // 이부분은 곡선그리는 부분떄문에 사용
    painting = false;
    return;
  }
  painting = true;
  sX = event.offsetX;
  sY = event.offsetY;
}

function stopPainting(event) {
  // 마우스 클릭 버튼 떔
  // console.log("stop들어옴");
  if (activate == "curve") {
    // 커브면 끝좌표 초기화 or 갱신
    if (mX == null && mY == null) {
      mX = event.offsetX;
      mY = event.offsetY;
      return; // 여기서는 끝좌표만 갱신하고 리턴해줘야 다음작업 가능
    }
    mX = null;
    mY = null;
  }
  painting = false;
  saveImage = ctx.getImageData(0, 0, canvas.width, canvas.height); // 지금까지 그린 정보를 저장
  addHistory();
}

function leaveStopPainting() {
  // 마우스 범위 밖으로 나감
  if (painting) {
    painting = false;
    saveImage = ctx.getImageData(0, 0, canvas.width, canvas.height); // 지금까지 그린 정보를 저장
    addHistory();
  }
  if (activate == "curve") {
    mX = null;
    mY = null;
  }
}

function onMouseMove(event) {
  // 마우스 움직일때 실행
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
    if (activate == "eraser") {
      // 부분 지우기
      // ctx.strokeRect(eX-ctx.lineWidth*1.49, eY-ctx.lineWidth*1.49, ctx.lineWidth*2.9, ctx.lineWidth*2.9);
      ctx.clearRect(
        eX - ctx.lineWidth * 1.5,
        eY - ctx.lineWidth * 1.5,
        ctx.lineWidth * 3,
        ctx.lineWidth * 3
      ); // 해당 범위만큼 지운다.
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentIndex != 0) {
      // 저장된 정보가 있으면 불러옴 이전에 그렸던 작업을 다시 불러옴
      ctx.putImageData(array[currentIndex], 0, 0);
    }

    if (activate == "pen") {
      // 펜그리는 부분
      ctx.lineTo(eX, eY);
      ctx.stroke();
    } else if (activate == "rectangle") {
      // 네모 그리는 부분 시작 좌표에서 해당 너비 높이만큼 그린다
      ctx.strokeRect(sX, sY, eX - sX, eY - sY);
    } else if (activate == "triangle") {
      // 세모
      ctx.beginPath();
      ctx.moveTo((sX + eX) / 2, sY); // 시작점(x,y)
      ctx.lineTo(sX, eY);
      ctx.moveTo((sX + eX) / 2, sY);
      ctx.lineTo(eX, eY);
      ctx.moveTo(sX, eY);
      ctx.lineTo(eX, eY);
      ctx.lineCap = "round"; // 끝을 둥글게
      ctx.stroke();
      ctx.lineCap = "butt"; // 끝을 원래로
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
      var headlen = ctx.lineWidth * 6; // 화살표 선 길이
      var dx = eX - sX;
      var dy = eY - sY;
      var angle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.lineTo(eX, eY);
      ctx.moveTo(eX, eY);
      ctx.lineTo(
        eX - headlen * Math.cos(angle - Math.PI / 6),
        eY - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(eX, eY);
      ctx.lineTo(
        eX - headlen * Math.cos(angle + Math.PI / 6),
        eY - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.lineCap = "round"; // 끝을 둥글게
      ctx.stroke();
      ctx.lineCap = "butt"; // 끝을 원래로
    }
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
  canvas.style.height = a + "px";
  // if (!e) {
  //   restoreCanvas();
  // }
  // updatePaintStyle();
  ctx.lineWidth = n;
  if (saveImage)
    // 저장된 정보가 있으면 불러옴 이전에 그렸던 작업을 다시 불러옴
    ctx.putImageData(saveImage, 0, 0);
  if (array.length == 0)
    histories.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

createCanvas();
handleResize(); // 초기 캔버스 사이즈조절

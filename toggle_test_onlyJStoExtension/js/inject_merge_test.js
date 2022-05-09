!(function (window_t, func_e) {
  // t는 window, e는 function(window_e)
  if ("undefined" != typeof unsafeWindow && null !== unsafeWindow) {
    if (unsafeWindow.CTRL_HIDDEN) {
      // t.bnoty.showControlPanel();
    } else {
      if (!unsafeWindow.bnoty_INIT) {
        window_t.bnoty = func_e(window_t);
        window_t.bnoty.init(); //e.init()
      }
    }
  } else {
    if (!(void 0 !== window_t.bnoty && null !== window_t.bnoty)) {
      window_t.bnoty = func_e(window_t);
    }
    if (window_t.bnoty.controlPanelHidden) {
      // t.bnoty.showControlPanel();
    } else {
      if (!window_t.bnoty.initialized) {
        window_t.bnoty.init();
      }
    }
  }
})("undefined" != typeof window ? window : this, function (window_e) {
  var global;
  if ("undefined" != typeof chrome) {
    global = chrome;
  } else {
    if ("undefined" != typeof browser) {
      global = browser;
    } else {
      void 0;
    }
  }
  e_group = {
    canvas: null,
    ctx: null,
    initialized: !1,
    INITIAL_COLOR: "red",
    painting: false,
    resizeTimeoutID: null,
    paragraph: null,
    strokeStyle: "rgb(0, 0, 0)", // 선 색상
    lineWidth: 3, // 선 두께
    globalAlpha: 1, //투명도
    activate: "pen", // 지금 활성화된 도구 기본은 펜!
    saveImage: null, // 지금 까지 그린 이미지를 저장
    saveLasso: [null, null], // 올가미로 선택한 영역을 이미지로 저장 (테투리 x , 테두리 o)
    histories: null, // 여기에 이제 그 작업한거 저장함
    MAX_ITEMS: null, // 최대 저장 아이템
    currentIndex: null, // 지금 인덱스 위치
    array: [], // 데이터 저장 공간
    red: 0,
    green: 0,
    blue: 0,
    sX: null,
    sY: null,
    eX: null,
    eY: null,
    mX: null,
    mY: null,
    lassosX: null,
    lassosY: null,
    lassoeX: null,
    lassoeY: null,
    lassosubX: null,
    lassosubY: null,
    hasInput: false, // 텍스트 입력 여부
    size: "20px", // 텍스트 사이즈
    font: "sans-serif", // 텍스트 폰트
    boldtext: "", // 볼드
    italictext: "", // 기울이기
    textactive: false, // 텍스트 입력중인지 체크

    startPainting: function (event) {
      // 마우스 클릭버튼 누름
      if (event.which === 1) {
        //좌클릭 일 때만 그리기
        if (this.painting) {
          // 이부분은 곡선그리는 부분떄문에 사용
          this.painting = false;
          return;
        }
        // console.log("start들어옴");
        this.painting = true;
        this.sX = event.offsetX;
        this.sY = event.offsetY;
        if (this.activate == "fill") {
          this.handleFill(event.clientX, event.clientY);
        }
        if (this.activate == "lasso" && this.saveLasso[0] == null) {
          // 올가미 활성화이면서 테두리없는 이미지가 저장되어있지않으면 범위를 시작범위 지정
          this.lassosX = event.offsetX;
          this.lassosY = event.offsetY;
          this.lassosubX = event.offsetX;
          this.lassosubY = event.offsetY;
        } else if (
          this.activate == "lasso" &&
          this.saveLasso[0] != null &&
          (this.sX < this.lassosX ||
            this.sX > this.lassoeX ||
            this.sY < this.lassosY ||
            this.sY > this.lassoeY)
        ) {
          // 올가미 활성화면서 이미 저장된 이미지있으면 이건 범위체크해서 다른범위찍으면 이미지 저장.
          if(this.lassosX == this.lassosubX && this.lassosY == this.lassosubY){
            this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
            this.currentIndex--;
            this.saveLasso[0] = null,
            this.saveLasso[1] = null,
            this.lassosX = null,
            this.lassosY= null,
            this.lassoeX = null,
            this.lassoeY = null,
            this.lassosubX = null,
            this.lassosubY = null
          }else{
            this.ctx.putImageData(this.saveLasso[0], this.lassosX, this.lassosY)
            this.saveLasso[0] = null,
            this.saveLasso[1] = null,
            this.lassosX = null,
            this.lassosY= null,
            this.lassoeX = null,
            this.lassoeY = null,
            this.lassosubX = null,
            this.lassosubY = null
          }
        }
      }
    },
    stopPainting: function (event) {
      // 마우스 클릭 버튼 떔
      // console.log("stop들어옴");
      if (this.activate == "curve") {
        // 커브면 끝좌표 초기화 or 갱신
        if (this.mX == null && this.mY == null) {
          this.mX = event.offsetX;
          this.mY = event.offsetY;
          return; // 여기서는 끝좌표만 갱신하고 리턴해줘야 다음작업 가능
        }
        this.mX = null;
        this.mY = null;
      } else if (this.activate == "lasso") {
        if (this.lassosX > this.lassoeX) {
          var tmp = this.lassosX;
          this.lassosX = this.lassoeX;
          this.lassoeX = tmp;
          this.lassosubX = this.lassosX;
        }
        if (this.lassosY > this.lassoeY) {
          var tmp = this.lassosY;
          this.lassosY = this.lassoeY;
          this.lassoeY = tmp;
          this.lassosubY = this.lassosY;
        }
        if (this.saveLasso[1] == null && this.saveLasso[0] != null) {
          this.saveLasso[1] = this.ctx.getImageData(
            this.lassosX,
            this.lassosY,
            this.lassoeX - this.lassosX,
            this.lassoeY - this.lassosY
          );
        } else if (this.saveLasso[1] != null) {
          this.lassosX = this.eX - (this.sX - this.lassosX);
          this.lassosY = this.eY - (this.sY - this.lassosY);
          (this.lassoeX = this.lassosX + this.saveLasso[1].width),
            (this.lassoeY = this.lassosY + this.saveLasso[1].height);
          this.ctx.putImageData(this.saveLasso[1], this.lassosX, this.lassosY);
        }
      }
      if (this.activate != "lasso") {
        (this.saveLasso[0] = null),
          (this.saveLasso[1] = null),
          (this.lassosX = null),
          (this.lassosY = null),
          (this.lassoeX = null),
          (this.lassoeY = null),
          (this.lassosubX = null),
          (this.lassosubY = null);
      }
      this.painting = false;
      if (this.activate != "text" && this.saveLasso[0] == null) {
        this.saveImage = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        ); // 지금까지 그린 정보를 저장
        this.addHistory();
      }
    },
    leaveStopPainting: function () {
      // 마우스 범위 밖으로 나감
      if (this.painting) {
        if (this.activate == "lasso") {
        if (this.lassosX > this.lassoeX) {
          var tmp = this.lassosX;
          this.lassosX = this.lassoeX;
          this.lassoeX = tmp;
          this.lassosubX = this.lassosX;
        }
        if (this.lassosY > this.lassoeY) {
          var tmp = this.lassosY;
          this.lassosY = this.lassoeY;
          this.lassoeY = tmp;
          this.lassosubY = this.lassosY;
        }
        if (this.saveLasso[1] != null || this.saveLasso[0] != null) {
          this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
          this.currentIndex--;
          this.saveLasso[0] = null,
          this.saveLasso[1] = null,
          this.lassosX = null,
          this.lassosY= null,
          this.lassoeX = null,
          this.lassoeY = null,
          this.lassosubX = null,
          this.lassosubY = null
        }
      }
        this.painting = false;
        if (this.activate != "text"  && this.saveLasso[0] == null ) {
          this.saveImage = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          ); // 지금까지 그린 정보를 저장
          this.addHistory();
        }
      }
      if (this.activate == "curve") {
        this.mX = null;
        this.mY = null;
      }
    },
    onMouseMove: function (event) {
      // 마우스 움직일때 실행
      // clientX는 화면 전체에서 마우스 좌표, offsetX는 캔버스 내 좌표
      this.eX = event.offsetX;
      this.eY = event.offsetY;
      if (this.activate == "lasso") {
        if (
          this.lassosX <= this.eX &&
          this.lassoeX >= this.eX &&
          this.lassosY <= this.eY &&
          this.lassoeY >= this.eY
        ) {
          this.canvas.style.cursor = "move";
        } else {
          this.canvas.style.cursor = "crosshair";
        }
      }

      if (this.activate == "lasso" && this.lassosX == null) {
        return;
      }
      // console.log("좌표", x, y);
      if (!this.painting) {
        // console.log("begin들어옴");
        // this.ctx.globalCompositeOperation = "destination-atop"; // 이 줄 추가로 펜선 안겹침. 즉 투명하게 그릴 수 있음. 기존엔 투명도 설정해도 계속 겹쳐서 불투명하게 그려짐. + 부작용> 두번째 그릴때 이전에 그린거 초기화됨. restore, buffer캔버스 사용해야 할 듯...
        this.ctx.beginPath();
        this.ctx.moveTo(this.eX, this.eY);
      } else {
        //그냥 else하면 filling 상태일 때 클릭하고 드래그하면 선 그려짐
        // console.log("stroke들어옴");
        if (this.activate == "eraser") {
          // 부분 지우기
          // this.ctx.strokeRect(this.eX-this.ctx.lineWidth*1.49, this.eY-this.ctx.lineWidth*1.49, this.ctx.lineWidth*2.9, this.ctx.lineWidth*2.9);
          this.ctx.save();
          this.lineWidth = 4;
          this.setCtxProp();
          this.ctx.clearRect(
            this.eX - this.ctx.lineWidth * 1.5,
            this.eY - this.ctx.lineWidth * 1.5,
            this.ctx.lineWidth * 3,
            this.ctx.lineWidth * 3
          ); // 해당 범위만큼 지운다.
          this.ctx.restore();
          this.lineWidth = this.ctx.lineWidth;
          return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentIndex != 0) {
          // 저장된 정보가 있으면 불러옴 이전에 그렸던 작업을 다시 불러옴
          this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
        }

        if (this.activate == "pen") {
          // 펜그리는 부분
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.stroke();
        } else if (this.activate == "highlighter") {
          this.ctx.globalAlpha = 0.5; // 형광펜 그리는 동안 알파 변경
          if (this.ctx.lineWidth < 15) {
            // 너무 얇으면 최소굵기 지정
            this.ctx.lineWidth = 15;
          }
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.stroke();
          this.ctx.globalAlpha = this.globalAlpha; // 알파 초기화
          this.ctx.lineWidth = this.lineWidth; // 굵기 초기화
        } else if (this.activate == "rectangle") {
          // 네모 그리는 부분 시작 좌표에서 해당 너비 높이만큼 그린다
          this.ctx.strokeRect(
            this.sX,
            this.sY,
            this.eX - this.sX,
            this.eY - this.sY
          );
        } else if (this.activate == "triangle") {
          // 세모
          this.ctx.beginPath();
          this.ctx.moveTo((this.sX + this.eX) / 2, this.sY); // 시작점(x,y)
          this.ctx.lineTo(this.sX, this.eY);
          this.ctx.moveTo((this.sX + this.eX) / 2, this.sY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.moveTo(this.sX, this.eY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.lineCap = "round"; // 끝을 둥글게
          this.ctx.stroke();
          this.ctx.lineCap = "butt"; // 끝을 원래로
        } else if (this.activate == "circle") {
          // 동그라미
          var s = ((this.eX - this.sX) / 2) * 0.5522848,
            o = ((this.eY - this.sY) / 2) * 0.5522848,
            a = this.sX + this.eX - this.sX,
            r = this.sY + this.eY - this.sY,
            h = this.sX + (this.eX - this.sX) / 2,
            c = this.sY + (this.eY - this.sY) / 2;
          this.ctx.beginPath(); // 새로운 경로 시작함을 알림 약간 기존 저장된 시작점 그런거 초기화느낌?
          this.ctx.moveTo(this.sX, c); // 시작점(x,y)
          this.ctx.bezierCurveTo(this.sX, c - o, h - s, this.sY, h, this.sY); //곡선 그리는 부분 첫번째 제어점 (x,y), 두번째 제어점(x,y), 끝점x,y
          this.ctx.bezierCurveTo(h + s, this.sY, a, c - o, a, c);
          this.ctx.bezierCurveTo(a, c + o, h + s, r, h, r);
          this.ctx.bezierCurveTo(h - s, r, this.sX, c + o, this.sX, c);
          this.ctx.stroke(); // 이걸 해줌으로써 위에서 작성한 것들 화면에 뿌려줌?
        } else if (this.activate == "line") {
          // 직선
          this.ctx.beginPath();
          this.ctx.moveTo(this.sX, this.sY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.stroke();
        } else if (this.activate == "curve") {
          // 그 여기 들어온 수를 판단해서 점 찍고 하는식으로 해야할거 같은데?
          this.ctx.beginPath();
          if (this.mX == null && this.mY == null) {
            // 끝 좌표가 없으면 끝좌표를 저장하고 직선 그림
            this.ctx.moveTo(this.sX, this.sY);
            this.ctx.lineTo(this.eX, this.eY);
          } else {
            // 끝 좌표가 존재하면 마우스 이동좌표에 따른 곡선 그림
            this.ctx.moveTo(this.sX, this.sY);
            this.ctx.quadraticCurveTo(
              event.offsetX,
              event.offsetY,
              this.mX,
              this.mY
            );
          }
          this.ctx.stroke();
        } else if (this.activate == "arrow") {
          var headlen = this.ctx.lineWidth * 6; // 화살표 선 길이
          var dx = this.eX - this.sX;
          var dy = this.eY - this.sY;
          var angle = Math.atan2(dy, dx);
          this.ctx.beginPath();
          this.ctx.moveTo(this.sX, this.sY);
          this.ctx.lineTo(this.eX, this.eY);
          this.ctx.moveTo(this.eX, this.eY);
          this.ctx.lineTo(
            this.eX - headlen * Math.cos(angle - Math.PI / 6),
            this.eY - headlen * Math.sin(angle - Math.PI / 6)
          );
          this.ctx.moveTo(this.eX, this.eY);
          this.ctx.lineTo(
            this.eX - headlen * Math.cos(angle + Math.PI / 6),
            this.eY - headlen * Math.sin(angle + Math.PI / 6)
          );
          this.ctx.lineCap = "round"; // 끝을 둥글게
          this.ctx.stroke();
          this.ctx.lineCap = "butt"; // 끝을 원래로
        } else if (this.activate == "lasso") {
          // 올가미
          if (this.saveLasso[1] != null) {
            this.ctx.clearRect(
              this.lassosubX,
              this.lassosubY,
              this.saveLasso[1].width,
              this.saveLasso[1].height
            );
            this.ctx.putImageData(
              this.saveLasso[1],
              this.eX - (this.sX - this.lassosX),
              this.eY - (this.sY - this.lassosY)
            );
            return;
          }
          this.lassoeX = event.offsetX;
          this.lassoeY = event.offsetY;
          if (this.eX != this.lassosX && this.eY != this.lassosY) {
            this.saveLasso[0] = this.ctx.getImageData(
              this.lassosX,
              this.lassosY,
              this.eX - this.lassosX,
              this.eY - this.lassosY
            );
          }
          this.ctx.save();
          this.ctx.strokeStyle = "rgba(46,112,245)"; // 파란색
          this.ctx.lineWidth = 1;
          // 네모 그리는 부분 시작 좌표에서 해당 너비 높이만큼 그린다
          this.ctx.setLineDash([5]); // 간격이 5인 점선 설정
          this.ctx.strokeRect(
            this.sX,
            this.sY,
            this.eX - this.sX,
            this.eY - this.sY - 0.5
          );
          this.ctx.setLineDash([]); // 실선으로 변경
          this.ctx.restore();
        }
      }
    },
    onMouseClick: function (event) {
      if (this.activate == "text") {
        if (this.textactive) {
          this.handleMouseClick();
        }
        if (!this.hasInput) {
          console.log("실행됨");
          this.addInput(event.offsetX, event.offsetY);
        }
      }
    },
    matchOutlineColor: function (a, b, c, d) {
      console.log("inject.js e 내부 matchOutlineColor");
      return 255 !== a && 255 !== b && 255 !== c && 0 !== d;
    },
    handleFill: function (x, y) {
      var currentImage = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      i = 4 * (y * this.canvas.width + x);
      r = currentImage.data[i];
      g = currentImage.data[i + 1];
      b = currentImage.data[i + 2];
      a = currentImage.data[i + 3];
      red_option = this.red;
      green_option = this.green;
      blue_option = this.blue;
      alpha_option = Math.round(255 * this.globalAlpha);
      if (
        !(
          r === red_option &&
          g === green_option &&
          b === blue_option &&
          a === alpha_option
        )
      ) {
        if (!this.matchOutlineColor(r, g, b, a)) {
          this.floodFill(
            x,
            y,
            [
              this.red,
              this.green,
              this.blue,
              Math.round(255 * this.globalAlpha),
            ],
            !1,
            currentImage,
            0,
            !0
          );
          this.ctx.putImageData(currentImage, 0, 0);
          // this.storeCanvas();
          // this.storeHistory();
        }
      }
    },
    floodFill: function (x, y, option, i, image, a, s) {
      console.log("inject.js e 내부 floodFill");
      var r,
        h,
        c,
        data = image.data,
        array_1 = [],
        u = !!0,
        p = !1,
        width = image.width,
        height = image.height,
        array_wh = new Uint8ClampedArray(width * height),
        width_4 = 4 * width,
        x2 = x,
        y2 = y,
        w = y2 * width_4 + 4 * x2,
        C = data[w],
        b = data[w + 1],
        L = data[w + 2],
        P = data[w + 3],
        T = !1,
        D = function (t, e) {
          if (t < 0 || e < 0 || height <= e || width <= t) return !1;
          var i = e * width_4 + 4 * t,
            n = Math.max(
              Math.abs(C - data[i]),
              Math.abs(b - data[i + 1]),
              Math.abs(L - data[i + 2]),
              Math.abs(P - data[i + 3])
            );
          if (n < a) {
            n = 0;
          }
          var s = Math.abs(0 - array_wh[e * width + t]);
          return (
            T ||
              (0 !== n &&
                255 !== s &&
                ((data[i] = option[0]),
                (data[i + 1] = option[1]),
                (data[i + 2] = option[2]),
                (data[i + 3] = (option[3] + data[i + 3]) / 2),
                (array_wh[e * width + t] = 255))),
            n + s === 0
          );
        };
      for (array_1.push([x2, y2]); array_1.length; ) {
        var k = array_1.pop();
        for (x2 = k[0], y2 = k[1], T = !0; D(x2, y2 - 1); ) y2 -= 1;
        for (
          T = !1,
            i &&
              (!D(x2 - 1, y2) &&
                D(x2 - 1, y2 - 1) &&
                array_1.push([x2 - 1, y2 - 1]),
              !D(x2 + 1, y2) &&
                D(x2 + 1, y2 - 1) &&
                array_1.push([x2 + 1, y2 - 1])),
            p = u = !1;
          D(x2, y2);

        )
          void 0,
            (data[(c = (h = y2) * width_4 + 4 * (r = x2))] = option[0]),
            (data[c + 1] = option[1]),
            (data[c + 2] = option[2]),
            (data[c + 3] = option[3]),
            (array_wh[h * width + r] = 255),
            D(x2 - 1, y2)
              ? u || (array_1.push([x2 - 1, y2]), (u = !0))
              : u && (u = !1),
            D(x2 + 1, y2)
              ? p || (array_1.push([x2 + 1, y2]), (p = !0))
              : p && (p = !1),
            (y2 += 1);
        if (i) {
          D(x2 - 1, y2) && !u && array_1.push([x2 - 1, y2]);
          D(x2 + 1, y2) && !p && array_1.push([x2 + 1, y2]);
        }
      }
    },
    addInput: function (x, y) {
      var input = document.createElement("input");

      input.id = "textbox";
      input.type = "text";
      input.style.position = "fixed";
      input.style.left = x + "px";
      input.style.top = y + "px";
      input.style.width = "1000px";
      input.style.outline = "none";
      input.style.border = "none";
      input.style.backgroundColor = "transparent";
      input.style.fontSize = e_group.size;

      input.onkeydown = this.handleENTER;

      document.body.appendChild(input);

      input.focus();

      this.hasInput = true;
      this.textactive = true;
    },
    handleENTER: function (event) {
      // 공백문자인지 판단하는 패턴
      var blank_pattern = /^\s+|\s+$/g;
      var keyCode = event.keyCode;
      if (keyCode === 13) {
        e_group.drawText(
          this.value,
          parseInt(this.style.left, 10),
          parseInt(this.style.top, 10)
        );
        document.body.removeChild(this);
        // 공백문자일 경우 저장안됨
        if (this.value.replace(blank_pattern, "") != "") {
          e_group.saveImage = e_group.ctx.getImageData(
            0,
            0,
            e_group.canvas.width,
            e_group.canvas.height
          ); // 지금까지 그린 정보를 저장
          e_group.addHistory();
        }
      }
      e_group.hasInput = false;
      e_group.textactive = false;
    },
    handleMouseClick: function () {
      var inputs = document.getElementById("textbox");

      if (this.value != null) {
        console.log("value : " + this.value);
        e_group.drawText(
          inputs.value,
          parseInt(inputs.style.left, 10),
          parseInt(inputs.style.top, 10)
        );
        document.body.removeChild(inputs);
        e_group.saveImage = e_group.ctx.getImageData(
          0,
          0,
          e_group.canvas.width,
          e_group.canvas.height
        ); // 지금까지 그린 정보를 저장
        e_group.addHistory();
      }
      e_group.hasInput = false;
    },
    // 캔버스에 글자 그리는 함수
    drawText: function (txt, x, y) {
      this.ctx.textBaseline = "top";
      this.ctx.textAlign = "left";
      // 폰트는 굵기, 기울이기, 크기, 폰트로 들어감
      this.ctx.font =
        e_group.boldtext +
        " " +
        e_group.italictext +
        " " +
        e_group.size +
        " " +
        e_group.font;
      this.ctx.fillText(txt, x, y);
    },
    createCanvas: function () {
      console.log("inject.js e 내부 createCanvas");
      this.canvas = window_e.document.createElement("Canvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.setAttribute("id", "bnoty");
      window_e.document.body.appendChild(this.canvas);
      window_e.addEventListener("resize", this.resizeBinded);
      window_e.addEventListener("scroll", this.resizeBinded);
      // ctx.fillStyle = "skyblue";
      // ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      this.setCtxProp();
      // 여기부터 테스트를 위해서 임시 UI 시작 ----------------------------------
      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("전체");
      button.appendChild(buttonText);
      button.setAttribute("id", "delBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 0; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("펜");
      button.appendChild(buttonText);
      button.setAttribute("id", "penBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 50px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("네모");
      button.appendChild(buttonText);
      button.setAttribute("id", "rectangleBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 100px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("세모");
      button.appendChild(buttonText);
      button.setAttribute("id", "triangleBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 150px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("동그라미");
      button.appendChild(buttonText);
      button.setAttribute("id", "circleBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 200px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("직선");
      button.appendChild(buttonText);
      button.setAttribute("id", "lineBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 280px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("곡선");
      button.appendChild(buttonText);
      button.setAttribute("id", "curveBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 330px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("화살표");
      button.appendChild(buttonText);
      button.setAttribute("id", "arrowBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 380px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("올가미");
      button.appendChild(buttonText);
      button.setAttribute("id", "lassoBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 0; left: 450px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("부분");
      button.appendChild(buttonText);
      button.setAttribute("id", "delPartBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 30px; left: 0; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("이전");
      button.appendChild(buttonText);
      button.setAttribute("id", "previousBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 30px; left: 50px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("다음");
      button.appendChild(buttonText);
      button.setAttribute("id", "nextBut");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 30px; left: 100px; z-index: 2147483647;`;

      var input = window_e.document.createElement("input");
      input.setAttribute("id", "inputColor");
      input.setAttribute("type", "color");
      input.setAttribute("placeholder", "색상");
      window_e.document.body.appendChild(input);
      input.style = `position: absolute; top: 30px; left: 150px; z-index: 2147483647; width:30px`;

      var input = window_e.document.createElement("input");
      input.setAttribute("id", "inputLineWidth");
      input.setAttribute("placeholder", "두께");
      window_e.document.body.appendChild(input);
      input.style = `position: absolute; top: 30px; left: 200px; z-index: 2147483647; width:30px`;

      var input = window_e.document.createElement("input");
      input.setAttribute("id", "inputTransparency");
      input.setAttribute("placeholder", "투명도");
      window_e.document.body.appendChild(input);
      input.style = `position: absolute; top: 30px; left: 250px; z-index: 2147483647; width:30px`;

      var button = window.document.createElement("button");
      var buttonText = window.document.createTextNode("텍스트");
      button.appendChild(buttonText);
      button.setAttribute("id", "textBut");
      window.document.body.appendChild(button);
      button.style = `position: absolute; top: 60px; left: 150px; z-index: 2147483647;`;

      var button = window.document.createElement("button");
      var buttonText = window.document.createTextNode("진하게");
      button.appendChild(buttonText);
      button.setAttribute("id", "textboldBut");
      window.document.body.appendChild(button);
      button.style = `position: absolute; top: 60px; left: 220px; z-index: 2147483647;`;

      var button = window.document.createElement("button");
      var buttonText = window.document.createTextNode("기울이기");
      button.appendChild(buttonText);
      button.setAttribute("id", "textitalicBut");
      window.document.body.appendChild(button);
      button.style = `position: absolute; top: 60px; left: 290px; z-index: 2147483647;`;

      var input = window.document.createElement("input");
      input.setAttribute("id", "jsFontSize");
      input.setAttribute("type", "number");
      input.setAttribute("value", "20");
      window.document.body.appendChild(input);
      input.style = `position: absolute; top: 60px; left: 380px; z-index: 2147483647;`;

      var select = window.document.createElement("select");
      select.setAttribute("id", "jsFont");
      var opt = window.document.createElement("option");
      opt.setAttribute("value", "sans-serif");
      var optText = window.document.createTextNode("고딕체");
      opt.appendChild(optText);
      select.appendChild(opt);
      var opt = window.document.createElement("option");
      opt.setAttribute("value", "monospace");
      var optText = window.document.createTextNode("바탕체");
      opt.appendChild(optText);
      select.appendChild(opt);
      var opt = window.document.createElement("option");
      opt.setAttribute("value", "serif");
      var optText = window.document.createTextNode("명조체");
      opt.appendChild(optText);
      select.appendChild(opt);
      var opt = window.document.createElement("option");
      opt.setAttribute("value", "cursive");
      var optText = window.document.createTextNode("손글씨");
      opt.appendChild(optText);
      select.appendChild(opt);
      var opt = window.document.createElement("option");
      opt.setAttribute("value", "fantasy");
      var optText = window.document.createTextNode("화려체");
      opt.appendChild(optText);
      select.appendChild(opt);
      window.document.body.appendChild(select);
      select.style = `position: absolute; top: 30px; left: 600px; z-index: 2147483647;`;

      var button = window_e.document.createElement("button");
      var buttonText = window_e.document.createTextNode("형광펜");
      button.appendChild(buttonText);
      button.setAttribute("id", "highlighterBtn");
      window_e.document.body.appendChild(button);
      button.style = `position: absolute; top: 30px; left: 300px; z-index: 2147483647;`;

      var button = window.document.createElement("button");
      var buttonText = window.document.createTextNode("채우기");
      button.appendChild(buttonText);
      button.setAttribute("id", "fillBtn");
      window.document.body.appendChild(button);
      button.style = `position: absolute; top: 30px; left: 380px; z-index: 2147483647;`;

      var button = window.document.createElement("button");
      var buttonText = window.document.createTextNode("나가기");
      button.appendChild(buttonText);
      button.setAttribute("id", "exitBtn");
      window.document.body.appendChild(button);
      button.style = `position: absolute; top: 30px; left: 380px; z-index: 2147483647;`;

      document
        .getElementById("highlighterBtn")
        .addEventListener("click", function () {
          e_group.activate = "highlighter";
          e_group.canvas.style.cursor = "pointer";
        });

      document.getElementById("fillBtn").addEventListener("click", function () {
        e_group.activate = "fill";
        e_group.canvas.style.cursor = "pointer";
      });

      document
        .getElementById("exitBtn")
        .addEventListener(
          "click",
          Function.prototype.bind.call(this.exit, this)
        );

      document.getElementById("delBut").addEventListener("click", function () {
        e_group.ctx.clearRect(
          0,
          0,
          e_group.canvas.width,
          e_group.canvas.height
        ); //clear canvas
        e_group.saveImage = e_group.ctx.getImageData(
          0,
          0,
          e_group.canvas.width,
          e_group.canvas.height
        );
        e_group.addHistory();
      });

      document
        .getElementById("delPartBut")
        .addEventListener("click", function () {
          e_group.activate = "eraser";
          e_group.canvas.style.cursor = `url("https://cdn.discordapp.com/attachments/901731363844132894/970567643847356457/2e2938dfcaaf1173.png") 8 8, auto`;
          // e.canvas.style.cursor = url(images/image38.png), 2,2, auto;
        });

      document.getElementById("penBut").addEventListener("click", function () {
        e_group.activate = "pen";
        e_group.canvas.style.cursor = "pointer";
      });

      document
        .getElementById("rectangleBut")
        .addEventListener("click", function () {
          e_group.activate = "rectangle";
          e_group.canvas.style.cursor = "crosshair";
        });

      document
        .getElementById("triangleBut")
        .addEventListener("click", function () {
          e_group.activate = "triangle";
          e_group.canvas.style.cursor = "crosshair";
        });

      document
        .getElementById("circleBut")
        .addEventListener("click", function () {
          e_group.activate = "circle";
          e_group.canvas.style.cursor = "crosshair";
        });

      document.getElementById("lineBut").addEventListener("click", function () {
        e_group.activate = "line";
        e_group.canvas.style.cursor = "crosshair";
      });

      document
        .getElementById("curveBut")
        .addEventListener("click", function () {
          e_group.activate = "curve";
          e_group.canvas.style.cursor = "crosshair";
        });

      document
        .getElementById("arrowBut")
        .addEventListener("click", function () {
          e_group.activate = "arrow";
          e_group.canvas.style.cursor = "crosshair";
        });

      document
        .getElementById("lassoBut")
        .addEventListener("click", function () {
          e_group.activate = "lasso";
          e_group.canvas.style.cursor = "pointer";
        });

      document
        .getElementById("previousBut")
        .addEventListener("click", function () {
          if (e_group.histories.hasPrevious()) {
            e_group.ctx.putImageData(e_group.histories.previous(), 0, 0);
          }
        });

      document.getElementById("nextBut").addEventListener("click", function () {
        if (e_group.histories.hasNext()) {
          e_group.ctx.putImageData(e_group.histories.next(), 0, 0);
        }
      });

      document
        .getElementById("inputColor")
        .addEventListener("input", function () {
          var color = document.getElementById("inputColor").value;
          // 헥사값을 rgb로 변경
          e_group.red = parseInt(color[1] + color[2], 16);
          e_group.green = parseInt(color[3] + color[4], 16);
          e_group.blue = parseInt(color[5] + color[6], 16);
          e_group.strokeStyle =
            "rgb(" +
            e_group.red +
            "," +
            e_group.green +
            "," +
            e_group.blue +
            ")";
          e_group.setCtxProp();
        });

      document
        .getElementById("inputLineWidth")
        .addEventListener("input", function () {
          e_group.lineWidth = document.getElementById("inputLineWidth").value;
          e_group.ctx.lineWidth = e_group.lineWidth;
        });

      document
        .getElementById("inputTransparency")
        .addEventListener("input", function () {
          e_group.globalAlpha =
            document.getElementById("inputTransparency").value;
          e_group.setCtxProp();
        });

      document.getElementById("textBut").addEventListener("click", function () {
        e_group.activate = "text";
      });

      document
        .getElementById("textboldBut")
        .addEventListener("click", function () {
          if (e_group.boldtext == "bold") {
            e_group.boldtext = "";
            this.innerText = "진하게";
          } else {
            e_group.boldtext = "bold";
            this.innerText = "연하게";
          }
        });

      document
        .getElementById("textitalicBut")
        .addEventListener("click", function () {
          if (e_group.italictext == "italic") {
            e_group.italictext = "";
            this.innerText = "기울이기";
          } else {
            e_group.italictext = "italic";
            this.innerText = "기울이지 않기";
          }
        });

      document
        .getElementById("jsFontSize")
        .addEventListener("input", function () {
          e_group.size = document.getElementById("jsFontSize").value + "px";
        });

      document.getElementById("jsFont").addEventListener("input", function () {
        e_group.font = document.getElementById("jsFont").value;
      });

      // ------------------------------------------------------------------- 임시 UI 종료
      this.Histories();
      this.initCanvas();
    },
    initCanvas: function (t) {
      console.log("inject.js e 내부 initCanvas");
      if (t) {
        this.handleResize(!0);
        // this.ctx.drawImage(t, 0, 0);
        // this.storeCanvas(!0);
      } else {
        this.handleResize();
      }
      // this.storeHistory();
    },
    addMouseEventListener: function () {
      console.log("inject.js e 내부 addMouseEventListener");
      var startPainting = Function.prototype.bind.call(
        this.startPainting,
        this
      );
      var onMouseMove = Function.prototype.bind.call(this.onMouseMove, this);
      var stopPainting = Function.prototype.bind.call(this.stopPainting, this);
      var leaveStopPainting = Function.prototype.bind.call(
        this.leaveStopPainting,
        this
      );
      var onMouseClick = Function.prototype.bind.call(this.onMouseClick, this);
      this.canvas.addEventListener("mousedown", startPainting);
      this.canvas.addEventListener("touchstart", startPainting);
      this.canvas.addEventListener("mousemove", onMouseMove);
      this.canvas.addEventListener("touchmove", onMouseMove);
      this.canvas.addEventListener("mouseup", stopPainting);
      this.canvas.addEventListener("touchend", stopPainting);
      this.canvas.addEventListener("mouseleave", leaveStopPainting);
      this.canvas.addEventListener("click", onMouseClick);
      // window_e.document.addEventListener("keydown", this.keydownBinded);
      // window_e.document.addEventListener("keypress", this.keypressBinded);
    },
    // 작업마다 저장한거 관리하는 부분 시작 -----------------------------
    Histories: function () {
      // 최초 변수 초기화
      function historySave() {
        e_group.MAX_ITEMS = 50;
        e_group.currentIndex = 0;
        e_group.array = [];
      }

      this.histories = new historySave(); // 객체 할당
      // 프로토 타입 객체 생성. 다른 객체도 사용 가능
      historySave.prototype.add = function (t) {
        // 작업 저장하는 프로토타입
        if (
          (e_group.currentIndex < e_group.array.length - 1
            ? ((e_group.array[++e_group.currentIndex] = t),
              (e_group.array = e_group.array.slice(
                0,
                e_group.currentIndex + 1
              )))
            : (e_group.array.push(t),
              (e_group.currentIndex = e_group.array.length - 1)),
          e_group.array.length > e_group.MAX_ITEMS)
        ) {
          var e_h = e_group.array.length - e_group.MAX_ITEMS;
          (e_group.array = e_group.array.splice(-e_group.MAX_ITEMS)),
            (e_group.currentIndex = e_group.currentIndex - e_h);
        }
      };
      historySave.prototype.previous = function () {
        // 이전 작업 가져오는거
        return 0 === e_group.currentIndex
          ? null
          : e_group.array[--e_group.currentIndex];
      };
      historySave.prototype.next = function () {
        // 다음 작업 가져오는거
        return e_group.currentIndex === e_group.array.length - 1
          ? null
          : e_group.array[++e_group.currentIndex];
      };
      historySave.prototype.hasPrevious = function () {
        //이전 저장값 있는지
        return 0 < e_group.currentIndex;
      };
      historySave.prototype.hasNext = function () {
        // 다음 저장값 있는지
        return e_group.currentIndex < e_group.array.length - 1;
      };
    },
    // 작업마다 저장한거 관리하는 부분 종료 -----------------------------
    addHistory: function () {
      this.histories.add(this.saveImage);
      // 여기서 버튼 디스에이블하는것도 해줘야함
      console.log(e_group.currentIndex);
    },
    setCtxProp: function () {
      console.log("inject.js e 내부 setCtxProp");
      this.ctx.strokeStyle = this.strokeStyle; // 선 색
      this.ctx.fillStyle = this.strokeStyle; // 채우기 색
      this.ctx.globalAlpha = this.globalAlpha; // 투명도
      this.ctx.lineWidth = this.lineWidth; // 선 굵기
    },
    exit: function () {
      console.log("inject.js e 내부 exit");
      this.canvas.parentNode.removeChild(this.canvas),
        window_e.removeEventListener("resize", this.resizeBinded),
        window_e.removeEventListener("scroll", this.resizeBinded),
        (this.canvas = null),
        (this.ctx = null),
        (this.initialized = !1),
        (this.painting = false),
        (this.resizeTimeoutID = null),
        (this.paragraph = null),
        (this.strokeStyle = "rgb(0, 0, 0)"),
        (this.lineWidth = 3),
        (this.globalAlpha = 1),
        (this.paragraph = null),
        (this.activate = "pen"),
        (this.saveImage = null),
        (this.histories = null),
        (this.MAX_ITEMS = null),
        (this.currentIndex = null),
        (this.array = []),
        (this.red = 0),
        (this.green = 0),
        (this.blue = 0),
        (this.sX = null),
        (this.sY = null),
        (this.eX = null),
        (this.eY = null),
        (this.mX = null),
        (this.mY = null),
        (this.hasInput = false),
        (this.size = "20px"),
        (this.font = "sans-serif"),
        (this.boldtext = ""),
        (this.italictext = ""),
        (this.textactive = false),
        "undefined" != typeof unsafeWindow &&
          null !== unsafeWindow &&
          ((unsafeWindow.bnoty_INIT = !1), (unsafeWindow.CTRL_HIDDEN = !1));
    },
    handleResize: function (t) {
      // 사이즈조절. 삼항, 콤마> if문으로 어느정도 변경
      // store, restore는 아직 없어서 주석해둠.
      // paragraph는 아직 해석못함.
      // console.log("resize");
      var e = !1,
        i = window_e.pageYOffset || document.documentElement.scrollTop,
        n =
          (window_e.innerHeight || document.documentElement.clientHeight,
          this.ctx.lineWidth),
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
        a = Math.min(o - this.canvas.offsetTop, 5e3);
      if (5e3 < i - this.canvas.offsetTop) {
        a = Math.min(o - i, 5e3);
        this.canvas.style.top = i + "px";
        e = !0;
      } else {
        if (i < this.canvas.offsetTop) {
          a = 5e3;
          this.canvas.style.top = Math.max(0, 5e3 * Math.floor(i / 5e3)) + "px";
          e = !0;
        }
      }
      if (e) {
        this.ctx.clearRect(0, 0, this.this.canvas.width, this.canvas.height);
        if (this.paragraph) {
          // this.paragraph는 무슨 역할인지 아직 모름.
          this.paragraph.clearIntervals();
          this.paragraph = null;
        }
        // storeCanvas(!0);
      } else {
        // storeCanvas(t);
      }
      this.canvas.width = s; // 여기서 ctx 속성 처음 초기화됨.
      this.canvas.style.width = s + "px";
      this.canvas.height = a; // 여기서 ctx 속성 두번째 초기화됨. 없애면 마우스랑 그려지는 위치 어긋남. 그러니 ctx 속성 설정해주는 함수 따로 만듦.
      this.setCtxProp();
      this.canvas.style.height = a + "px";
      // if (!e) {
      //   restoreCanvas();
      // }
      // updatePaintStyle();
      this.ctx.lineWidth = n;
      if (this.array.length == 0) {
        // 저장된 정보가 없으면 현재 정보 초기값을 추가해줌
        this.histories.add(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
      } else {
        // 저장된 정보가 있으면 불러옴 이전에 그렸던 작업을 다시 불러옴
        this.ctx.putImageData(this.array[this.currentIndex], 0, 0);
      }
    },
    render: function (t) {
      console.log("inject.js e 내부 render");
      this.config = t || {};
      this.createCanvas();
      this.addMouseEventListener();
    },
    initConfig: function () {
      console.log("inject.js e 내부 initConfig");
      global.runtime.sendMessage(
        {
          method: "get_data",
        },
        this.renderBinded // init에서 바인딩된 render 여기서 실행
      );
    },
    init: function () {
      console.log("inject.js e 내부 init");
      // 여기 this는 401번 줄 e임.
      // this.history = new t();
      // this.CSSAnimationManager = getCSSAnimationManager();
      // this.setColorBinded = Function.prototype.bind.call(this.setColor, this);
      this.renderBinded = Function.prototype.bind.call(this.render, this);
      // this.handlePostMessageResponseBinded = Function.prototype.bind.call(
      //   this.handlePostMessageResponse,
      //   this
      // ); // 이건 this에 handlePostMessageResponseBinded 속성을 새로 선언하면서 그 속성에 this.handlePostMessageResponse를 할당하는데, handlePostMessageResponse 내부의 this에 call의 두번째 인자가 할당됨. 즉 앞으로 this.handlePostMessageResponseBinded(xxx)를 사용하면 handlePostMessageResponse(xxx)랑 같음. call 두번째 인자도 this 됐으니까. this.handlePostMessageResponseBinded가 어디서 호출된건 안보이는데, e를 리턴해주니까 그쪽에서 쓰겠지 뭐...
      // this.keydownBinded = Function.prototype.bind.call(
      //   this.handleKeyDown,
      //   this
      // );
      // this.keypressBinded = Function.prototype.bind.call(
      //   this.handleKeyPress,
      //   this
      // );
      // this.handleHotKeysDownBinded = Function.prototype.bind.call(
      //   this.handleHotKeysDown,
      //   this
      // );
      // this.persistLocalStorageBinded = Function.prototype.bind.call(
      //   this.persistLocalStorage,
      //   this
      // );
      this.resizeBinded = Function.prototype.bind.call(function () {
        this.resizeTimeoutID &&
          (this.resizeTimeoutID = window_e.clearTimeout(this.resizeTimeoutID));
        this.resizeTimeoutID = window_e.setTimeout(
          Function.prototype.bind.call(this.handleResize, this),
          200
        );
      }, this);
      this.initConfig(); // get data 샌드메시지 하는 부분임
      this.initialized = !0;
      "undefined" != typeof unsafeWindow &&
        null !== unsafeWindow &&
        (unsafeWindow.bnoty_INIT = !0);
    },
  };
  return e_group;
});

// 윈도우 사이즈 변할때마다 작동
// window.onresize = function (event) {
//   handleResize();
// };

// createCanvas();
// handleResize(); // 초기 캔버스 사이즈조절

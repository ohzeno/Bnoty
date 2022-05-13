const firebaseConfig = {
  // apiKey: "AIzaSyC4bhvgrZnBlZa63HOjr4YWb0vPUEy0TNs",
  // authDomain: "bnoty-ae856.firebaseapp.com",
  // databaseURL: "https://bnoty-ae856-default-rtdb.firebaseio.com",
  // projectId: "bnoty-ae856",
  // storageBucket: "bnoty-ae856.appspot.com",
  // messagingSenderId: "109988155599",
  // appId: "1:109988155599:web:24fc23b8766d44363a27ba",
  // measurementId: "G-J5849SYJY8",
  apiKey: "AIzaSyALSkDo_nYey6fbcEPNkTnzuMZsGuzF5oQ",
  authDomain: "bnoty-1d9ee.firebaseapp.com",
  databaseURL:
    "https://bnoty-1d9ee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bnoty-1d9ee",
  storageBucket: "bnoty-1d9ee.appspot.com",
  messagingSenderId: "242015103962",
  appId: "1:242015103962:web:6c56dad160e5232b64eee3",
  measurementId: "G-90EW45MQ3N",
};

firebase.initializeApp(firebaseConfig);
console.log(firebase);

let url;
let email;
let userVol;
let pageVol;
let overVolume = false;
let linkarr = [];
let time;
const db = firebase.firestore();

chrome.identity.getProfileUserInfo({ accountStatus: "ANY" }, function (info) {
  email = info.email;
  check = false;
  db.collection("Users")
    .where("email", "==", email)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        docEmail = doc.get("email");
        if (email === docEmail) {
          check = true;
        }
      });
      if (!check && email !== "") {
        db.collection("Users").doc().set({
          email: email,
          volume: 0,
        });
      }
    });
  console.log(info);
});

// async function getUrl(){
//   await chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     url = tabs[0].url;
//     console.log(url);
//   })
// };

async function getConfig(urlMessage) {
  console.log("urlMessage : ", urlMessage);
  overVolume = false;
  const checkEmail = await db
    .collection("Users")
    .where("email", "==", email)
    .get();
  if (!checkEmail.empty) {
    const user = await db.collection("Users").doc(checkEmail.docs[0].id);
    const urlCheck = await user
      .collection("dataQuery")
      .where("url", "==", urlMessage)
      .get();
    console.log(user);
    await user.get().then((response) => {
      userVol = response.get("volume");
      uEmail = response.get("email");
    });
    if (urlCheck.empty || email === "") {
      testString = "";
      linkarr = [];
    } else {
      if (userVol > 102400) overVolume = true;
      const doc = await user
        .collection("dataQuery")
        .doc(urlCheck.docs[0].id)
        .get();
      linkarr = doc.get("link");
      testString = doc.get("config");
      time = doc.get("time");
      pageVol = doc.get("volume");
    } // urlCheck end
  } else {
    console.log("로컬 파일 불러오기");
    testString = window.localStorage.getItem("key" + urlMessage);
    linkarr = window.localStorage.getItem("link" + urlMessage);
    time = window.localStorage.getItem("time" + urlMessage);
    userVol = 0;
  }
  return testString;
}

async function timeCompare(res, urlMessage) {
  var localTs = window.localStorage.getItem("key" + urlMessage);
  var localLa = window.localStorage.getItem("link" + urlMessage);
  var localT = window.localStorage.getItem("time" + urlMessage);
  console.log("time : ", time, " localTs : ", localT);
  console.log("localLinkarr : ", localLa);
  if (parseInt(time) > parseInt(localT)) {
    await chrome.storage.local.set(
      {
        ["key" + urlMessage]: res,
        ["link" + urlMessage]: linkarr,
        ["userVol" + urlMessage]: userVol,
        ["preVol" + urlMessage]: pageVol,
      },
      function () {
        console.log("chrome local set by FB: ", res);
      }
    );
  } else {
    linkarr = localLa;
    await chrome.storage.local.set(
      {
        ["key" + urlMessage]: localTs,
        ["link" + urlMessage]: linkarr,
        ["userVol" + urlMessage]: 0,
        ["preVol" + urlMessage]: 0,
      },
      function () {
        console.log("chrome local set by local: ", localTs);
      }
    );
  }
}

async function getVolume(str) {
  const getByteLengthOfString = function (s, b, i, c) {
    for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
  };

  let vol = getByteLengthOfString(str);

  return Math.ceil(vol / 1000); // 컴퓨터는 1024대신 1000을 사용
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  console.log("onMessage");
  if (msg.method == "save") {
    console.log("save");
    chrome.identity.getProfileUserInfo(
      { accountStatus: "ANY" },
      function (info) {
        email = info.email;
        console.log(info);
      }
    );
    msg.link.forEach(function (x, y, link) {
      console.log(x, y, link);
    });

    if (email === "" || overVolume) {
      window.localStorage.setItem("key" + msg.url, msg.config);
      window.localStorage.setItem("link" + msg.url, JSON.stringify(msg.link));
      window.localStorage.setItem("time" + msg.url, msg.time);
      console.log("로컬 저장");
    } else {
      url = msg.url;
      linkarr = msg.link;
      db.collection("Users")
        .where("email", "==", email)
        .get()
        .then((response) => {
          response.forEach(async (doc) => {
            docEmail = doc.get("email");
            overVolume = false;
            if (email === docEmail) {
              userVol = doc.get("volume");
              console.log("uservol : ", userVol);
              if (userVol > 102400) overVolume = true;
              const user = db.collection("Users").doc(doc.id);
              const urlCheck = await user
                .collection("dataQuery")
                .where("url", "==", url)
                .get();
              let configVol;
              await getVolume(msg.config).then((response) => {
                configVol = response;
              });
              if (configVol + userVol > 102400) overVolume = true;

              if (overVolume) {
                window.localStorage.setItem("key" + msg.url, msg.config);
                window.localStorage.setItem(
                  "link" + msg.url,
                  JSON.stringify(msg.link)
                );
                window.localStorage.setItem("time" + msg.url, msg.time);
                console.log("용량초과! 로컬 저장");
              } else {
                if (urlCheck.empty) {
                  user
                    .collection("dataQuery")
                    .doc()
                    .set({
                      url: url,
                      config: msg.config,
                      volume: configVol,
                      link: linkarr,
                      time: msg.time,
                    })
                    .then(() => {
                      user.update({
                        volume: configVol + userVol,
                      });
                      // alert("자동저장")
                    })
                    .catch(function (error) {
                      console.error("Error writing document: ", error);
                    });
                } else {
                  const dq = await user
                    .collection("dataQuery")
                    .doc(urlCheck.docs[0].id)
                    .get();
                  let previousVol = await dq.get("volume");
                  user
                    .collection("dataQuery")
                    .doc(urlCheck.docs[0].id)
                    .update({
                      url: url,
                      config: msg.config,
                      volume: configVol,
                      link: linkarr,
                      time: msg.time,
                    })
                    .then(() => {
                      user.update({
                        volume: configVol + userVol - previousVol,
                      });
                      // alert("자동저장")
                    })
                    .catch(function (error) {
                      console.error("Error writing document: ", error);
                    });
                  console.log("cv : " + configVol);
                  console.log("pv : " + previousVol);
                  console.log("uv : " + userVol);
                } // urlcheck end
              } // overVolume end
              return false;
            } // if email end
          });
        });
    } // else end
  } // 10SecSave end
  else if (msg.method == "startRead") {
    getConfig(msg.url).then(async (response) => {
      await timeCompare(response, msg.url);
      await chrome.storage.onChanged.addListener(function (changes, namespace) {
        console.log("storage changed");
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
          console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is ${newValue}.`,
            newValue
          );
        }
      });
    });
    return true;
  } // startRead end
  else if (msg.method == "localSave") {
    window.localStorage.setItem("key" + msg.url, msg.config);
    window.localStorage.setItem("link" + msg.url, JSON.stringify(msg.link));
    window.localStorage.setItem("time" + msg.url, msg.time);
  }

  return true;
});

const firebaseConfig = {
  //Insert FireBase Info
};

firebase.initializeApp(firebaseConfig);

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
});

async function getConfig(urlMessage) {
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
  if (parseInt(time) >= parseInt(localT)) {
    await chrome.storage.local.set(
      {
        ["key" + urlMessage]: res,
        ["link" + urlMessage]: linkarr,
        ["userVol" + urlMessage]: userVol,
        ["preVol" + urlMessage]: pageVol,
      },
      function () {}
    );
  } else {
    await chrome.storage.local.set(
      {
        ["key" + urlMessage]: localTs,
        ["link" + urlMessage]: JSON.parse(localLa),
        ["userVol" + urlMessage]: 0,
        ["preVol" + urlMessage]: 0,
      },
      function () {}
    );
  }
}

async function getVolume(str) {
  const getByteLengthOfString = function (s, b, i, c) {
    for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
  };

  let vol = getByteLengthOfString(str);

  return Math.ceil(vol / 1000); //
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.method == "save") {
    chrome.identity.getProfileUserInfo(
      { accountStatus: "ANY" },
      function (info) {
        email = info.email;
      }
    );

    if (email === "" || overVolume) {
      window.localStorage.setItem("key" + msg.url, msg.config);
      window.localStorage.setItem("link" + msg.url, JSON.stringify(msg.link));
      window.localStorage.setItem("time" + msg.url, msg.time);
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
                    })
                    .catch(function (error) {});
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
                    })
                    .catch(function (error) {});
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

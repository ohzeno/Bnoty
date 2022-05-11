const firebaseConfig = {
  apiKey: "AIzaSyALSkDo_nYey6fbcEPNkTnzuMZsGuzF5oQ",
  authDomain: "bnoty-1d9ee.firebaseapp.com",
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
  let overVolume = false;
  const db = firebase.firestore();

  chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
    email = info.email;
    check = false;
    db.collection('Users').get().then((response)=>{
      response.forEach((doc)=>{
        docEmail = doc.get('email');
        if(email === docEmail) {
          check = true;
        }
      })
      if(!check && email !== ''){
        db.collection('Users').doc().set({
          email: email,
          volume: 0
        })
      }
    })
    console.log(info);
  })

  // async function getUrl(){
  //   await chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  //     url = tabs[0].url;
  //     console.log(url);
  //   })    
  // };

  async function getConfig(urlMessage){
    console.log("urlMessage : ", urlMessage);
    overVolume = false;
    const checkEmail = await db.collection('Users').where('email', '==', email).get();
    if(!checkEmail.empty){
      const user =  await db.collection('Users').doc(checkEmail.docs[0].id);
      const urlCheck = await user.collection('dataQuery').where('url', '==', urlMessage).get();
      console.log(user);
      await user.get().then(response => {
        userVol = response.get('volume');
        uEmail = response.get('email');
      });
      if(urlCheck.empty || email === ''){
        testString = "";
      }else{
        if(userVol > 102400) overVolume = true;
        const doc = await user.collection('dataQuery').doc(urlCheck.docs[0].id).get();
        testString = doc.get('config');
      } // urlCheck end
    }else {
      console.log("로컬 파일 불러오기")
      testString = window.localStorage.getItem("key" + urlMessage);
    }
    return testString;
  }

  async function getVolume(str){

    const getByteLengthOfString = function(s,b,i,c){
      for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
      return b;
    };

    let vol = getByteLengthOfString(str);

    return Math.ceil(vol / 1000); // 컴퓨터는 1024대신 1000을 사용
  }

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log("onMessage");
    if(msg.method == 'save'){
      console.log("save");
      chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
        email = info.email;
        console.log(info);
      });
      
      if(email === "" || overVolume){
        window.localStorage.setItem("key" + msg.url, msg.config);
        console.log("로컬 저장")
      }
      else {
        url = msg.url;
        db.collection('Users').get().then((response)=>{
          response.forEach(async (doc)=>{
            docEmail = doc.get('email');
            overVolume = false;
            if(email === docEmail){
              userVol = doc.get('volume');
              console.log("uservol : ", userVol);
              if(userVol > 102400) overVolume = true;
              const user = db.collection('Users').doc(doc.id);
              const urlCheck = await user.collection('dataQuery').where('url', '==', url).get();
              let configVol;
              await getVolume(msg.config).then(response => {
                configVol = response;
              });
              if(configVol + userVol > 102400) overVolume = true;
              
              if(overVolume){
                window.localStorage.setItem("key" + msg.url, msg.config);
                console.log("용량초과! 로컬 저장");
              }else {
                if(urlCheck.empty){
                  user.collection('dataQuery').doc().set({
                    url: url,
                    config: msg.config,
                    volume: configVol,
                  })
                  .then(() => {
                    user.update({
                      volume: configVol + userVol
                    })
                    // alert("자동저장")
                  })
                  .catch(function(error) {
                    console.error("Error writing document: ", error);
                  });
                }else {
                  const dq = await user.collection('dataQuery').doc(urlCheck.docs[0].id).get();
                  let previousVol = await dq.get('volume');
                  user.collection('dataQuery').doc(urlCheck.docs[0].id).update({
                    url: url,
                    config: msg.config,
                    volume: configVol,
                  })
                  .then(() => {
                    user.update({
                      volume: configVol + userVol - previousVol
                    })
                    // alert("자동저장")
                  })
                  .catch(function(error) {
                    console.error("Error writing document: ", error);
                  });
                  console.log("cv : " + configVol);
                  console.log("pv : " + previousVol);
                  console.log("uv : " + userVol);
                }// urlcheck end
              }// overVolume end
              return true;
            } // if email end
          })
        })
      } // else end

    } // 10SecSave end

    else if(msg.method == 'startRead'){
      console.log("startRead on FB")
      getConfig(msg.url).then(async response => {
        await chrome.storage.local.set({['key' + msg.url]: response, ['test']: "test"}, function() {
          console.log("chrome local set : ", response);
        });
        
        await chrome.storage.onChanged.addListener(function (changes, namespace) {
          console.log("storage changed");
          for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            console.log(
              `Storage key "${key}" in namespace "${namespace}" changed.`,
              `Old value was "${oldValue}", new value is "${newValue}".`
            );
          }
        });
      });
      return true;
    } // startRead end
  
    return true;
  });
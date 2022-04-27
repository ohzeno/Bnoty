const firebaseConfig = {
    apiKey: "AIzaSyC4bhvgrZnBlZa63HOjr4YWb0vPUEy0TNs",
    authDomain: "bnoty-ae856.firebaseapp.com",
    databaseURL: "https://bnoty-ae856-default-rtdb.firebaseio.com",
    projectId: "bnoty-ae856",
    storageBucket: "bnoty-ae856.appspot.com",
    messagingSenderId: "109988155599",
    appId: "1:109988155599:web:24fc23b8766d44363a27ba",
    measurementId: "G-J5849SYJY8"
  };    

  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  let url;
  let email;
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
      if(!check){
        db.collection('Users').doc().set({
          email: email
        })
      }
    })
    console.log(info);
  })


  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log("onMessage");
    if(msg.method == '10SecSave'){
      console.log("10SecSave");
      chrome.identity.getProfileUserInfo({'accountStatus': 'ANY'}, function(info) {
        email = info.email;
        console.log(info);
      });
      
      if(email === ""){
        console.log("로컬 저장")
      }
      else {       
        db.collection('Users').get().then((response)=>{
          response.forEach((doc)=>{
            docEmail = doc.get('email');
            if(email === docEmail){
              console.log(typeof(msg.url))
              db.collection('Users').doc(doc.id).collection('dataQuery').doc('' + msg.url).set({
                config: "데이터"
              })
              .then(() => {
                alert("자동저장")
              })
              .catch(function(error) {
                console.error("Error writing document: ", error);
              });
            } // if email end
          })
        })
      } // else end

    }
  
    return true;
  });
  // chrome.runtime.sendMessage({command: "testNote", data: {notes: ''}}, (response) => {
                  
  // })

  // setInterval(function () {
  //    alert('hello'); 
  //   }, 10000);
  
  // var url=chrome.runtime.getURL("background.html");
  // console.log(url);

  // const db = firebase.firestore();
  // db.collection('restaurants').get().then((response)=>{
  //   response.forEach((doc)=>{
  //     console.log(doc.data())
  //   })
  // })

  // chrome.runtime.onMessage.addListener((msg, sender, response) => {

  //   if(msg.command == 'testNote'){
  //     console.log(firebase.firestore().collection('restaurants').get());

      
  //   }

  //   return true;
  // });

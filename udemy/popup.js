$(function () {
  $("#submit").click(function () {
    var imageLink = $("#imageLink").val();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        todo: "changeBg",
        imageLink: imageLink,
      });
    });
  });
  // chrome.storage.sync.get("username", function (Greeting) {
  //   if (Greeting.username) {
  //     $("#name").html(Greeting.username);
  //   }
  // });
  // $("#alias").keyup(function () {
  //   $("#name").html($("#alias").val());
  // });
  // $("#submit").click(function () {
  //   var user_name = $("#alias").val();
  //   /* This is the way to store data in your browser memory */
  //   chrome.storage.sync.set({ username: user_name }, function () {
  //     close();
  //   });
  // });
});

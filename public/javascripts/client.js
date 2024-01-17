var socket  = io();
var currentChattingUser = null;
// console.log(loggedInUser)

socket.emit('joinServer', loggedInUsername);

var msgbox = document.querySelector(".msg");
msgbox.addEventListener("keypress", (event)=>{
  if (event.key === "Enter" && msgbox.value !== "") {
    sender(msgbox.value);

    const msgObject = {
      Message: msgbox.value,
      toUserId: currentChattingUser,
      loggedInUser: loggedInUser
    }

    socket.emit('privateMessage', msgObject);
    msgbox.value = ""
  }
})    

var receiver = (msg) => {
  var chatBox = document.querySelector(".chat-container");
  chatBox.innerHTML += `<div class="message-box friend-message">
      <p>${msg}</p>
    </div>`
}

var sender = msg => {
  var chatBox = document.querySelector(".chat-container");
  chatBox.innerHTML += `<div class="message-box my-message">
      <p>${msg}</p>
    </div>`;
}

socket.on('recievePrivateMessage', msg => {
  receiver(msg);
})

var openChat = (img, username, chatId) => {
  document.querySelector(".right-container").style.display = "block"
  document.querySelector(".talker").setAttribute('src', img);
  document.querySelector(".talker-name").textContent = username;
  currentChattingUser = chatId;

  socket.emit('getMessage', {
    receivingUser: currentChattingUser,
    sendingUser: loggedInUser
  })
}

var appendChat = (chatId,img,username,lastMessage) => {
  var chats = document.querySelector(".chat-list");
  const template = `<div id="shery_${chatId}" class="chat-box" text-slate-400 onclick="openChat('${img}','${username}','${chatId}')">
      <div class="img-box">
        <img class="img-cover" src="${img}" alt="">
      </div>
      <div class="chat-details">
        <div class="text-head">
          <h4>${username}</h4>
        </div>
        <div class="text-message">
          <p>${lastMessage}</p>
          <!-- <b>1</b> -->
        </div>
      </div>
    </div>`
  if (!chats.querySelector(`#shery_${chatId}`)) {
    chats.innerHTML += template
  }
}

socket.on('newUserJoined', (users) => {
  appendChat(users.id, users.img, users.username, users.lastMessage);
})

socket.on('chatMessage', allMsgs => {
    allMsgs.forEach( msg => {
      // console.log(msg)
        if(msg.fromUser == loggedInUser) {
            sender(msg.msg);
        } else {
            receiver(msg.msg);
        }
    });
})
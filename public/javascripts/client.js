var socket  = io();
var currentChattingUser = null;
let groupClickEvent = true;

socket.emit('joinServer', loggedInUsername);


var msgbox = document.querySelector(".msg");

msgbox.addEventListener("keypress", (event)=>{
  if (event.key === "Enter" && msgbox.value !== "") {
    sender(msgbox.value);

    const msgObject = {
      Message: msgbox.value,
      toUserId: currentChattingUser,
      fromUser: loggedInUser
    }
    socket.emit('privateMessage', msgObject);
    msgbox.value = ""
  }
})  

var newGroupCreator = () => {
  var createGroup = document.querySelector(".group");
  var groupDiv = document.querySelector(".groupDiv");
  var groupInput = document.querySelector(".groupInput");
  var groupButton = document.querySelector(".groupButton");

  createGroup.addEventListener("click", () => {
    if (groupClickEvent) {
      groupDiv.style.display = "flex";
      groupClickEvent = false; 
    } else {
      groupDiv.style.display = "none";
      groupClickEvent = true;
    }
  })

  groupButton.addEventListener("click", () => {
    let value = groupInput.value
    if(value) {
      socket.emit("newGroup", {
        groupName: value,
        groupCreator: loggedInUser
      })
      groupInput.value = "";
    }
  })
}

newGroupCreator();  

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

socket.on('recievePrivateMessage', msgObject => {
  if (msgObject.fromUser == currentChattingUser) {
    receiver(msgObject.Message);
  }
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
    document.querySelector(".chat-container").innerHTML = "";
    
    allMsgs.forEach( msg => {
        if(msg.fromUser == loggedInUser) {
            sender(msg.msg);
        } else {
            receiver(msg.msg);
        }
    });

})


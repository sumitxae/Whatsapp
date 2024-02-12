// Variable to store the currently selected user for chat
var currentChattingUser = null;

// Array to store selected users
let selectedUsers = [];

// Function to display received message in the chat box
var receiver = (msg) => {
    var chatBox = document.querySelector(".chat-container");
    chatBox.innerHTML += `<div class="message-box friend-message">
        <p>${msg}</p>
      </div>`;
}
  
// Function to display sent message in the chat box
var sender = msg => {
    var chatBox = document.querySelector(".chat-container");
    chatBox.innerHTML += `<div class="message-box my-message">
        <p>${msg}</p>
    </div>`;
}

// Function to open chat with a user
var openChat = (img, username, chatId) => {
    document.querySelector(".right-container").style.display = "block";
    document.querySelector(".talker").setAttribute('src', img);
    document.querySelector(".talker-name").textContent = username;
    currentChattingUser = chatId;

    // Request messages between the current user and selected user
    socket.emit('getMessage', {
        receivingUser: currentChattingUser,
        sendingUser: loggedInUser
    });
}

// Function to select a user for chat
var selectUser = (userId) => {
    addMemberBtn.classList.remove('opacity-70');
    selectedUsers.push(userId);
}

// Function to append chat to the chat list
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
    </div>`;
    if (!chats.querySelector(`#shery_${chatId}`)) {
        chats.innerHTML += template;
    }
}

// Function to display a user in the user list
var showUser = (userId, userName, userProfile, bool) => {
    const container = document.querySelector('#userList');
    const alreadyExist = `<div id="user_${userId}" class="flex w-full cursor-pointer py-2 px-1.5 rounded-lg bg-[#111B21] items-center justify-start">
        <div class="h-11 opacity-65 w-11 mr-4 rounded-full overflow-hidden">
        <img class="object-cover h-full w-full" src="${userProfile}" alt="">
        </div>
        <div><p class="opacity-65">${userName}</p>
        <p class="text-green-400 text-xs">User Already Exists</p></div>
        </div>`;
    const newUser = `<div id="user_${userId}" class="flex w-full cursor-pointer py-2 px-1.5 rounded-lg bg-[#111B21] items-center justify-start" onclick="selectUser('${userId}')">
        <div class="h-11 w-11 mr-4 rounded-full overflow-hidden">
        <img class="object-cover h-full w-full" src="${userProfile}" alt="">
        </div>
        <p>${userName}</p>
        </div>`;
    if (!container.querySelector(`#user_${userId}`)){
        if(!bool) container.innerHTML += newUser;
        else container.innerHTML += alreadyExist;  
    }
}

// Connect to the Socket.IO server
var socket = io();

// Event: User joins the server
socket.emit("joinServer", loggedInUsername);

// Event: Receive private message
socket.on("recievePrivateMessage", (msgObject) => {
  // Check if the message is not from a group
  if (!msgObject.isGroup) {
    // Check if the message is from the current chatting user
    if (
      msgObject.fromUser == currentChattingUser &&
      msgObject.toUser == loggedInUser
    ) {
      // Display the received message
      receiver(msgObject.msg);
    }
  } else {
    console.log(msgObject);
    // Display the message from the group
    if (msgObject.fromUser !== loggedInUser && msgObject.group == currentChattingUser) {receiver(msgObject.msg);};
  }
});

// Event: New user joined
socket.on("newUserJoined", (users) => {
  // Append the new user to the chat
  appendChat(users.id, users.img, users.username, users.lastMessage);
});

// Event: Receive chat messages
socket.on("chatMessage", (allMsgObject) => {
  // Clear the chat container
  document.querySelector(".chat-container").innerHTML = "";

  // Check if it's not a group message
  if (!allMsgObject.isGroup) {
    // Iterate through all messages
    allMsgObject.allMessages.forEach((msg) => {
      // Check if the message is from the logged-in user
      if (msg.fromUser == loggedInUser) {
        // Display sender's message
        sender(msg.msg);
      } else {
        // Display receiver's message
        receiver(msg.msg);
      }
    });
  } else {
    // Iterate through all messages
    allMsgObject.allMessages.forEach((msg) => {
      // Check if the message is not from the logged-in user
      if (msg.fromUser != loggedInUser) receiver(msg.msg);
      else sender(msg.msg);
    });
  }
});

// Event: Receive user's joined groups
socket.on("joinedGroups", (userGroups) => {
  // Append joined groups to the chat
  userGroups.forEach((group) => {
    appendChat(group._id, group.groupProfileImage, group.groupName, "");
  });
});

// Event: Created a new group
socket.on("createdGroup", (createdGroup) => {
  // Log the created group
  console.log(createdGroup);
});

// Event: Show available users for chat
socket.on("showUsers", (userListArray) => {
  // Get the user list container
  const container = document.querySelector("#userList");

  // Check if there are users to show
  if (userListArray.userList.length > 0) {
    userListArray.userList.forEach((userDets) => {
      // Show users who are not in the current chatting group
      if (!userDets.groups.some((group) => group._id === currentChattingUser)) {
        showUser(
          userDets.user._id,
          userDets.user.username,
          userDets.user.image,
          false
        );
      } else {
        // Show users who are already in the current chatting group
        showUser(
          userDets.user._id,
          userDets.user.username,
          userDets.user.image,
          true
        );
      }
    });
  } else {
    // Clear the container if no users to show
    container.innerHTML = "";
  }
});

// Event: Add user status
socket.on("addStatus", (addObject) => {
  
  // If a new user is added, emit a private message event
  if (addObject.addStat) {
    const msgObject = {
      Message: loggedInUsername+" added "+addObject.addedUser,
      toUserId: currentChattingUser,
      fromUser: loggedInUser,
    };
    sender(msgObject.Message);
    socket.emit("privateMessage", msgObject);
  }
});

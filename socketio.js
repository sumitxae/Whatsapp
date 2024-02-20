// Importing required modules
const passport = require("passport");
const socketIO = require("socket.io");
const userModel = require("./models/users");
const msgModel = require("./models/message");
const groupModel = require("./models/group");

// Initializing Socket.IO
const io = socketIO();

// Creating an object to hold the Socket.IO instance
const socketAPI = {
  io: io,
};

// Array to store online users
const onlineUsers = [];

// Handling socket connections
io.on("connection", async (socket) => {
  // Event handler for when a user joins the server
  socket.on("joinServer", async (username) => {
    // Finding the current user from the database
    const currentUser = await userModel.findOne({ username });

    // Finding online users except the current user
    const otherOnlineUsers = onlineUsers.filter(
      (user) => user.username !== currentUser.username
    );

    // Emitting joined groups to the user
    const userGroups = await groupModel.find({ members: currentUser._id });
    socket.emit("joinedGroups", userGroups);

    // Emitting information about online users to the current user
    otherOnlineUsers.forEach((onlineUser) => {
      socket.emit("newUserJoined", {
        img: onlineUser.image,
        username: onlineUser.username,
        id: onlineUser._id,
        lastMessage: "this was the last message",
      });
    });

    // Updating the socketId of the current user
    currentUser.socketId = socket.id;
    await currentUser.save();

    // Adding the current user to the online users array
    onlineUsers.push(currentUser);
  });

  // Event handler for private messages
  socket.on("privateMessage", async (msgObject) => {
    const toUser = await userModel.findById(msgObject.toUserId);

    if (!toUser) {
      // If the recipient is not a user, it's a group message
      const groupMsgObject = await msgModel.create({
        msg: msgObject.Message,
        group: msgObject.toUserId,
        fromUser: msgObject.fromUser,
        isGroup: true
      });

      console.log(groupMsgObject)

      // Sending the message to all members of the group
      const group = await groupModel
        .findById(groupMsgObject.group)
        .populate("members");
      if (group) {
        group.members.forEach((user) => {
          socket.to(user.socketId).emit("recievePrivateMessage", groupMsgObject);
        });
      }
      return;
    }

    if (toUser) {
      // If the recipient is a user, it's a private message
      await msgModel.create({
        msg: msgObject.Message,
        toUser: msgObject.toUserId,
        fromUser: msgObject.fromUser,
      });
      io.to(toUser.socketId).emit("recievePrivateMessage", msgObject);
    }
  });

  // Event handler for getting messages between users or from a group
  socket.on("getMessage", async (userObject) => {
    const toUserOrGroup = await userModel.findById(userObject.receivingUser);

    if (toUserOrGroup) {
      // If the recipient is a user, find all messages between the two users
      const allMessages = await msgModel.find({
        $or: [
          {
            fromUser: userObject.sendingUser,
            toUser: userObject.receivingUser,
          },
          {
            fromUser: userObject.receivingUser,
            toUser: userObject.sendingUser,
          },
        ],
      });
      socket.emit("chatMessage", { allMessages, isGroup: false });
    }

    if (!toUserOrGroup) {
      // If the recipient is a group, find all messages in the group
      const toGroup = await groupModel.findById(userObject.receivingUser);
      if (toGroup) {
        const allMessages = await msgModel.find({
          group: userObject.receivingUser,
        });
        socket.emit("chatMessage", { allMessages, isGroup: true });
      }
    }
  });

  // Event handler for searching users
  socket.on("getUserInfo", async (searchObject) => {
    const users = await userModel.find({
      username: {
        $regex: searchObject.query,
        $options: "i",
        $ne: searchObject.loggedInUsername,
      },
    });

    // Array to hold user information
    const foundUsers = await Promise.all(
      users.map(async (user) => {
        const groups = await groupModel.find({ members: user });
        return { user, groups };
      })
    );

    // Sending user information to the client
    socket.emit("showUsers", { userList: foundUsers });
  });

  // Event handler for adding users to a group
  socket.on("addUsers", async (addUsersInfo) => {
    console.log(addUsersInfo)
    const group = await groupModel.findById(addUsersInfo.group);
    addUsersInfo.users.forEach(async (user) => {
      if (!group.members.includes(user)) {
        group.members.push(user);
        const addedUsers = await userModel.findById(user);
        const stat = {
          addStat : true,
          addedUser: addedUsers.displayName
        }
        socket.emit("addStatus", stat);
      } else {
        socket.emit("addStatus", false);
      }
    });
    await group.save();
  });

  // Event handler for when a client disconnects
  socket.on("disconnect", async () => {
    const userIndex = onlineUsers.findIndex(
      (user) => user.socketId === socket.id
    );
    if (userIndex !== -1) {
      // Update the socketId of the disconnected user
      const disconnectedUser = onlineUsers.splice(userIndex, 1)[0];
      disconnectedUser.socketId = "";
      await disconnectedUser.save();
    }
  });
});

// Exporting the socketAPI object
module.exports = socketAPI;

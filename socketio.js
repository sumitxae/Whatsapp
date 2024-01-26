const passport = require('passport');
const io = require( 'socket.io' )();
const socketapi = {
    io: io
};

const userModel = require('./models/users');
const msgModel = require('./models/message');
const groupModel = require('./models/group');


io.on( "connection", function( socket ) {
    
    socket.on("joinServer", async (username) => {
        const currentUser = await userModel.findOne({ username:username });
        
        const onlineUsers = await userModel.find({
            socketId: { $nin: [ "" ] },
            username: { $nin: [currentUser.username] }
        })

        onlineUsers.forEach( onlineUser => {
            socket.emit('newUserJoined', {
                img: onlineUser.image,
                username: onlineUser.username,
                id: onlineUser._id,
                lastMessage : "this was the last message"
            })
        })

        currentUser.socketId = socket.id;
        await currentUser.save();
    })

    socket.on('privateMessage', async msgObject => {
        await msgModel.create({
            msg: msgObject.Message,
            toUser: msgObject.toUserId,
            fromUser: msgObject.fromUser
        })
        const toUser = await userModel.findById(msgObject.toUserId)
        io.to(toUser.socketId).emit('recievePrivateMessage', msgObject)
    })

    socket.on('getMessage', async userObject => {
        // console.log(userObject)
        const allMessages = await msgModel.find({
            $or: [
                {
                    fromUser: userObject.sendingUser,
                    toUser: userObject.receivingUser
                },
                {
                    fromUser: userObject.receivingUser,
                    toUser: userObject.sendingUser   
                }
            ]
        });
        // console.log(allMessages)
        socket.emit('chatMessage', allMessages);
    })

    socket.on('newGroup', async groupObject => {
        const newGroup = await groupModel.create({
            groupName: groupObject.groupName
        })

        newGroup.users.push(groupObject.groupCreator);
        await groupModel.save();
    })

    socket.on('disconnect', async () => {
        await userModel.findOneAndUpdate({
            socketId: socket.id
        },{
            socketId: ''
        });
    })
});

module.exports = socketapi;

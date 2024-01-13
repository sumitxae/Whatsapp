const passport = require('passport');
const io = require( 'socket.io' )();
const socketapi = {
    io: io
};

const userModel = require('./routes/users');
const msgModel = require('./routes/message');

// Add your socket.io logic here!
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
            fromUser: msgObject.loggedInUser
        })
        const toUser = await userModel.findById(msgObject.toUserId)
        io.to(toUser.socketId).emit('recievePrivateMessage', msgObject.Message)
    })

    socket.on('getMessage', async userObject => {
        // console.log(userObject)
        const allMessages = await msgModel.find({
            $or: [
                {
                    fromUser: userObject.sendingUser,
                    toUser: userObject.recievingUser
                },
                {
                    fromUser: userObject.recievingUser,
                    toUser: userObject.sendingUser   
                }
            ]
        })
        socket.emit('chatMessage', allMessages);
    } )

    socket.on('disconnect', async () => {
        await userModel.findOneAndUpdate({
            socketId: socket.id
        },{
            socketId: ''
        });
    })
});

module.exports = socketapi;

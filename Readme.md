Sure, here's a simplified version of the README.md without licensing information:

---

# WhatsApp Clone

This project is a WhatsApp clone that allows users to chat with each other individually or in groups. It's built using Node.js, Express.js, MongoDB, Socket.io, and EJS.

## Features

- User authentication: Users can register, log in, and log out.
- Individual and group chat: Users can chat with each other individually or in groups.
- Real-time messaging: Messages are delivered instantly using Socket.io for real-time communication.
- User profiles: Each user has a profile with a username and an optional profile image.
- Group creation: Users can create new groups and add members to them.
- Group administration: Group creators can manage group settings and members.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Socket.io
- EJS (Embedded JavaScript) for server-side rendering
- Passport.js for authentication
- Multer for handling file uploads

## Setup Instructions

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up your MongoDB database and configure the connection in `app.js`.
4. Run the server using `npx nodemon`.
5. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Project Structure

```
whatsapp-clone/
│
├── public/              # Static assets
│   ├── images/          # Image files
│   ├── javascripts/     # Client-side JavaScript files
│   └── stylesheets/     # CSS files
│
├── routes/              # Route handlers
│   ├── index.js         # Main router
│   └── multer.js        # File Handling
│
├── models/              # Mongoose models
│   ├── message.js       # Message model
│   ├── group.js         # Group model
│   └── user.js          # User model
│
├── views/               # EJS view files
│   ├── index.ejs        # Homepage
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
│   └── home.ejs         # User home page
│
├── app.js               # Express application setup
└── package.json         # Node.js project dependencies and scripts
```

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests.

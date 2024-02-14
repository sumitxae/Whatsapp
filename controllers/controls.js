// Import required modules
const userModel = require("../models/users");
const groupModel = require("../models/group");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const { uploadGroupDPs } = require("../routes/multer");
const localStrategy = require("passport-local").Strategy;

passport.use(new localStrategy(userModel.authenticate()));

// Controller object to export
const controller = {};

// Controller method for user registration
controller.registerUser = async (req, res, next) => {
  try {
    // Create a new user object with data from request body
    const user = new userModel({
      username: req.body.username,
      contact: req.body.contact,
    });

    // Register the user using Passport's register method
    await userModel.register(user, req.body.password);

    // Authenticate the registered user
    passport.authenticate("local")(req, res, () => {
      res.redirect("/home"); // Redirect to home page after successful registration
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// Controller method for user login
controller.loginUser = passport.authenticate("local", {
  successRedirect: "/home", // Redirect to home page on successful login
  failureRedirect: "/", // Redirect to index page on login failure
});

// Controller method to render home page after login
controller.renderHomePage = (req, res, next) => {
  res.render("home", { user: req.user }); // Render home view with user data
};

// Controller method to create a new group with image upload
controller.createGroup = async (req, res, next) => {
  try {
    const groupObject = JSON.parse(req.body.groupObject); // Parse group object from request body
    const { groupName, groupCreator } = groupObject; // Destructure group properties
    // Create new group in database
    const newGroup = await groupModel.create({
      groupName: groupName, // Set group name 
      groupProfileImage: "/images/groupDps/" + req.file.filename, // Set group profile image path
      admin: groupCreator, // Set group admin
    });

    newGroup.members.push(groupCreator); // Add group creator as member
    await newGroup.save(); // Save new group to database
    res.send(newGroup); // Send response with created group data
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

controller.editProfile = async (req, res, next) => {
  try {
    // console.log(req.file)
    const { displayName, loggedInUser } = JSON.parse(req.body.userDets); // Destructure group properties
    // Create new group in database
    const user = await userModel.findOneAndUpdate({_id:loggedInUser},{displayName:displayName});
    res.send(user); // Send response with created group data
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// Controller method to logout user
controller.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Redirect to index page after logout
  });
};

// Export the controller object
module.exports = controller;

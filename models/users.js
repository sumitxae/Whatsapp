const mongoose = require('mongoose')
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"]
  },
  contact: String,
  image: {
    type: String,
    default: 'https://imgs.search.brave.com/vwimYLUDcAbT_ZWKjz9DlBVRoovzdUlB7dl-L8ZFB78/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by91/c2VyLXByb2ZpbGUt/ZnJvbnQtc2lkZV8x/ODcyOTktMzk1OTUu/anBnP3NpemU9NjI2/JmV4dD1qcGc'
  },
  socketId:{
    type: String,
    default: ''
  }
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
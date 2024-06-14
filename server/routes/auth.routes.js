const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  joiUserCreationSchema,
} = require("../validations/userCreationValidation");
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const requireLogin = require("../middleware/requireLogin");
/*
router.get('/', (req, res)=>{
    res.send("hello")
})
*/
//  This route is an example to show the we can route users in a separate file, here "auth.routes.js"

/*
router.get("/protected", requireLogin, (req, res) => {
  // console.log(req.user.name)
  const name = req.user.name;
  // appeded the req object with the userdata(user) in the requireLogin middleware in "../middleware/requireLogin"

  let index = -1;

  for (let i = 0; i < name.length; i++) {
    if (name[i] === " ") {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    const newName = name.substring(0, index);
    return res.send(`Hello user: ${newName}`.format(newName));
  } else {
    return res.send(`Hello user: ${name}`);
  }
});
*/ // -->This is the `/protected` route which is the protercted resource using the 'requireLogin.js' middleware imported in the line 13

router.post("/signup", (req, res) => {
  const { name, username, email, password, profilePicUrl } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  const { error } = joiUserCreationSchema.validate({
    name,
    username,
    email,
    password,
  });
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  User.findOne({ $or: [{ email }, { username }] })
    .then((savedUser) => {
      if (savedUser) {
        if (savedUser.email === email) {
          return res.status(422).json({ error: "Email already exists" });
        } else {
          return res.status(422).json({ error: "Username already exists" });
        }
      }

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          username,
          email,
          password: hashedPassword,
          profilePicUrl
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "User saved successfully" });
          })
          .catch((err) => {
            if (err.code === 11000) {
              // Check for duplicate key error
              const duplicateField = Object.keys(err.keyPattern)[0];
              res
                .status(422)
                .json({
                  error: `${
                    duplicateField.charAt(0).toUpperCase() +
                    duplicateField.slice(1)
                  } already exists`,
                });
            } else {
              console.log(err);
              res.status(500).json({ err });
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  // console.log(req,"\n", req.headers, "\n", req.body) // _-> This is for understanding
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(422)
      .json({ error: "You must give the Email and the Password both" });
  } else {
    User.findOne({ email: email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Invalid Email or Password" });
        }
        bcrypt
          .compare(password, savedUser.password)
          .then((doMatch) => {
            if (doMatch) {
              // return res.json({message:"Successfully Singed in"})
              const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
              const { _id, name, username, email, profilePicUrl } = savedUser;
              console.log(profilePicUrl);
              res.json({
                token,
                user: { _id, name, username, email, profilePicUrl },
              });
            } else {
              return res
                .status(422)
                .json({ error: "Invalid Email or Password" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;

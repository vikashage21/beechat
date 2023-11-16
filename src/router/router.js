const express = require("express");

const router = new express.Router();

const UserRegistration = require("../modles/registration");

const path = require ('path')


const index = path.join(__dirname,"../template/views/index.hbs")

const login = path.join(__dirname,'../template/views/login.html')


const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// getting request for signup pages

router.get("/signup", (req, res) => {
  res.render("signup");
});

// getting request for login page
router.get("/login", (req, res) => {
  res.render("login");
});

// getting reset page
router.get("/reset", (req, res) => {
  res.render("reset");
});

// getting home page

router.get("/home", (req, res) => {
  res.render("home");
});



// creating auth meddleware to check that user is same at acess the secret page

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    const verifyUser = await jwt.verify(token, process.env.SCREAT);

    const user = await UserRegistration.findOne({_id:verifyUser._id})


    next();

  } catch (e) {
    res.status(404).sendFile(login);
  }
};

// creating logout route

router.get("/logout", auth, async (req, res) => {
  try {
 
  // Clear the JWT cookie
  res.clearCookie("jwt");

  res.render("login");

   
  } catch (e) {
    res.status(500).send(e);
  }
});

// // getting secret page

// router.get("/secert", auth, (req, res) => {
//   res.render("secert");
// });


// get chat page

router.get('/chat' , auth ,(req, res)=>{
  res.render(index)
})



// getting all data form database

router.get("/user", async (req, res) => {
  try {
    const user = await UserRegistration.find();
    res.send(user);
  } catch (e) {
    console.log(e);
  }
});
// post request for signup page

router.post("/signup", async (req, res) => {
  try {
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      age: req.body.age,
    };

    // creating a function to encrypt the data given by user

    const securePassword = async (password) => {
      try {
        const securePassword = await bycrpt.hash(password, 10);

        return securePassword;
      } catch (e) {
        console.log(e);
      }
    };

    // creating a fucntion to for jwt token

    // const generateToken = async function () {
    //   try {
    //     const token = await jwt.sign(
    //       { _id: this._id },
    //       process.env.SCREAT
    //     );

    //     token.toString();

    //     return token;
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };

    // checking the password and confirm password ---- simple verification

    if (data.password !== data.confirm_password) {
      res.send("invalid confirm password");
    } else {
      // calling function for encrypt the data

      data.password = await securePassword(data.password);

      data.confirm_password = data.password;

      // calling function for generation the token here

      //
      const user = await UserRegistration.insertMany([data]);

      // syntax

      // res.cookie(name,value,[options])

      res.render("login");
    }
  } catch (e) {
    console.log(e);
  }
});

// login page post method

router.post("/login", async (req, res) => {
  try {
    const user = await UserRegistration.findOne({ email: req.body.email });

    // comparing the hased  password and user password

    const checkPassword = await bycrpt.compare(
      req.body.password,
      user.password
    );
    // creating a fucntion to for jwt token

    const generateToken = async function () {

      try {
        
        const token = await jwt.sign({ _id: user._id }, process.env.SCREAT);

        token.toString();

        return token;
      } catch (e) {
        console.log(e);
      }
    };

    const token = await generateToken();

    // Add the new token to the 'tokens' array
    user.tokens.push({ token: token });

    // Save the user document after adding the new token
    await user.save();

    //sending the jwt token in cookies

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 500000),
      httpOnly: true,
    });

    // using cookies middleware req.cookies.name

    // console.log( ` this is jwt token ${req.cookies.jwt} `)

    if (checkPassword) {
      res.render("home");
    } else {
      res.send("Enter valid Email and Password");
    }
  } catch (e) {
    console.log(e);
  }
});

// reset password feature in the application

router.post("/reset", async (req, res) => {
  try {
    const user = await UserRegistration.findOne({ email: req.body.email });

    if (req.body.password == req.body.confirm_password) {
      const checkPassword = await bycrpt.compare(
        req.body.password,
        user.password
      );

      if (checkPassword) {
        const newPassword = await bycrpt.hash(req.body.newPassword, 10);

        await UserRegistration.updateOne(
          { email: user.email },
          {
            $set: {
              password: newPassword,
              confirm_password: newPassword,
            },
          }
        );

        res.render("login");
        return newPassword;
      }
    } else {
      res.send("invalid details , please check it and try again");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const { User } = require("./models/user");

// handling mp4 uploads
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function(req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var upload = multer({ storage: storage }).any();

const app = express();
app.use(bodyParser.json());

port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost/bigClout", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Database Connected Successfully !!!"))
  .catch(err => {
    console.log(err);
  });

// Signup Route
app.post("/api/signup", (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  }).save((err, data) => {
    if (err) res.status(400).send(err);
    res.status(200).send(data);
  });
});

//Login Route
app.post("/api/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      res.json("User Not Found !!!");
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch) {
        return res.status(400).json({
          message: "Wrong Password"
        });
      }

      res.status(200).send("User Login Successful");
    });
  });
});

//Video Upload Route
app.post("/api/media/upload", function(req, res) {
  multer({
    fileFilter: function(req, file, cb) {
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (extname === "mp4") {
        return cb(null, true);
      }

      cb(
        "Error: File uploads only supports following filetypes - " + filetypes
      );
    }
  });

  upload(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.send("Error uploading file.");
    }
    res.send("File is uploaded");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

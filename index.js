// 生成 JWT token
const jwt = require("jsonwebtoken");
const secret = "mysecretkey";
const expiresIn = 60;
const payload = {
  user_id: "UserA",
  email: "UserA@example.com",
};
const token = jwt.sign(payload, secret, { expiresIn });

// Build server
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/user/login", (req, res) => {
  const checkUser =
    req.body.account === "UserA" && req.body.password === "ABC123";
  if (checkUser) {
    res.send({ token });
  }
});

app.post("/user/verify", (req, res) => {
  try {
    const verifyResult = jwt.verify(req.body.token, secret);
    if (verifyResult) {
      res.send({ status: "verified" });
    }
  } catch (error) {
    console.log(error.message, "==error");
    if (error.message.includes("jwt expired")) {
      res.send({ status: "fail", reason: "Token is expired." });
    } else {
      res.send({ status: "fail", reason: "JWT verify fail." });
    }
  }
});

app.listen(4500, () => console.log("Node server is running."));

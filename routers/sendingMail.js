const express = require("express");
const router = express.Router();
const path = require("path");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require("util");
const otp = require("otp-generator");

const readFileAsync = promisify(fs.readFile);

async function sendEMail(username, email) {
  // const htmlTemplate = await readFileAsync("./public/html/template.ejs");
  const imageAttachment = await readFileAsync("./public/images/mail.png");

  const templatePath = path.join(__dirname, "..", "public/html/template.ejs");
  const template = fs.readFileSync(templatePath, "utf-8");

  const password = otp.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const htmlContent = ejs.render(template, {
    username: username,
    password: password,
  });

  console.log(password);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Dribble <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Dribble Account Verification  ",
    html: htmlContent,
    attachments: [
      {
        filename: "mail.png",
        content: imageAttachment,
        encoding: "base64",
        cid: "uniqueImageCID", // Referenced in the HTML template
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

router.get("/send", (req, res, next) => {
  res.send(`
        <form method="POST" action="/post"> 
            <label for="email"> Email</label>
            <input type="email" name="email" id="username">

            <label for="username"> Username</label>
            <input type="text" name="username" id="username">  

            <button type="submit"> Submit </button>
        <form/>
    `);
});

router.post("/post", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  sendEMail(username, email);
  console.log(username);
  res.redirect("/send");
});

module.exports = router;

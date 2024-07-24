const nodemailer = require("nodemailer");
require('dotenv').config()
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});





exports.sendOTP = (recipient, Otp) => {
    const mailOptions = {
        from: 'petaverse.com',
        to: recipient,
        subject: 'OTP Verification',
        text: `Your OTP (One-Time-Password) is ${Otp}`
    };

    transporter.sendMail(mailOptions, function(err) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
}
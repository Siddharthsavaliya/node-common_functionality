const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    from: process.env.FROM_EMAIL,
    secure: false, // true for production 465, false for other ports
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.generateEmail = async function (mailDetails) {
    // the file name will be coming from the mail detail that is from where in which api you calling email service.
    mailDetails.fileName = "welcome.ejs" // this is example file
    let emailPath = path.join(__dirname, `../template/${mailDetails.fileName}`);

    const ejsTemplate = fs.readFileSync(emailPath, "utf8"); // Read the EJS template file

    const htmlContent = ejs.render(ejsTemplate, {
        appName: "mobilefirst"
        // other keys can be added here to pass in the email template 
    });

    let emailOptions = {
        from: process.env.FROM_EMAIL,
        to: "mobilefirst@gmail.com", // please enter to email address
        subject: "mobilefirst email",
        text: "this mobilefirst test email",
        html: htmlContent,
    };


    let email = transport.sendMail(emailOptions);
    return email;
};

 
const twilio = require('twilio');
const nodeMailer = require('nodemailer');
// send email 
async function sendEmail({ host, port, secure, requireTLS, user, pass, mailOption }) {
    const transporter = nodeMailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        requireTLS: requireTLS,
        auth: {
            user: user,
            pass: pass
        }
    });
    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else if (info) {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    } catch (error) {
        throw new Error("Email sending failed: " + error.message);
    }

}

// send message 
async function sendMessage({ TWILIO_SID, TWILIO_AUTH_TOKEN, body, from, phone }) {
    const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

    await new Promise((resolve, reject) => {
        client.messages
            .create({ body: body, from: from, to: phone })
            .then(message => resolve(message))
            .catch(err => reject(err));
    });

}

module.exports = { sendEmail, sendMessage };
const twilio = require('twilio');

// send message 
async function sendMessage({ body, from, phone }) {
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    await new Promise((resolve, reject) => {
        client.messages
            .create({ body: body, from: from, to: phone })
            .then(message => resolve(message))
            .catch(err => reject(err));
    });

}

module.exports = { sendMessage };
const Cron = require('node-cron');

function createCron({ second = "*", minute = "*", hour = "*", dayofmonth = "*", month = "*", dayofweek = "*", cronFunction }) {
    try {
        const cron = Cron.schedule(`${second} ${minute} ${hour} ${dayofmonth} ${month} ${dayofweek}`, cronFunction);
        return cron;
    } catch (error) {
        throw new Error('Error creating cron job');
    }
}

module.exports = { createCron };
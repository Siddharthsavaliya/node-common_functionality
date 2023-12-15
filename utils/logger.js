const fs = require('fs'); // Import the fs module
const path = require('path');
const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const logDirectory = path.join(__dirname, 'logs');  // Directory path where you want to store log files

// Create the log folder if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const year = currentDate.getFullYear();

const formattedDate = `${day}-${month}-${year}`;
const customFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: `${logDirectory}/${formattedDate}.log` // Specify the folder in the filename
        })
    ]
});


module.exports = {logger};
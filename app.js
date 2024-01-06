const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// .env config
dotenv.config();

// Parse the body text
app.use(bodyParser.json());

// CORS
app.use(cors({
    allowedHeaders: "*",
    origin: "*",
}));

// Error handling for the wrong json input
app.use((err, req, res, next) => {
    if (err) {
        // Handle JSON parsing errors
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            return res.status(400).json({ status: 400, message: 'Invalid JSON payload' });
        }

        // Handle entity too large errors
        if (err.type === 'entity.too.large') {
            return res.status(413).json({ status: 413, message: 'Payload too large' });
        }

        // Log the error and return a generic server error response
        console.error(err);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }

    next();
});

// Error
app.use((req, res) => {
    res.status(404).json({
        message: "Error serving the request !",
    });
});

const fs = require('fs');
const jwt = require('jsonwebtoken');
const { program } = require('commander');

program
    .option('--createStruct')
program.parse();
// create folder
async function createFolderInRoot(folderName) {
    try {
        await fs.mkdirSync(folderName);
        return true;
    } catch (err) {
        console.error(`Error creating folder "${folderName}": ${err.message}`);
    }
}

// create common folder
async function createCommonFolder() {
    await createFolderInRoot('./routes')
    await createFolderInRoot('./middleware')
    await createFolderInRoot('./controller')
    await createFolderInRoot('./model')
    return
}
const options = program.opts();

if (options.createStruct) {
    createCommonFolder();
}
// jwt authentication
function createToken(payload, secretKey, options,) {
    try {
        const token = jwt.sign(payload, secretKey, options);
        return token;
    } catch (error) {
        throw new Error('Error creating JWT token');
    }
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized - Invalid authorization header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}
module.exports = { createCommonFolder, createToken, verifyToken };

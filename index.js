const fs = require('fs');
const { program } = require('commander');

// command declaration
program
    .option('--createStruct')
program.parse();
function createFolderIfNotExists(folderPath, callback) {
    fs.stat(folderPath, (err, stats) => {
        if (err && err.code === 'ENOENT') {
            fs.mkdir(folderPath, { recursive: true }, (mkdirErr) => {
                if (mkdirErr) {
                    console.error('Error creating folder:', mkdirErr.message);
                } else {
                    console.log(`Folder created: ${folderPath}`);
                }
                if (callback && typeof callback === 'function') {
                    callback();
                }
            });
        } else {
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    });
}

function copyFile(sourcePath, destinationPath, folderName) {
    console.log(sourcePath)
    fs.readFile(sourcePath, 'utf-8', (readErr, existingContent) => {
        console.log('1')
        if (readErr) {
            console.log('2')
            console.error('Error reading file:', readErr.message);
        } else {
            console.log('3')
            createFolderIfNotExists(folderName, () => {
                console.log('4')
                console.log(folderName)
                fs.writeFile(destinationPath, existingContent, 'utf-8', (writeErr) => {
                    console.log('5')
                    if (writeErr) {
                        console.log('6')
                        console.log(writeErr)
                        console.log(writeErr.message)
                        console.error('Error writing file:', writeErr.message);
                    } else {
                        console.log('7')
                        console.log('File created successfully!');
                    }
                });
            });
        }
    });
}

// create file in all three folders
function createFile() {
    createFolderIfNotExists('./utils')
    createFolderIfNotExists('./middleware')
    createFolderIfNotExists('./controllers')
    createFolderIfNotExists('./models')
    createFolderIfNotExists('./utils/template')
    copyFile('./node_modules/common_functionality/utils/common.js', './utils/common.js', './utils');
    copyFile('./node_modules/common_functionality/utils/email.js', './utils/email.js', './utils');
    copyFile('./node_modules/common_functionality/utils/sms.js', './utils/sms.js', './utils');
    copyFile('./node_modules/common_functionality/utils/jwt.js', './utils/jwt.js', './utils');
    copyFile('./node_modules/common_functionality/utils/template/welcome.ejs', './utils/template/welcome.ejs', './utils/template');
    copyFile('./node_modules/common_functionality/.env', './.env', '.');
    copyFile('./node_modules/common_functionality/.gitignore', './.gitignore', '.');
}


const options = program.opts();
// create folder command listener  
if (options.createStruct) {
    createFile();
}





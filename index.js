const fs = require('fs');
const { program } = require('commander');
const path = require('path');
// command declaration
program
    .option('--createStruct')
    .option('--createFile')
    .option('-s, --separator <char>');
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

// create file function
async function createJSFile(folderPath, fileName) {
    // Ensure the folder path exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Construct the file path with the .js extension
    const filePath = path.join(folderPath, `${fileName}.js`);

    // Create the file
    fs.writeFileSync(filePath, '');

    console.log(`File "${fileName}.js" created successfully in folder "${folderPath}".`);
}

// create common folder
async function createCommonFolder() {
    await createFolderInRoot('./routes')
    await createFolderInRoot('./middleware')
    await createFolderInRoot('./controller')
    await createFolderInRoot('./utils')
    await createFolderInRoot('./model')
    return
}

// create file in all three folders
async function createFile(fileName) {
    await createJSFile('./routes', fileName)
    await createJSFile('./controller', fileName)
    await createJSFile('./model', fileName)
    return
}

const options = program.opts();
// create folder command listener  
if (options.createStruct) {
    createCommonFolder();
}
// create file command listener  
if (options.createFile) {
    createFile(program.args[0])
}


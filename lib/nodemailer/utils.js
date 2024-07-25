const fse = require('fs-extra');

const readHTMLContent = async (path) => {
    try {
        const data = await fse.readFile(path, 'utf8');
        return data;
    } catch (error) {
        console.error(error);
        return 'Email conversion error';
    }
}

module.exports = {readHTMLContent};
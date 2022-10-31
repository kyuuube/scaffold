const https = require('https');
const template = require('art-template');
const fs = require('fs');
const url = 'https://rosetta-latte.art/swagger/v2/api-docs';

let basePath = '';
let paths = null;
let pathList = [];

(async () => {
    https.get(url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            basePath = data.basePath === '/' ? '' : data.basePath;
            paths = data.paths;
            pathList = Object.keys(paths).map(key => ({...paramsFlat(paths[key]), url: basePath + key}))
            console.log(pathList)
            // fileData = template(__dirname + '/template/tpl-apiFile.art', {
            //     list: pathList
            // });
            // fileData = replaceBlank(fileData)
            // fs.writeFile(__dirname + `/dist/${basePath}Api.js`, fileData, function (err) {
            //     if (err) return console.log(err);
            //     console.log('finish');})
        });
    }).on('error', err => {
        console.log(err.message);
    });
})();

const paramsFlat = (obj) => {
    let flatingObj = null
    for (const key in obj) {
        flatingObj = {
            method: key,
            ...obj[key]
        }
    }
    return flatingObj
}

const replaceBlank = (oldStr) =>{
    return oldStr.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '');
}

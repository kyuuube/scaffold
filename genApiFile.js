const http = require('http');
const template = require('art-template');
const fs = require('fs');
const url = 'http://domain/service-name/v2/api-docs';

let basePath = '';
let paths = null;
let pathList = [];

(async () => {
    http.get(url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            basePath = data.basePath;
            paths = data.paths;
            if (Object.prototype.toString.call(paths) === '[object Object]') {
                console.log("paths is an Object");
            } else if (Array.isArray(paths)) {
                console.log("paths is an Array");
            } else if (paths instanceof Map) {
                console.log("is map");
            } else {
                // is not [Object Object] , but [object Object]
                console.log(Object.prototype.toString.call(paths) === '[Object Object]');
            }
            pathList = Object.keys(paths).map(key => ({...paramsFlat(paths[key]), url: basePath + key}))
            fileData = template(__dirname + '/tpl-apiFile.art', {
                list: pathList
            });
            fileData = replaceBlank(fileData)
            fs.writeFile(__dirname + `/template/${basePath}Api.js`, fileData, function (err) {
                if (err) return console.log(err);
                console.log('finish');})
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

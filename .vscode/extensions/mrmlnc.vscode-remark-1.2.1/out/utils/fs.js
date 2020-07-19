'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function fileRead(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, file) => {
            if (err) {
                return reject(err);
            }
            resolve(file.toString());
        });
    });
}
exports.fileRead = fileRead;

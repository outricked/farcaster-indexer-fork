"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakIntoChunks = void 0;
/**
 * Break a large array into smaller chunks.
 * @param {array} array Array to break into smaller chunks
 * @param {number} chunkSize Size of each chunk
 * @returns {array} Array of smaller chunks
 */
function breakIntoChunks(array, chunkSize) {
    var chunks = Array();
    for (var i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}
exports.breakIntoChunks = breakIntoChunks;

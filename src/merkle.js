"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MERKLE_REQUEST_OPTIONS = exports.NEYNAR_API_KEY = void 0;
if (!process.env["API_KEY"]) {
    console.error('Missing NEYNAR API KEY environment variables');
}
exports.NEYNAR_API_KEY = process.env["API_KEY"];
exports.MERKLE_REQUEST_OPTIONS = {};

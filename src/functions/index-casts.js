"use strict";
//import { getSSLHubRpcClient } from '@farcaster/hub-nodejs'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCasts = exports.indexAllCasts = void 0;
var got_1 = require("got");
var merkle_js_1 = require("../merkle.js");
var supabase_1 = require("../supabase");
var utils_js_1 = require("../utils.js");
/**
 * Index the casts from all Farcaster profiles and insert them into Supabase
 * @param limit The max number of recent casts to index
 */
function indexAllCasts(limit) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, allCasts, cleanedCasts, formattedCasts, chunks, _i, chunks_1, chunk, error, endTime, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    return [4 /*yield*/, getAllCasts(limit)];
                case 1:
                    allCasts = _a.sent();
                    cleanedCasts = cleanCasts(allCasts);
                    formattedCasts = cleanedCasts.map(function (c) {
                        var cast = {
                            hash: c.hash,
                            thread_hash: c.threadHash,
                            parent_url: '',
                            parent_hash: c.parentHash || null,
                            author_fid: c.author.fid,
                            author_username: c.author.username || null,
                            author_display_name: "",
                            author_pfp_url: null,
                            author_pfp_verified: false,
                            text: c.text,
                            published_at: new Date(c.timestamp),
                            mentions: c.mentions || null,
                            replies_count: c.replies.count,
                            reactions_count: c.reactions.likes.length,
                            recasts_count: c.reactions.recasts.length,
                            deleted: false,
                        };
                        return cast;
                    });
                    chunks = (0, utils_js_1.breakIntoChunks)(formattedCasts, 1000);
                    _i = 0, chunks_1 = chunks;
                    _a.label = 2;
                case 2:
                    if (!(_i < chunks_1.length)) return [3 /*break*/, 5];
                    chunk = chunks_1[_i];
                    return [4 /*yield*/, supabase_1.default.from('casts').upsert(chunk, {
                            onConflict: 'hash',
                        })];
                case 3:
                    error = (_a.sent()).error;
                    if (error) {
                        throw error;
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    endTime = Date.now();
                    duration = (endTime - startTime) / 1000;
                    if (duration > 60) {
                        // If it takes more than 60 seconds, log the duration so we can optimize
                        console.log("Updated ".concat(formattedCasts.length, " casts in ").concat(duration, " seconds"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.indexAllCasts = indexAllCasts;
/**
 * Get the latest casts from the Merkle API. 100k casts every ~35 seconds on local machine.
 * @param limit The maximum number of casts to return. If not provided, all casts will be returned.
 * @returns An array of all casts on Farcaster
 */
function getAllCasts(limit) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var allCasts, params, _response, response, casts, _i, casts_1, cast, cursor;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    allCasts = new Array();
                    params = {
                        api_key: merkle_js_1.NEYNAR_API_KEY,
                        feed_type: "filter",
                        filter_type: "parent_url",
                        parent_url: "chain://eip155:999/erc721:0x5a5ddb8a2d1ee3d8e9fd59785da88d573d1a84fe",
                        limit: 150
                    };
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, buildCastEndpointNeynar(params)];
                case 2:
                    _response = _b.sent();
                    response = _response;
                    casts = response.casts;
                    if (!casts)
                        throw new Error('No casts found');
                    for (_i = 0, casts_1 = casts; _i < casts_1.length; _i++) {
                        cast = casts_1[_i];
                        allCasts.push(cast);
                    }
                    // If limit is provided, stop when we reach it
                    if (limit && allCasts.length >= limit) {
                        return [3 /*break*/, 3];
                    }
                    cursor = (_a = response.next) === null || _a === void 0 ? void 0 : _a.cursor;
                    if (cursor) {
                        params = {
                            api_key: merkle_js_1.NEYNAR_API_KEY,
                            feed_type: "filter",
                            filter_type: "parent_url",
                            parent_url: "chain://eip155:999/erc721:0x5a5ddb8a2d1ee3d8e9fd59785da88d573d1a84fe",
                            limit: 150
                        };
                    }
                    else {
                        return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, allCasts];
            }
        });
    });
}
exports.getAllCasts = getAllCasts;
// /**
//  * Get the latest casts from Hub.
//  */
//  async function getAllCastsFromHub(limit?: number): Promise<Cast[]> {
//   let hubRpcEndpoint = 'your-hub-id.hubs.neynar.com:2283'
//   let client = getSSLHubRpcClient(hubRpcEndpoint)
//   client.subscribe()
// }
/**
 * Helper function to build the profile endpoint with a cursor
 * @param cursor
 */
function buildCastEndpoint(cursor) {
    return "https://api.warpcast.com/v2/recent-casts?limit=1000".concat(cursor ? "&cursor=".concat(cursor) : '');
}
/**
 * Helper function to get casts for the MangAnime
 * @param params
 */
function buildCastEndpointNeynar(params) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, definedParams, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "https://api.neynar.com/v2/farcaster/feed";
                    definedParams = Object.fromEntries(Object.entries(params).filter(function (_a) {
                        var key = _a[0], value = _a[1];
                        return value !== undefined;
                    }));
                    return [4 /*yield*/, (0, got_1.default)(endpoint, { searchParams: definedParams })];
                case 1:
                    response = _a.sent();
                    data = JSON.parse(response.body);
                    console.log("data", data);
                    return [2 /*return*/, data];
            }
        });
    });
}
// chain://eip155:999/erc721:0x5a5ddb8a2d1ee3d8e9fd59785da88d573d1a84fe
function cleanCasts(casts) {
    var cleanedCasts = new Array();
    for (var _i = 0, casts_2 = casts; _i < casts_2.length; _i++) {
        var cast = casts_2[_i];
        // Remove recasts
        if (cast.text.startsWith('recast:farcaster://'))
            continue;
        // TODO: find way to remove deleted casts
        // Remove some data from mentions
        if (cast.mentions) {
            cast.mentions = cast.mentions.map(function (m) {
                return {
                    fid: m.fid,
                    username: m.username,
                    displayName: m.displayName,
                    pfp: m.pfp,
                };
            });
        }
        cleanedCasts.push(cast);
    }
    return cleanedCasts;
}

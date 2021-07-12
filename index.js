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
        while (_) try {
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
var axios = require("axios");
var cheerio = require("cheerio");
var readline = require('readline');
var fs = require('fs');
//url정의 
var urls = {
    vibe: "https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/chart/track/total"
};
//album url정의 
var album_urls = {
    vibe: "https://vibe.naver.com/album/"
};
var music;
// Output 정의  
// req_count : 요청횟수 
// scrap_count : 스크래핑작업 호출횟수
// status_code: 200(성공) , 404(실패) -> 한개라도 실패시 실패처리 
// start / end / result_time => 시간측정
var output = {
    start: 0,
    end: 0,
    result_time: "",
    req_count: 0,
    scrap_count: 0,
    status_code: 200
};
//Input 
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//입력받은 사이트명 
var sites;
rl.on('line', function (line) {
    sites = line.split(' ');
    // 시간측정 변수
    output.start = new Date(); // 시작
    console.log(sites);
    scrapHTML().then(function () {
        output.end = new Date(); // 종료
        output.result_time = String(output.end - output.start) + "ms";
        console.log(output);
        // 파일작성 
        fs.writeFileSync('result.txt', JSON.stringify(output), 'utf8', function (error) {
            console.log('write end');
        });
    });
    rl.close();
}).on('close', function () {
    //종료
});
function scrapHTML() {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, i;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //요청횟수 저장 
                    output.req_count = sites.length;
                    _loop_1 = function (i) {
                        var site_url, getHTML, parsing;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    site_url = urls[sites[i]];
                                    //null 체크
                                    if (site_url == null || site_url == '') {
                                        output.status_code = 404;
                                        return [2 /*return*/, "continue"];
                                    }
                                    getHTML = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var err_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    output.scrap_count += 1;
                                                    return [4 /*yield*/, axios.get(site_url)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                                case 2:
                                                    err_1 = _a.sent();
                                                    output.status_code = 404;
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    if (!(sites[i] == "vibe")) return [3 /*break*/, 2];
                                    parsing = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var html, vibe_data, songs, rank, key, artist_arr, cnt;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, getHTML()];
                                                case 1:
                                                    html = _a.sent();
                                                    vibe_data = html.data.response.result.chart.items.tracks;
                                                    songs = [];
                                                    rank = 0;
                                                    for (key in vibe_data) {
                                                        artist_arr = [];
                                                        for (cnt = 0; cnt < vibe_data[key].album.artists.length; cnt++) {
                                                            artist_arr.push(vibe_data[key].album.artists[cnt]['artistName']);
                                                        }
                                                        music = {
                                                            songId: vibe_data[key].trackId,
                                                            rank: rank += 1,
                                                            rank_up: 0,
                                                            albumImg: vibe_data[key].album['imageUrl'],
                                                            title: vibe_data[key].trackTitle,
                                                            singer: artist_arr.join(' '),
                                                            albumId: vibe_data[key].album['albumId'],
                                                            albumTitle: vibe_data[key].album['albumTitle']
                                                        };
                                                        songs.push(music); // [end] push
                                                    } // [end] for 
                                                    output.vibe = songs;
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); } // [end] parsing 
                                    ;
                                    return [4 /*yield*/, parsing()];
                                case 1:
                                    _b.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    console.log("입력값이 올바르지 않습니다.");
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < sites.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}

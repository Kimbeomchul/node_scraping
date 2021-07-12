const axios = require("axios");
const cheerio = require("cheerio");
const readline = require('readline');
const fs = require('fs');

//url정의 
const urls = {
    vibe: "https://apis.naver.com/vibeWeb/musicapiweb/vibe/v1/chart/track/total"
}; 
//album url정의 
const album_urls = {
    vibe: "https://vibe.naver.com/album/"
}

//인터페이스 정의 Music
interface Music{
    songId: number;
    rank: number;
    rank_up: string;
    albumImg: string;
    title: string;
    singer: string;
    albumId: number;
    albumTitle: string;
}
let music: Music;

// Output 정의  
// req_count : 요청횟수 
// scrap_count : 스크래핑작업 호출횟수
// status_code: 200(성공) , 404(실패) -> 한개라도 실패시 실패처리 
// start / end / result_time => 시간측정
let output: any ={
    start: 0,
    end: 0,
    result_time: "",
    req_count: 0,
    scrap_count: 0, 
    status_code: 200
};


//Input 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//입력받은 사이트명 
let sites;

rl.on('line', (line) => {
    sites = line.split(' ');
    // 시간측정 변수
    output.start = new Date();  // 시작
    console.log(sites);

    scrapHTML().then(() =>{ 
        output.end = new Date();  // 종료
        output.result_time = String(output.end - output.start)+"ms";
        console.log(output);

        // 파일작성 
        fs.writeFileSync('result.txt', JSON.stringify(output), 'utf8', function(error){
        console.log('write end') 
        });
    });
    rl.close();

}).on('close', () => {

    //종료
});

async function scrapHTML(){
    //요청횟수 저장 
    output.req_count = sites.length;
    for (let i=0; i<sites.length; i++){
        let site_url = urls[sites[i]];
        //null 체크
        if(site_url == null || site_url == ''){
            output.status_code = 404;
            continue;
        }

        //Axios get
        const getHTML = async() =>{
                try{
                    output.scrap_count += 1;
                    return await axios.get(site_url);
                }catch(err){
                    output.status_code = 404;
                }
            }
        
        // -- s vibe --  
        if(sites[i] == "vibe"){

            const parsing = async() =>{
                const html = await getHTML();
                const vibe_data = html.data.response.result.chart.items.tracks;

                let songs = [];
                let rank = 0;
                for (var key in vibe_data){
                    // 아티스트 배열 
                    let artist_arr = [];
                    for(var cnt = 0; cnt < vibe_data[key].album.artists.length; cnt++){
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
                    }
                    songs.push(music); // [end] push
                } // [end] for 
                output.vibe = songs;
                
            } // [end] parsing 
            await parsing();
        }else{// — e vibe —  
            console.log("입력값이 올바르지 않습니다.");
        }
        
    }
}

# Web scraping
- naver vibe


### used
- Node js
- Typescript
- Axios , Cheerio

### 사용법
```
npm install
npm start
vibe
```

### more
- 기능을 추가하여 사용하기
  + 현재 실행시 결과값을 txt파일로 저장하며 부르는 방법은 하단 코드참조. 
  + 추후 사이트를 추가할 수 있도록 확장가능하게 상단에 정의한값만 추가하면 모듈화해서 사용가능

```
fs.readFile('result.txt','utf8',function(err,data){ 
  console.log(JSON.parse(data)); 
});  
``` 

### 설명
[스크래핑,크롤링 차이](https://github.com/Kimbeomchul/TIL/blob/main/scraping.md)

### Demo
![scrap](https://user-images.githubusercontent.com/54543148/125275738-5b132b00-e34a-11eb-9131-7bbdade3bc20.gif)


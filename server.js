const http = require("http");
const sourcePathList = ["M:\\新番", "M:\\整理庫"];
const fs = require('fs');
const querystring = require('querystring');

function getFile(query) {
  let fileList = [];

  if (query.name !== undefined) {
    for (let sourcePath  of sourcePathList) {
      if (fs.existsSync(sourcePath + "\\" + query.name)) {
        fileList = fileList.concat(fs.readdirSync(sourcePath + "\\" + query.name))
      }
      ;
    }
  }

  let db = {}
  if (fs.existsSync(".\\db.json")) {
    db = JSON.parse(fs.readFileSync(".\\db.json", 'utf8'));
  }

  return JSON.stringify({"file": fileList, "condition": (db[query.name] || [])});
}


requestHandler = (request, response) => {
  let url = request.url;
  let json;
  let query = querystring.parse((request.url.split("?")[1]), null, null,);
  let db = {};

  switch (url.split("?")[0]) {
    case "/list":
      let extensionRegExp = RegExp(/\./);
      let tmpFileList = [];
      let dirList = [];

      for (let sourcePath  of sourcePathList) {
        tmpFileList = [...new Set(tmpFileList.concat(fs.readdirSync(sourcePath)))];
      }

      for (let dir of tmpFileList) {
        if (!extensionRegExp.exec(dir.toString())) {
          dirList.push(dir);
        }
      }

      json = JSON.stringify(dirList);
      break;
    case "/get":
      json = getFile(query);
      break;
    case "/add":
      if (query.name !== undefined && query.text !== undefined) {
        if (fs.existsSync(".\\db.json")){
          db = JSON.parse(fs.readFileSync(".\\db.json", 'utf8'));
        }
        if (db[query.name]){
          db[query.name].push(query.text);
        }else{
          db[query.name]  = [query.text];
        }
      }

      fs.writeFileSync('.\\db.json', JSON.stringify(db), 'utf8');
      json = getFile(query);
      break;
    case "/remove":

      if (query.name !== undefined && query.text !== undefined) {
        if (fs.existsSync(".\\db.json")){
          db = JSON.parse(fs.readFileSync(".\\db.json", 'utf8'));
        }

        if (db[query.name]){
          db[query.name].splice( db[query.name].indexOf(query.text), 1 );
        }
      }
      fs.writeFileSync('.\\db.json', JSON.stringify(db), 'utf8');
      json = getFile(query);
      break;
    case "/build/build.js":
      json  = fs.readFileSync("./build/build.js",'utf8');
      break;
    case "/":
      json  = fs.readFileSync("./dist/index.html",'utf8');
        break;
    default:
      let getPath = url.split("?")[0];
      if (fs.existsSync(".\\dist\\" + getPath)){
        json  = fs.readFileSync(".\\dist\\" + getPath, 'utf8');
      }
  }
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  response.end(json);
}


const server = http.createServer(requestHandler);

server.listen(3000);
console.log("start in http://127.0.0.1:3000/");

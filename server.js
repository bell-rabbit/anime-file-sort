const http = require("http");
const sourcePathList = ["M:\\新番", "M:\\整理庫","M:\\影片目錄庫"];
const imagePathList = ["O:\\","\\\\192.168.10.10\\圖片庫"];
const fs = require('fs');
const path = require('path');
const exec = require('child_process');

const querystring = require('querystring');

function getFile(query) {
  let fileList = [];

  if (query.name !== undefined) {
    for (let sourcePath  of sourcePathList) {
      if (fs.existsSync(sourcePath + "\\" + query.name)) {
        fileList = fileList.concat(fs.readdirSync(sourcePath + "\\" + query.name))
      }
    }
  }

  let db = {};
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
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  switch (url.split("?")[0]) {
    case "/api/list":
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
    case "/api/getCollection":
      json  = fs.readFileSync(".\\collectionDB.json",'utf8');
      break;

    case "/api/getCollectionImg":

      let name = query.name;
      for (let i = 0; i < imagePathList.length; i++) {
        let data = imagePathList[i];

        if(fs.existsSync(data + "\\" + name)){
          let fileList = fs.readdirSync(data + "\\" + name);
          if (fileList.length === 0){continue;}

          let x = Math.floor((Math.random() * fileList.length));
          switch (path.extname(fileList[x])) {
            case ".jpg":
              response.setHeader("Content-Type", "image/jpeg");
              response.status = 200;
              break;
            case ".png":
              response.setHeader("Content-Type", "image/png");
              response.status = 200;
              break;
            default:
              continue;
          }
          response.end(fs.readFileSync(data + "\\" + name + "\\" +fileList[x]));
          return;
        }
      }
      response.setHeader("Content-Type", "image/jpeg");
      response.status = 200;
      response.end(fs.readFileSync(".\\no-image.jpg"));
      return;
    case "/api/refreshCollection":

      if (fs.existsSync(".\\collectionDB.json")){
        let data = JSON.parse(fs.readFileSync(".\\collectionDB.json", 'utf8'));

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].list.length; j++) {
            let month = data[i].list[j];
            for (let k = 0; k < month.list.length; k++) {
              let anime = month.list[k].name;
              let maxNumber = 0;
              let fileList = [];
              for (let i = 0; i < sourcePathList.length; i++) {
                let data = sourcePathList[i];
                let path = data + "\\" + anime + "\\";
                if(month.list[k].season){
                  path += "\\" + month.list[k].season
                }

                if (fs.existsSync(path)) {
                  fileList = [...new Set(fileList.concat(fs.readdirSync(path)))];
                }
              }
              let rollRegex = /\[[0-9][0-9]\]/;
              for (let l = 0; l < fileList.length; l++) {
                let myArray = rollRegex.exec(fileList[l]);

                if(myArray){
                  let number = parseInt(myArray[0].substring(1,myArray[0].length - 1));
                  if (number > maxNumber ){
                    maxNumber = number;
                  }
                }
              }
              month.list[k].roll = maxNumber;
            }
          }
        }

        fs.writeFileSync(".\\collectionDB.json", JSON.stringify(data), 'utf8');
        json = JSON.stringify({"status":"success"});
      }
      break;
    case "/api/get":
      json = getFile(query);
      break;
    case "/api/add":
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
    case "/api/remove":

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
    case "/api/add/folder":
        if (query.name !== undefined){
          if (!fs.existsSync(sourcePathList[1] + "\\" + query.name)){
            fs.mkdirSync(sourcePathList[1] + "\\" + query.name);
          }
        }
      json = JSON.stringify({"status":"success"});
      break;
    case "/api/start":
      db = JSON.parse(fs.readFileSync(".\\db.json", 'utf8'));

      for (let sourcePath of sourcePathList) {
        let fileList = fs.readdirSync(sourcePath);
        let extensionRegExp = RegExp(/\./);

        for (let file of fileList) {
          if (extensionRegExp.exec(file.toString())) {
            for (let dbKey in db) {
              if (!db.hasOwnProperty(dbKey)){
                continue;
              }

              let stringList = db[dbKey];
              for (let stringListKey in stringList) {
                if (!stringList.hasOwnProperty(stringListKey)){
                  continue;
                }
                if(file.includes(stringList[stringListKey])){

                  if (!fs.existsSync(sourcePath + "\\" + dbKey)){
                    fs.mkdirSync(sourcePath + "\\" + dbKey);
                  }

                  fs.renameSync(sourcePath + "\\" + file,sourcePath + "\\" + dbKey+ "\\" + file );
                }
              }
            }
          }
        }

        json = JSON.stringify({"status":"success"});
      }
      break;
    case "/":
    case "/collection":
      json  = fs.readFileSync("./dist/index.html",'utf8');
        break;
    default:
      let getPath = url.split("?")[0];
      if (fs.existsSync(".\\dist\\" + getPath)){
        json  = fs.readFileSync(".\\dist\\" + getPath, 'utf8');
      }

      let extension = path.extname(getPath);
      switch (extension) {
        case ".css":
          response.writeHead(200, {"Content-Type": "text/css; charset=utf-8"});
          break;
        default:
          response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      }
  }
  response.end(json);
};

const server = http.createServer(requestHandler);

server.listen(3000);
console.log("start in " + "http://127.0.0.1:3000");

exec.exec('start "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" http://127.0.0.1:3000/');

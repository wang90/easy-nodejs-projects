const http = require('http');
const url = require("url");
const path = require("path");
const fs = require("fs");
const qs = require("querystring");

const notFount = (req,res) =>{
    console.log(404)
    fs.readFile(path.join(__dirname,'404.html'),(err, data)=>{
        if (err) {
            res.write(404,'not found');
        } else {
            res.writeHead(404,{'Content-Type':'text/html;charset="utf--8"'});
            res.write(data);
            res.end();
        }
    })
}
const writeDb = (chunk)=>{
    fs.appendFile(path.join(__dirname,'db'),chunk,err=>{
        if(err) throw err;
        console.log("db insert")
    })
}
http.createServer((req,res) =>{
    // 路由处理
    // 静态资源托管
    // 可以处理http的动词
    // 可以是持久化数据

    let pathName = url.parse(req.url).pathname;

    // api 
    if(pathName.startsWith("/api")){
        const method = req.method;
        if (method === 'GET') {
            const query = qs.parse(url.parse(req.url).query)
            const resData = {
                "code":200,
                "msg":"success",
                "data":query,
            }
            res.end(JSON.stringify(resData));
        }
        if (method === 'POST') {
            console.log('post');
            const contentType = req.headers['content-type']
            console.log(contentType)
            if (contentType === 'application/json'){
                let postData = '';
                req.on('data',chunk=>{
                    postData += chunk;
                    writeDb(chunk)
                })
                req.on('end',()=>{
                    res.end(postData)
                });
            }
        }
    }


    if (pathName === '/'){
        pathName = path.join(__dirname,"index.html");
    }

    const extName = path.extname(pathName);

    if (extName === '.html'){
        // index.html
        fs.readFile(pathName,(err,data)=>{
            if (err){
                // 404
                console.log(404)
                notFount(req,res);
            } else {
                res.writeHead(200,{'Content-Type':'text/html;charset="utf--8"'});
                res.write(data);
                res.end();
            }
        });
    } 
}).listen(8000,()=>{
    console.log("listen is run 8000")
})
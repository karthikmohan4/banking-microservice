const http = require("http");

http.createServer((req,res)=>{
res.writeHead(200,{"Content-Type":"application/json"});
res.end(JSON.stringify({
    message:"hello api gateway",
    url:req.url,
    headers:req.headers
}));
}).listen(3001);
console.log("auth service running on port 3001");
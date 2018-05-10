const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const mongoClient = require("mongodb").MongoClient;

const dbUrl = "mongodb://localhost:27017";

const mimeTypes = {
    ".txt": "text/plain",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".ico": "image/x-icon"
};

const server = http.createServer();

const port = process.env.PORT || 3000;

mongoClient.connect(dbUrl, (err, client) => {
    let db = client.db("grader");
    requestHandler(db);
});

function requestHandler (db) {
    server.on("request", (req, res) => {
        console.log(req.url);
        switch (req.method) {
            case "GET":
                if (req.url === "/") {
                    loadFile("text/html", "/index.html", res);
                } else if (req.url === "/cities") {
                    db.collection("cities").find({}).toArray((err, arr) => {
                        if (err) console.error(err);
                        res.writeHead(200, { "Content-Type": "application/json"})
                        res.end(JSON.stringify(arr));
                    });
                } else if (path.extname(req.url)) {
                    loadFile(mimeTypes[path.extname(req.url)], req.url, res);
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(`{ data: "test" }`);
                }
                break;
            default:
                res.writeHead(400, { "Content-Type": "text/plain"});
                res.end("Bad request");
                break;
        }
    });
    server.on("close", () => {
        client.close();
    });
}

/**
 * Send response message with file. If failed sends error message.  
 * @param {string} mimeType example "text/html"
 * @param {*} filePath local file path or just its name 
 * @param {*} res path through res object to send file in it 
 */
function loadFile(mimeType, filePath, res) {
    res.writeHead(200, { "Content-Type": mimeType });
    fs.readFile(__dirname + "/public" + filePath, (err, fileData) => {
        if (err) {
            console.error(err);
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("Nothing was found");
            return;
        }
        res.end(fileData);
    });
}

function loadData() {
    
}

server.listen(port, () => {
    console.info(`Server started on ${port}`);
});
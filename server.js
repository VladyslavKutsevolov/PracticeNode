const http = require("http");
const services = require("./services");
const url = require("url");
const jsonBody = require("body/json");
const fs = require("fs");
const formidable = require("formidable");

const PORT = process.env.PORT || 3000;

const server = http.createServer();

server.on("request", (req, res) => {
  req.on("request", err => {
    console.error("request error");
  });
  res.on("response", err => {
    console.error("response error");
  });

  const parsedUrl = url.parse(req.url, true);
  if (req.method === "GET" && parsedUrl.pathname === "/metadata") {
    const { id } = parsedUrl.query;
    const metadata = services.fetchImageMetadata(id);
    res.writeHeader(200, { "Content-Type": "application/json" });
    const serialized = JSON.stringify(metadata);
    res.end(serialized);
  } else if (req.method === "POST" && parsedUrl.pathname === "/users") {
    jsonBody(req, res, (err, body) => {
      if (err) {
        console.log(err);
      } else {
        services.createUser(body[0].name);
      }
    });
  } else if (req.method === "POST" && parsedUrl.pathname === "/upload") {
    const form = new formidable.IncomingForm({
      uploadDir: __dirname,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 10 * 1024 * 1024
    });
    form
      .parse(req)
      .on("fileBegin", (name, file) => {
        console.log("Our upload has started!");
      })
      .on("file", (name, file) => {
        console.log("Field + file pair has been received");
      })
      .on("field", (name, value) => {
        console.log("Field received:");
        console.log(name, value);
      })
      .on("progress", (bytesReceived, bytesExpected) => {
        console.log(bytesReceived + " / " + bytesExpected);
      })
      .on("error", err => {
        console.error(err);
        req.resume();
      })
      .on("aborted", () => {
        console.error("Request aborted by the user!");
      })
      .on("end", () => {
        console.log("Done - request fully received!");
        res.end("Success!");
      });
  } else {
    fs.createReadStream("./index.html").pipe(res);
  }
});
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

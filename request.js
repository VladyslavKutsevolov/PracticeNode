const http = require("http");

const data = JSON.stringify({
  user: "Abram"
});

const opt = {
  hostname: "localhost",
  port: 3000,
  path: "/users",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

const req = http.request(opt, res => {
  console.log(`status code: ${res.statusCode}`);
  console.log(res.headers);

  res.on("data", chunk => {
    console.log(chunk.toString());
  });
});

req.on("error", err => {
  console.log(err);
});

req.end(data);

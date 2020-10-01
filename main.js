const settings = require('./settings.json');

const key = settings.key;

const https = require("https");
const Stream = require("stream").Transform;
const fs = require("fs");

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

let date = "";
readline.question('Enter date(YYYY-MM-DD):', date_ => {
    date += date_;
    https
    .get(`https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`, resp => {
        let data = "";

        resp.on("data", chunk => {
            data += chunk;
        });

        resp.on("end", () => {
            let parsed = JSON.parse(data);
            let title = parsed.title;
            let url = parsed.hdurl;
            console.log(`${title}: ${url}`);

            https.get(url, res => {
                console.log(res.headers);
                console.log(res.headers["content-type"], res.headers["content-length"]);
                let content_type = res.headers["content-type"];

                if (
                    res.statusCode == 200 &&
                    (content_type == "image/jpeg" || content_type == "image/gif" || content_type == "image/png")
                ) {
                    let ext = res.headers["content-type"].substring(6);
                    let img = new Stream();

                    res.on("data", chunk => {
                        img.push(chunk);
                    });

                    res.on("end", () => {
                        let path = `${__dirname}/img/`;
                        if (!fs.existsSync(path)) {
                            fs.mkdirSync(path);
                        }
                        let filename = `${path}/apod_${date}.${ext}`;
                        fs.writeFileSync(filename, img.read());
                    });
                }
            });
        });
    })
    .on("error", err => {
        console.log(`Error: ${err.message}`);
    });
    readline.close();
});
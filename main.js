const settings = require('./settings.json');

const key = settings.key;

const https = require("https");

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
        });
    });
});
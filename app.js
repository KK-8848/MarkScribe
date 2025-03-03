const express = require("express");
const app = express();
const port = 3007;
const fs = require("fs");
const marked = require('marked');

const showdown = require('showdown');

const markdownString = "< person > K  </person>";
const converter = new showdown.Converter();
const html = converter.makeHtml(markdownString);
console.log(html)

if (html !== '') { // or check for specific HTML tags/structure
    console.log('The string is in Markdown format');
} else {
    console.log('The string is not in Markdown format');
}
const markdownIt = require('markdown-it');
const md = markdownIt();

const markdownText = "<person>K</person>";
const parsedHtml = md.render(markdownText);
console.log(!md);
console.log(parsedHtml);

// Validate the parsed HTML against a schema or expected output
// For example, ensure the HTML has a specific structure or contains certain elements
const readlineSync = require('readline-sync');
let data = "";
app.use(require('express-useragent').express());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', true);


app.get("/", (req, res) => {
    res.render('namaskara');
})
app.get("/exercise-2", (req, res) => {
    res.redirect("/exercise-2-redirected");
})
app.get("/exercise-2-redirected", (req, res) => {
    res.render('exercise-2.ejs');
})
app.get("/exercise-3", (req, res) => {

    res.render("exercise-3.ejs");
})
app.get('/exercise-3/result', (req, res) => {
    const query = req.query.string;
    res.render('result.ejs', { query });
})
app.get("/exercise-4", (req, res) => {


    res.render('exercise-4');
})
let query = '';
let lines = '';
app.post('/exercise-4/result', (req, res) => {
    const IP = req.ip;
    const browser = req.useragent.browser;
    const requestTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const obj = { IP, browser, requestTime, data };
    const pageno = req.query.page || 1;
    const start = (pageno - 1) * 10;
    let fileContent = '';
    try {
        fileContent = fs.readFileSync('search.csv', 'utf-8')
    } catch (err) {
        console.log(err);
    }
    console.log(fileContent);
    lines = fileContent.split('\n');
    console.log(lines);
    const totalPages = Math.ceil(lines.length / 10);
    const end = Math.min(start + 10, lines.length);
    paginatedLines = lines.slice(start, end);
    L = paginatedLines.map(line => line.split(','));
    if (req.body.clear) {
        fs.writeFile("search.csv", "", (err) => {
            if (err) {
                console.log(err);
            } else
                console.log("File deleted");
        })
        res.redirect("/exercise-4/result");
    } else {

        query = req.body.string;
        console.log(query)
        if (query == "") {
            res.redirect("/exercise-4");
        } else {
            data = query;
            newLine = [IP, browser, requestTime, data];
            res.render('search.ejs', { query, lines: L, totalPages, pageno });
            fs.appendFile("search.csv", newLine + "\n", (err) => {
                if (err) throw err;
            })
        }
    }
})
app.get("/exercise-4/result", (req, res) => {
    res.render('search.ejs', { query, lines: [], pageno: 1, totalPages: 1 })
})


module.exports= app;
//app.listen(port, () => { console.log("Server is running") })

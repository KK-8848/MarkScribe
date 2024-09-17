const express = require("express");
const app = express();
const port = 3008;
const fs = require("fs");
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
app.get(
    "/exercise-4", (req, res) => {
        const pageno = req.query.page || 1;
        const start = (pageno - 1) * 10;
        let fileContent = '';
        try {
            fileContent = fs.readFileSync('search.csv', 'utf-8')
        } catch (err) {
            console.log(err);
        }
        console.log(fileContent);
        const lines = fileContent.split('\n');
        console.log(lines);
        const totalPages = Math.ceil(lines.length / 10);
        const end = Math.min(start + 10, lines.length);
        paginatedLines = lines.slice(start, end);

        res.render('exercise-4.ejs', { lines: paginatedLines, totalPages, pageno });
    })
app.post('/exercise-4/result', (req, res) => {
    const IP = req.ip;
    const browser = req.useragent.browser;
    const requestTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const obj = { IP, browser, requestTime, data };
    if (req.body.clear) {
        fs.writeFile("search.csv", "", (err) => {
            if (err) {
                console.log(err);
            } else
                console.log("File deleted");
        })
        res.redirect("/exercise-4");
    } else {

        const query = req.body.string;
        if (query == "") {
            res.redirect("/exercise-4");
        }
        data = query;
        newLine = [IP, browser, requestTime, data];
        res.render('result.ejs', { query });
        fs.appendFile("search.csv", newLine + "\n", (err) => {
            if (err) throw err;
        })
    }
})


app.listen(port, () => { console.log("Server is running") })
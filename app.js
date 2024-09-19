const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const readlineSync = require('readline-sync');
const files = [];
app.use(require('express-useragent').express());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', true);
const markdown = require("markdown-it");
const md = markdown();
const he = require('he');


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
app.get("/Blogs", (req, res) => {
    const dirpath = path.join(__dirname, "markdownfiles");
    fs.readdir(dirpath, (err, files) => {
        if (err) throw err;
        else
            res.render('post.ejs', { files });
    });
})
app.get("/Blogs/post", (req, res) => {
    res.render('exercise-5.ejs');
})
app.post("/Blogs/submission", (req, res) => {
    const content = md.render(req.body.text);


    console.log(content);
    if (!content) {
        res.redirect('/Blogs/post');
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const filename = `${year}${month}${day}${hour}${minute}${second}.md`
    const filepath = path.join(__dirname, "markdownfiles", filename);
    console.log(filepath);
    fs.writeFile(filepath, content, (err) => {
        if (err) throw err;

    })
    files.push(filename);
    res.render("saved.ejs", { filename });
})
app.get("/Blogs/:filename", (req, res) => {
    const file = req.params.filename;
    console.log(file);
    const filepath = path.join(__dirname, "markdownfiles", file + ".md");
    fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) throw err;
        else {

            const content = he.decode(md.render(data));
            console.log(content);
            res.render('blog.ejs', { content });
        }
    })

})


app.listen(port, () => { console.log("Server is running") })
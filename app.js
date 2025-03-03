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
const markDown = require("markdown-it");
const md = markDown();
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
app.get("/blogs", (req, res) => {
    const dirpath = path.join(__dirname, "blogs", "markdown-files");
    fs.readdir(dirpath, (err, files) => {
        if (err) throw err;
        else
            res.render('post.ejs', { files });
    });
})
app.get("/blogs/post", (req, res) => {
    res.render('exercise-5.ejs');
})
app.post("/blogs/submission", (req, res) => {
    const mdContent = req.body.text;
    const content = md.render(req.body.text);


    console.log(content);
    if (!content) {
        res.redirect('/blogs/post');
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const fileName = `${year}${month}${day}${hour}${minute}${second}.md`
    const filePath = path.join(__dirname, "blogs", "markdown-files", fileName);
    console.log(mdContent);
    fs.writeFile(filePath, mdContent, (err) => {
        if (err) throw err;

    })
    const htmlFile = `${year}${month}${day}${hour}${minute}${second}.html`;
    const htmlPath = path.join(__dirname, "blogs", "html-files", htmlFile);
    fs.writeFile(htmlPath, content, (err) => {
        if (err) throw err;
        else
            console.log("file written");
    })
    res.render("saved.ejs", { fileName });
})
app.get("/blogs/:fileName", (req, res) => {
    const file = req.params.fileName;
    console.log(file);
    const filePath = path.join(__dirname, "blogs", "html-files", file + ".html");
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) throw err;
        else {

            // const content = he.decode(md.render(data));
            console.log(content);
            res.render('blog.ejs', { content });
        }
    })

})

module.exports= app;
//app.listen(port, () => { console.log("Server is running") })

app.listen(port, () => { console.log("Server is running") })
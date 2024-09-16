const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const readlineSync = require('readline-sync');
let item = "";
let csvData = [];



app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

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

    const fileContent = fs.readFileSync('search.csv', 'utf-8');
    const lines = fileContent.split('\n');

    res.render('exercise-3.ejs', { lines });
})
app.post('/exercise-3', (req, res) => {
    if (req.body.clear) {
        fs.writeFile("search.csv", "", (err) => {
            if (err) {
                console.log(err);
            } else
                console.log("File deleted");
        })
        res.redirect("/exercise-3");
    } else {

        const query = req.body.string;

        newLine = query;
        res.render('result.ejs', { query });

        fs.appendFile("search.csv", newLine + "\n", (err) => {
            if (err) throw err;
            console.log("Saved to CSV");
        })
    }
})


app.listen(port, () => { console.log("Server is running") })
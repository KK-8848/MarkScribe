const express = require("express");
const app = express();
const port = 3000;
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
    res.render('exercise-3.ejs');
})
app.get('/result', (req, res) => {
    const query = req.query.string;


    res.render('result.ejs', { query });
});

app.listen(port, () => { console.log("Server is running") })
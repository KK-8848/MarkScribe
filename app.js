const express = require("express");
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('namaskara');
})
app.get("/exercise-2", (req, res) => {
    res.redirect("/exercise-2-redirected");
})
app.get("/exercise-2-redirected", (req, res) => {
    res.send("REDIRECTED")
})
app.listen(port, () => { console.log("Server is running") })
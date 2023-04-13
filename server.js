require("dotenv").config()
const mongoose = require('mongoose');
const express = require("express")
const app = express()
const routes = require("./routes");
const path = require("path")

app.use(express.json())
app.use(routes)
app.use(express.static('build'))

app.get("*", (req, res) => {
    console.log(path.join(__dirname, "./build/index.html"));
    res.sendFile(
        path.join(__dirname, "./build/index.html")
    );
});

mongoose.connect(process.env.MONGO_SECRET).then(a => {
    app.listen(process.env.PORT || 8000)
}).catch(error => {
    console.log({ error });
})
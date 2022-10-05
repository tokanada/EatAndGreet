require('dotenv').config();
const dbUri = process.env.DBURI;

const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes/routes")

const app = express();
app.use(express.json());

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("Connected successfully");
});
app.use(Router);

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
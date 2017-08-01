const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const app = express()
const expressValidator = require("express-validator")
const fs = require("fs") //is a built in mod that comes for free with node but is not require by default

app.engine("mustache", mustacheExpress())

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n")

app.set("views", "./templates")
app.set("view engine", "mustache")
app.use(express.static("public"))
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.render("index")
})

app.listen(3000, () => {
  console.log(words)
  console.log("I've got the magic in me!")
})

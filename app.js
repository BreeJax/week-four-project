const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const app = express()
const expressValidator = require("express-validator")
const expressSession = require("express-session")
const fs = require("fs") //is a built in mod that comes for free with node but is not require by default

app.engine("mustache", mustacheExpress())

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n")

app.set("views", "./templates")
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  let randomWord = words[Math.floor(Math.random() * words.length)]
  let PLACEHOLDER = "_"
  let hiddenWord = randomWord
    .split("")
    .map(letter => {
      return PLACEHOLDER
    })
    .join("")

  //where word is chosen
  //make underscores

  res.render("index", { hiddenWord: hiddenWord })
})
//where would I send people are guess is wrong? post?
//where do I show wrong guesses

app.post("/", (req, res) => {
  //wher the guesses go
  //where you put the page that tells people if they win
  //where you put the page that tells people if they lose
})

app.listen(3000, () => {
  console.log("I've got the magic in me!")
})

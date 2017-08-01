const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const expressSession = require("express-session")
const fs = require("fs") //is a built in mod that comes for free with node but is not require by default

const app = express()

app.use(
  expressSession({
    secret: "NoLove",
    resave: false,
    saveUninitialized: true
  })
)

app.engine("mustache", mustacheExpress())

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n")

app.set("views", "./templates")
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  const letterGuess = req.session.letterGuess || [] //part of sessions
  //where random word is chosen
  if (!req.session.randomWord) {
    req.session.randomWord = words[Math.floor(Math.random() * words.length)]
  }
  let randomWord = req.session.randomWord
  let PLACEHOLDER = "_"
  let hiddenWord = randomWord
    .split("")
    .map(letter => {
      return letterGuess.includes(letter) ? letter : PLACEHOLDER
    })
    .join("")

  res.render("index", { hiddenWord: hiddenWord, letterGuessed: req.session.letterGuess })
})
//where would I send people are guess is wrong? post?
//where do I show wrong guesses

// app.post("/", (req, res) => {
//   //wher the guesses go
//   //where you put the page that tells people if they win
//   //where you put the page that tells people if they lose
// })

app.post("/guess", (req, res) => {
  const letterGuess = req.session.letterGuess || []
  const randomWord = req.session.randomWord || []

  // letters.push({ id: todos.length + 1, completed: false, description: description })
  letterGuess.push(req.body.letterGuess)
  req.session.letterGuess = letterGuess

  res.redirect("/")
})

app.listen(3000, () => {
  console.log("I've got the magic in me!")
})

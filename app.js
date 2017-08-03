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
  const letterGuess = req.session.letterGuess || [] //part of sessions- keeping the letters guessed before
  let numberWrong = req.session.numberWrong || 8 //keeping the number of guesses in sessions

  if (!req.session.randomWord) {
    //if there is NOT a random word
    req.session.randomWord = words[Math.floor(Math.random() * words.length)] //choose a random word
  }
  let randomWord = req.session.randomWord //random word is the one in session
  let PLACEHOLDER = "_"
  let hiddenWord = randomWord //hidden word is the same as the random word
    .split("") //taking the word appart
    .map(letter => {
      //mapping out the word and finding everything inside of it and where it lays
      return letterGuess.includes(letter) ? letter : PLACEHOLDER //if the letter guessed IS in it, place the letter, otherwise place a PLACEHOLDER
    })
    .join("") //join together the results

  res.render("index", { hiddenWord: hiddenWord, letterGuessed: req.session.letterGuess, numberWrong: numberWrong })
})

app.post("/easy", (req, res) => {})

app.post("/guess", (req, res) => {
  const letterGuess = req.session.letterGuess || []
  const randomWord = req.session.randomWord || []
  let numberWrong = req.session.numberWrong || 8

  letterGuess.push(req.body.letterGuess)
  req.session.letterGuess = letterGuess
  let countOfMatches = randomWord.split("").filter(letter => {
    return letter === req.body.letterGuess
  }).length

  if (countOfMatches == 0) {
    numberWrong -= 1
  }

  req.session.numberWrong = numberWrong

  // calculate the number of _
  let PLACEHOLDER = "_"
  let countOfPlaceHolders = randomWord //hidden word is the same as the random word
    .split("") //taking the word appart
    .map(letter => {
      //mapping out the word and finding everything inside of it and where it lays
      return letterGuess.includes(letter) ? letter : PLACEHOLDER //if the letter guessed IS in it, place the letter, otherwise place a PLACEHOLDER
    })
    .filter(letter => {
      return letter === PLACEHOLDER
    }).length

  if (numberWrong === 0) {
    req.session.destroy()
    res.render("youlose")
  } else if (numberWrong >= 1 && countOfPlaceHolders === 0) {
    req.session.destroy()
    res.render("youwin")
  } else {
    res.redirect("/")
  }
})

app.listen(3000, () => {
  console.log("I've got the magic in me!")
})

require('dotenv').config()

import express, { Application } from "express";
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import session from 'express-session'
const MongoStore = require("connect-mongo")(session)

import passport from './passport'

import AuthRouter from './routes/auth.routes'
import UserRouter from './routes/user.routes'

const app: Application = express();
const port = 5000 || process.env.PORT;
const uri = process.env.DB_URI as string

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  return console.log(`Successfully connected to database`)
})
.catch(error => {
  console.log("Error connecting to database: ", error)
  return process.exit(1)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", AuthRouter)
app.use('/user', UserRouter)

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

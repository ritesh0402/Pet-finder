const express=require('express')
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const path=require('path')
const app=express();
const passport=require('passport')
const session=require('express-session')
const MongoStore = require('connect-mongo')

//Load Config
dotenv.config({path:'./config/.env'})

//Passport Config
require('./config/passport')(passport)
//passport is passed as a arguement

//Ejs
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')

//Express Session
app.use(session({
  secret: 'harsh',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  })
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


//Static Files
app.use(express.static('public'))

//Connect to DB
connectDB()

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))



//Start Server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>
{
  console.log("Server up and running")
})
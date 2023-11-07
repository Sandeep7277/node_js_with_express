//Import Packages
const express=require('express'); //return a method
const fs=require('fs'); //return an object module
const morgan=require('morgan')
const movieRouter=require('./Routes/moviesRoutes')

let app= express();//Call Express() method

//Custom Middleware
const logger=function(req,res,next){
    console.log('Custom middleware is called');
    next();
}

app.use(express.json()); //use middleware
app.use(express.static('./public'))
app.use(morgan('dev')); //morgan middleware called
app.use(logger); //custom middleware called
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next();
})//custom middleware where date is added in req parameter
app.use('/api/v1/movies',movieRouter);//Using Routes

module.exports =app;




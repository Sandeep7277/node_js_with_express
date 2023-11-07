const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const app=require('./app')
const mongoose=require('mongoose');

//Connecting MongoDb with Express.Js
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
    }).then((conn)=>{
    console.log(conn);
    console.log('DB Connection Successful');
}).catch((error)=>{
    console.error('Some error has occured '+error);
});

//Creating Simple Schema
// const movieSchema=new mongoose.Schema({
//     name:String,
//     description:String,
//     duration:Number,
//     rating:Number
// });

const movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required field!'],
        unique:true
    },
    description:String,
    duration:{
        type:Number,
        required:[true,'Duration is required field!']
    },
    rating:{
        type:Number,
        default:1.0,
        max: [5, 'Must be less than 5, got {VALUE}']
    }
});

//Creating Model based on schema
const Movie=mongoose.model('Movie',movieSchema);

//Creating document from model
const testMovie=new Movie({
    name:'Ram',
    description:'Action packed movie of sunny deol',  
    duration:120,
    rating:4.4
});

//Save movie document in database
testMovie.save().then(doc=>{
    console.log(doc);
}).catch(err=>{
    console.log('Error occured '+err);
});





// console.log(app.get('env'));
// console.log(process.env);

//Create Server
// const port=3000;
const port=process.env.PORT||3000;
app.listen(port, ()=>{
    console.log('Server has started...');
})

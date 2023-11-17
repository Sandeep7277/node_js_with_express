const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const app=require('./app')
const mongoose=require('mongoose');

//Connecting MongoDb with Express.Js
mongoose.connect(process.env.CONN_STR,{
    // useNewUrlParser:true
    }).then((conn)=>{
    console.log(conn);
    console.log('DB Connection Successful');
}).catch((error)=>{
    console.error('Some error has occured '+error);
});

// console.log(app.get('env'));
// console.log(process.env);

//Create Server
// const port=3000;
const port=process.env.PORT||3000;
app.listen(port, ()=>{
    console.log('Server has started...');
})

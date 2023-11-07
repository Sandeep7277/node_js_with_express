const fs=require('fs');

//Read file and convert into javascript object
let movies = JSON.parse(fs.readFileSync('./data/movies.json')); 

exports.checkId = (req,res,next,value)=>{
    console.log('Movie ID is '+value);
    //Find movie based on id parameter
    let movie=movies.find(el=> el.id===value*1);
    //Send Error msg & status 404 if movie not found
    if(!movie){
        return res.status(404).json({
            Status:"Fail",
            Message:"Movie with ID "+value+" is not found"
        })
    }
    next();
}

//Validate Body of Request when sent a post request
exports.validateBody=(req,res,next)=>{
    console.log(req.body.name +' and '+ req.body.releaseyear);
if(!req.body.name || !req.body.releaseyear){
    return res.status(400).json({
        Status:'Fail',
        Message:'Not a valid movie data'
    });
}
next();
}

//Refactor the above API with ROUTE HANDLER FUNCTIONS
//GET All MOVIES
exports.getAllMovies=(req,res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,
        count:movies.lemgth,
        data:{
            movies:movies
        }
    })
}

//GET SINGLE MOVIES
exports.getmovie=(req,res)=>{
    //Fetch and convert id string to number type
    const id=req.params.id*1; //or const id= +req.params.id;
    //Find movie based on id parameter
    let movie=movies.find(el=> el.id===id);
    //Send Error msg & status 404 if movie not found
    // if(!movie){
    //     return res.status(404).json({
    //         Status:"Fail",
    //         Message:"Movie with ID "+id+" is not found"
    //     })
    // }
    //Sending movie as response
    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
}

//POST MOVIE
exports.createMovie=(req,res)=>{
    const newId=movies[movies.length - 1].id + 1;
    // console.log(req.body);
    // console.log(newId);
    const newMovie=Object.assign({id:newId},req.body);
    movies.push(newMovie);
    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err)=>{
        res.status(201).json({
            status:'Success',
            data:{
                movie:newMovie
            }
        })
    })
}

//PATCH MOVIE
exports.updateMovie=(req,res)=>{
    //Fetch Id and convert into number type
    let id=req.params.id *1;
    //Find movie which has to update
    let movieToUpdate=movies.find(el=>el.id===id);

    //Return Error 404 if movie is not found
    // if(!movieToUpdate){
    //     return res.status(404).json({
    //         Status:'fail',
    //         Message:'No movie object with ID '+id+' is found'
    //     })
    // }
    //find index no of mivie object which has to update
    let index = movies.indexOf(movieToUpdate);
    //Update movie object with req.body object properties
    Object.assign(movieToUpdate, req.body);
    //Set movie object in movies array 
    movies[index]=movieToUpdate;
    //write updated movies array to movies.json file
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(200).json({
            ststus:'Success',
            data:{
                movie:movieToUpdate
            }
        })
    })
}

//DELETE MOVIE
exports.deleteMovie=(req,res)=>{
    //fetch id and convert into Number type
    let id = req.params.id*1;
    //Find Movie which has to delete
    let movieToDelete = movies.find(el=>el.id===id);
    //Return Error 404 if movie is not found
    // if(!movieToDelete){
    //     return res.status(404).json({
    //         Status:'fail',
    //         Message:'No movie object with ID '+id+' is found to delete'
    //     })
    // }
    //find index no where to delete movie
    let index=movies.indexOf(movieToDelete);
    //delete movie from movies array
    movies.splice(index,1);
    //write updated movies array to movies.json file
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(204).json({
            ststus:'Success',
            data:{
                movie:null
            }
        })
    })   
}
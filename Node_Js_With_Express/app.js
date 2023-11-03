//Import Packages
const express=require('express'); //return a method
const fs=require('fs'); //return an object module

let app= express();//Call Express() method
let movies = JSON.parse(fs.readFileSync('./data/movies.json')); //Read file and convert into javascript object

app.use(express.json()); //use middleware

/* 
//Basic API CREATEION
//GET - api/v1/movies Request
app.get('/api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.lemgth,
        data:{
            movies:movies
        }
    })
})

//GET - api/v1/movies/:id Request
app.get('/api/v1/movies/:id?',(req,res)=>{
    //Fetch and convert id string to number type
    const id=req.params.id*1; //or const id= +req.params.id;
    //Find movie based on id parameter
    let movie=movies.find(el=> el.id===id);
    //Send Error msg & status 404 if movie not found
    if(!movie){
        return res.status(404).json({
            Status:"Fail",
            Message:"Movie with ID "+id+" is not found"
        })
    }
    //Sending movie as response
    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
})

//POST - api/v1/movies
app.post('/api/v1/movies', (req,res)=>{
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
})

//PATCH - api/v1/movies/id
app.patch('/api/v1/movies/:id', (req,res)=>{
    //Fetch Id and convert into number type
    let id=req.params.id *1;
    //Find movie which has to update
    let movieToUpdate=movies.find(el=>el.id===id);

    //Return Error 404 if movie is not found
    if(!movieToUpdate){
        return res.status(404).json({
            Status:'fail',
            Message:'No movie object with ID '+id+' is found'
        })
    }
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
})

//Delete - api/v1/movies/:id
app.delete('/api/v1/movies/:id',(req,res)=>{
    //fetch id and convert into Number type
    let id = req.params.id*1;
    //Find Movie which has to delete
    let movieToDelete = movies.find(el=>el.id===id);
    //Return Error 404 if movie is not found
    if(!movieToDelete){
        return res.status(404).json({
            Status:'fail',
            Message:'No movie object with ID '+id+' is found to delete'
        })
    }
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
})
*/

//Refactor the above API with ROUTE HANDLER FUNCTIONS
//GET All MOVIES
const getAllMovies=(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.lemgth,
        data:{
            movies:movies
        }
    })
}

//GET SINGLE MOVIES
const getmovie=(req,res)=>{
    //Fetch and convert id string to number type
    const id=req.params.id*1; //or const id= +req.params.id;
    //Find movie based on id parameter
    let movie=movies.find(el=> el.id===id);
    //Send Error msg & status 404 if movie not found
    if(!movie){
        return res.status(404).json({
            Status:"Fail",
            Message:"Movie with ID "+id+" is not found"
        })
    }
    //Sending movie as response
    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
}

//POST MOVIE
const createMovie=(req,res)=>{
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
const updateMovie=(req,res)=>{
    //Fetch Id and convert into number type
    let id=req.params.id *1;
    //Find movie which has to update
    let movieToUpdate=movies.find(el=>el.id===id);

    //Return Error 404 if movie is not found
    if(!movieToUpdate){
        return res.status(404).json({
            Status:'fail',
            Message:'No movie object with ID '+id+' is found'
        })
    }
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
const deleteMovie=(req,res)=>{
    //fetch id and convert into Number type
    let id = req.params.id*1;
    //Find Movie which has to delete
    let movieToDelete = movies.find(el=>el.id===id);
    //Return Error 404 if movie is not found
    if(!movieToDelete){
        return res.status(404).json({
            Status:'fail',
            Message:'No movie object with ID '+id+' is found to delete'
        })
    }
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
/*
//Call ROUTE HANDLER FUNCTION
app.get('/api/v1/movies',getAllMovies);
app.get('/api/v1/movies/:id?',getmovie);
app.post('/api/v1/movies',createMovie);
app.patch('/api/v1/movies/:id',updateMovie);
app.delete('/api/v1/movies/:id',deleteMovie);
*/

//Call ROUTE HANDLER FUNCTION WITH CHAINING
app.route('/api/v1/movies')
        .get(getAllMovies)
        .post(createMovie)

app.route('/api/v1/movies/:id')
        .get(getmovie)
        .patch(updateMovie)
        .delete(deleteMovie)



const port=3000;
app.listen(port, ()=>{
    console.log('Server has started...');
})



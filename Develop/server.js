const express = require('express');
const path = require('path');
const DB = require('./db/db.json');
//work with file system on your computer
const fs = require('fs');

const PORT = process.env.PORT || 3001;

var IDofNote = 1;

// Creates an Express application.The express() function is a top-level function exported by the express module.
const app = express();

//Middleware for parsing application/json and urlencoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set static folder
app.use(express.static('public'));

//get root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//get notes file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//Get all notes
app.get('/api/notes', (req, res) => {
    //the default is index 0
    //the array in db.json file started from index 1
    res.json(DB.slice(1));
});
function addNote(dbJSONObject, dbJSON) {
    //assgin id to the object
    dbJSONObject.id = IDofNote;
    IDofNote++;
    //add to the db.json file
    dbJSON.push(dbJSONObject);
    //updatd the db.json file
    fs.writeFileSync(path.join(__dirname, './db/db.json'),JSON.stringify(dbJSON));
    return dbJSONObject;
}

app.post('/api/notes', (req, res) => {
    //req.body return the object 
    res.json(addNote(req.body, DB));
});

function deleteNote(id, dbJSON) {
    for (let i = 0; i < dbJSON.length; i++) {
        //if match the id
        if (dbJSON[i].id == id) {
            console.log("Note id "+dbJSON[i].id +" Deleted, with note title ("+dbJSON[i].title+") with Note Text ("+dbJSON[i].text+")");
            //removed
            dbJSON.splice(i, 1);
            IDofNote--;
            //updatd the db.json file
            fs.writeFileSync(path.join(__dirname, './db/db.json'),JSON.stringify(dbJSON));
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    //req.params contains route parameter id
    //capture the values specified at their position in the URL
    deleteNote(req.params.id, DB);
    res.json(true);
});

app.listen(PORT, () => console.log('Connected to port 3001!'));
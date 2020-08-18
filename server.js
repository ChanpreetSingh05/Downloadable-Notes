const express = require("express");
const mongoose = require ("mongoose");
const say = require('say');
const app = express();
const notes = require("./models/notes");

const gtts = require('gtts.js').gTTS

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://chan:chan1234@cluster0-uqtcp.mongodb.net/Notes?retryWrites=true&w=majority",{
        useNewUrlParser: true, useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Connection Established..!");
  })
  .catch(() => {
    console.log("Connection Not Established..!");
  });


app.get('/', async (req, res) => {
    // const tinyURls= await tinyURl.find()
    const notesi = await notes.find();
    
    res.status(200).render('index', {notes: notesi});
});

app.post('/notes', async (req, res) => {
   await notes.create({ title: req.body.title, description: req.body.Desc })
    res.redirect('/');
});

app.get('/:noteid', async (req, res) => {
  const note= await notes.findOne({_id: req.params.noteid})
    
  if(note == null) return res.sendStatus(404);
  console.log(note);
  res.status(200).render('update', {notes: note});
});

app.post('/update/:id', async (req, res) => {
  // const update = { userid: id, status: status };
  var newvalues = { $set: {title: req.body.title, description: req.body.Desc } };
   await notes.updateOne({ _id: req.params.id }, newvalues);
      res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  notes.remove({
    _id: req.params.id}, function (err, user) {
    if (err)
      return console.error(err);

    console.log('User successfully removed from polls collection!');
    res.status(200).redirect('/');
  });
  // res.redirect('/');
});

app.get('/download/:noteid', async (req, res) => {
  console.log(req.params.id);
  const note =  await notes.findOne({_id: req.params.noteid})
    

  if(note == null) 
  {return res.sendStatus(404);}
  console.log(note);
  
  const text = "Your title is " + note.title + " and Description is " + note.description;
  const filename=  note.title +".mp3";
  
  const speech = new gtts(text);
  speech.save(filename)
        .then(function () {
          res.download(filename)
        }).catch(function (err) {
        
    })
 
  // res.sendStatus(200);
});

app.get('/speak/:noteid', async (req, res) => {
  console.log(req.params.id);
  const note =  await notes.findOne({_id: req.params.noteid})
    

  if(note == null) 
  {return res.sendStatus(404);}
  console.log(note);
  
  const text = "Your title is " + note.title + " and Description is " + note.description;
  say.speak(text);
  // res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var cookieParser = require('cookie-parser');
var session = require('express-session');


var db
var sess;

MongoClient.connect('mongodb://admin:passgen@ds229918.mlab.com:29918/passgen', (err, client) => {
  if (err) return console.log(err)
db = client.db('passgen') // whatever your database name is


app.listen(process.env.PORT || 3000, function () {
  console.log('listening on 3000')
})

})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: 'passgen'}, {cookie: { secure: false }}));



app.get('/', (req, res) => {
  res.render('index');
  // res.sendFile(__dirname + '/index.pug')
})

app.post('/register', (req, res) => {
  console.log(req.body)
  db.collection('users').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.post('/login', (req, res) => {  
  console.log(req.body)
  db.collection('users').find().toArray(function(err, results) {
    var length = results.length;
    for(var i=0; i<length; i++){
     if ((req.body.loginname === results[i].username) && (req.body.loginpass === results[i].password))
     {
      res.cookie('name',req.body.loginname);
      res.redirect('/dashboard')
      
      //req.session.uname = req.body.loginname;
    }
    }
       
  })
})

app.get('/dashboard', (req, res) => {

  db.collection('passwords').find({uname:req.cookies.name}).toArray(function(err, results) {
    res.render('dashboard',{passwords: results,user:req.cookies.name});
   // console.log(results);
    //console.log(req.cookies.name)
  // res.sendFile(__dirname + '/index.pug')
})
})

app.get('/error', (req, res) => {
  //res.render('dashboard');
   res.sendFile(__dirname + '/error.html')
})

app.post('/add', (req, res) => {
  db.collection('passwords').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/dashboard')
  })
})
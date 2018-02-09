const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const session = require('express-session');


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
app.use(session({secret: 'username'}));



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
  sess=req.session;
  
  console.log(req.body)
  db.collection('users').find().toArray(function(err, results) {
    var length = results.length;
    for(var i=0; i<length; i++){
     if ((req.body.loginname === results[i].username) && (req.body.loginpass === results[i].password))
     {
      res.redirect('/dashboard')
      sess.uname = req.body.loginname;
    }
    }
       
  })
})

app.get('/dashboard', (req, res) => {

  db.collection('passwords').find().toArray(function(err, results) {
    res.render('dashboard',{passwords: results});
   // console.log(results);
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      //console.log(object['url'])
      // for (var property in object) {
      //    // console.log('item ' + i + ': ' + property + '=' + object[property]);
      //     console.log(object['url'])
      // }
  }
  })
  // res.sendFile(__dirname + '/index.pug')
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
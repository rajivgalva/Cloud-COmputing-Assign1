const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('listening on 3000')
  })

  app.get('/', (req, res) => {
    res.render('index');
   // res.sendFile(__dirname + '/index.pug')
  })

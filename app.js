const express = require('express')
const path = require('path');

const app = express();

const port = 80;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, ()=>{
  console.log(`Server live on port ${port}` )
});

app.get('/', (req, res)=>{
  res.send('app home page')
});

// Route Files
let dtq = require('./routes/dtq');
app.use('/dtq', dtq)
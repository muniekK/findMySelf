const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const port = process.env.PORT || 80;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server live on port ${port}`)
});

app.get('/', (req, res) => {
  res.render('dtq');
});

// Route Files
let dtq = require('./routes/dtq');
app.use('/dtq', dtq)
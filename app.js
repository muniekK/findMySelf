const express = require('express')

const app = express();

const port = 80;

app.listen(port, ()=>{
  console.log(`Server live on port ${port}` )
});

app.get('/', (req, res)=>{
  res.send('hello')
});
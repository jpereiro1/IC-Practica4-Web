const express = require('express');
const app = express();
const path = require('path');

const publicPath = path.join(__dirname, 'public');

// Usa express.static con la ruta completa
app.use(express.static(publicPath));



app.get("/",function (request,response) {
  response.sendFile(path.join(__dirname,'/public/index.html'));
});

var listener = app.listen(9091, function (){
  console.log('Your app is listening on port ' + listener.address().port);
});
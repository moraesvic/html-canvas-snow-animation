const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendFile('index.html');
})

const PORT = 8080;

app.listen(PORT, function(req,res){
    console.log('Listening on port ' + PORT + '...');
});
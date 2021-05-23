const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendFile('index.html');
})

app.listen(3000, function(req,res){
    console.log('listening on port 3000');
});
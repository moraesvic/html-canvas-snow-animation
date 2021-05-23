const express = require('express');
const path = require('path')
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res){
    res.sendFile('index.html');
})

const PORT = process.env.PORT || 5000

app.listen(PORT, function(req,res){
    console.log('Listening on port ' + PORT + '...');
});
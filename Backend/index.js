const express = require('express');

const app = express();

const user = require('./database/users');


(async () => {
    
})()

user.registerUser('rafael@gmail.com', 'rafael123');

/*

const port = 2020
app.use(express.json())

app.get('/', (req, res) => {
    return res.json({'gggg': 'fgfgfg'});
})

app.listen(port, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('listening on port ' + port)
    }
})
*/
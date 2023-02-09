const express = require('express');

const app = express();

const user = require('./database/users');

/*
user.registerCredentials('rafael@gmail.com', 'rafael123');
user.registerCredentials('henrique_eduardo_souza@hotmail.com', 'henrique123');
user.registerCredentials('cef@usp.br', 'cef123');
*/

// console.log(user.autheticateCredentials('rafael@gmail.com', 'rafael123'));

user.autheticateCredentials('rafael@gmail.com', 'rafael123').then((response) => {
    console.log(response);
});

const port = 2020
app.use(express.json())

app.get('/users/:email/:password', (req, res) => {
    var auth = false;
    user.autheticateCredentials(req.params.email, req.params.password).then((response) => {
        auth = response;
        console.log('sdnsdnfj: ' + response);
        res.json({'email': req.params.email, 'password': req.params.password, 'authenticate': auth});
    });
    
})

app.listen(port, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('listening on port ' + port)
    }
})

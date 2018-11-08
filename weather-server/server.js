const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')
const app = express();

const endpoint = 'http://api.openweathermap.org/data/2.5/forecast?zip=';
const key = '&units=imperial&appid=4c850b3fed89b3c96a4f53167411d6df';

app.use(bodyParser.json());

var originsWhitelist = [
    'http://localhost:4200', //this is my front-end url for development
    'http://www.myproductionurl.com'
];

var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}

app.use(cors(corsOptions))

app.listen(8000, () => {
    console.log('Server started!');
});
app.route('/api/weather/:zip').get((req, res) => {
    axios.get(endpoint + req.params['zip'] + key).then(response => {
        res.send(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});
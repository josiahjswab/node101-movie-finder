require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Movie Person')
})

var cache = {};

app.get('/movie/:id', (req, res) => {
  if(cache[req.params.id]) {
    res.send(cache[req.params.id]["Plot"])
    console.log('check if output was received from cache')
  } else {
    axios({
      url: `http://omdbapi.com/?i=${req.params.id}&apikey=${process.env.OMDB_API_KEY}`,
      method: 'get'
    })
    .then((response) => {
      cache[response.data.imdbID] = response.data;
      res.send(response.data);
      console.log(Object.keys(cache), "Keys in cache after the last request.");
    })
    .catch((err) => {
      res.send(console.log(err, 'Error!'))
    })
  }
});

app.get('/movieInfo/:inputValue', (req, res) => {
  if(cache[req.params.inputValue]) {
    res.send(cache[req.params.inputValue]["Plot"])
    console.log('check if output was received from cache')
  } else {
    axios({
      url: `http://omdbapi.com/?t=${req.params.inputValue}&apikey=${process.env.OMDB_API_KEY}`,
      method: 'get'
    })
    .then((response) => {
      cache[response.data.Title] = response.data;
      res.send(response.data);
      console.log(Object.keys(cache), "Keys in cache after the last request.");
    })
    .catch((err) => {
      res.send(console.log(err, 'Error!'))
    });
  }
});

module.exports = app;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const woven = require('woven-js'); // need to add npm module
const functions = require('./woven_functions/functions');

app.use(bodyParser.json());
// how can we incorporate bodyParser into our woven.optimize middleware?

woven.configure(functions, { alwaysClient: true });

app.use(woven.optimize);

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/dist/')));

app.listen(3000);

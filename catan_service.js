/**
catan_service.js
Chad Stogner
CSC 337, Spring 2019
Assignment #11

Web Service accessed by catan.js


**/

"use strict";

const express = require("express");
const app = express();

const fs = require("fs");

app.use(express.static('public'));

/**

**/
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
})

app.listen(process.env.PORT);

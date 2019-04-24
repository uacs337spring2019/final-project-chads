/**
catan_service.js
Chad Stogner
CSC 337, Spring 2019
Assignment #11

Web Service accessed by catan.js

Reads the files in the development cards folder to create a 'deck' and return one random card.
**/

"use strict";

const express = require("express");
const app = express();

const fs = require("fs");

app.use(express.static('public'));

/**
Takes in parameter mode.  (In this version, only one mode used.)
Sends back a JSON object.
**/
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let mode = req.query.mode;

	if (mode == "development") {
		let json = getCard();
		res.send(JSON.stringify(json));
	}
})

app.listen(3000);

/**
Picks a random card from the 'deck'.  Builds a JSON object of the cards name and description.
Returns the JSON obejct.
**/
function getCard() {
	let json = {};

	let deck = createDeck();
	let random = Math.floor(Math.random() * deck.length);

	let fileName = "development/" + deck[random];
	let info = fs.readFileSync(fileName, 'utf8');
	let lines = info.split("\n");

	json["name"] = lines[0];
	json["description"] = lines[2];

	return json;
}

/**
Builds a 'deck' of the files in the development file.  Files are added according to multiplicity
speciified in each file.  Returns the deck as a list.
**/
function createDeck() {
	let deck = [];
	let files = fs.readdirSync("development/");

	for (let i = 0; i < files.length; i++) {
		let curFile = files[i];

		// skips hidden files on Mac
		if (curFile.startsWith(".")) {
			continue;
		}

		let fileName = "development/" + curFile;
		let info = fs.readFileSync(fileName, 'utf8');
		let lines = info.split("\n");

		let number = lines[1];
		for (let j = 0; j < number; j++) {
			deck.push(curFile);
		}
	}

	return deck;
}
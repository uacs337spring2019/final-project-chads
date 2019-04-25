/**
catan.js
Chad Stogner
CSC 337, Spring 2019
Assignment #11

Java Script for catan.html
Accesses web service catan_service.js using node

Draws the gameboard, actvivates buttons, places game pieces, and manipulates game cards.
Uses the web service to grab a random development card.
**/

"use strict";

(function() {
	let piece = "settlement";
	let player = 4;
	// used to assign each player a color
	let colors = ["", "red", "blue", "orange", "white"];
	// used to idetify the corners of each hexagon in the game board and their respective colors
	let hexagons = [[121, 125, "#7B7080"], [207, 125, "#8ED47C"], [293, 125, "#246A19"],
		[78, 200, "#F0D031"], [164, 200, "#CC5500"], [250, 200, "#8ED47C"], [336, 200, "#CC5500"],
		[35, 275, "#F0D031"], [121, 275, "#246A19"], [207, 275, "#DBCA9C"], [293, 275, "#246A19"],
		[379, 275, "#7B7080"], [78, 350, "#246A19"], [164, 350, "#7B7080"], [250, 350, "#F0D031"],
		[336, 350, "#8ED47C"], [121, 425, "#CC5500"], [207, 425, "#F0D031"], 
		[293, 425, "#8ED47C"]];

	window.onload = function() {
		drawBoard();

		document.getElementById("board").onclick = placePiece;
		document.getElementById("road").onclick = road;
		document.getElementById("settlement").onclick = settlement;
		document.getElementById("city").onclick = city;
		document.getElementById("development").onclick = development;
		document.getElementById("roll").onclick = roll;
		document.getElementById("end").onclick = endTurn;

		addCards();
		activateCards();

		endTurn();
		clearDice();
	};

	/**
	Called by road button. Sets piece variable such that a road is placed when the game board is
	clicked.
	**/
	function road() {
		piece = "road";
	}

	/**
	Called by settlement bugtton.  Sets piece variable such that a settlement is placed when the 
	game board is clicked.
	**/
	function settlement() {
		piece = "settlement";
	}

	/**
	Called by city button.  Sets piece variable such that a city is placed when the game board is
	clicked.
	**/
	function city() {
		piece = "city";
	}

	/**
	Called when player clicks game board.  Draws a game piece on the board: a square for the road,
	a circle for the settlement, and a triangle for the city.
	**/
	function placePiece(event) {
		let board = document.getElementById("board");
		let context = board.getContext("2d");
		let rect = board.getBoundingClientRect();

		context.fillStyle = colors[player];
		context.beginPath();

		switch (piece) {
			case "road":
				context.fillRect(event.clientX - rect.left - 5, event.clientY - rect.top - 5, 
					10, 10);
				context.strokeRect(event.clientX - rect.left - 5, event.clientY - rect.top - 5, 
					10, 10);
				break;
			case "settlement":
				context.arc(event.clientX - rect.left, event.clientY - rect.top, 
					8, 0, 2 * Math.PI);
				context.fill();
				context.stroke();
				break;
			case "city":
				context.moveTo(event.clientX - rect.left, event.clientY - rect.top - 12);
				context.lineTo(event.clientX - rect.left - 10, event.clientY - rect.top + 6);
				context.lineTo(event.clientX - rect.left + 10, event.clientY - rect.top + 6);
				context.lineTo(event.clientX - rect.left, event.clientY - rect.top - 12);
				context.fill();
				context.stroke();
				break;
		}
	}

	/**
	Called by development card button.  Uses and AJAX request to get infomation from the web 
	service.  Gets a random development card.  Response text is the title of the card and the 
	description of the card as a JSON object.  Builds the card and sets its show and hide methods.
	**/
	function development() {
		// parameter passed in case future versions make use of the web service
		let url = "http://settlersofkatan.herokuapp.com?mode=development";

		fetch(url)
		.then(checkStatus)
		.then(function(responseText) {
			let json = JSON.parse(responseText);
			let divs = document.querySelectorAll("#player" + player + " .development");

			let div = divs [0];
			if (div.childNodes.length > 4) {
				div = divs[1];
			}

			let card = document.createElement("div");
			let name = document.createElement("h3");
			let description = document.createElement("p");

			name.innerHTML = json["name"];
			description.innerHTML = json["description"];
			card.appendChild(name);
			card.appendChild(description);
			card.classList.add("norm");

			card.onmousedown = show;
			card.onmouseup = hide;

			div.appendChild(card);
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	/**
	Called by the development cards.  On mouse down, all otber development cards are hidden and
	the development card div is enlarged and its description is shown in the div.
	**/
	function show() {
		this.classList.add("show");
		let cards = document.querySelectorAll(".development > div");
		for (let i = 0; i < cards.length; i++) {
			if (cards[i] === this) {
				continue;
			}
			cards[i].style.display = "none";
		}
	}

	/**
	Called by the development cards.  On mouse up, all other development cards are shown again
	and the original card is returned to its normal size.
	**/
	function hide() {
		this.classList.remove("show");
		let cards = document.querySelectorAll(".development > div");
		for (let i = 0; i < cards.length; i++) {
			cards[i].style.display = "block";
		}
	}

	/**
	Called by the material buttons.  On mouse over, border becomes white.  The corresponding
	player's div is shown and the current player's is hidden.
	**/
	function highlight() {
		this.style.border = "#DDDDDD solid 2px";

		document.getElementById("player" + player).style.display = "none";

		let collector = this.id.slice(-1,);
		document.getElementById("player" + collector).style.display = "block";
		document.getElementById("playerinfo").style.border = colors[collector] + " solid 5px";
	}

	/**
	Called by the material buttons.  On mouse out, border returns to black.  The corresponding
	player's div is hidden and the current player's is shown.
	**/
	function unhighlight() {
		this.style.border = "black solid 2px";

		let collector = this.id.slice(-1,);
		document.getElementById("player" + collector).style.display = "none";

		document.getElementById("player" + player).style.display = "block";
		document.getElementById("playerinfo").style.border = colors[player] + " solid 5px";
	}

	/**
	On load, material cards are added to each players div and given a starting value of 0.
	**/
	function addCards() {
		let materials = ["Brick", "Lumber", "Grain", "Wool", "Ore"];
		let cardsDiv = document.querySelectorAll(".player > .cards");

		for (let i = 0; i < cardsDiv.length; i++) {
			for (let j = 0; j < materials.length; j++) {
				let card = document.createElement("div");
				card.classList.add(materials[j]);
				let material = document.createElement("p");
				material.innerHTML = materials[j];
				let number = document.createElement("p");
				number.innerHTML = "0";
				number.classList.add("number");
				card.appendChild(material);
				card.appendChild(number);
				cardsDiv[i].appendChild(card);
			}
		}
	}

	/**
	Called by material called plus buttons.  A player's material count will go up on their card.
	**/
	function plusCard() {
		let material = this.parentNode.classList[0];
		let collector = "player" + this.id.slice(-1,);
		let p = document.querySelector("#" + collector + " ." + material + " .number");
		p.innerHTML = "" + (parseInt(p.innerHTML) + 1);
	}

	/**
	Called by end turn button.  Switches which players div is shown and clears dice roll.
	**/
	function endTurn() {
		document.getElementById("player" + player).style.display = "none";

		player = (player)%4 + 1;
		document.getElementById("player" + player).style.display = "block";
		document.getElementById("playerinfo").style.border = colors[player] + " solid 5px";

		clearDice();
	}

	/**
	Called by the roll button.  Gets two randoms number 1-6 and, using canvas, draws the two
	corresponding dice.
	**/
	function roll() {
		let dieOne = document.getElementById("dieOne");
		let contextOne = dieOne.getContext("2d");
		let dieTwo = document.getElementById("dieTwo");
		let contextTwo = dieTwo.getContext("2d");

		contextOne.fillStyle = "white";
		contextOne.fillRect(0, 0, 50, 50);
		contextTwo.fillStyle = "white";
		contextTwo.fillRect(0, 0, 50, 50);

		let numOne = Math.ceil(Math.random() * 6);
		let numTwo = Math.ceil(Math.random() * 6);

		drawNum(numOne, contextOne);
		drawNum(numTwo, contextTwo);
	}

	/**
	Makes call to different die sides based on random number generated.
	**/
	function drawNum(num, context) {
		switch (num) {
			case 1:
				drawOne(context);
				break;
			case 2:
				drawTwo(context);
				break;
			case 3:
				drawThree(context);
				break;
			case 4:
				drawFour(context);
				break;
			case 5:
				drawFive(context);
				break;
			case 6:
				drawSix(context);
				break;
		}
	}

	/**
	Draws the 1 side of a die.
	**/
	function drawOne(context) {
		context.fillStyle = "black";
		context.beginPath();
		context.arc(25, 25, 5, 0, 2 * Math.PI);
		context.fill();
	}

	/**
	Draws the 2 side of a die.
	**/
	function drawTwo(context) {
		context.fillStyle = "black";
		for (let i = 14; i < 37; i += 22) {
			context.beginPath();
			context.arc(i, i, 5, 0, 2 * Math.PI);
			context.fill();
		}
	}

	/**
	Draws the 3 side of a die.
	**/
	function drawThree(context) {
		context.fillStyle = "black";
		for (let i = 13; i < 38; i += 12) {
			context.beginPath();
			context.arc(i, i, 5, 0, 2 * Math.PI);
			context.fill();
		}
	}

	/**
	Draws the 4 side of a die.
	**/
	function drawFour(context) {
		context.fillStyle = "black";
		for (let i = 14; i < 37; i += 22) {
			for (let j = 14; j < 37; j += 22){
				context.beginPath();
				context.arc(i, j, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
	}

	/**
	Draws the 5 side of a die.
	**/
	function drawFive(context) {
		context.fillStyle = "black";
		for (let i = 13; i < 38; i += 24) {
			for (let j = 13; j < 38; j += 24){
				context.beginPath();
				context.arc(i, j, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
		context.beginPath();
		context.arc(25, 25, 5, 0, 2 * Math.PI);
		context.fill();
	}

	/**
	Draws the 6 side of a die.
	**/
	function drawSix(context) {
		context.fillStyle = "black";
		for (let i = 15; i < 36; i += 20) {
			for (let j = 12; j < 39; j += 13) {
				context.beginPath();
				context.arc(i, j, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
	}

	/**
	Clears the dice by putting a black square on top.
	**/
	function clearDice() {
		let dieOne = document.getElementById("dieOne");
		let contextOne = dieOne.getContext("2d");
		let dieTwo = document.getElementById("dieTwo");
		let contextTwo = dieTwo.getContext("2d");

		contextOne.fillStyle = "black";
		contextTwo.fillStyle = "black";
		contextOne.fillRect(0, 0, 50, 50);
		contextTwo.fillRect(0, 0, 50, 50);
	}

	/**
	Adds methods to material buttons.
	**/
	function activateCards() {
		let materials = document.querySelectorAll("#cards button");
		for (let i = 0; i < materials.length; i++) {
			materials[i].onmouseover = highlight;
			materials[i].onmouseout = unhighlight;
			materials[i].onclick = plusCard;
		}
	}

	/**
	Uses canvas to draw the game board.  Uses the hexagon array to draw the 19 hexagons and color
	them appropriatley.  Adds the numbers to the hexagons.
	**/
	function drawBoard() {
		let board = document.getElementById("board");
		let context = board.getContext("2d");

		context.strokeStyle = "black 2px solid";
		context.fillStyle = "#0089E5";

		// bounding hexagon drawn clockwise starting at bottom left corner
		context.beginPath();
		context.moveTo(375, 33);
		context.lineTo(125, 33);
		context.lineTo(0, 250);
		context.lineTo(125, 467);
		context.lineTo(375, 467);
		context.lineTo(500, 250);
		context.lineTo(375, 33);
		context.stroke();
		context.fill();

		// (x,y) is bottom left vertex of hexagon
		// shape is traced clockwise
		// hexagons from left to right, top to bottom
		let x = 0;
		let y = 0;
		for (let i = 0; i < hexagons.length; i++) {
			x = hexagons[i][0];
			y = hexagons[i][1];
			context.fillStyle = hexagons[i][2];

			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x, y-50);
			context.lineTo(x+43, y-75);
			context.lineTo(x+86, y-50);
			context.lineTo(x+86, y);
			context.lineTo(x+43, y+25);
			context.lineTo(x, y);	
			context.fill();
			context.stroke();
		}

		// numbers are added left to right, top to bottom
		context.fillStyle = "black";
		context.font = "25px Fantasy";

		context.fillText("10", 153, 109);
		context.fillText("2", 243, 109);
		context.fillText("9", 329, 109);

		context.fillText("12", 111, 184);
		context.fillText("6", 200, 184);
		context.fillText("4", 286, 184);
		context.fillText("10", 368, 184);

		context.fillText("9", 71, 259);
		context.fillText("11", 158, 259);
		context.fillText("3", 331, 259);
		context.fillText("8", 415, 259);

		context.fillText("8", 114, 334);
		context.fillText("3", 202, 334);
		context.fillText("4", 286, 334);
		context.fillText("5", 372, 334);

		context.fillText("5", 157, 409);
		context.fillText("6", 243, 409);
		context.fillText("11", 330, 409);
	}

	/** 
	Returns the response text if the status is in the 200s,
	otherwise rejects the promise with a message including the status.
	**/
	function checkStatus(response) { 
	    if (response.status >= 200 && response.status < 300) {  
	        return response.text();
	    } else {  
	        return Promise.reject(new Error(response.status+": "+response.statusText)); 
	    } 
	}
})();

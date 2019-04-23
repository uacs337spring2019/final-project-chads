/**
catan.js
Chad Stogner
CSC 337, Spring 2019
Assignment #11

Java Script for catan.html
Accesses web service catan_service.js using node


**/

"use strict";

(function() {
	let piece = "settlement";
	let player = 4;
	let colors = ["", "red", "blue", "orange", "white"];
	let hexagons = [[121, 125, "gray"], [207, 125, "lightgreen"], [293, 125, "darkgreen"],
		[78, 200, "yellow"], [164, 200, "orange"], [250, 200, "lightgreen"], [336, 200, "orange"],
		[35, 275, "yellow"], [121, 275, "darkgreen"], [207, 275, "tan"], [293, 275, "darkgreen"],
		[379, 275, "gray"], [78, 350, "darkgreen"], [164, 350, "gray"], [250, 350, "yellow"],
		[336, 350, "lightgreen"], [121, 425, "orange"], [207, 425, "yellow"],
		[293, 425, "lightgreen"]];

	window.onload = function() {
		drawBoard();

		document.getElementById("board").onclick = placePiece;
		document.getElementById("road").onclick = road;
		document.getElementById("settlement").onclick = settlement;
		document.getElementById("city").onclick = city;
		document.getElementById("roll").onclick = roll;
		document.getElementById("end").onclick = endTurn;

		document.getElementById("brick").onmouseover = highlight;
		document.getElementById("brick").onmouseout = unhighlight;
		document.getElementById("brick").onclick = addCard;
		document.getElementById("lumber").onmouseover = highlight;
		document.getElementById("lumber").onmouseout = unhighlight;
		document.getElementById("lumber").onclick = addCard;
		document.getElementById("grain").onmouseover = highlight;
		document.getElementById("grain").onmouseout = unhighlight;
		document.getElementById("grain").onclick = addCard;
		document.getElementById("wool").onmouseover = highlight;
		document.getElementById("wool").onmouseout = unhighlight;
		document.getElementById("wool").onclick = addCard;
		document.getElementById("ore").onmouseover = highlight;
		document.getElementById("ore").onmouseout = unhighlight;
		document.getElementById("ore").onclick = addCard;

		endTurn();
		clearDice();
	};

	function road() {
		piece = "road";
	}

	function settlement() {
		piece = "settlement";
	}

	function city() {
		piece = "city";
	}

	function placePiece(event) {
		let board = document.getElementById("board");
		let context = board.getContext("2d");
		let rect = board.getBoundingClientRect();

		context.fillStyle = colors[player];
		context.beginPath();

		switch(piece) {
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

	function highlight() {
		this.style.border = colors[player] + " solid 2px";
	}

	function unhighlight() {
		this.style.border = "black solid 2px";
	}

	function addCard() {
		document.getElementById()
	}

	function endTurn() {
		document.getElementById("player" + player).style.display = "none";

		player = (player)%4 + 1;
		document.getElementById("player" + player).style.display = "block";
		document.getElementById("playerinfo").style.border = colors[player] + " solid 5px";

		clearDice();
	}

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

	function drawNum(num, context) {
		switch(num) {
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

	function drawOne(context) {
		context.fillStyle = "black";
		context.beginPath();
		context.arc(25, 25, 5, 0, 2 * Math.PI);
		context.fill();
	}

	function drawTwo(context) {
		context.fillStyle = "black";
		for(let i = 14; i < 37; i += 22) {
			context.beginPath();
			context.arc(i, i, 5, 0, 2 * Math.PI);
			context.fill();
		}
	}

	function drawThree(context) {
		context.fillStyle = "black";
		for(let i = 13; i < 38; i += 12) {
			context.beginPath();
			context.arc(i, i, 5, 0, 2 * Math.PI);
			context.fill();
		}
	}

	function drawFour(context) {
		context.fillStyle = "black";
		for(let i = 14; i < 37; i += 22) {
			for(let j = 14; j < 37; j += 22){
				context.beginPath();
				context.arc(i, j, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
	}

	function drawFive(context) {
		context.fillStyle = "black";
		for(let i = 13; i < 38; i += 24) {
			for(let j = 13; j < 38; j += 24){
				context.beginPath();
				context.arc(i, j, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
		context.beginPath();
		context.arc(25, 25, 5, 0, 2 * Math.PI);
		context.fill();
	}

	function drawSix(context) {
		context.fillStyle = "black";
		for(let i = 15; i < 36; i += 20) {
			for(let j = 12; j < 39; j += 13) {
				context.beginPath();
				context.arc(i, j, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
	}

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

	function drawBoard() {
		let board = document.getElementById("board");
		let context = board.getContext("2d");

		context.strokeStyle = "black 2px solid";
		context.fillStyle = "#0089E5";

		// (x,y) is bottom left vertex of hexagon
		// shape is traced clockwise
		// hexagons from left to right, top to bottom
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

		let x = 0;
		let y = 0;
		for(let i = 0; i < hexagons.length; i++) {
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

		context.fillText("12", 110, 184);
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
})();






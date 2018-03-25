$('#play').click(function() {
	$('#playtest').toggle({
		complete: function() {
			// Note: Some skills require card position movement, thus
			// they need access to coordinates after the page has rendered     
			handleSkill(Phase.STANDBY);
		}
	});
})

let decklist = []
let extradecklist = []
let hand = []
let board = []
let currentDeck = joinMainExtraDeck(playtest.main, playtest.extra)
let graveyardlist = []

let encode = window.btoa(JSON.stringify(getExportReadyDeck(currentDeck)))

/*
	* This ID is used for adding cards back to the hand from the graveyard
	* It's count starts high enough to avoid the main/extra number IDs 
*/ 
let handCountId = 100

$('#export').click(function() {
	$('.export').html(`<textarea style="width:320px" class="code">${encode}</textarea>`)
	$('.export').dialog({
		width: 388,
		open: function(event, ui) {
			$(this).closest(".ui-dialog")
			.find(".ui-dialog-titlebar-close")
			.removeClass("ui-dialog-titlebar-close")
			.html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>")
		}
	})
})

$('#import').click(function() {
	$('.import').html(`<textarea style="width:320px" class="codeimport"></textarea><input type="button" value="Submit" id="submitdeck">`)
	$('.import').dialog({
		width: 388,
		open: function(event, ui) {
			$(this).closest(".ui-dialog")
			.find(".ui-dialog-titlebar-close")
			.removeClass("ui-dialog-titlebar-close")
			.html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>")
		}
	})
})

$(document).on("click", "#submitdeck", function() {
	$('.import').dialog("close")
	let code = window.atob($('.codeimport').val())
	importDeck(JSON.parse(code))
})

$(document).on("click", ".code", function() {
	$(this).select()
	document.execCommand("Copy");
})

$(document).on("click", "#deckmenu img", function() {
	let id = $(this).attr('id');
	
	var positionInGrave = getCardPositionInArray(graveyardlist, id);
	if(positionInGrave >= 0) {
		dealCardFromGrave(positionInGrave);    
	} 
	else {
		let positionInMain = getCardPositionInArray(decklist, id)
		
		if (positionInMain >= 0) { // monster is in the main deck
			dealCard(positionInMain)
			} else { // monster is in the extra deck
			summonMonsterFromExtra(getCardPositionInArray(extradecklist, id))
		}
	}
})

function getExportReadyDeck(currentDeck){
	var joined = [];
	
	for (let card in currentDeck) {
		let found = false;
		for(let joinedCard in joined){
			if(joined[joinedCard].name == currentDeck[card].name){
				joined[joinedCard].amount++;
				found = true;
				break;
			}
		}
		
		if(!found){
			joined.push({
				name: currentDeck[card].name,
				deck: currentDeck[card].deck,
				amount: 1
			});
		}
	}
	
	return joined;
}

function joinMainExtraDeck(main, extra) {
	var joined = [];
	
	let id = 0;
	
	for (let card in main) {
		joined.push({
			name: main[card].name,
			deck: 0,
			amount: main[card].amount
		})
	}
	
	for (let card in extra) {
		joined.push({
			name: extra[card].name,
			deck: 1,
			amount: extra[card].amount
		})
	}
	
	return joined;
}

function importDeck(deck) {
	refreshDeck(deck)
	shuffleDeck(decklist)
	$('#hand').empty();
	handleSkill(Phase.DRAW); 
	handleSkill(Phase.STANDBY); 
currentDeck = deck
}

/*
	* This is the starting function for the playtest area.
	* Marking this for future reference. 
*/  
$(function() {
	refreshDeck(currentDeck);
	shuffleDeck(decklist);
	$('#hand').empty();
	handleSkill(Phase.DRAW); 
})

/*
	* The object 'Phase' represents the time in which a skill needs to occur.
	* 
	* There are several representations:
	* -- DRAW: The opening hand is modified in some way BEFORE the duel begins (i.e. start with Harpies' Hunting Ground, start with 5 card [Duel, Standby], etc.) 
	* -- STANDBY: The field is manipulated in some way BEFORE the duel begins (i.e. start with Ojama Country, start with monsters on the field [Elements Unite], etc.)
	* -- MAIN: Anything after the beginning of the duel is manipuated (i.e. draw the same card twice [Extra, Extra], etc.)     
*/ 
let Phase = {}
Phase.DRAW = "Draw Phase"
Phase.STANDBY = "Standby Phase"
Phase.MAIN = "Main Phase"

// Note: The id is high to accommodate the number of cards in a deck
// It must be a number for the 'snappedEvent' function  
let Skill = {}
Skill.DEFAULT_ID = "99"

function handleSkill(phase) {
	switch(phase) {
		case Phase.DRAW: 
		switch(playtest.skill) {
			case "Harpies' Hunting Ground":
			decklist.push({ id: decklist.length, name: "Harpies' Hunting Ground" });
			dealHand(decklist.length - 1);
			
			for (var i = 0; i < 3; i++) {
				dealHand(randomCard());
			}
			
			break;
			case "Duel, standby!":
			for (var i = 0; i < 5; i++) {
				dealHand(randomCard());
			}   
			
			break;
			default: 
			for (var i = 0; i < 4; i++) {
				dealHand(randomCard());
			}
		}
		break;
		case Phase.STANDBY:
		switch(playtest.skill) {
			case "Straight to the Grave":  
			addCardToField(Skill.DEFAULT_ID, "Wasteland", 0);          
			break;
			case "Middle Age Mechs":
			addCardToField(Skill.DEFAULT_ID, "Ancient Gear Castle", 7);          
			break;
			case "Dinosaur Kingdom":
			addCardToField(Skill.DEFAULT_ID, "Jurassic World", 0);          
			break;  
			case "Fields of the Warriors":
			addCardToField(Skill.DEFAULT_ID, "Sogen", 0);          
			break;  
		}
		break;
		default:
		console.error("The following phase has not been defined: " + phase) 
	}  
}

function addCardToField(id, cardName, position) {
	// Create the div and temporarily add it to the hand slot
	$('#hand').append(`<div id="cardId${id}" class="testcard-slot-row"><div class="hand cardMain${id}"><img id="${id}" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(cardName)}&il" /></div>`)
	
	// Make the card draggable
	let nameDom = ('.cardMain' + id);
	$(nameDom).css('border', 'none');
	$(nameDom).draggable({
		snap: '.testcard-slot',
		snapMode: 'inner',
		snapTolerance: '22',
		stack: '.hand',
		stop: function() {
			snappedEvent($(this), false, snappedToDeck);
		},
		create: function() {
			addHand(cardName, id); 
			
			// Update the location of the card, as needed
			var cardslotPosition = $($('.testcard-slot')[position]).offset();
			$(nameDom).offset(cardslotPosition);
			
			// Manually update the hand, as the offset isn't equal to dragging
			let cardIdInHand = getCardPositionInArray(hand, Number(id));
			hand[cardIdInHand].moved = true;
			refreshHand();  
		}
	}); 
}

$(document).on("click", ".hand img", function() {
	let currentImage = $(this).attr('src')
	if ($(this).hasClass('rotated')) {
		$(this).removeClass('rotated')
		} else {
		$(this).addClass('rotated')
	}
})

$('#shuffle').click(function() {
	if (decklist == 0) return;
	$('#playerdeck').effect("shake", {
		distance: "5"
	})
	shuffleDeck(decklist)
	if ($('#deckmenu').dialog('isOpen')) {
		openDeck(currentDeck)
	}
})

$('#view').click(function() {
	openDeck(currentDeck)
})

$('#playerdeck, #deal').click(function() {
	dealCard(0)
})

$('#playerextradeck').click(function() {
	openDeck(currentDeck, true);
})

$('#graveyard').click(function() {
	openDeck(currentDeck, false, true);
})

$('#new').click(function() {
	importDeck(currentDeck);
	$('.tokencopy').remove();
	//test deckmenu initializing
	if ($('#deckmenu').length){
		if ($('#deckmenu').dialog('isOpen')) {
			openDeck(currentDeck)
		}
	}
})

function openDeck(deck, extra = false, grave = false) {
	if (grave && (graveyardlist.length == 0)) return;
	if ((extra ? extradecklist : decklist) == 0) return;
	
	$('#deckmenu').empty();  
	
	/* 
		* There's an issue (possibly within JQuery-UI) with the dialog opening without 
		* a reference to the top of the #playlist div; initializing 
		* the dialog once addresses this 
	*/  
	if(!$('#deckmenu').dialog('instance')) {    
		$('#deckmenu').dialog({autoOpen: false})  
	}
	
	if(grave) {
		$('#deckmenu').dialog('option', 'title', 'Card in Graveyard');
		for(i in graveyardlist) {
			$('#deckmenu').append(`<img style="margin: 1px" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(graveyardlist[i].name)}&il" width="60px" id="${graveyardlist[i].id}"/>`)
		}
	}
	else {
		$('#deckmenu').dialog('option', 'title', 'Card in Deck');
		
		for (i in (extra ? extradecklist : decklist)) {
			if (extra)
			$('#deckmenu').append(`<img style="margin: 1px" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(extradecklist[i].name)}&il" width="60px" id="${extradecklist[i].id}"/>`)
			else
			$('#deckmenu').append(`<img style="margin: 1px" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(decklist[i].name)}&il" width="60px" id="${decklist[i].id}"/>`)
		}
	} 
	
	
	$('#deckmenu').dialog({
		width: 450,
		height: 563,
		resizable: false,
		draggable: false,
		autoOpen: true,
		open: function(event, ui) {
			$(this).closest(".ui-dialog")
			.find(".ui-dialog-titlebar-close")
			.removeClass("ui-dialog-titlebar-close")
			.html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>")
		},
		position: {
			my: "left top",
			at: "right-158 top",
			of: '#playtest'
		}
	})
	}
	
	function randomCard() {
		return Math.floor(Math.random() * decklist.length)
	}
	
	function dealHand(i) {
		addCardToHandDiv(i, 0);
		
		addHand(decklist[i].name, decklist[i].id)
		
		removeCard(i)
	}
	
	function dealCard(i) {
		if (decklist == 0) return;
		
		addCardToHandDiv(i, 0);
		
		addHand(decklist[i].name, decklist[i].id)
		
		removeCard(i)
		
		if ($('#deckmenu').dialog('isOpen')) {
			if (decklist == 0) {
				$('#deckmenu').dialog("close")
			}
			openDeck(currentDeck)
		}
	}
	
	function dealCardFromGrave(position) {
		addCardToHandDiv(position, graveyardlist[position].extra, true);
		
		addHand(graveyardlist[position].name, handCountId);
		
		handCountId++;
		
		graveyardlist.splice(position, 1);
		
		$('#graveyard > img').remove();
		if(graveyardlist.length > 0) {
			$('#graveyard').html("<img src='https://images.weserv.nl/?url=yugiohprices.com/api/card_image/" + encodeURIComponent(graveyardlist[0].name).replace("'", "%27") + "&il' />");
		}  
		
		if(graveyardlist.length == 0) {
			$('#deckmenu').dialog("close");    
		}
		openDeck(currentDeck, false, true);
	}
	
	function summonMonsterFromExtra(i) {
		if (extradecklist > 0) return;
		
		$("#source").appendTo("#destination");
		
		addCardToHandDiv(i, 1);
		addHand(extradecklist[i].name, extradecklist[i].id);
		
		var destination = $('#playerextradeck').position();
		$('#cardId' + extradecklist[i].id).css({
			top: destination.top,
			left: destination.left,
			position: 'absolute'
		});
		
		var animDest = $('#center-m-z').position();
		$('#cardId' + extradecklist[i].id).animate({
			top: animDest.top - 20,
			left: animDest.left
		}, 500);
		
		removeCardFromExtra(i);
		removeCard(i)
	}
	
	function addCardToHandDiv(i, extra, grave = false) {
		if(grave) {
			if(extra == 0)
			$('#hand').append(`<div id="cardId${handCountId}" class="testcard-slot-row"><div class="hand cardMain${handCountId}"><img id="${handCountId}" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(graveyardlist[i].name)}&il" /></div>`)
			else if(extra == 1)
			$('#hand').append(`<div id="cardId${handCountId}" class="testcard-slot-row"><div class="hand cardEx${handCountId}"><img id="${handCountId}" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(graveyardlist[i].name)}&il" /></div>`)
		}
		else {
			if(extra == 0)
			$('#hand').append(`<div id="cardId${decklist[i].id}" class="testcard-slot-row"><div class="hand cardMain${decklist[i].id}"><img id="${decklist[i].id}" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(decklist[i].name)}&il" /></div>`)
			else if(extra == 1)
			$('#hand').append(`<div id="cardId${extradecklist[i].id}" class="testcard-slot-row"><div class="hand cardEx${extradecklist[i].id}"><img id="${extradecklist[i].id}" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${encodeURIComponent(extradecklist[i].name)}&il" /></div>`)
		}
		
		let cardId 
		if(grave) {
			cardId = handCountId;
		}
		else {
			cardId = (extra == 1) ? extradecklist[i].id : decklist[i].id;
		}
		let nameDom = (extra == 1) ? ('.cardEx' + cardId) : ('.cardMain' + cardId);
		
		$(nameDom).css('border', 'none')
		$(nameDom).draggable({
			snap: '.testcard-slot',
			snapMode: 'inner',
			snapTolerance: '22',
			stack: '.hand',
			stop: function() {
				snappedEvent($(this), extra, snappedToDeck);
			}
		});
	}
	
	function addHand(i, id) {
		hand.push({
			id: id,
			name: i,
			moved: false
		});
	}
	
	function shuffleDeck(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
	}
	
	function snappedEvent(cardDOM, extra, event) {
		// Shift the hand, if necessary
		let cardIdInHand = getCardPositionInArray(hand, Number(cardDOM.children().first().attr('id')));
		hand[cardIdInHand].moved = true;
		refreshHand();
		
		// Get the center point of the dragged card
		var cardCenter = getCenterPoint(cardDOM);
		
		// Get the player and extra deck card slot elements 
		var cardSlotElements = $(".testcard-slot");
		var playerDeckElem;
		var extraDeckElem;
		var graveyardElem;
		$.each(cardSlotElements, function(index, element) {
			if($(element).children().first().attr('id') == "playerdeck") {
				playerDeckElem = element;
			}      
			if($(element).children().first().attr('id') == "playerextradeck") {
				extraDeckElem = element;
			}
			if($(element).attr('id') == "graveyard") {
				graveyardElem = element;
			}
			if(playerDeckElem && extraDeckElem && graveyardElem) {
				return false;
			}
		});  
		
		// Determine if the card's center point is within the player deck area 
		// (with a 10px buffer for margins)
		var playerdeckCenter = getCenterPoint($(playerDeckElem));
		var playerdeckLowerHeight = playerdeckCenter.y - ($(playerDeckElem).height()/2) - 10;
		var playerdeckUpperHeight = playerdeckCenter.y + ($(playerDeckElem).height()/2) + 10;
		var playerdeckLowerWidth = playerdeckCenter.x - ($(playerDeckElem).width()/2) - 10;
		var playerdeckUpperWidth = playerdeckCenter.x + ($(playerDeckElem).width()/2) + 10;
		var playerdeckCenterInHeight = (playerdeckLowerHeight <= cardCenter.y) && (cardCenter.y <= playerdeckUpperHeight);
		var playerdeckCenterInWidth = (playerdeckLowerWidth <= cardCenter.x) && (cardCenter.x <= playerdeckUpperWidth);
		
		// Add the card to the player deck, if needed
		if((playerdeckCenterInHeight && playerdeckCenterInWidth) && !extra ) {
			event(cardDOM, extra, false);  
			return;  
		} 
		
		// Determine if the card's center point is within the extra deck area 
		// (with a 10px buffer for margins)
		var extradeckCenter = getCenterPoint($(extraDeckElem));
		var extradeckLowerHeight = extradeckCenter.y - ($(extraDeckElem).height()/2) - 10;
		var extradeckUpperHeight = extradeckCenter.y + ($(extraDeckElem).height()/2) + 10;
		var extradeckLowerWidth = extradeckCenter.x - ($(extraDeckElem).width()/2) - 10;
		var extradeckUpperWidth = extradeckCenter.x + ($(extraDeckElem).width()/2) + 10;
		var extradeckCenterInHeight = (extradeckLowerHeight <= cardCenter.y) && (cardCenter.y <= extradeckUpperHeight);
		var extradeckCenterInWidth = (extradeckLowerWidth <= cardCenter.x) && (cardCenter.x <= extradeckUpperWidth);
		
		// Add the card to the extra deck, if needed
		if((extradeckCenterInHeight && extradeckCenterInWidth) && extra) {
			event(cardDOM, extra, false);
			return;  
		}
		
		// Determine if the card's center point is within the graveyard deck area 
		// (with a 10px buffer for margins)
		var graveyardCenter = getCenterPoint($(graveyardElem));
		var graveyardLowerHeight = graveyardCenter.y - ($(graveyardElem).height()/2) - 10;
		var graveyardUpperHeight = graveyardCenter.y + ($(graveyardElem).height()/2) + 10;
		var graveyardLowerWidth = graveyardCenter.x - ($(graveyardElem).width()/2) - 10;
		var graveyardUpperWidth = graveyardCenter.x + ($(graveyardElem).width()/2) + 10;
		var graveyardCenterInHeight = (graveyardLowerHeight <= cardCenter.y) && (cardCenter.y <= graveyardUpperHeight);
		var graveyardCenterInWidth = (graveyardLowerWidth <= cardCenter.x) && (cardCenter.x <= graveyardUpperWidth);
		
		// Add the card to the graveyard, if needed
		if(graveyardCenterInHeight && graveyardCenterInWidth) {
			event(cardDOM, extra, true);
			return;  
		}
	}
	
	function snappedToDeck(cardDOM, extra, grave){
		let cardId = cardDOM.children().first().attr('id');
		
		if(grave) {
			addCardToGrave(cardId, extra);
		}
		else {
			if(extra) {
				addCardToExtraDeck(cardId);
			}
			else {
				addCardToDeck(cardId);
			}
		}
		
		removeCardFromHand(cardId);
		
		if($('#deckmenu').dialog('instance')) {
			if ($('#deckmenu').dialog('isOpen')) {
				openDeck(currentDeck, extra, grave)
			}
		}
	}
	
	function getCenterPoint(div) {
		var offset = div.offset();
		var height = div.height();
		var width = div.width();
		
		var x = 0;
		var y = 0;
		
		x = offset.left + (width / 2);
		y = offset.top + (height / 2);
		
		var center = {};
		center.x = x;
		center.y = y;
		return center;  
	}  
	
	function refreshHand(){
		for(i in hand){
			if(Boolean(hand[i].moved)){
				let pos = $('#cardId' + hand[i].id).position();
				$('#hand').append($('#cardId' + hand[i].id));
				$('#cardId' + hand[i].id).css({
					top: pos.top,
					left: pos.left,
					position: 'absolute'
				});
			}
		}
	}
	
	function removeCard(c) {
		decklist.splice(c, 1)
	}
	
	function removeCardFromExtra(c) {
		extradecklist.splice(c, 1)
	}
	
	function getCardPositionInArray(arr, cardId) {
		let index = -1;
		
		arr.forEach(function(element, i) {
			if (element.id == cardId) index = i;
		});
		
		return index;
	}
	
	function addCardToDeck(c) {
		let cardIndexInHand = getCardPositionInArray(hand, c);
		
		decklist.unshift({
			id: hand[cardIndexInHand].id,
			name: hand[cardIndexInHand].name
		});
	}
	
	function addCardToExtraDeck(c) {
		let cardIndexInHand = getCardPositionInArray(hand, c);
		
		extradecklist.push({
			id: hand[cardIndexInHand].id,
			name: hand[cardIndexInHand].name
		});
	}
	
	function addCardToGrave(c, extra) {
		let cardIndexInHand = getCardPositionInArray(hand, c);
		
		graveyardlist.unshift({
			id: hand[cardIndexInHand].id,
			name: hand[cardIndexInHand].name,
			extra: extra
		});
		
		$('#graveyard > img').remove();
		$('#graveyard').html("<img src='https://images.weserv.nl/?url=yugiohprices.com/api/card_image/" + encodeURIComponent(hand[cardIndexInHand].name).replace("'", "%27") + "&il' />");
	}
	
	function removeCardFromHand(c) {
		let cardIndexInHand = getCardPositionInArray(hand, c);
		
		$('#hand').find('#cardId' + c).remove();
		
		hand.splice(cardIndexInHand, 1)
	}
	
	function refreshDeck(deck) {
		if (deck.length > 0) {
			decklist = []
			extradecklist = []
			hand = []
			graveyardlist = []
			
			// Clear the image from the graveyard, if needed
			$('#graveyard > img').remove();
		}
		
		let id = 0;
		
		for (let i in deck) {
			for (let j = 0; j < Number(deck[i].amount); j++) {
				if (deck[i].deck == 0) {
					decklist.push({
						id: id,
						name: deck[i].name
					})
					} else if (deck[i].deck == 1) {
					extradecklist.push({
						id: id,
						name: deck[i].name
					})
				}
				
				id++;
			}
		}
		
		shuffleDeck(decklist)
		
		$(function() {
			$('#deckcount span').text(decklist.length)
		})
	}
	
	$('.token').draggable({
		helper: 'clone',
		snap: '.testcard-slot',
		snapMode: 'center',
		snapTolerance: '22',
		stack: '.hand'
	});
	$('.token').bind('dragstop', function(event, ui) {
		$(this).after($(ui.helper).clone().draggable().addClass('tokencopy'));
	});
	
	$('.dice').click(function() {
		let die = []
		die[0] = 'https://i.imgur.com/kp4VvpW.png'
		die[1] = 'https://i.imgur.com/zsG76hB.png'
		die[2] = 'https://i.imgur.com/3LJiXtf.png'
		die[3] = 'https://i.imgur.com/Ngbnkkv.png'
		die[4] = 'https://i.imgur.com/lwEpMt6.png'
		die[5] = 'https://i.imgur.com/4TZwH9q.png'
		let output
		let faceValue = Math.floor(Math.random() * 6);
		$('#results').hide().html(`<img width="60px" src=${die[faceValue]} />`).fadeIn()
	})
	
	$('.coin').click(function() {
		return (Math.floor(Math.random() * 2) == 0) ? $('#results').hide().html(`<img width="60px" src="https://i.imgur.com/1AJdr5l.png"/>`).fadeIn() : $('#results').hide().html(`<img width="60px" src="https://i.imgur.com/N2dFEVu.png"/>`).fadeIn();
	})
	
	$(document).on("click", ".tokencopy", function() {
		$(this).remove();
	})	
$('#play').click(function() {
  $('#playtest').show()
})

$(function() {
  $('#playtest').hide()
})

let decklist = []
let extradecklist = []
let hand = []
let board = []
let currentDeck = joinMainExtraDeck(playtest.main, playtest.extra)

let encode = window.btoa(JSON.stringify(getExportReadyDeck(currentDeck)))

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

  let positionInMain = getCardPositionInArray(decklist, id)

  if (positionInMain >= 0) { // monster is in the main deck
    dealCard(positionInMain)
  } else { // monster is in the extra deck
    summonMonsterFromExtra(getCardPositionInArray(extradecklist, id))
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
  if ($('#deckmenu').dialog('isOpen')) {
    openDeck(deck)
  }
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
        default: 
          for (var i = 0; i < 4; i++) {
            dealHand(randomCard());
          }
      }
      break;
    default:
      console.error("The following phase has not been defined: " + phase)
  }
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

$('#new').click(function() {
  importDeck(currentDeck);
  $('.tokencopy').remove();
  $('#hand').empty();
  handleSkill(Phase.DRAW);
  if ($('#deckmenu').dialog('isOpen')) {
    openDeck(currentDeck)
  }
})

function openDeck(deck, extra = false) {
  if (hand.length == 0) {
    refreshDeck(deck);
  }

  if ((extra ? extradecklist : decklist) == 0) return;

  $('#deckmenu').empty()

  for (i in (extra ? extradecklist : decklist)) {
    if (extra)
      $('#deckmenu').append(`<img style="margin: 1px" src="https://yugiohprices.com/api/card_image/${extradecklist[i].name}" width="60px" id="${extradecklist[i].id}"/>`)
    else
      $('#deckmenu').append(`<img style="margin: 1px" src="https://yugiohprices.com/api/card_image/${decklist[i].name}" width="60px" id="${decklist[i].id}"/>`)
  }

  $('#deckmenu').dialog({
    width: 450,
    height: 563,
    resizable: false,
    draggable: false,
    open: function(event, ui) {
      $(this).closest(".ui-dialog")
        .find(".ui-dialog-titlebar-close")
        .removeClass("ui-dialog-titlebar-close")
        .html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>")
    },
    position: {
      my: "left+10 top",
      at: "right top",
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

function addCardToHandDiv(i, extra){
  if(extra == 0)
    $('#hand').append(`<div id="cardId${decklist[i].id}" class="testcard-slot-row"><div class="hand cardMain${decklist[i].id}"><img id="${decklist[i].id}" src="https://yugiohprices.com/api/card_image/${decklist[i].name}" /></div>`)
  else if(extra == 1)
    $('#hand').append(`<div id="cardId${extradecklist[i].id}" class="testcard-slot-row"><div class="hand cardEx${extradecklist[i].id}"><img id="${extradecklist[i].id}" src="https://yugiohprices.com/api/card_image/${extradecklist[i].name}" /></div>`)

  let nameDom = (extra == 1) ? ('.cardEx' + extradecklist[i].id) : ('.cardMain' + decklist[i].id);

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
  var draggable = cardDOM.data("ui-draggable");
  $.each(draggable.snapElements, function(index, element) {
    if (element.snapping) {
      var snapped = draggable.snapElements;

      var snappedTo = $.map(snapped, function(element) {
        return element.snapping ? element.item : null;
      });

      let snapToId = (extra == true) ? 'playerextradeck' : 'playerdeck';

      let cardIdInHand = getCardPositionInArray(hand, Number(cardDOM.children().first().attr('id')));
      hand[cardIdInHand].moved = true;

      refreshHand();

      $.each(snappedTo, function(idx, item) {
        if ($(item).children().first().attr('id') == snapToId) {
          event(cardDOM, extra);
        }
      });

      return false;
    }
  });
}

function snappedToDeck(cardDOM, extra){
  let cardId = cardDOM.children().first().attr('id');

  if(extra)
    addCardToExtraDeck(cardId);
  else
    addCardToDeck(cardId);

  removeCardFromHand(cardId);

  if ($('#deckmenu').dialog('isOpen')) {
    openDeck(currentDeck, extra)
  }

  return false;
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

  decklist.push({
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
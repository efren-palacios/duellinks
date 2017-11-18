$('#play').click(function(){
    $('#playtest').show()
})

$(function(){
  $('#playtest').hide()
})

let decklist = []
let hand = []
let board = []


$(document).on("click","#deckmenu img", function(){
  dealCard($(this).attr('id'))
})

$(function() {
  refreshDeck();
  shuffleDeck(decklist);
  $('#hand').empty();
  for (var i = 0; i < 4; i++) {
  dealHand(randomCard())
  }
})

$(document).on("click",".hand img", function(){
  let currentImage = $(this).attr('src')
  if ($(this).hasClass('rotated')) {
    $(this).removeClass('rotated')
  } else {
    $(this).addClass('rotated')
  }
}) 

$('#shuffle').click(function() {
  if (decklist == 0) return;
  $('#playerdeck').effect( "shake", {distance: "5"} )
  shuffleDeck(decklist)
      if ($('#deckmenu').dialog('isOpen')) {
      openDeck()
    }
})


function openDeck() {
  if (hand.length == 0) {
      refreshDeck()
      }
  if (decklist == 0) return;
  $('#deckmenu').empty()
  for (i in decklist) {
  $('#deckmenu').append(`<img style="margin: 1px" src="https://yugiohprices.com/api/card_image/${decklist[i]}" width="60px" id="${i}"/>`)
  }
  $('#deckmenu').dialog({
    width: 450,
    open: function() {
        $(this).closest(".ui-dialog")
        .find(".ui-dialog-titlebar-close")
        .removeClass("ui-dialog-titlebar-close")
        .html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");
    }
})
}


$('#view').click(function() {
  openDeck()
})

$('.testcard-slot').droppable
    ({
        accept: '.hand', 
        drop: function(event, ui) 
        {
         ui.draggable.css('left', $(this).position().left -1)
         ui.draggable.css('top', $(this).position().top)
         ui.draggable.css('position', 'absolute')
        }
});

$('#playerdeck, #deal').click(function() {
  dealCard(0)
})

$('#new').click(function() {
  refreshDeck();
  shuffleDeck(decklist);
  $('#hand').empty();
  for (var i = 0; i < 4; i++) {
  dealHand(randomCard())
  }
      if ($('#deckmenu').dialog('isOpen')) {
      openDeck()
    }
})

function randomCard() {
  return Math.floor(Math.random() * decklist.length)
}

function dealHand(i) {
      let card = document.createElement('img');
      card.src = `https://yugiohprices.com/api/card_image/${decklist[i]}`;
      $('#hand').append(`<div class="game-board"><div class="testcard-slot-row"><div class="hand"><img src="${card.src}" /></div></div>`)
      addHand(decklist[i])
      $('.hand').css('border', 'none')
      $('.hand').draggable
    ({  
        snap: '.testcard-slot',
        snapMode: 'inner',
        snapTolerance: '22',
        stack: '.hand'
    });
      removeCard(i)
}

function addHand(i) {
  hand.push(i);
}

function shuffleDeck(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

function dealCard(i) {
  if (decklist == 0) return;
  $('#hand').append(`<div class="testcard-slot-row"><div class="hand"><img src="https://yugiohprices.com/api/card_image/${decklist[i]}" /></div>`)
    addHand(decklist[i])
    $('.hand').css('border', 'none')
    $('.hand').draggable
    ({  
        snap: '.card-slot',
        snapMode: 'inner',
        snapTolerance: '22',
        stack: '.hand'
    });
    removeCard(i)
    $('#deckcount span').text(decklist.length)
    if ($('#deckmenu').dialog('isOpen')) {
      if (decklist == 0) {$('#deckmenu').dialog( "close" )}
      openDeck()
    }
}

function removeCard(c) {
  decklist.splice(c, 1)
}

function refreshDeck() {
      if (decklist.length > 0) {
      decklist = []
      hand = []
    }
  for (let card in playtest.main) {
    for (i = 0; i < Number(playtest.main[card].amount); i++) {
          decklist.push(playtest.main[card].name)
    }
  }
  $(function() {
      $('#deckcount span').text(decklist.length)
  })
}

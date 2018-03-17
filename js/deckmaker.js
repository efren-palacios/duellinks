// Main function
// =================
$(function() {
	var is_mobile = isMobile();
	
	if(is_mobile) {
		updatePopupsForMobile();
	}
	else {
		updatePopupsForDesktops();
	}
});

// Action handler functions
// ========================
$(window).resize( updateMobileInformation );

async function updateMobileInformation() {
	// Delay the update to sync with the page load
	await sleep(500);
	resizeSkillInformation();
};

// Helper functions
// =================
function isMobile() {
	if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) ) {
		return true;
	}
	else {
		return false;
	}
};

function updatePopupsForMobile() {
	// Update every card to display an image, whether in a deck or on a guide/article page
	$(".item a").each(function() {
		$(this).attr("href", "javascript:;").addClass("fancybox-card");
		$(this).attr("data-src", "#fancyboxCardDiv");
	});
	$(".markdown-item a").each(function() {
		$(this).attr("href", "javascript:;").addClass("fancybox-card");
		$(this).attr("data-src", "#fancyboxCardDiv");
	});
	
	// Update instances of skills/cards to conform for the fancybox plugin 
	$(".card-hover").each(function() {
		if($(this).attr('name') == 'skillPopup') {
			$(this).replaceWith($('<a class="fancybox-skill" data-src="#fancyboxSkillDiv" href="javascript:;">' + $(this).text() + '</a>'));    
		}
		else {
			$(this).replaceWith($('<a class="fancybox-card" data-src="#fancyboxCardDiv" href="javascript:;">' + $(this).text() + '</a>'));
		}
	})
	
	// Set the fancybox for card images
	$().fancybox({
		buttons: ['close'],
		selector: '.fancybox-card',
		smallBtn: false,
		afterShow: obtainCardInformation,
		afterClose: closeMobilePopup
	});
	
	// Set the fancybox for skill popups
	$().fancybox({
		buttons: ['close'],
		selector: '.fancybox-skill',
		smallBtn: false,
		afterShow: obtainSkillInformation,
		afterClose: closeMobilePopup
	});
};

function obtainSkillInformation( instance, current ) {
	// Obtain the skill
	var skill = $(current.opts.$orig).html();
	
	// Obtain the skill data
	let websiteLink = location.protocol + "//" + location.hostname;
	if(location.port){
		websiteLink += ":" + location.port;
	}
	axios.get(websiteLink + "/data/skillsChars.json").then( function( response ) {
		displaySkillInformation( response, skill, websiteLink );
	});
};

function displaySkillInformation( response, skill, websiteLink ) {
	// Slice the data
	let characterWhoUses = [];
	let exclusive = false;
	let desc = "No description available";
	let officialName = skill;
	for(var i = 0; i < response.data.length; i++){
		if(response.data[i].name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase() == skill.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase()){
			officialName = response.data[i].name;
			desc = response.data[i].desc;
			exclusive = response.data[i].exclusive;
			characterWhoUses.push(response.data[i].character);
			
			if(exclusive == true) {
				break;
			}
		}
	}
	let portaitName = characterWhoUses[0].toLowerCase().replace(" ", "-");
	
	// Update and display the data
	$('#skillTitle').html(officialName);
	$('#skillDescription').html(desc);
	var exclusiveString = (exclusive == true ? 'Skill exclusive to ' + characterWhoUses[0] + '' : 'Skill can be used by different characters.');
	$('#skillExclusive').html(exclusiveString); 
	var characterString = websiteLink + "/img/characters/portrait-" + (exclusive == true ? portaitName : 'vagabond') + ".png";
	$('#characterImage').one("load", function() {
		resizeSkillInformation();
		
		$('.fancybox-loading').hide();
		$('#skillFancybox').removeClass('hideSkillContainer');
	});
	$('#characterImage').attr('src', characterString);    
};

function resizeSkillInformation() {
	// Style the image for large skill descriptions
	var containerHeight = $('#characterImageContainer').height();
	var difference = Math.floor(containerHeight - 146); // Default height of all pics are 146
	$('#characterImage').css('padding-top', Math.floor(difference/2) + 'px');
};

function obtainCardInformation( instance, current ) {
	// Obtain the card name
	var cardName = $(current.opts.$orig).html();
	if(cardName.includes("<img")) {
		cardNameEnc = $(current.opts.$orig).find('img').attr("alt");
		cardName =decodeURIComponent(cardNameEnc);
	}
	
	// Obtain the card data
	let websiteLink = location.protocol + "//" + location.hostname;
	if(location.port){
		websiteLink += ":" + location.port;
	}
	let cardobtain = axios.get(websiteLink + "/data/cardObtain.json").then(function(r) {
		return r.data.filter(i => i.name == cardName)[0] || new Error('No Resource')
	});
	let cardinfo=JSON.parse(sessionStorage.getItem(cardNameEnc));
	
	if (!cardinfo) cardinfo = $.getJSON("https://query.yahooapis.com/v1/public/yql",
	{
		q:      "select * from json where url=\"https://yugiohprices.com/api/card_data/" + cardNameEnc + "?fmt=JSON\"",
		format: "json"
		}).then(function(r) {
		sessionStorage.setItem(cardNameEnc, JSON.stringify(r.query.results.json));
		return r.query.results.json;
	});
	Promise.all([cardobtain, cardinfo]).then(function(r) {
		displayCardInformation( r, websiteLink, cardName );
	});
};

function displayCardInformation( response, websiteLink, cardName ) {
	// Update and display the data
	if(response[0].rarity) {
		$('#cardRarity').attr('src', websiteLink + '/img/assets/' + response[0].rarity + '.png');
		$('#cardRarity').show();
	} 
	else {
		$('#cardRarity').hide();
	}
	$('#cardImage').one("load", function() {
		//resizeCardInformation();
		
		$('.fancybox-loading').hide();
		$('#cardFancybox').removeClass('hideSkillContainer');
	});
	$('#cardImage').attr('src', "https://images.weserv.nl/?url=yugiohprices.com/api/card_image/"+encodeURIComponent(cardName)+"&w=200&il&q=95");
	$('#cardName').html(cardName);
	if(response[1].data.family!="null" && response[1].data.level!="null") {
		$('#cardAttribLevel').html('Attribute: <span class="capitalize-text">' + response[1].data.family + ' | Level: ' + response[1].data.level + '</span>');
		$('#cardAttribLevel').show();
	} 
	else {
		$('#cardAttribLevel').hide();
	}
	if(response[1].data.type && response[1].data.type.includes("Fusion")) {
		var cardTextArray = response[1].data.text.split('\n');
		$('#cardMaterials').html('<i>' + cardTextArray[0] + '</i>');
		$('#cardMaterials').show();
		$('#cardText').html(cardTextArray[2]);
	} 
	else {
		$('#cardMaterials').hide();
		$('#cardText').html(response[1].data.text);
	}
	if(response[1].data.card_type=="monster") {
		$('#cardType').html('<b>[ </b><span class="capitalize-text">' + response[1].data.type + '</span><b> ]</b>');
	}
	else {
		$('#cardType').html('<b>[ </b><span class="capitalize-text">' + response[1].data.card_type + '</span> / ' + response[1].data.property +  '<b> ]</b>');
	}
	
	$('#cardAttackDefense').html((response[1].data.atk!="null" ? "<b>ATK/ </b>" + response[1].data.atk : "") + " " + (response[1].data.def!="null" ? "<b>DEF/ </b>" + response[1].data.def : ""));
	$('#cardObtain').html(response[0].how ? 'How to obtain: '+response[0].how : '');    
};



function closeMobilePopup() {
	$('#fancyboxSkillDiv').hide();
	$('#fancyboxCardDiv').hide();
	
	$('.fancybox-loading').show();
	
	$('#skillFancybox').addClass('hideSkillContainer'); 
	$('#cardFancybox').addClass('hideSkillContainer');
	
	$('#cardImage').css('padding-top', '');
	$('#cardRarity').css('padding-top', '');
};

function updatePopupsForDesktops() {
	let options =
	{
		style: { classes: 'qtip-dark qtip-shadow rounded' },
		show:  { 
			effect: function() { $(this).fadeIn(250); },
			event: false,
			solo: true
		},
		hide:  { 
			fixed: true, 
			effect: function() { $(this).fadeOut(250); },
			event: false 
		},
		content: { text: obtainTextForDesktops }        
	}
	
	// Manually show/hide the popup, as the listener for qtip
	// doesn't add the card/skill listeners correctly outside a deck
	$('.dcards').on('mouseenter', function() {
		options = updatePopupOptions($(this), options);
		
		var tooltips = $(this).qtip(options);
		var api = tooltips.qtip('api');
		api.show();
	});
	$('body').on('mouseenter', '.card-hover', function() {
		options = updatePopupOptions($(this), options);
		
		// Add additional needed options for card-hover elements 
		options.style.tip = false;
		options.position.viewport = $('.container');
		options.position.adjust.method = 'shift';
		options.position.adjust.x = 0;
		options.position.adjust.y = 0;
		
		var tooltips = $(this).qtip(options);
		var api = tooltips.qtip('api');
		api.show();
	}); 
};

function updatePopupOptions(cardElem, options) {
	var events = {
		visible: function(event, api) {
			tooltipVisible(event, api, cardElem, '.dcards');
		}
	}
	options.events = events;
	
	var itemOffset = cardElem.offset().left;
	var itemWidth = cardElem.width();
	var popupWidthAdjustment = 10; 
	var popupWidth = 500;
	var popupExtension = itemOffset + itemWidth + popupWidthAdjustment + popupWidth; 
	if(popupExtension > $('body').width()) {
		options.position = { 
			my: 'right center', 
			at: 'left center',
			adjust: {
				x: -10
			}
		}
	}  
	else {
		options.position = { 
			my: 'left center', 
			at: 'right center', 
			adjust: { 
				x: 10 
			} 
		}
	}
	
	return options;    
};

function obtainTextForDesktops( event, api ) {
	let websiteLink = location.protocol + "//" + location.hostname;
	if(location.port){
		websiteLink += ":" + location.port;
	}
	
	let type = $(this).attr('name');
	if(type == "cardPopup") {
		let name = (this).attr('alt');
		let namepure = decodeURIComponent(name);
		let cardobtain = axios.get(websiteLink + "/data/cardObtain.json").then(function(r) {
			return r.data.filter(i => i.name == namepure)[0] || new Error('No Resource')
		});
		//get carddata via yahoo yql from yugiohprices api
		
		let cardinfo=JSON.parse(sessionStorage.getItem(name));
		
		if (!cardinfo) cardinfo = $.getJSON("https://query.yahooapis.com/v1/public/yql",
		{
			q:      "select * from json where url=\"https://yugiohprices.com/api/card_data/" + name + "?fmt=JSON\"",
			format: "json"
			}).then(function(r) {
			sessionStorage.setItem(name, JSON.stringify(r.query.results.json));
			return r.query.results.json;
		});
		
		Promise.all([cardobtain, cardinfo]).then(function(r) {
			
			// Determine if fusion monster materials need to be displayed
			var cardText = r[1].data.text;
			var cardMaterials;
			if(r[1].data.type && r[1].data.type.includes('Fusion')) {
				var cardTextArray = r[1].data.text.split('\n');
				cardMaterials = cardTextArray[0];
				cardText = cardTextArray[2];
			}
			
			
			api.set('content.text',
			`<div class="preview">
			${ r[0].rarity ? `<img src="${websiteLink}/img/assets/${r[0].rarity}.png" class="rarityCard" />` : ""}
			<img class="cardPicBig" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/${name}&w=200&il&q=95" />
			</div>
			<div class="carddata"><b>${r[1].data.name}</b><br />
			${r[1].data.family!="null" ? '<p> Attribute: <span class="capitalize-text">' + r[1].data.family + "</span></p>" : ""}
			${r[1].data.level!="null" ? "<p> Level: " + r[1].data.level + "</p>" : ""}
			${r[1].data.card_type=="monster"
			? '<p><b>[ </b>' + r[1].data.type + '<b> ]</b></p>'
			: '<p><b>[ </b><span class="capitalize-text">' + r[1].data.card_type + '</span> / ' + r[1].data.property +  '<b> ]</b></p>'}  
			${cardMaterials ? '<p><i>' + cardMaterials + '</i></p>' : ""}
			<p>${cardText}</p>
			${r[1].data.atk!="null" ? "<p><b>ATK/ </b>" + r[1].data.atk : ""}
			${r[1].data.def!="null" ? "<b>DEF/ </b>" + r[1].data.def + '</p>' : ""}
			<p><u>How To Obtain</u></p>
			${ r[0].how ? `<p class="capitalize-text">${r[0].how}</p>` : 'Needs to be Added'}
			</div>`)
		});
		return "Loading card...";
	}
	else if(type == "skillPopup") {
		let name = $(this).html();
		axios.get(websiteLink + "/data/skillsChars.json").then( function( response ) {
			displayTextForSkillOnDesktops(response, name, api, websiteLink);
		});
		return "Loading skill...";
	}
};  

function displayTextForSkillOnDesktops(r, name, api, websiteLink) {
	let characterWhoUses = [];
	let exclusive = false;
	let desc = "No description available";
	let officialName = name;
	
	for(var i = 0; i < r.data.length; i++) {
		if(r.data[i].name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase() == name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase()){
			officialName = r.data[i].name;
			desc = r.data[i].desc;
			exclusive = r.data[i].exclusive;
			characterWhoUses.push(r.data[i].character);
			
			if(exclusive == true)
			break;
		}
	}
	
	let portaitName = characterWhoUses[0].toLowerCase().replace(" ", "-");
	
	api.set('content.text',
	`<div class="previewSkill"><img src="${websiteLink}/img/characters/portrait-${exclusive == true ? portaitName : 'vagabond'}.png" /></div>
	<div class="skilldata">
	<b>${officialName}</b><br/>
	<p>${desc}</p>
	${exclusive == true
	? '<p>Skill exclusive to ' + characterWhoUses[0] + '.</p>'
	: '<p>Skill can be used by different characters.</p>'}
	</div>`);
};

async function tooltipVisible( event, api, self, className ) {
	$('#qtip-' + api.id).on('mouseleave', function() {
		var tooltips = self.qtip();
		tooltips.hide();
		$('body').off('mouseleave', className);
		$('body').off('click.tooltip.off');
	});
	$('body').on('click.tooltip.off', function() {
		var tooltips = self.qtip();
		tooltips.hide();
		$('body').off('mouseleave', className);
		$('body').off('click.tooltip.off');
	});
	
	// Delay the mouseleave initialization until the tip is fully visible (.5 second)
	await sleep(500);
	
	$('body').on('mouseleave', className, function() {
		var tooltips = self.qtip();
		tooltips.hide();
		$('body').off('mouseleave', className);
		$('body').off('click.tooltip.off');
	});
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};		
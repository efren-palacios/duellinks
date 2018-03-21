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
		afterShow: obtainCardInformationForMobile,
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

function obtainCardInformationForMobile( instance, current ) {
	var cardName = $(current.opts.$orig).html();
	if(cardName.includes("<img")) {
		var cardNameEnc = $(current.opts.$orig).find('img').attr("alt");
		cardName = decodeURIComponent(cardNameEnc);
	}
	
	var card = new CardsAPI().search(cardName, displayCardInformationForMobile);
};

function displayCardInformationForMobile( card ) {	
	if(card.rarity.length > 0) {
		$('#cardRarity').attr('src', getWebsiteLink() + '/img/assets/' + card.rarity + '.png');
		$('#cardRarity').show();
	} 
	else {
		$('#cardRarity').hide();
	}
	$('#cardImage').one("load", function() {		
		$('.fancybox-loading').hide();
		$('#cardFancybox').removeClass('hideSkillContainer');
	});
	$('#cardImage').attr('src', new CardsAPI().getImageURL(card.name));
	$('#cardName').html(card.name);
	if(card.attribute.length > 0) {
		$('#cardAttribute').html('Attribute: ' + card.attribute);
		$('#cardAttribute').show();
	} 
	else {
		$('#cardAttribute').hide();
	} 
	if(card.level.length > 0) {
		$('#cardLevel').html('Level: ' + card.level);
		$('#cardLevel').show();
	} 
	else {
		$('#cardLevel').hide();
	}
	if(card.materials.length > 0) {
		$('#cardMaterials').html('<i>' + card.materials + '</i>');
		$('#cardMaterials').show();
	} 
	else {
		$('#cardMaterials').hide();
	}
	$('#cardText').html(card.description);
	$('#cardType').html('<b>[ </b><span class="capitalize-text">' + card.type + '</span><b> ]</b>');
	
	if(card.attack.length > 0) {
		$('#cardAttackDefense').html("<b>ATK/ </b>" + card.attack + " " + "<b>DEF/ </b>" + card.defense);
		$('#cardAttackDefense').show();
	}	
	else {
		$('#cardAttackDefense').hide();	
	}
	$('#cardObtain').html(card.obtain);
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
	let type = $(this).attr('name');
	if(type == "cardPopup") {
		let name = (this).attr('alt');
		let nameDecoded = decodeURIComponent(name);

		new CardsAPI().search(nameDecoded, displayTextForCardsOnDesktops(api));
		return "Loading card...";
	}
	else if(type == "skillPopup") {
		let name = $(this).html();
		axios.get(getWebsiteLink() + "/data/skillsChars.json").then( function( response ) {
			displayTextForSkillOnDesktops(response, name, api, getWebsiteLink());
		});
		return "Loading skill...";
	}
};  
 
function displayTextForCardsOnDesktops( api ) {
	return function( card ) {
		var clone = $('#desktopPopup').clone();

		if(card.rarity.length > 0) {
			clone.find('#cardDesktopRarity').attr('src', getWebsiteLink() + '/img/assets/' + card.rarity + '.png');
			clone.find('#cardDesktopRarity').show();
		} 
		else {
			clone.find('#cardDesktopRarity').hide();
		}
		clone.find('#cardDesktopImage').attr('src', new CardsAPI().getImageURL(card.name));
		clone.find('#cardName').html(card.name);
		if(card.attribute.length > 0) {
			clone.find('#cardAttribute').html('Attribute: ' + card.attribute);
			clone.find('#cardAttribute').show();
		} 
		else {
			clone.find('#cardAttribute').hide();
		} 
		if(card.level.length > 0) {
			clone.find('#cardLevel').html('Level: ' + card.level);
			clone.find('#cardLevel').show();
		} 
		else {
			clone.find('#cardLevel').hide();
		}
		if(card.materials.length > 0) {
			clone.find('#cardMaterials').html('<i>' + card.materials + '</i>');
			clone.find('#cardMaterials').show();
		} 
		else {
			clone.find('#cardMaterials').hide();
		}
		clone.find('#cardText').html(card.description);
		clone.find('#cardType').html('<b>[ </b><span class="capitalize-text">' + card.type + '</span><b> ]</b>');
		
		if(card.attack.length > 0) {
			clone.find('#cardAttackDefense').html("<b>ATK/ </b>" + card.attack + " " + "<b>DEF/ </b>" + card.defense);
		}	
		else {
			clone.find('#cardAttackDefense').hide();	
		}
		clone.find('#cardObtain').html(card.obtain);

		api.set('content.text', clone.show()[0]);	
	};
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
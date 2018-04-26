---
layout: blog
title: Deckbuilder preAlpha
author: Maggi64
category: page
comments: false
permalink: /deckbuilder/
sitemap: false
hide: true
---
<div class="section">
    <div class="row">
        <div class="col-sm-6 left-side">
            <div class="form-group">
                <label for="name">Deck name</label>
                <input type="text" class="form-control" id="name" name="fields[name]">
            </div>
            <div class="form-group">
                <label for="skill">Skill</label>
                <input type="text" class="form-control" id="skill" name="fields[skill]">
            </div>
            <div class="form-group">
                <label>Search a card</label>
                <input type="text" class="form-control" data-bind="textInput: searchTerm">
                <div id="deck" class="card-search">
                    <div id="cards" data-bind="foreach: filteredCards">
                        <div class="item" data-bind="attr: {'data-name': name}">
                            <a><img class="DBcards" data-bind="attr: { src: $root.GetCardUrl(name), alt:name }"></a> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6 right-side">
            <div class="form-group">
                <label>Your deck</label>
                <div id="deck-container">
                    <div id="deck" class="deckbuilder_deck">
                        <div id="cards" data-bind="foreach: selectedMainCards().sort(SortDeck)">
                            <div class="item" data-bind="attr: {'data-name': name, 'data-number': number}">
                                <a><img class="DBcards dcards" name="cardPopup" data-bind="attr: { src: $root.GetCardUrl(name), alt:name }"></a>
                            </div>
                        </div>
                    </div>
                    <label>Sidedeck</label>
                    <div id="deck" class="extra-deck">
                        <div id="cards" data-bind="foreach: selectedExtraCards().sort(SortDeck)">
                            <div class="item" data-bind="attr: {'data-name': name, 'data-number': number}">
                                <a><img class="DBcards dcards" name="cardPopup" data-bind="attr: { src: $root.GetCardUrl(name), alt:name }"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--<div class="form-group col-sm-12">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" name="fields[notes]" rows="3"></textarea>
        </div>-->
    </div>
    <button type="button" onclick="savedeck(1)" class="btn btn-info">Save to slot 1</button>
    <button type="button" onclick="loaddeck(1)" class="btn btn-secondary">Load slot 1</button>
    <button type="button" onclick="savedeck(2)" class="btn btn-info">Save to slot 2</button>
    <button type="button" onclick="loaddeck(2)" class="btn btn-secondary">Load slot 2</button>
    <button type="button" onclick="savedeck(3)" class="btn btn-info">Save to slot 3</button>
    <button type="button" onclick="loaddeck(3)" class="btn btn-secondary">Load slot 3</button>
    <button type="button" onclick="savedeck(4)" class="btn btn-info">Save to slot 4</button>
    <button type="button" onclick="loaddeck(4)" class="btn btn-secondary">Load slot 4</button>
    <button type="button" onclick="savedeck(5)" class="btn btn-info">Save to slot 5</button>
    <button type="button" onclick="loaddeck(5)" class="btn btn-secondary">Load slot 5</button>
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="btn btn-success" onclick="saveDeckOnline()" id="inputGroup-sizing-default">Save online</span>
        </div>
        <input type="text" class="form-control" id="decklink" aria-label="Default" aria-describedby="inputGroup-sizing-default" readonly>
    </div>
    <div class="text-center">
        <button type="button" onclick="pushToPlaytester()" class="btn btn-success">Push deck to playtester</button>
        <a style='margin: 1rem 0;' id="play" class='btn btn-success' role='button'><i class='fa fa-play-circle' aria-hidden='true'></i> Play Test Deck</a>
        <div id="playtest" title="Playtest Beta">
            <div class="game-board">
                <div class="actions">
                    <input type="button" value="Import" id="import" class="btn btn-outline-primary onlyDesktopBtn">
                    <input type="button" value="Export" id="export" class="btn btn-outline-primary onlyDesktopBtn">                    
                    <div class="tools">
                        <img src="https://i.imgur.com/BYD9LdN.png" class="token"/>
                        <img src="https://i.imgur.com/1AJdr5l.png" alt="" class="coin">
                        <img src="https://i.imgur.com/oPHhyyo.png" alt="" class="dice">
                        <div style="display:inline-block"><span id="results"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAABCAQAAAAoEQWKAAAADElEQVR42mNkGCAAAADyAAKG+BtxAAAAAElFTkSuQmCC"></span></div>
                    </div>
                </div>
                <div id="deckmenu" title="Cards in Deck"></div>
                <div class="testcard-slot-row" id="field">
                    <div class="testcard-slot"></div>
                    <div class="testcard-slot"></div>
                    <div class="testcard-slot" id="center-m-z"></div>
                    <div class="testcard-slot"></div>
                    <div class="testcard-slot" id="graveyard"></div>
                </div>
                <div class="testcard-slot-row">
                    <div class="testcard-slot"><img src="/img/assets/card-back.png" id="playerextradeck" />
                        <div id="deckcount"><p></p></div>
                    </div>
                    <div class="testcard-slot"></div>
                    <div class="testcard-slot"></div>
                    <div class="testcard-slot"></div>
                    <div class="testcard-slot"><img src="/img/assets/card-back.png" id="playerdeck" />
                        <div id="deckcount"><p></p></div>
                    </div>
                </div>
                <div id="hand">
                    <div class="game-board"></div>
                </div>
                <div class="actions">
                    <input type="button" value="New Hand" id="new" class="btn btn-outline-primary">
                    <input type="button" value="View Deck" id="view" class="btn btn-outline-primary">
                    <input type="button" value="Draw Card" id="deal" class="btn btn-outline-primary">
                    <input type="button" value="Shuffle Deck" id="shuffle" class="btn btn-outline-primary">
                </div>
                <div class="export" title="Export Code"></div>
                <div class="import" title="Import Code"></div>
            </div>          
        </div>
    </div>
    <b>Disclaimer: This is not the offical deckbuilder! <a href="/the-dev-team">The Dev-Team</a> is working on the new deckbuilder which will look and work much better. <br>This here is Frankenstein's monster created by Maggi64</b> <img src="https://cdn.frankerfacez.com/emoticon/236895/1">
</div>

---
layout: blog
title: "SUBMIT YOUR DECK"
category: other
hide: true
image: https://i.imgur.com/AJBBqGQ.png
author: Creative
date: 2017-11-12 18:05:00 +0200
comments: false
description: ADD PAGE DESCRIPTION HERE - MAX 150 CHARS
keywords: submit your deck, deck submission, showcase deck, upload deck, deck
permalink: /submit-your-deck/
---

<div class="section">
    <h2>SUBMIT YOUR DECK</h2>
    <p>lorem ipsum dolar sit amet</p>
</div>

<div class="section">
    <form class="deck-submission" method="post" action="https://api.staticman.net/v2/entry/orctamer/duellinks/master">
        <div class="row">
            <div class="form-group col-sm-6">
                <label for="name">Deck name</label>
                <input type="text" class="form-control" id="name" name="fields[name]">
            </div>
            <div class="form-group col-sm-6">
                <label for="author">Author</label>
                <input type="text" class="form-control" id="author" name="fields[author]">
            </div>
            <div class="form-group col-sm-6">
                <label for="deckType">Deck Type</label>
                <select class="form-control" id="deckType" name="fields[deckType]">
                    <option value=""></option>
                    {% assign tiers = site.data.tierlist %}
                    {% for tier in tiers %}
                        {% for type in tier.types %}
                            <option value="{{type.id}}">{{type.display}}</option>
                        {% endfor %}
                    {% endfor %}
                </select>
            </div>
            <div class="form-group col-sm-6">
                <label for="skill">Skill</label>
                <input type="text" class="form-control" id="skill" name="fields[skill]">
            </div>
            <div class="form-group col-sm-5 card-search">
                <label for="searcher">Search a card</label>
                <input type="text" class="form-control" data-bind="textInput: searchTerm">
                <div id="deck">
                    <div id="cards" data-bind="foreach: filteredCards">
                        <div class="item" data-bind="attr: {'data-name': name}">
                            <a><img class="dcards" data-bind="attr: { src: $root.GetCardUrl(name) }" alt=""></a> 
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group col-sm-7 card-display">
                <label for="searcher">Your deck</label>
                <div id="deck" class="user-deck">
                    <div id="cards" data-bind="foreach: selectedMainCards().sort(SortDeck)">
                        <div class="item" data-bind="attr: {'data-name': name, 'data-number': number}">
                            <a><img class="dcards" data-bind="attr: { src: $root.GetCardUrl(name) }" alt=""></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group col-sm-12">
                <label for="notes">Notes</label>
                <textarea class="form-control" id="notes" name="fields[notes]" rows="3"></textarea>
            </div>
            <div class="form-group col-sm-12 hidden" data-bind="foreach: selectedMainCards">
                <input type="text" class="form-control" data-bind="attr: { name: 'fields[main' + $index() + ']', value: name}">
            </div>
            <div class="form-group col-sm-1">
                <input type="button" id="SubmitDeck" class="btn btn-primary" value="Submit">
            </div>
        </div>
    </form>
</div>
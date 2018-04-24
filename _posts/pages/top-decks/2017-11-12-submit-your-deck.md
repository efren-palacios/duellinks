---
layout: blog
title: Submit Your Deck
author: Creative
category: page
date: 2017-11-12 18:05:00 +0200
comments: false
permalink: /submit-your-deck/
sitemap: false
hide: true
---

<!-- TODO: Change permalink to /top-decks/submit-your-deck/ but also adjust url BELOW and in the DLM DISCORD APP -->

<div id="season-end" class="hidden" data-date="{{site.season-end}}"></div>

<div class="section">
    <h2>SUBMIT YOUR DECK</h2>
    <p>This page is meant for our discord members who have reached King of Games in the current season and who want to showcase the deck that they reached it with. We display these KoG decks on our <a href="/top-decks/">top decks</a> page as an informative overview and guideline of what kind of decks are being used to reach KoG with.</p>
    <p id="kog-status"></p>
    <a id="discord-login-button" class="btn btn-info" role="button">Log in</a>
</div>

<div class="section">
    <form class="deck-submission hidden" id="deck-sub-form" method="post" action="https://api.staticman.net/v2/entry/orctamer/duellinks/master">
        <div class="row">
            <div class="col-sm-5 left-side">
                <div class="form-group">
                    <label for="name">Deck name</label>
                    <input type="text" class="form-control" id="name" name="fields[name]">
                </div>
                <div class="form-check tpc-checkbox-container">
                    <input class="form-check-input" type="checkbox" id="tpc" name="fields[tpc]">
                    <label class="form-check-label" for="tpc">Top Player Council</label> 
                </div>
                <div class="form-group">
                    <label for="deckType">Deck Type</label>
                    <select class="form-control" id="deckType" name="fields[deckType]">
                        <option value=""></option>
                        {% assign tiers = site.data.tierlist %}
                        {% for tier in tiers %}
                            {% if tier.category != "Archive" %}
                                {% for type in tier.types %}
                                    <option value="{{type.id}}">{{type.display}}</option>
                                {% endfor %}
                            {% endif %}
                        {% endfor %}
                    </select>
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
                                <a><img class="dcards" data-bind="attr: { src: $root.GetCardUrl(name) }" alt=""></a> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-7 right-side">
                <div class="form-group">
                    <label for="author">Author</label>
                    <input type="text" class="form-control" id="author" name="fields[author]">
                </div>
                <div class="form-group">
                    <label>Your deck</label>
                    <div id="deck-container">
                        <div id="deck">
                            <div id="cards" data-bind="foreach: selectedMainCards().sort(SortDeck)">
                                <div class="item" data-bind="attr: {'data-name': name, 'data-number': number}">
                                    <a><img class="dcards" data-bind="attr: { src: $root.GetCardUrl(name) }" alt=""></a>
                                </div>
                            </div>
                        </div>
                        <div id="deck" class="extra-deck">
                            <div id="cards" data-bind="foreach: selectedExtraCards().sort(SortDeck)">
                                <div class="item" data-bind="attr: {'data-name': name, 'data-number': number}">
                                    <a><img class="dcards" data-bind="attr: { src: $root.GetCardUrl(name) }" alt=""></a>
                                </div>
                            </div>
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
            <div class="form-group col-sm-12 hidden" data-bind="foreach: selectedExtraCards">
                <input type="text" class="form-control" data-bind="attr: { name: 'fields[extra' + $index() + ']', value: name}">
            </div>
            <div class="form-group col-sm-1">
                <input type="button" id="SubmitDeck" class="btn btn-primary" value="Submit">
            </div>
        </div>
    </form>
    <div class="post-submission-wrapper">
        <span id="post-submit-message"></span>
    </div>
</div>
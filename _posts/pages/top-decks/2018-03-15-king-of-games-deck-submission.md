---
layout: blog
title: King of Games - Deck Submission
author: unpreceden7ed
category: top-decks
date: 2018-03-15
description: This page allows users to submit their most recent King of Games deck to be displayed on the site, provided proof of obtaining the rank.
keywords: king of games, ranked decks, top decks, top tier decks, deck submission
permalink: /king-of-games-deck-submission/
---

{% include heading.html title=page.title %}

<div class="section header">
    <p>Have you made the King of Games rank this season and want your deck displayed on the site? Simply submit the following information below and provided proof of rank, your deck will be listed among the others this season.
    </p>
</div>

<div class="section">
    <form id="kog_deck_submission">
        <div class="form-group">
            <label for="author">Author</label>
            <input type="text" class="form-control" id="author">
        </div>
        <div class="form-group">
            <label for="proof">Proof of Rank</label>
            <input type="file" class="form-control-file" id="proof" multiple>
        </div>
        <div class="form-group">
            <label for="deck_pics">Deck</label>
            <input type="file" class="form-control-file" id="deck_pics" multiple>
        </div>
        <div class="form-group">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>             
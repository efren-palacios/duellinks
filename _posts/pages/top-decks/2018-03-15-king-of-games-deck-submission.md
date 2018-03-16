---
layout: blog
title: King of Games - Deck Submission
author: unpreceden7ed
category: top-decks
date: 2018-03-15
description: This page allows users to submit their most recent King of Games deck to be displayed on the site, provided proof of obtaining the rank.
keywords: king of games, ranked decks, top decks, top tier decks, deck submission
permalink: /king-of-games-deck-submission/
scripts: kog-deck-submission.js
hide: true
---

{% include heading.html title=page.title %}

<div class="section header">
    <p>Have you made the King of Games rank this season and want your deck displayed on the site? Simply submit the following information below and provided proof of rank, your deck will be listed among the others this season.
    </p>
</div>

<div class="section">
    <form id="kog-deck-submission-form" novalidate>
        <div class="form-group">
            <label for="author">Author</label>
            <input type="text" class="form-control" id="author" required>
            <div class="invalid-feedback">
                Please enter an author's name  
            </div>
        </div>
        <div class="custom-file">            
            <input type="file" class="custom-file-input" id="proof" multiple>
            <label for="proof" class="custom-file-label">Enter pictures for your proof of rank this season</label>
            <small class="form-text text-muted">You need to submit two forms of proof: a screenshot indicating your last win streak for the season (
                <a data-src="#kog-proof-1" href="javascript:;" class="fancybox">
                    example
                </a>
            ) and a screenshot of the King of Games ranking with your username (
                <a data-src="#kog-proof-2" href="javascript:;" class="fancybox">
                    example
                </a>
            )
            </small>
            <div class="invalid-feedback">
                Please enter both pictures of ranking proof 
            </div>
        </div>
        <div class="custom-file">            
            <input type="file" class="custom-file-input" id="deck-pics" multiple required>
            <label for="deck-pics" class="custom-file-label">Enter picture(s) for your deck</label>
            <small class="form-text text-muted">Be sure and include your extra deck, if needed</small>
            <div class="invalid-feedback">
                Please enter the picture(s) of your deck  
            </div> 
        </div>
        <div class="form-group">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>          

<div style="display: none;" id="kog-proof-1" class="kog-proof">
	<img src="/img/pages/top-decks/kog-submission/kog_proof_1.png" class="kog-proof-picture">
</div>   

<div style="display: none;" id="kog-proof-2" class="kog-proof">
	<img src="/img/pages/top-decks/kog-submission/kog_proof_2.png" class="kog-proof-picture">
</div>
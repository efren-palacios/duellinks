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
    <p><b>Note: This deck submission is for non-Discord members only. If you are a member of the Duel Links Meta Discord, please continue using the submission process on that server in the appropriate channels.</b></p>     
</div>

<div class="section">
    <form id="kog-deck-submission-form" novalidate action="https://formspree.io/
duel-links-deck-submission@googlegroups.com"
      method="POST">
        <div class="form-group">
            <label for="author">Author</label>
            <input type="text" class="form-control" id="author" required name="author">
            <div class="invalid-feedback">
                Please enter an author's name  
            </div>
        </div>
        <div class="form-group row" id="proof-form-group">            
            <label for="proof" class="col-12">Ranking proof pictures</label>
            <input type="hidden" role="uploadcare-uploader" name="proof" data-images-only="true" data-multiple="true" id="proof"/>
            <small class="form-text text-muted col-12">You need to submit two forms of proof: a screenshot indicating your last win streak for the season (
                <a data-src="#kog-proof-1" href="javascript:;" class="fancybox">
                    example
                </a>
            ) and a screenshot of the King of Games ranking with your username (
                <a data-src="#kog-proof-2" href="javascript:;" class="fancybox">
                    example
                </a>
            )
            </small>
            <div class="invalid-feedback col-12">
                Please enter both pictures of ranking proof 
            </div>
        </div>
        <div class="form-group row" id="deck-form-group">            
            <label for="deck-pics" class="col-12">Deck picture(s)</label>
            <input type="hidden" role="uploadcare-uploader" name="deck-pics" data-images-only="true" data-multiple="true" id="deck-pics"/>
            <small class="form-text text-muted col-12">Be sure and include your extra deck, if needed</small>
            <div class="invalid-feedback col-12">
                Please enter the picture(s) of your deck  
            </div> 
        </div>
        <div class="form-group">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" rows="3" name="notes"></textarea>
        </div>
        <input type="hidden" name="_subject" id="subject"/>
        <button type="submit" class="btn btn-primary" id="submit">Submit</button>
    </form>
</div>          

<div style="display: none;" id="kog-proof-1" class="kog-proof">
	<img src="/img/pages/top-decks/kog-submission/kog_proof_1.png" class="kog-proof-picture">
</div>   

<div style="display: none;" id="kog-proof-2" class="kog-proof">
	<img src="/img/pages/top-decks/kog-submission/kog_proof_2.png" class="kog-proof-picture">
</div>
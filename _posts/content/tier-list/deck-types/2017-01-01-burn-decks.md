---
layout: blog
date: 2017-10-07
title: Introduction to Burn Decks
author: 
has-profile: false
category: tier-list
sub-category: deck-type
deck-type: burn-decks
image: /img/content/tier-list/deck-types/default.jpg
comments: false
description: A quick introduction to the Burn deck type. View sample deck, core cards, tech cards, quick tips, guides, videos and other information.
keywords: burn, burn decks, deck type, information, sample deck, core cards, tech cards, quick tips, guides, videos
permalink: /tier-list/deck-types/burn-decks/
hide: true
---

{% assign deck-type-name = page.deck-type | getDeckTypeName %}
{% include guides/heading.html deck-type=deck-type-name author=page.author hidden=page.hide %}
{% unless page.hide %}

<!-- CONTENT GOES HERE -->

{% include guides/guides.html deckType=page.deck-type %}

{% include guides/videos.html videos='' %}

{% endunless %}
{% include decktype_decks.html deckType=page.deck-type %}

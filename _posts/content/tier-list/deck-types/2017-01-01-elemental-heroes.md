---
layout: blog
date: 2018-01-16
title: Introduction to Elemental Heroes
author: 
has-profile: false
category: tier-list
sub-category: deck-type
deck-type: elemental-heroes
image: /img/content/tier-list/deck-types/default.jpg
comments: false
description: A quick introduction to the Elemental Heroes deck type. View sample deck, core cards, tech cards, quick tips, guides, videos and other information.
keywords: elemental heroes, deck type, information, sample deck, core cards, tech cards, quick tips, guides, videos
permalink: /tier-list/deck-types/elemental-heroes/
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

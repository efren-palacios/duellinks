---
layout: blog
date: 2017-12-06
title: Introduction to Mill Decks
author: 
has-profile: false
category: tier-list
sub-category: deck-type
deck-type: mill-decks
image: /img/content/tier-list/deck-types/default.jpg
comments: true
description: A quick introduction to the Mill deck type. View sample deck, core cards, tech cards, quick tips, guides, videos and other information.
keywords: mill, mill decks, deck type, information, sample deck, core cards, tech cards, quick tips, guides, videos
permalink: /tier-list/deck-types/mill-decks/
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
{% include top-decks-season-archive.html %}
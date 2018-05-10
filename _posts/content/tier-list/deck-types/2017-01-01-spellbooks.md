---
layout: blog
date: 2017-12-06
title: Introduction to Spellbooks
author: 
has-profile: false
category: tier-list
sub-category: deck-type
deck-type: spellbooks
image: /img/content/tier-list/deck-types/default.jpg
comments: true
description: A quick introduction to the Spellbooks Deck type. View sample Deck, core cards, tech cards, quick tips, guides, videos and other information.
keywords: spellbooks, deck type, information, sample deck, core cards, tech cards, quick tips, guides, videos
permalink: /tier-list/deck-types/spellbooks/
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
---
layout: blog
title: Hammer Shark
author: pll
category: deck-type-page
date: 2017-12-06
comments: false
description: In depth information about Hammer Shark decks.
deck-type: hammer-shark
permalink: /tier-list/hammer-shark/ 
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
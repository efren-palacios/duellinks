---
layout: blog
title: Relinquished
category: deck-type-page
author: pll
date: 2017-12-06
comments: false
description: In depth information about Relinquished decks.
deck-type: relinquished
permalink: /tier-list/relinquished/ 
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
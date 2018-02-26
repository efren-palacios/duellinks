---
layout: blog
title: Stall Decks
author: Creative
category: page
sub-category: deck-type
date: 2018-01-24
comments: false
description: In depth information about Stall decks.
deck-type: stall-decks
permalink: /tier-list/stall-decks/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
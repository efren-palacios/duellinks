---
layout: blog
title: Dark Paladin
author: pll
category: deck-type-page
date: 2017-12-06
comments: false
description: In depth information about Dark Paladin decks.
deck-type: dark-paladin
permalink: /tier-list/dark-paladin/ 
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
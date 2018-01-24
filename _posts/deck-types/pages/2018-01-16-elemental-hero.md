---
layout: blog
title: Elemental Hero
category: deck-type-page
author: pll
date: 2018-01-10
comments: false
description: In depth information about Elemental Hero decks.
deck-type: elemental-hero
permalink: /tier-list/elemental-hero/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
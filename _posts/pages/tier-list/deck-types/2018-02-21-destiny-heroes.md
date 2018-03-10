---
layout: blog
title: Destiny Heroes
author: Creative
category: page
sub-category: deck-type
date: 2018-02-21
comments: false
description: In depth information about Aromages.
deck-type: destiny heroes
permalink: /tier-list/destiny-heroes/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
---
layout: blog
title: Hammer Shark
author: Creative
category: page
sub-category: deck-type
deck-type: hammer-shark
date: 2017-10-07
comments: false
description: In depth information about Hammer Shark decks.
permalink: /tier-list/hammer-shark/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
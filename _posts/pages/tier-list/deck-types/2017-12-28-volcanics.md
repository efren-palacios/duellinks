---
layout: blog
title: Volcanics
author: unpreceden7ed
category: page
sub-category: deck-type
date: 2017-12-28
comments: false
description: In depth information about Volcanics decks.
deck-type: volcanics
permalink: /tier-list/volcanics/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
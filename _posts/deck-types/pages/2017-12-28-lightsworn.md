---
layout: blog
title: Lightsworn
author: unpreceden7ed
category: deck-type-page
date: 2017-12-28
comments: false
description: In depth information about Lightsworn decks.
deck-type: lightsworn
permalink: /tier-list/lightsworn/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
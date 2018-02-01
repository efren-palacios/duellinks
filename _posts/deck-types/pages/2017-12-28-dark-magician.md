---
layout: blog
title: Dark Magician
author: unpreceden7ed
category: deck-type-page
date: 2017-12-28
comments: false
description: In depth information about Dark Magician decks.
deck-type: dark-magician
permalink: /tier-list/dark-magician/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html %}
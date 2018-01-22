---
layout: blog
title: Gladiator Beasts
category: deck-type-page
author: Dkayed
date: 2017-11-06
comments: false
description: A quick introduction to the gladiator beasts deck type. Learn how to play gladiator beasts in no time.
deck-type: gladiators
permalink: /tier-list/gladiators/
---

{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}

{% include guides/guide.html guide=guide %}

{% include decktype_decks.html deckType=page.deck-type %}

{% include top-decks-season-archive.html season=include.season %}
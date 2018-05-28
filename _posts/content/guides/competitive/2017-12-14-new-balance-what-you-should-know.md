---
layout: blog
title: Balance Skill - What You Should Know
author: pll; Superforms
category: guide
sub-category: competitive
image: /img/content/guides/new-balance-report/thumbnail.png
date: 2017-12-14
comments: false
description: A write-up about the new Balance skill by pll.
keywords: guide, balance, new, update, skill
deck-type: balance skill
permalink: /guides/competitive/new-balance-what-you-should-know/
---

{% include heading.html title=page.title author=page.author %}

### Introduction

Thanks to the Balance Math Managers on the Discord and everyone who helped with the math and contributing almost 500 datasets - you are awesome!

This [spreadsheet](https://goo.gl/ooRts5) is where we gathered all the datasets.

And remember, this is not data from the actual game, this is made using several test cases that were made in regular matches, but we have no real way of checking what the code of the game is actually doing.

### Overview

Remember the good old {Balance} when you could arrange your Deck in a particular way to guarantee you a specific number of Monsters, Spells and Traps in your starting hand? There’s no way to do that anymore, with the new Balance mechanic, the best you can do is **guarantee a minimum and a maximum**.

With the new {Balance} we can’t be so sure in exactly how many cards of a type we will open with, we now have a table of probabilities of how many of a type can you open given how many you have in the Deck.

It’s not that difficult, here we have the table of *Number of Cards in the Deck x Number of cards you open* (this table only works for a 20 card Deck):

<a name="table-1"></a>

[w75]
![Table 1 - Table of probabilities - Check notes for 15~19 card info](http://image.noelshack.com/fichiers/2017/50/4/1513213333-capture-d-ecran-2017-12-14-a-01-55-51.png)

As you can see from the table, no quantity of cards in the Deck gives you a 100% chance of opening with an exact number of cards like 5, 10 or 15 did before, giving you 1, 2 and 3 cards in your starting hand respectively.

But we can get some interesting results out of that like with 6 cards of a type in the Deck, you are guaranteed AT LEAST 1 of it in your starting hand. With that in mind, we can get what is the maximum and minimum cards of a type you can open with and gather it all up, which looks something like this:

<a name="graph-1"></a>

[w75]
![Graph 1 - Table of max/min in the starting hand](http://image.noelshack.com/fichiers/2017/50/4/1513213333-capture-d-ecran-2017-12-14-a-01-56-14.png)

So, for example, if you have 12 Monsters in your Deck, you can only open with 2 or 3 Monsters, never with 1 and never with 4!

#### Examples

1. A Deck with 5 Monsters, 7 Spells and 8 Traps:
    - You are guaranteed 1 Spell and 1 Trap since in the Deck you have 6 or more of them.
    - You cannot get more than 2 Spells or 2 Traps.
    - You are not guaranteed a Monster in your hand, but you can open with it about 60% of the time (check [Table 1](#table-1)). You can very rarely open with 2 Monsters.

2. A Deck with 13 Monsters, 3 Spells and 4 Traps:
    - Even though you don’t have 6 Traps nor 6 Spells, you are guaranteed 1 Trap or Spell since with 13 Monsters you can’t get 4 Monsters in your starting hand, so the slots missing are filled with Spell/Traps.
 
### Top Deck

You feel like your top Deck is getting influenced by Balance? You open without any Spells but you feel like every time it happens, there is a Spell in the top of your Deck… You're right! **Balance actually influences your top Deck.**

Why we think that? Look at these example stats carefully:

[w75]
![Table 2 - Stats about 5/8/7 Deck](http://image.noelshack.com/fichiers/2017/50/4/1513213334-capture-d-ecran-2017-12-14-a-01-56-45.png)

In this dataset, we got stats about the 5th card as well (the top Deck card), and as you can see, the probability of getting a Monster on the top Deck was **~40%**, top Decking a Spell was **~30%** and top Decking a Trap was **~30%**.
	
But given the number of cards of each type left on the Deck based on the percentage of each of the card ratios on the starting hand (if you opened with 1 Monster, 2 Spells and 1 Trap for example), if the top Deck was completely random, the probabilities should be Monsters with ~26%, Spells with ~40% and Traps with ~34%, which is not the case (Spells and Monsters are too far off to be lack of samples).

### The Averages

One really nice thing we got was the averages. If you graph the *Number of Cards of a Type in a Deck x Average Number in Starting Hand*, you get almost a straight line like:

<a name="graph-2"></a>

[w75]
![Graph 2 - Average number in hand x Number in the Deck - Check notes](http://image.noelshack.com/fichiers/2017/50/4/1513213333-capture-d-ecran-2017-12-14-a-01-57-03.png)

This is nice because we can now think about Balance in a pattern that respects an almost linear line with the average hands the skill will give you, not with the actual cards in your hand in a specific match. This is nice if you want to check how your Deck should behave on the long run.

### Notes

Notes about the [Table 1](#table-1):
- With 15 and 16 cards, we have a low sample size, so the probabilities are not accurate.
- We don’t have any data on 17, 18 and 19 from the time of making this document, if you want to see updated stats, check the Google Sheets document linked on the first page.

Notes about the [Graph 1](#graph-1):
- With 15 and 16 cards, we have a low sample size, so the min/max are not 100% certain although we are pretty confident it is right.
- We don’t have any data on 17, 18 and 19 from the time of making this document, but it’s pretty safe to assume that it will continue the trend of 16. There’s no reason why the minimum amount would drop to 2.

Notes about the [Graph 2](#graph-2):
- With 15 and 16 cards, we have a low sample size, so the averages are not 100% accurate.
- We don’t have any data on 17, 18 and 19 from the time of making this document, so the graph is brute forced linear on those 3 values.
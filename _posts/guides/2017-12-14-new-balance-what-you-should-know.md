---
layout: blog
title: New Balance - What you should know
category: useful-guide
author: pll
image: /img/guides/new-balance-report/thumbnail.png
date: 2017-12-14
comments: false
description: A write-up about the new Balance skill by pll.
keywords: guide, balance, new, update, skill
deck-type: balance skill
permalink: /guides/new-balance-what-you-should-know/
---

# New Balance - What you should know

### Introduction

Thanks to the Balance-Math Managers on the DLM Discord and everyone who helped with the math and with the almost 500 datasets, you are awesome!

The spreadsheet where we gathered all the datasets: https://goo.gl/ooRts5

And remember, this is not data from the actual game, this is made using several test cases that were made in regular matches, but we have no real way of checking what the code of the game is actually doing.

*Lucas “pll”*

### The New balance - Basics

Remember the good old balance when you could arrange your deck in a particular way to guarantee you a specific number of monsters, spells and traps in your starting hand? There’s no way to do that anymore, with the new balance mechanic, the best you can do is **guarantee a minimum and a maximum**.

With the new balance we can’t be so sure in exactly how many cards of a type we will open with, we now have a table of probabilities of how many of a type can you open given how many you have in the deck.

It’s not that difficult, here we have the table of *Number of Cards in the deck x Number of cards you open* (PS. This table only works for a 20 card deck):

![Table 1 - Table of probabilities - Check notes for 15~19 card info](http://image.noelshack.com/fichiers/2017/50/4/1513213333-capture-d-ecran-2017-12-14-a-01-55-51.png)

As you can see from the table, no quantity of cards in the deck gives you a 100% chance of opening with an exact number of cards like 5, 10 or 15 did before, giving you 1, 2 and 3 cards in your starting hand respectively.

But we can get some interesting results out of that like with ***6 cards of a type in the deck, you are guaranteed AT LEAST 1 of it in your starting hand***.

With that in mind, we can get what is the maximum and minimum cards of a type you can open with and gather it all up, which looks something like this:

![Graph 1 - Table of max/min in the starting hand](http://image.noelshack.com/fichiers/2017/50/4/1513213333-capture-d-ecran-2017-12-14-a-01-56-14.png)

So, for example, if you have 12 monsters in your deck, you can only open with 2 or 3 of that monster, never with 1 and never with 4!

### Examples:

 1. A deck with 5 monsters, 7 spells and 8 traps:
 
 - You are guaranteed 1 spell and 1 trap since in the deck you have 6 or more of them.
 - You cannot get more than 2 spells or 2 traps.
 - You are not guaranteed a monster in your hand, but you can open with it about 60% of the time (check table 1). You can very rarely open with 2 monsters
 
 2. A deck with 13 monsters, 3 spells and 4 traps:
 
 - Even though you don’t have 6 traps nor 6 spells, you are guaranteed 1 trap or spell since with 13 monsters you can’t get 4 monsters in your starting hand, so the slots missing are filled with spell/traps.
 
### The New balance - Top Deck

You feel like your top deck is getting influenced by balance? You open without any spells but you feel like every time it happens, there is a spell in the top of your deck… You are right! **Balance actually influences your top deck.**

Why we think that? Look at these example stats carefully:

![Table 2 - Stats about 5/8/7 deck](http://image.noelshack.com/fichiers/2017/50/4/1513213334-capture-d-ecran-2017-12-14-a-01-56-45.png)

In this dataset, we got stats about the 5th card as well (the top deck card), and as you can see, the probability of getting a monster on the top deck was **~40%**, top decking a spell was **~30%** and top decking a trap was **~30%**.
	
But given the number of cards of each type left on the deck based on the percentage of each of the card ratios on the starting hand (if you opened with 1 monster, 2 spells and 1 trap for example), if the top deck was completely random, the probabilities should be monsters with ~26%, spells with ~40% and traps with ~34%, which is not the case (spells and monsters are too far off to be lack of samples).

### The New balance - The Averages

One really nice thing we got was the averages. If you graph the *Number of Cards of a Type in a Deck x Average Number in Starting Hand*, you get almost a straight line like:

![Graph 2 - Average number in hand x Number in the deck - Check notes](http://image.noelshack.com/fichiers/2017/50/4/1513213333-capture-d-ecran-2017-12-14-a-01-57-03.png)

This is nice because we can now think about balance in a pattern that respects an almost linear line with the average hands the skill will give you, not with the actual cards in your hand in a specific match. This is nice if you want to check how your deck should behave on the long run.

### Notes

Notes about the Table 1:

 - With 15 and 16 cards, we have a low sample size, so the probabilities are not accurate.
 - We don’t have any data on 17, 18 and 19 from the time of making this document, if you want to see updated stats, check the Google Sheets document linked on the first page.

Notes about the Graph 1:

 - With 15 and 16 cards, we have a low sample size, so the min/max are not 100% certain although we are pretty confident it is right.
 - We don’t have any data on 17, 18 and 19 from the time of making this document, but it’s pretty safe to assume that it will continue the trend of 16. There’s no reason why the minimum amount would drop to 2.

Notes about the Graph 2:

 - With 15 and 16 cards, we have a low sample size, so the averages are not 100% accurate.
 - We don’t have any data on 17, 18 and 19 from the time of making this document, so the graph is brute forced linear on those 3 values.


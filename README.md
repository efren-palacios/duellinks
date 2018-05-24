## About

This is the project code of the Duel Links Meta website. 

## Markdown

### Standard

Articles and other content can be marked up with markdown. Markdown is an easy to learn, easy to use formatting language which makes you able to format a post in a way that makes it visually organized and pleasant to read. No knowledge of html and css is required. Markdown handles that for you. There are plenty of guides out there which explain you all the nifty features of markdown but one that we recommend is the guide by ghost.

https://blog.ghost.org/markdown/

Please read this very carefully to learn all of its features so you can start writing up articles in no time!

### Custom DLM Extensions

Next to this handy default markdown syntax, the DLM dev team has also provided some extra markdown extensions to accomodate for some special needs. These extensions will only work on our website as we have developed them to meet the DLM requirements.

#### Card hovers

This is probably the extension that you'll be using the most. A very straightforward syntax which displays the card name that you provide but adds a hover effect on it. The hover effect is a detailed description of the card so users can read its effects instantly without having to google them.

__Example__

```
{Dark Magician}
```

__Note__

When the given card name is also a skill, you can force the system to treat it as a card by adding an extra ! symbol.

```
{!Destiny Draw}
```

#### Skill hovers

Pretty much the same as card hovers, but for skills. Provides a hoverable box with details about the skill.

__Example__

```
{Restart}
```

#### Profile links

One of the newest to join the crew. This one lets you create links to profiles without having to worry about the url of the profile. It will also color the user name depending on his/her role.

__Example__

```
{#Yamy Hammy}
```

#### Decklists

One of the most useful extensions that we provide, the markdown decklist feature. It has a pretty basic syntax which allows you to create a decklist box with hoverable cards and an optional skill at the top.

__Example__

```
[deck:Balance](Alien Overlord;Alien Telepath;Alien Telepath;Alien Telepath;Alien Warrior;Alien Warrior;Alien Warrior;Alien Grey;Alien Grey;Anti-Magic Arrows;Enemy Controller;Enemy Controller;Enemy Controller;"A" Cell Recombination Device;"A" Cell Recombination Device;"A" Cell Recombination Device;Powerful Rebirth;Powerful Rebirth;Wall of Disruption;Brainwashing Beam;Brainwashing Beam;Brainwashing Beam)
```

__Without a skill__

```
[deck](Cosmic Cyclone;Forbidden Chalice;Super Rush Headlong;Super Rush Headlong;Straight Flush)
```

As you can see above, a decklist does not necessarily need to be an actual deck but it can also be used for a regular box of cards. Examples of this are side decks, drop rewards boxes and so on. Basically anything to group a list of cards together.


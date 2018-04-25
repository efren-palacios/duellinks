var SkillsTableViewModel = {
    originalSkills: [],
    displayedSkills: ko.observableArray()
}

$(document).ready(function() {
    $.getJSON("/data/skills.json", function(data) {
        var sortedSkills = data.sort(function(skillA, skillB){
            if(skillA.name < skillB.name) {
                return -1;
            }

            if(skillA.name > skillB.name) {
                return 1;
            }

            return 0; // names are equal
        });

        var characterLinks = [
            {
                "name": "mokuba",
                "link": "/img/characters/portrait-mokuba.png"
            },
            {
                "name": "crowler",
                "link": "/img/characters/portrait-vellian-crowler.png"
            }
        ];
        $(sortedSkills).each(function(index, skill) {
            skill.image = '/img/characters/portrait-' + (skill.exclusive ? skill.characters[0].name.toLowerCase().replace(" ", "-") : 'vagabond') + '.png'
            $(characterLinks).each(function(index, character) {
                if (skill.image.includes(character.name)) {
                    skill.image = character.link;
                }
            });

            skill.exclusiveDisplay = skill.exclusive ? 'Yes' : 'No';
        }); 

        SkillsTableViewModel.originalSkills = sortedSkills;
        SkillsTableViewModel.displayedSkills = ko.observableArray(sortedSkills);

        ko.applyBindings(SkillsTableViewModel);
    });
});
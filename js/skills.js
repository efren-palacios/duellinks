var SkillsTableViewModel = {
    originalSkills: [],
    displayedSkills: ko.observableArray()    
}

var CharacterFiltersViewModel = {
    characters: [],
    activeCharacter: ko.observable(""),
    filterByCharacter: function(character) {
        if(CharacterFiltersViewModel.activeCharacter() != character.name) {
            SkillsTableViewModel.displayedSkills($(SkillsTableViewModel.originalSkills).filter(function(index, skill) {
                for(var i = 0; i < skill.characters.length; i++) {
                    if(character.name == skill.characters[i].name) return true;
                }
                return false; 
            }));

            CharacterFiltersViewModel.activeCharacter(character.name);

            $('#skillSearch').val("");
            $('#searchButton').attr('disabled', 'disabled'); 
        }
        else {
            SkillsTableViewModel.displayedSkills(SkillsTableViewModel.originalSkills);

            CharacterFiltersViewModel.activeCharacter("");
        }                
    }
}

$(document).ready(function() {
    $.getJSON("/data/skills.json", function(data) {
        var sortedSkills = data.sort(function(skillA, skillB) {
            var exclusiveResult = (skillA.exclusive && !skillB.exclusive) ? -1 : (!skillA.exclusive && skillB.exclusive) ? 1 : 0;  
            if(exclusiveResult != 0) return exclusiveResult;

            var nameResult = (skillA.name < skillB.name) ? -1 : (skillA.name > skillB.name) ? 1 : 0;
            return nameResult; 
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

            if(skill.exclusive) {
                skill.obtainString = skill.characters[0].name + " by " + skill.characters[0].how + " Reward"; 
                skill.obtainLink = false;
            }
            else {
                skill.obtainLink = true;
                skill.obtainString = "";
            } 
        }); 

        SkillsTableViewModel.originalSkills = sortedSkills;
        SkillsTableViewModel.displayedSkills = ko.observableArray(sortedSkills);

        ko.applyBindings(SkillsTableViewModel, $('#SkillsTable')[0]);

        initializeCharacterFilters(data);
    });

    $('#skillSearch').keyup(function() {
        if($(this).val().length > 1) {
            $('#searchButton').removeAttr('disabled');
        }
        else {
            $('#searchButton').attr('disabled', 'disabled');
        }
    });

    $('#searchButton').click(filterBySearch);
    $('#skillSearch').change(function() {
        if($(this).val().length > 1) filterBySearch();
    });
    $('#clearSearchButton').click(resetFilterSearch);
});

function initializeCharacterFilters(skills) {
    $.getJSON("/data/characters.json", function(data) {
        $(data).each(function(index, character) {
            character.skillCount = $(skills).filter(function(index, skill) {
                for(var i = 0; i < skill.characters.length; i++) {
                    if(skill.characters[i].name == character.name) return true;
                }
                return false;
            }).length;

            character.gx = character.season == 'gx' ? true : false;
            character.dm = character.season == 'dm' ? true : false;
        });

        CharacterFiltersViewModel.characters = data;

        ko.applyBindings(CharacterFiltersViewModel, $('#characterFiltersGX')[0]);
        ko.applyBindings(CharacterFiltersViewModel, $('#characterFiltersDM')[0]);
    });
};

function filterBySearch() {
    var searchTerm = $('#skillSearch').val();
    
    SkillsTableViewModel.displayedSkills($(SkillsTableViewModel.originalSkills).filter(function(index, skill) {
        if(skill.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        return false;
    }));

    CharacterFiltersViewModel.activeCharacter("");
};

function resetFilterSearch() {
    SkillsTableViewModel.displayedSkills(SkillsTableViewModel.originalSkills);

    $('#skillSearch').val("");
    $('#searchButton').attr('disabled', 'disabled');    

    CharacterFiltersViewModel.activeCharacter("");
};
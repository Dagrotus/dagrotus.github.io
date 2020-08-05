class Sprite{
    constructor(title, id, name, image, type){
        this.title = title;
        this.id = id;
        this.name = name;
        this.image = image;
        this.type = type;
    }
}

var sprites = [
    new Sprite('Bilgewater', 5, 'Bilgewater', 'img/sprites/5.png', 'Faction'),
    new Sprite('Demacia', 0, 'Demacia', 'img/sprites/0.png', 'Faction'),
    new Sprite('Freljord', 18, 'Freljord', 'img/sprites/18.png', 'Faction'),
    new Sprite('Ionia', 11, 'Ionia', 'img/sprites/11.png', 'Faction'),
    new Sprite('Noxus', 1, 'Noxus', 'img/sprites/1.png', 'Faction'),
    new Sprite('Piltover', 19, '', 'img/sprites/19.png', 'Faction'),
    new Sprite('Shadow isles', 12, 'Shadowisles', 'img/sprites/12.png', 'Faction'),
    new Sprite('All factions', 17, '', 'img/sprites/17.png', 'Faction'),
    new Sprite('Targon', 6, '', 'img/sprites/6.png', 'Faction'),
    new Sprite('Shurima', 7, '', 'img/sprites/7.png', 'Faction'),
    new Sprite('Void', 2, '', 'img/sprites/2.png', 'Faction'),
    new Sprite('Zaun', 20, '', 'img/sprites/20.png','Faction'),
    new Sprite('Bandle city', 10, '', 'img/sprites/10.png', 'Faction'),
    new Sprite('Level up: empty', 13, '', 'img/sprites/13.png', 'Levelup'),
    new Sprite('Level up: half', 8, '', 'img/sprites/8.png', 'Levelup'),
    new Sprite('Level up: full', 3, '', 'img/sprites/3.png', 'Levelup'),
    new Sprite('Common wildcard', 9, '', 'img/sprites/9.png', 'Wildcard'),
    new Sprite('Rare wildcard', 4, '', 'img/sprites/4.png', 'Wildcard'),
    new Sprite('Epic wildcard', 15, '', 'img/sprites/15.png', 'Wildcard'),
    new Sprite('Champion wildcard', 16, '', 'img/sprites/16.png', 'Wildcard'),
    new Sprite('Shards', 14, '', 'img/sprites/14.png', 'Currency'),
    new Sprite('Coin', 24, '', 'img/sprites/24.png', 'Currency'),
    new Sprite('Attune', '', 'Attune', 'img/sprites/Attune.png', 'Keyword'),
    new Sprite('Aura', '', 'Aura', 'img/sprites/Aura.png', 'Keyword'),
    new Sprite('Barrier', '', 'Barrier', 'img/sprites/Barrier.png', 'Keyword'),
    new Sprite('Burst', 21, 'Burst', 'img/sprites/21.png', 'Keyword'),
    new Sprite('Capture', '', 'Capture', 'img/sprites/Capture.png', 'Keyword'),
    new Sprite('Challenger', '', 'Challenger', 'img/sprites/Challenger.png', 'Keyword'),
    new Sprite('Deep', '', 'Deep', 'img/sprites/Deep.png', 'Keyword'),
    new Sprite('Double strike', '', 'DoubleStrike', 'img/sprites/DoubleStrike.png', 'Keyword'),
    new Sprite('Elusive', '', 'Elusive', 'img/sprites/Elusive.png', 'Keyword'),
    new Sprite('Ephemeral', '', 'Ephemeral', 'img/sprites/Ephemeral.png', 'Keyword'),
    new Sprite('Fast', 22, 'Fast', 'img/sprites/22.png', 'Keyword'),
    new Sprite('Fearsome', '', 'Fearsome', 'img/sprites/Fearsome.png', 'Keyword'),
    new Sprite('Fleeting', '', 'Fleeting', 'img/sprites/Fleeting.png', 'Keyword'),
    new Sprite('Frostbite', '', 'Frostbite', 'img/sprites/Frostbite.png', 'Keyword'),
    new Sprite('Immobile', '', 'Immobile', 'img/sprites/Immobile.png', 'Keyword'),
    new Sprite('Last breath', '', 'LastBreath', 'img/sprites/LastBreath.png', 'Keyword'),
    new Sprite('Lifesteal', '', 'Lifesteal', 'img/sprites/Lifesteal.png', 'Keyword'),
    new Sprite('Overwhelm', '', 'Overwhelm', 'img/sprites/Overwhelm.png', 'Keyword'),
    new Sprite('Quick strike', '', 'QuickStrike', 'img/sprites/QuickStrike.png', 'Keyword'),
    new Sprite('Reckless', '', 'Reckless', 'img/sprites/Reckless.png', 'Keyword'),
    new Sprite('Regeneration', '', 'Regeneration', 'img/sprites/Regeneration.png', 'Keyword'),
    new Sprite('Scout', '', 'Scout', 'img/sprites/Scout.png', 'Keyword'),
    new Sprite('Silenced', '', 'Silenced', 'img/sprites/Silenced.png', 'Keyword'),
    new Sprite('Slow', 23, 'Slow', 'img/sprites/23.png', 'Keyword'),
    new Sprite('Stunned', '', 'Stunned', 'img/sprites/Stunned.png', 'Keyword'),
    new Sprite('Tough', '', 'Tough', 'img/sprites/Tough.png', 'Keyword'),
    new Sprite('Vulnerable', '', 'Vulnerable', 'img/sprites/Vulnerable.png', 'Keyword'),
];
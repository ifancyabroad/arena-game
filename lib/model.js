'use strict';

// Array of portraits that can be found in the images folder
var portraits = [{
	active: ko.observable(true),
	path: 'images/portraits/female-warrior.jpg'
}, {
	active: ko.observable(false),
	path: 'images/portraits/male-mage.jpg'
}, {
	active: ko.observable(false),
	path: 'images/portraits/female-mage.jpg'
}, {
	active: ko.observable(false),
	path: 'images/portraits/male-knight.jpg'
}, {
	active: ko.observable(false),
	path: 'images/portraits/female-knight.jpg'
}, {
	active: ko.observable(false),
	path: 'images/portraits/male-thief.png'
}, {
	active: ko.observable(false),
	path: 'images/portraits/female-thief.jpg'
}, {
	active: ko.observable(false),
	path: 'images/portraits/male-warrior.jpg'
}];

// Array of possible classes to choose from
var classes = [{
	active: ko.observable(true),
	name: 'Warrior',
	description: 'Some text describing the warrior class',
	maxStats: [15, 10, 13, 6, 10]
}, {
	active: ko.observable(false),
	name: 'Mage',
	description: 'Some text describing the mage class',
	maxStats: [6, 9, 8, 15, 12]
}, {
	active: ko.observable(false),
	name: 'Rogue',
	description: 'Some text describing the rogue class',
	maxStats: [9, 15, 11, 8, 12]
}];

// Enemy tier lists
var enemyTiers = [
// Tier 1
[{
	name: 'Goblin',
	portrait: 'images/monsters/goblin.jpg',
	stats: [5, 7, 3, 2, 6],
	armour: 2,
	magicResistance: 4,
	expValue: 50,
	goldValue: 100
}, {
	name: 'Kobold',
	portrait: 'images/monsters/kobold.jpg',
	stats: [4, 8, 3, 2, 6],
	armour: 3,
	expValue: 50,
	goldValue: 100
}, {
	name: 'Wolf',
	portrait: 'images/monsters/wolf.jpg',
	stats: [6, 8, 4, 1, 7],
	expValue: 75,
	goldValue: 100
}, {
	name: 'Orc',
	portrait: 'images/monsters/orc.jpg',
	stats: [8, 7, 7, 3, 7],
	armour: 6,
	magicResistance: 2,
	expValue: 150,
	goldValue: 150
}, {
	name: 'Imp',
	portrait: 'images/monsters/imp.jpg',
	stats: [2, 5, 3, 10, 8],
	magicResistance: 8,
	expValue: 50,
	goldValue: 100
}, {
	name: 'Knoll',
	portrait: 'images/monsters/knoll.jpg',
	stats: [8, 5, 8, 2, 6],
	armour: 4,
	expValue: 100,
	goldValue: 150
}, {
	name: 'Skeleton',
	portrait: 'images/monsters/skeleton.jpg',
	stats: [4, 7, 5, 1, 6],
	armour: 2,
	magicResistance: 6,
	expValue: 100,
	goldValue: 100
}],
// Tier 2
[{
	name: 'Ogre',
	portrait: 'images/monsters/ogre.jpg',
	stats: [14, 8, 11, 1, 6],
	armour: 2,
	expValue: 150,
	goldValue: 200
}, {
	name: 'Troll',
	portrait: 'images/monsters/troll.jpg',
	stats: [12, 5, 13, 2, 5],
	armour: 2,
	magicResistance: 12,
	expValue: 200,
	goldValue: 200
}, {
	name: 'Gauth',
	portrait: 'images/monsters/gauth.png',
	stats: [5, 7, 8, 12, 10],
	armour: 2,
	magicResistance: 7,
	expValue: 150,
	goldValue: 200
}, {
	name: 'Mage',
	portrait: 'images/monsters/mage.jpg',
	stats: [3, 5, 7, 15, 11],
	armour: 1,
	magicResistance: 10,
	expValue: 200,
	goldValue: 250
}, {
	name: 'Elf',
	portrait: 'images/monsters/elf.png',
	stats: [9, 16, 9, 8, 14],
	armour: 2,
	magicResistance: 8,
	expValue: 300,
	goldValue: 300
}, {
	name: 'Centaur',
	portrait: 'images/monsters/centaur.png',
	stats: [11, 13, 10, 4, 12],
	armour: 4,
	magicResistance: 4,
	expValue: 200,
	goldValue: 250
}, {
	name: 'Dwarf',
	portrait: 'images/monsters/dwarf.png',
	stats: [12, 8, 14, 7, 7],
	armour: 8,
	magicResistance: 7,
	expValue: 200,
	goldValue: 300
}],
// Tier 3
[{
	name: 'Mind Flayer',
	portrait: 'images/monsters/flayer.jpg',
	stats: [7, 11, 10, 16, 12],
	armour: 2,
	magicResistance: 11,
	expValue: 400,
	goldValue: 300
}, {
	name: 'Golem',
	portrait: 'images/monsters/golem.jpg',
	stats: [14, 7, 15, 2, 8],
	armour: 12,
	magicResistance: 15,
	expValue: 750,
	goldValue: 500
}, {
	name: 'Lich',
	portrait: 'images/monsters/lich.jpg',
	stats: [8, 9, 10, 18, 15],
	armour: 4,
	magicResistance: 14,
	expValue: 1000,
	goldValue: 750
}, {
	name: 'Vampire',
	portrait: 'images/monsters/vampire.jpg',
	stats: [14, 12, 12, 13, 10],
	armour: 5,
	magicResistance: 10,
	expValue: 750,
	goldValue: 500
}, {
	name: 'Werewolf',
	portrait: 'images/monsters/werewolf.png',
	stats: [12, 16, 11, 6, 16],
	armour: 6,
	magicResistance: 6,
	expValue: 500,
	goldValue: 400
}, {
	name: 'Dragon',
	portrait: 'images/monsters/dragon.jpg',
	stats: [17, 16, 18, 19, 16],
	armour: 14,
	magicResistance: 14,
	expValue: 2000,
	goldValue: 1500
}]];

// Array of available items for the shop
var items = ko.observableArray([{
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'head',
	name: 'Leather Helm',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 2,
	price: 100
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'head',
	name: 'Plate Helm',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 3,
	price: 200
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'head',
	name: 'Magic Helm',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'magic resistance',
	value: 2,
	price: 300
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'head',
	name: 'Crown of Intellect',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 5,
	price: 650
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'head',
	name: 'Helm of the Black Knight',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 6,
	price: 600
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Leather Armour',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 3,
	price: 150
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Chainmail',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 4,
	price: 250
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Plate Armour',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 6,
	price: 400
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Mage Robes',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 3,
	price: 400
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Armour of Protection',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'magic resistance',
	value: 5,
	price: 350
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Adamantium Plate',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'magic resistance',
	value: 10,
	price: 900
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Tunic of the Betrayer',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 9,
	price: 800
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'body',
	name: 'Supreme Garb of the Burnt Sorcerer',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 10,
	price: 1200
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Dagger',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 4,
	price: 50
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Longsword',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'strength',
	value: 3,
	price: 150
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Greataxe',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'strength',
	value: 5,
	price: 300
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Magic Staff',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 3,
	price: 300
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Twin Swords',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 8,
	price: 700
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Skull Crusher Maul',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'strength',
	value: 7,
	price: 800
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'weapon',
	name: 'Staff of Power',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 6,
	price: 650
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Leather Boots',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 1,
	price: 100
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Plate Boots',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 3,
	price: 250
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Golem\'s Boots',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'magic resistance',
	value: 3,
	price: 200
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Boots of Speed',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'initiative',
	value: 4,
	price: 100
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Silent Shoes',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 5,
	price: 500
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Boots of Resolve',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'constitution',
	value: 4,
	price: 750
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'boots',
	name: 'Archmage Slippers',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 5,
	price: 650
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Leather Gloves',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 1,
	price: 100
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Plate Gloves',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 3,
	price: 250
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Gloves of Intelligence',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 2,
	price: 200
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Gloves of Accuracy',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 2,
	price: 200
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Adamantium Gloves',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 6,
	price: 600
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Gloves of Superior Protection',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'magic resistance',
	value: 7,
	price: 800
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'gloves',
	name: 'Ogre Gauntlets',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'strength',
	value: 8,
	price: 1000
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Ring of Swiftness',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'initiative',
	value: 6,
	price: 200
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Ring of Resistance',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'magic resistance',
	value: 4,
	price: 400
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Ring of Deadly strikes',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 6,
	price: 500
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Shield Ring',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'armour',
	value: 5,
	price: 400
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Necklace of Power',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 2,
	price: 150
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Amulet of Unstoppable Energy',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 12,
	price: 1500
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Necklace of Strength',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'strength',
	value: 5,
	price: 500
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Rogue\'s Trinket',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'dexterity',
	value: 3,
	price: 250
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Mage\'s Trinket',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'intelligence',
	value: 3,
	price: 250
}, {
	active: ko.observable(false),
	available: ko.observable(true),
	type: 'misc',
	name: 'Warrior\'s Trinket',
	description: function description() {
		return this.modifier + ' +' + this.value;
	},
	modifier: 'strength',
	value: 3,
	price: 250
}]);
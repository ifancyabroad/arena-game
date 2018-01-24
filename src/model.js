// Array of portraits that can be found in the images folder
const portraits = [
	{
		active: ko.observable(true),
		path: 'images/portraits/female-warrior.jpg'
	},
	{
		active: ko.observable(false),
		path: 'images/portraits/male-mage.jpg'
	},
	{
		active: ko.observable(false),
		path: 'images/portraits/male-warrior.jpg'
	},
	{
		active: ko.observable(false),
		path: 'images/portraits/female-thief.jpg'
	}
]

// Array of possible classes to choose from
const classes = [
	{
		active: ko.observable(true),
		name: 'Warrior',
		description: 'Some text describing the warrior class',
		maxStats: [15, 10, 13, 6, 10]
	},
	{
		active: ko.observable(false),
		name: 'Mage',
		description: 'Some text describing the mage class',
		maxStats: [6, 9, 10, 15, 10]
	},
	{
		active: ko.observable(false),
		name: 'Rogue',
		description: 'Some text describing the rogue class',
		maxStats: [9, 15, 10, 9, 12]
	}
]

// Array of possible enemies from tier 1
const enemiesOne = [
	{
		name: 'Goblin',
		portrait: 'images/monsters/goblin.jpg',
		stats: [5, 7, 3, 2, 6],
		armour: 2,
		expValue: 50,
		goldValue: 50
	},
	{
		name: 'Kobold',
		portrait: 'images/monsters/kobold.jpg',
		stats: [4, 8, 3, 2, 6],
		armour: 3,
		expValue: 50,
		goldValue: 50
	},
	{
		name: 'Wolf',
		portrait: 'images/monsters/wolf.jpg',
		stats: [6, 8, 4, 1, 7],
		expValue: 75,
		goldValue: 50
	},
	{
		name: 'Orc',
		portrait: 'images/monsters/orc.jpg',
		stats: [8, 7, 7, 3, 7],
		armour: 8,
		expValue: 150,
		goldValue: 100
	},
	{
		name: 'Imp',
		portrait: 'images/monsters/imp.jpg',
		stats: [2, 5, 3, 10, 8],
		expValue: 50,
		goldValue: 50
	}
]

// Array of possible enemies from tier 2
const enemiesTwo = [
	{
		name: 'Orc',
		portrait: 'images/monsters/orc.jpg',
		stats: [10, 7, 9, 3, 7],
		armour: 8,
		expValue: 150,
		goldValue: 100
	},
	{
		name: 'Troll',
		portrait: 'images/monsters/troll.jpg',
		stats: [12, 5, 13, 2, 5],
		armour: 2,
		expValue: 200,
		goldValue: 150
	},
	{
		name: 'Gauth',
		portrait: 'images/monsters/gauth.png',
		stats: [5, 7, 8, 12, 10],
		armour: 4,
		expValue: 150,
		goldValue: 100
	},
	{
		name: 'Mage',
		portrait: 'images/monsters/mage.jpg',
		stats: [3, 5, 7, 15, 11],
		armour: 2,
		expValue: 200,
		goldValue: 150
	},
	{
		name: 'Mind Flayer',
		portrait: 'images/monsters/flayer.jpg',
		stats: [7, 11, 10, 16, 12],
		armour: 4,
		expValue: 400,
		goldValue: 300
	}
]

// Array of possible enemies from tier 3
const enemiesThree = [
	{
		name: 'Mind Flayer',
		portrait: 'images/monsters/flayer.jpg',
		stats: [6, 8, 10, 16, 12],
		armour: 4,
		expValue: 400,
		goldValue: 300
	},
	{
		name: 'Golem',
		portrait: 'images/monsters/golem.jpg',
		stats: [14, 9, 17, 12, 11],
		armour: 12,
		expValue: 750,
		goldValue: 500
	},
	{
		name: 'Lich',
		portrait: 'images/monsters/lich.jpg',
		stats: [8, 9, 10, 18, 15],
		armour: 4,
		expValue: 1000,
		goldValue: 750
	},
	{
		name: 'Werewolf',
		portrait: 'images/monsters/werewolf.png',
		stats: [12, 15, 11, 10, 16],
		expValue: 500,
		goldValue: 400
	},
	{
		name: 'Dragon',
		portrait: 'images/monsters/dragon.jpg',
		stats: [17, 16, 18, 19, 16],
		armour: 14,
		expValue: 2000,
		goldValue: 1500
	}
]

// Array of available items for the shop
const items = ko.observableArray([
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'head',
		name: 'Steel Helm',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'armour',
		value: 2,
		price: 200
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'head',
		name: 'Magic Helm',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'intelligence',
		value: 2,
		price: 300
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'body',
		name: 'Chainmail',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'armour',
		value: 4,
		price: 250
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'body',
		name: 'Plate Armour',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'armour',
		value: 6,
		price: 400
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'weapon',
		name: 'Longsword',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'strength',
		value: 2,
		price: 100
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'weapon',
		name: 'Greataxe',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'strength',
		value: 4,
		price: 300
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'weapon',
		name: 'Magic Staff',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'intelligence',
		value: 3,
		price: 300
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'boots',
		name: 'Boots of Speed',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'initiative',
		value: 2,
		price: 100
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'gloves',
		name: 'Gloves of Accuracy',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'dexterity',
		value: 2,
		price: 200
	},
	{
		active: ko.observable(false),
		available: ko.observable(true),
		type: 'misc',
		name: 'Ring of Swiftness',
		description: function() { return `Increases your ${this.modifier} by ${this.value}` },
		modifier: 'initiative',
		value: 3,
		price: 200
	}
]);
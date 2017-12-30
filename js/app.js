// Array of portraits that can be found in the images folder
const portraits = [
	{
		active: ko.observable(false),
		path: 'images/female-warrior.jpg'
	},
	{
		active: ko.observable(false),
		path: 'images/male-mage.jpg'
	},
	{
		active: ko.observable(false),
		path: 'images/male-warrior.jpg'
	},
	{
		active: ko.observable(false),
		path: 'images/female-thief.jpg'
	}
]

// Array of possible classes to choose from
const classes = [
	{
		active: ko.observable(false),
		name: 'Warrior',
		description: 'Some text describing the warrior class',
		maxStats: [15, 12, 14, 6, 12]
	},
	{
		active: ko.observable(false),
		name: 'Mage',
		description: 'Some text describing the mage class',
		maxStats: [6, 10, 12, 16, 12]
	},
	{
		active: ko.observable(false),
		name: 'Rogue',
		description: 'Some text describing the rogue class',
		maxStats: [9, 15, 11, 10, 15]
	}
]

// Superclass for all Game Entities
class GameEntity {
	constructor(name, portrait, stats) {
		this.name = ko.observable(name);
		this.portrait = ko.observable(portrait);
		
		this.stats = ko.observableArray([
			{
				name: 'Strength',
				value: ko.observable(stats[0])
			},
			{
				name: 'Dexterity',
				value: ko.observable(stats[1])
			},
			{
				name: 'Constitution',
				value: ko.observable(stats[2])
			},
			{
				name: 'Intelligence',
				value: ko.observable(stats[3])
			},
			{
				name: 'Initiative',
				value: ko.observable(stats[4])
			}
		])
		
		const self = this;
		this.maxHealth = ko.computed(function() {
			return self.stats()[2].value() * 10;
		});
		
		this.currentHealth = ko.observable(this.maxHealth());
	}
}

// Subclass for the player
class Player extends GameEntity {
	constructor(name, portrait, cl, stats) {
		super(name, portrait, stats);
		this.cl = ko.observable(cl);
		this.experience = ko.observable(0);
		this.level = ko.observable(1);
		this.rerolls = ko.observable(3);
	} 
}

// Get random number within a range
const getRandom = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};


// ViewModel section
const ViewModel = function() {
	const self = this;
	
	// Observables for UI screens and starting values
	this.startGameShow = ko.observable(true);
	this.characterCreationShow = ko.observable(false);
	this.rollStatsShow = ko.observable(false);
	
	// Toggle visibility of start game screen and character creation
	this.toggleStartGame = function() {
		self.startGameShow(false);
		self.characterCreationShow(true);
	}
	
	// Toggle visibility of character creation screen and roll stats
	this.toggleRollStats = function() {
		self.characterCreationShow(false);
		self.rollStatsShow(true);
	}
	
	// Toggle selection of portraits
	this.togglePortraitSelection = function(portrait) {
		portraits.forEach(function(p) {
			p.active(false);
		});
		if (portrait.active() === false) {
			portrait.active(true);
		} else {
			portrait.active(false);
		}
	}
	
	// Toggle selection of classes
	this.toggleClassSelection = function(cl) {
		classes.forEach(function(c) {
			c.active(false);
		});
		if (cl.active() === false) {
			cl.active(true);
		} else {
			cl.active(false);
		}
	}
	
	// Create player and name variables
	this.player = ko.observable();
	this.nameInput = ko.observable();
	
	// Create character with selected options once form is submitted
	this.createCharacter = function() {
		let portrait;
		let cl;
		let playerStats = [];
		portraits.forEach(function(p) {
			if (p.active() === true) {
				portrait = p.path;
			}			
		});
		classes.forEach(function(c) {
			if (c.active() === true) {
				cl = c;
				c.maxStats.forEach(function(s) {
					playerStats.push(getRandom(s - 5, s));
				});
			}
		});
		
		
		self.player(new Player(self.nameInput(), portrait, cl, playerStats));
		self.toggleRollStats();
	}
	
	// Create and roll for player stats
	this.rollStats = function() {
		let classStats = self.player().cl().maxStats;
		
		if (self.player().rerolls() > 0) {
			for (let i = 0; i < self.player().stats().length; i++) {
				self.player().stats()[i].value(getRandom(classStats[i] - 5, classStats[i]));
			}
			self.player().currentHealth(self.player().maxHealth());
			self.player().rerolls(self.player().rerolls() - 1)
		}
	}
}

ko.applyBindings(new ViewModel());
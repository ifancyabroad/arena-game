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

const enemies = [
	{
		name: 'Goblin',
		portrait: 'images/goblin.jpg',
		stats: [3, 4, 2, 2, 4],
		armour: 2
	},
	{
		name: 'Kobold',
		portrait: 'images/kobold.jpg',
		stats: [2, 5, 2, 2, 3],
		armour: 3
	},
	{
		name: 'Wolf',
		portrait: 'images/wolf.jpg',
		stats: [4, 4, 3, 1, 5]
	}
]

// Superclass for all Game Entities
class GameEntity {
	constructor(name, portrait, stats, armour = 0) {
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
		
		this.alive = ko.computed(function() {
			return self.currentHealth() > 0; 
		});
		
		this.armour = ko.observable(armour);
	}
	
	attack() {
		return (this.stats()[0].value() + getRandom(1, 6));
	}
	
	takeHit(damage) {
		damage -= this.armour();
		this.currentHealth(this.currentHealth() - damage);
		return damage;
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
	return Math.floor(Math.random() * (max - min + 1) + min);
};


// ViewModel section
const ViewModel = function() {
	const self = this;
	
	// Observables for UI screens and starting values
	this.startGameShow = ko.observable(true);
	this.characterCreationShow = ko.observable(false);
	this.rollStatsShow = ko.observable(false);
	this.townShow = ko.observable(false);
	this.battleShow = ko.observable(false);
	
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
	
	// Toggle visibility of roll stats and town screen
	this.toggleTown = function() {
		self.rollStatsShow(false);
		self.townShow(true);
	}
	
	// Toggle visibility of town screen and battle screen
	this.toggleBattle = function() {
		self.townShow(false);
		self.battleShow(true);
		self.getEnemy();
		self.battleLog('');
	}
	
	// Toggle visibility of battle screen and town screen
	this.toggleReturn = function() {
		self.battleShow(false);
		self.townShow(true);
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
	
	// Create current enemy variable
	this.currentEnemy = ko.observable();
	
	this.getEnemy = function() {
		let enemy = enemies[getRandom(0, enemies.length - 1)];		
		self.currentEnemy(new GameEntity(enemy.name, enemy.portrait, enemy.stats, enemy.armour));
	}
	
	this.battleLog = ko.observable('');
	
	this.playerAttack = function() {
		if (self.player().stats()[4].value() >= self.currentEnemy().stats()[4].value()) {
			let playerDmg = self.currentEnemy().takeHit(self.player().attack());
			self.battleLog(self.battleLog() + `<p>You attack the ${self.currentEnemy().name()} for ${playerDmg} damage</p>`);
			let enemyDmg = self.player().takeHit(self.currentEnemy().attack());
			self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()} attacks you for ${enemyDmg} damage</p>`);
		} else {
			let enemyDmg = self.player().takeHit(self.currentEnemy().attack());
			self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()} attacks you for ${enemyDmg} damage</p>`);
			let playerDmg = self.currentEnemy().takeHit(self.player().attack());
			self.battleLog(self.battleLog() + `<p>You attack the ${self.currentEnemy().name()} for ${playerDmg} damage</p>`);
		}
	}
}

ko.applyBindings(new ViewModel());
// Array of portraits that can be found in the images folder
const portraits = [
	{
		active: ko.observable(true),
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

// Array of possible enemies
const enemies = [
	{
		name: 'Goblin',
		portrait: 'images/goblin.jpg',
		stats: [3, 6, 2, 2, 4],
		armour: 2
	},
	{
		name: 'Kobold',
		portrait: 'images/kobold.jpg',
		stats: [2, 8, 2, 2, 3],
		armour: 3
	},
	{
		name: 'Wolf',
		portrait: 'images/wolf.jpg',
		stats: [4, 8, 3, 1, 5]
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
	
	checkHit() {
		if (this.stats()[1].value() >= getRandom(1, 20)) {
			return true;
		} else {
			return false;
		}
	}
	
	checkArmour(damage) {
		if (damage - this.armour() < 0) {
			return damage = 0;
		} else {
			return damage -= this.armour();
		}
	}
	
	getPhysicalDamage() {		
		return (this.stats()[0].value() + getRandom(1, 6));
	}
	
	getMagicalDamage() {
		return (this.stats()[3].value() + getRandom(1, 6));
	}
	
	takeHit(damage) {
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
		this.skillPoints = ko.observable(5);
		const self = this;
	}
	
	updateStat(stat, n) {
		if (((this.skillPoints() - n) >= 0) && ((stat.value() + n) <= 20)) {
			stat.value(stat.value() + n);
			this.skillPoints(this.skillPoints() - n)
		}
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
	this.uiCardShow = ko.observable(false);
	this.startGameShow = ko.observable(true);
	this.characterCreationShow = ko.observable(true);
	this.rollStatsShow = ko.observable(false);
	this.townShow = ko.observable(false);
	this.levelUpShow = ko.observable(false);
	this.battleShow = ko.observable(false);
	this.playerCardShow = ko.observable(false);
	this.enemyCardShow = ko.observable(false);
	
	// Toggle visibility of start game screen and character creation
	this.toggleStartGame = function() {
		self.uiCardShow(true);
	}
	
	// Toggle visibility of character creation screen and roll stats
	this.toggleRollStats = function() {
		self.characterCreationShow(false);
		self.rollStatsShow(true);
	}
	
	// Toggle visibility of roll stats and town screen
	this.toggleTown = function() {
		self.playerCardShow(true);
		self.startGameShow(false);
		self.townShow(true);
		self.uiCardShow(false);
	}
	
	// Toggle visibility of town screen and battle screen
	this.toggleBattle = function() {
		if (self.battleShow() === false) {
			self.rollStatsShow(false);
			self.levelUpShow(false);
			self.battleShow(true);
		}
		self.battleLog('');
		self.getEnemy();
		setTimeout(function() { 
			self.enemyCardShow(true)
		}, 300);
		self.uiCardShow(true);
	}
	
	// Toggle visibility of battle screen and town screen
	this.toggleReturn = function() {
		self.enemyCardShow(false);
		self.uiCardShow(false);
	}
	
	// Toggle visibility of town screen and level up screen
	this.toggleLevelUp = function() {
		self.rollStatsShow(false);
		self.battleShow(false);
		self.levelUpShow(true);
		self.uiCardShow(true);
	}
	
	// Return from level up screen
	this.toggleLevelUpReturn = function() {
		self.uiCardShow(false);
	}
	
	// Toggle browse right through portraits
	this.togglePortrait = function(n) {
		let currentIndex;
		
		portraits.forEach(function(portrait) {
			if (portrait.active() === true) {
				portrait.active(false);
				currentIndex = portraits.indexOf(portrait) + n;
			}
		});
		
		if (currentIndex >= portraits.length) {
			currentIndex = 0;
		} else if (currentIndex < 0) {
			currentIndex = portraits.length - 1;
		}
		
		portraits[currentIndex].active(true);
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
	
	this.changeStat = function(n) {
		self.player().updateStat(this, n);
	}
	
	// Level up
	this.levelUp = function() {
		
	}
	
	// Create current enemy variable
	this.currentEnemy = ko.observable();
	
	// Get a random enemy from enemies array
	this.getEnemy = function() {
		let enemy = enemies[getRandom(0, enemies.length - 1)];		
		self.currentEnemy(new GameEntity(enemy.name, enemy.portrait, enemy.stats, enemy.armour));
	}
	
	// Battle log observable
	this.battleLog = ko.observable('');
	
	// Check to see if the player hits, calculate the damage and display it in the combat log
	this.playerAttack = function() {
		if (self.player().checkHit()) {
			let playerDmg = self.currentEnemy().checkArmour(self.player().getPhysicalDamage());
			self.currentEnemy().takeHit(playerDmg);
			self.battleLog(self.battleLog() + `<p>You attack the ${self.currentEnemy().name()} for ${playerDmg} damage</p>`);
		} else {
			self.battleLog(self.battleLog() + `<p>You miss the ${self.currentEnemy().name()}</p>`);
		}
	}
	
	// Calculate magic damage and display it in the combat log
	this.playerMagicAttack = function() {
		let playerDmg = self.currentEnemy().takeHit(self.player().getMagicalDamage());
		self.battleLog(self.battleLog() + `<p>Your spell hits the ${self.currentEnemy().name()} for ${playerDmg} damage</p>`);
	}
	
	// Check to see if the enemy hits, calculate the damage and display it in the combat log
	this.enemyAttack = function() {
		if (self.currentEnemy().checkHit()) {
			let enemyDmg = self.player().checkArmour(self.currentEnemy().getPhysicalDamage());
			self.player().takeHit(enemyDmg);
			self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()} attacks you for ${enemyDmg} damage</p>`);
		} else {
			self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()} misses you</p>`);
		}
	}
	
	this.enemySlain = function() {
		self.battleLog(self.battleLog() + `<p>You have slain the ${self.currentEnemy().name()}!</p>`);
	}
	
	// Player attack and enemy attack when attack button is clicked
	this.physicalAttack = function() {
		
		// Check who strikes first based on initiative
		if (self.player().stats()[4].value() >= self.currentEnemy().stats()[4].value()) {
			self.playerAttack();
			self.currentEnemy().alive() ? self.enemyAttack() : self.enemySlain();
		} else {
			self.enemyAttack();
			self.playerAttack();
			if (!self.currentEnemy().alive()) {
				self.enemySlain();
			}
		}
	}
	
	// Player magic attack and enemy attack when magic button is clicked
	this.magicalAttack = function() {
		
		// Check who strikes first based on initiative
		if (self.player().stats()[4].value() >= self.currentEnemy().stats()[4].value()) {
			self.playerMagicAttack();
			self.currentEnemy().alive() ? self.enemyAttack() : self.enemySlain();
		} else {
			self.enemyAttack();
			self.playerMagicAttack();
			if (!self.currentEnemy().alive()) {
				self.enemySlain();
			}
		}	
	}
	
	// Reset the game back to its starting state
	this.resetGame = function() {
		self.playerCardShow(false);
		self.enemyCardShow(false);
		self.player(null);
		self.currentEnemy(null);
		self.townShow(false);
		self.battleShow(false);
		self.startGameShow(true);
		self.characterCreationShow(true);
		self.uiCardShow(false);
		portraits.forEach(function(p) {
			p.active(false);
		});
		portraits[0].active(true);
		classes.forEach(function(c) {
			c.active(false);
		});
		self.nameInput('');
	}
}

ko.applyBindings(new ViewModel());
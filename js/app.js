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

// Array of possible enemies
const enemies = [
	{
		name: 'Goblin',
		portrait: 'images/goblin.jpg',
		stats: [3, 6, 2, 2, 4],
		armour: 2,
		expValue: 50,
		goldValue: 50
	},
	{
		name: 'Kobold',
		portrait: 'images/kobold.jpg',
		stats: [2, 8, 2, 2, 3],
		armour: 3,
		expValue: 50,
		goldValue: 50
	},
	{
		name: 'Wolf',
		portrait: 'images/wolf.jpg',
		stats: [4, 8, 3, 1, 5],
		expValue: 75,
		goldValue: 50
	},
	{
		name: 'Orc',
		portrait: 'images/orc.jpg',
		stats: [10, 7, 9, 3, 7],
		armour: 8,
		expValue: 150,
		goldValue: 100
	},
	{
		name: 'Troll',
		portrait: 'images/troll.jpg',
		stats: [12, 5, 13, 2, 5],
		expValue: 200,
		goldValue: 150
	},
	{
		name: 'Gauth',
		portrait: 'images/gauth.png',
		stats: [4, 6, 8, 12, 10],
		expValue: 150,
		goldValue: 100
	}
]

// Superclass for all Game Entities
class GameEntity {
	constructor(name, portrait, stats, armour = 0) {
		const self = this;
		
		// Name and picture variables
		this.name = ko.observable(name);
		this.portrait = ko.observable(portrait);
		
		// Array to hold all player and enemy stats
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
		
		// Set maximum health to constitution * 10
		this.maxHealth = ko.computed(function() {
			return self.stats()[2].value() * 10;
		});
		
		// Initially set current health to maximum health
		this.currentHealth = ko.observable(this.maxHealth());
		
		// Alive is true as long as current health is above 0
		this.alive = ko.computed(function() {
			return self.currentHealth() > 0; 
		});
		
		// Armour variable
		this.armour = ko.observable(armour);
	}
	
	// Use dexterity stat to check whether or not attack hits
	checkHit() {
		if (this.stats()[1].value() >= getRandom(1, 20)) {
			return true;
		} else {
			return false;
		}
	}
	
	// Mitigate physical damage based on armour stat
	checkArmour(damage) {
		if (damage - this.armour() < 0) {
			return damage = 0;
		} else {
			return damage -= this.armour();
		}
	}
	
	// Mitigate magical damage based on intelligence stat
	checkIntelligence(damage) {
		if (damage - this.stats()[3].value() < 0) {
			return damage = 0;
		} else {
			return damage -= this.stats()[3].value();
		}
	}
	
	// Get physical damage based on strength stat
	getPhysicalDamage() {		
		return (this.stats()[0].value() + getRandom(1, 6));
	}
	
	// Get magical damage based on intelligence
	getMagicalDamage() {
		return (this.stats()[3].value() + getRandom(1, 6));
	}
	
	// Subtract from current health when hit
	takeHit(damage) {
		this.currentHealth(this.currentHealth() - damage);
		return damage;
	}
}

// Subclass for the player
class Player extends GameEntity {
	constructor(name, portrait, cl, stats) {
		
		// Get name, portrait and stats from parent class
		super(name, portrait, stats);
		
		const self = this;
		
		// Variable for class selected by player
		this.cl = ko.observable(cl);
		
		// Variable for experience obtained by player
		this.experience = ko.observable(0);
		
		// Variable for how much gold the player is holding
		this.gold = ko.observable(0);
		
		// Experience chart
		this.levelTier = ko.computed(function() {
			if (self.experience() > 20000) {
				return 10;
			} else if (self.experience() > 12000) {
				return 9;
			} else if (self.experience() > 8000) {
				return 8;
			} else if (self.experience() > 5000) {
				return 7;
			} else if (self.experience() > 3000) {
				return 6;
			} else if (self.experience() > 1500) {
				return 5;
			} else if (self.experience() > 800) {
				return 4;
			} else if (self.experience() > 300) {
				return 3;
			} else if (self.experience() > 100) {
				return 2;
			} else {
				return 1;
			}
		});
		
		// Player level, starts at 1
		this.level = ko.observable(1);
		
		// Variable for rerolls the player is allowed
		this.rerolls = ko.observable(3);
		
		// Skill points the player has acquired for spending
		this.skillPoints = ko.observable(0);
	}
	
	// Update the players stats based on an array of stats taken as a parameter
	updateStats(newStats) {
		for (let i = 0; i < this.stats().length; i++) {
			this.stats()[i].value(newStats[i].value());			
		}
	}
	
	// Increase experience
	experienceGain(xp) {
		let currentTier = this.levelTier();
		this.experience(this.experience() + xp);
		if (currentTier !== this.levelTier()) {
			this.skillPoints(this.skillPoints() + 1);
		}
	}
}

// Subclass for the enemy
class Enemy extends GameEntity {
	constructor(name, portrait, stats, armour = 0, expValue, goldValue) {
		
		// Get name, portrait and stats from parent class
		super(name, portrait, stats, armour);
		
		const self = this;
		
		// Variable for how much experience the enemy is worth
		this.expValue = expValue;
		
		// Variable for how much gold the enemy is worth
		this.goldValue = goldValue;
	}
	
	// Update the players stats based on an array of stats taken as a parameter
	checkAttackType() {
		if (this.stats()[0].value() >= this.stats()[3].value()) {
			return 'physical';
		} else {
			return 'magical';
		}
	}
}

// Get random number within a specified range
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
	this.healerShow = ko.observable(false);
	this.battleShow = ko.observable(false);
	this.playerCardShow = ko.observable(false);
	this.enemyCardShow = ko.observable(false);
	
	// Flip the UI card to toggle visibility of start game screen and character creation
	this.toggleStartGame = function() {
		self.uiCardShow(true);
	}
	
	// Switch display from character creation screen to roll stats
	this.toggleRollStats = function() {
		self.characterCreationShow(false);
		self.rollStatsShow(true);
	}
	
	// Flip player card to reveal character
	// Switch the start game screen with the town screen
	// Flip the UI card
	this.toggleTown = function() {
		self.playerCardShow(true);
		self.startGameShow(false);
		self.townShow(true);
		self.uiCardShow(false);
	}
	
	// Flip the UI card to reveal the battle screen
	this.toggleBattle = function() {
		
		// If battle screen is not visible, make it visible and hide other screens
		if (self.battleShow() === false) {
			self.rollStatsShow(false);
			self.healerShow(false);
			self.levelUpShow(false);
			self.battleShow(true);
		}
		
		// Reset battle log
		self.battleLog('');
		
		// Get new enemy and flip the enemy card to reveal it
		self.getEnemy();
		setTimeout(function() { 
			self.enemyCardShow(true)
		}, 300);
		
		// Flip the UI card
		self.uiCardShow(true);
	}
	
	// Return to town after battle by flipping enemy and UI cards
	this.toggleReturn = function() {
		self.enemyCardShow(false);
		self.uiCardShow(false);
	}
	
	// Set variables for initial stats and skill points when entering level up screen
	this.tempStats = ko.observableArray();
	this.tempSkillPoints;
	
	// Toggle visibility of town screen and level up screen
	this.toggleLevelUp = function() {
		
		// Set tempStats and tempSkillPoints to current player stats and skill points
		self.tempStats(self.player().stats().map(function(stat) {
			return {name: stat.name, value: ko.observable(stat.value()), min: stat.value()} 
		}));
		self.tempSkillPoints = self.player().skillPoints();
		
		// Set visibility of levelup screen and flip UI card
		self.rollStatsShow(false);
		self.healerShow(false);
		self.battleShow(false);
		self.levelUpShow(true);
		self.uiCardShow(true);
	}
	
	// Change stats on levelup screen
	this.changeStat = function(n) {	

		// Check placing or subtracting the point will not be higher than 20 or lower than initial value
		if (((self.player().skillPoints() - n) >= 0) && ((this.value() + n) >= this.min) && ((this.value() + n) <= 20)) {
			
			// Increment/decrement the stat and add or remove a skill point
			this.value(this.value() + n);
			self.player().skillPoints(self.player().skillPoints() - n)
		}
	}
	
	// Return from level up screen
	this.toggleLevelUpReturn = function() {
		// Update player stats with new values and update player level based on points spent
		self.player().updateStats(self.tempStats());
		self.player().level(self.player().level() + (self.tempSkillPoints - self.player().skillPoints()));
		
		// Flip UI card
		self.uiCardShow(false);
	}
	
	// Observable for the healer log
	this.healerLog = ko.observable();
	
	// Toggle visibility of town screen and healer screen
	this.toggleHealer = function() {
		// Reset the healer log
		self.healerLog('Welcome to the town healer!');
		
		// Set visibility of healer screen and flip UI card
		self.rollStatsShow(false);
		self.levelUpShow(false);
		self.battleShow(false);
		self.healerShow(true);
		self.uiCardShow(true);
	}
	
	this.cureWounds = function(healing, price) {
		if (self.player().currentHealth() <= self.player().maxHealth()) {
			if (self.player().gold() >= price) {
				self.player().gold(self.player().gold() - price);
				if ((self.player().currentHealth() + healing) > self.player().maxHealth()) {
					self.player().currentHealth(self.player().maxHealth());
				} else {
					self.player().currentHealth(self.player().currentHealth() + healing);
				}
				self.healerLog('Wounds cured');
			} else {
				self.healerLog('You do not have enough gold for that');
			}
		} else {
			self.healerLog('You have no wounds to cure');
		}
	}
	
	this.toggleHealerReturn = function() {
		self.uiCardShow(false);
	}
	
	// Toggle browse through portraits
	this.togglePortrait = function(n) {
		
		// Variable for next active portrait
		let currentIndex;
		
		// Set all portraits to not active
		// Set currentIndex to the next portrait
		portraits.forEach(function(portrait) {
			if (portrait.active() === true) {
				portrait.active(false);
				currentIndex = portraits.indexOf(portrait) + n;
			}
		});
		
		// Ensure the next portrait loops around if it is the first or last in the array
		if (currentIndex >= portraits.length) {
			currentIndex = 0;
		} else if (currentIndex < 0) {
			currentIndex = portraits.length - 1;
		}
		
		// Set next portrait to the active one
		portraits[currentIndex].active(true);
	}
	
	// Toggle selection of classes
	this.toggleClassSelection = function(cl) {
		
		// Set all classes to not selected
		classes.forEach(function(c) {
			c.active(false);
		});
		
		// Activate or de-activate selected class
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
		
		// Variables for selected character features
		let portrait;
		let cl;
		let playerStats = [];
		
		// Find selected portrait
		portraits.forEach(function(p) {
			if (p.active() === true) {
				portrait = p.path;
			}			
		});
		
		// Find selected class and set stats based on the class selected
		classes.forEach(function(c) {
			if (c.active() === true) {
				cl = c;
				c.maxStats.forEach(function(s) {
					playerStats.push(getRandom(s - 5, s));
				});
			}
		});
			
		// Create player instance and reveal roll stats screen
		self.player(new Player(self.nameInput(), portrait, cl, playerStats));
		self.toggleRollStats();
	}
	
	// Create and roll for player stats
	this.rollStats = function() {
		
		// Find maximum stats for selected class
		let classStats = self.player().cl().maxStats;
		
		// Check there are rerolls remaining
		if (self.player().rerolls() > 0) {
			
			// Set each stat as a number up to 5 less than the class maximum
			for (let i = 0; i < self.player().stats().length; i++) {
				self.player().stats()[i].value(getRandom(classStats[i] - 5, classStats[i]));
			}
			
			// Set current health and subtract one from rerolls
			self.player().currentHealth(self.player().maxHealth());
			self.player().rerolls(self.player().rerolls() - 1)
		}
	}
	
	// Create current enemy variable
	this.currentEnemy = ko.observable();
	
	// Get a random enemy from enemies array
	this.getEnemy = function() {
		let enemy = enemies[getRandom(0, enemies.length - 1)];		
		self.currentEnemy(new Enemy(enemy.name, enemy.portrait, enemy.stats, enemy.armour, enemy.expValue, enemy.goldValue));
	}
	
	// Battle log observable
	this.battleLog = ko.observable('');
	
	// Check to see if the player hits, calculate the damage and display it in the combat log
	this.playerAttack = function() {
		if (self.player().checkHit()) {
			
			// Get player damage
			let playerDmg = self.currentEnemy().checkArmour(self.player().getPhysicalDamage());
			
			// Enemy takes player damage
			self.currentEnemy().takeHit(playerDmg);
			
			// Display in battle log
			self.battleLog(self.battleLog() + `<p>You attack the ${self.currentEnemy().name()} for ${playerDmg} damage</p>`);
		} else {
			
			// Log a miss in the battle log
			self.battleLog(self.battleLog() + `<p>You miss the ${self.currentEnemy().name()}</p>`);
		}
	}
	
	// Calculate magic damage and display it in the combat log
	this.playerMagicAttack = function() {
		
		// Get player damage
		let playerDmg = self.currentEnemy().checkIntelligence(self.player().getMagicalDamage());
		
		// Enemy takes player damage
		self.currentEnemy().takeHit(playerDmg);
		
		// Display in battle log
		self.battleLog(self.battleLog() + `<p>Your spell hits the ${self.currentEnemy().name()} for ${playerDmg} damage</p>`);
	}
	
	// Check to see if the enemy hits, calculate the damage and display it in the combat log
	this.enemyAttack = function() {
		// Check if the enemy uses magic or physical attack
		if (self.currentEnemy().checkAttackType() === 'physical') {
			if (self.currentEnemy().checkHit()) {
				
				// Get enemy damage
				let enemyDmg = self.player().checkArmour(self.currentEnemy().getPhysicalDamage());
				
				// Player takes enemy damage
				self.player().takeHit(enemyDmg);
				
				// Display in battle log
				self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()} attacks you for ${enemyDmg} damage</p>`);
			} else {
				
				// Log a miss in the battle log
				self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()} misses you</p>`);
			}
		} else {
			// Get enemy damage
			let enemyDmg = self.player().checkIntelligence(self.currentEnemy().getMagicalDamage());
			
			// Player takes enemy damage
			self.player().takeHit(enemyDmg);
			
			// Display in battle log
			self.battleLog(self.battleLog() + `<p>${self.currentEnemy().name()}'s spell hits you for ${enemyDmg} damage</p>`);		
		}
	}
	
	// Log enemy death in battle log and gain experience
	this.enemySlain = function() {
		self.player().experienceGain(self.currentEnemy().expValue);
		self.player().gold(self.player().gold() + self.currentEnemy().goldValue);
		self.battleLog(self.battleLog() + 
		`<p>You have slain the ${self.currentEnemy().name()}!</p>
		<p>You gain ${self.currentEnemy().expValue} experience</p>
		<p>${self.currentEnemy().goldValue} gold earned</p>`);		
	}
	
	// Player attack and enemy attack when attack button is clicked
	this.physicalAttack = function() {
		
		// Check who strikes first based on initiative
		if (self.player().stats()[4].value() >= self.currentEnemy().stats()[4].value()) {
			
			// Attack and check for enemy death, if alive enemy retaliates
			self.playerAttack();
			self.currentEnemy().alive() ? self.enemyAttack() : self.enemySlain();
		} else {
			
			// Enemy attacks first followed by player and check for enemy death
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
			
			// Attack and check for enemy death, if alive enemy retaliates
			self.playerMagicAttack();
			self.currentEnemy().alive() ? self.enemyAttack() : self.enemySlain();
		} else {
			
			// Enemy attacks first followed by player and check for enemy death
			self.enemyAttack();
			self.playerMagicAttack();
			if (!self.currentEnemy().alive()) {
				self.enemySlain();
			}
		}	
	}
	
	// Reset the game back to its starting state
	this.resetGame = function() {
		
		// Hide player and enemy cards
		self.playerCardShow(false);
		self.enemyCardShow(false);
		
		// Set player and enemy objects to null
		self.player(null);
		self.currentEnemy(null);
		
		// Hide town and battle screens, show start game and character creation
		self.townShow(false);
		self.battleShow(false);
		self.startGameShow(true);
		self.characterCreationShow(true);
		
		// Flip UI card
		self.uiCardShow(false);
		
		// Reset portraits
		portraits.forEach(function(p) {
			p.active(false);
		});
		portraits[0].active(true);
		
		// Reset classes
		classes.forEach(function(c) {
			c.active(false);
		});
		
		// Reset player name
		self.nameInput('');
	}
}

ko.applyBindings(new ViewModel());
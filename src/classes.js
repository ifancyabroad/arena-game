// Superclass for all Game Entities
class GameEntity {
	constructor(name, portrait, stats, armour = 0, magicResistance = 0) {
		const self = this;
		
		// Name and picture variables
		this.name = ko.observable(name);
		this.portrait = ko.observable(portrait);
		
		// Array to hold all player and enemy stats
		this.stats = ko.observableArray([
			{
				name: 'Strength',
				value: ko.observable(stats[0]),
				modifier: ko.observable(0),
				description: 'How much damage your physical attacks do.'
			},
			{
				name: 'Dexterity',
				value: ko.observable(stats[1]),
				modifier: ko.observable(0),
				description: 'The chance your physical attacks hit and critical hit.'
			},
			{
				name: 'Constitution',
				value: ko.observable(stats[2]),
				modifier: ko.observable(0),
				description: 'Determines your maximum health.'
			},
			{
				name: 'Intelligence',
				value: ko.observable(stats[3]),
				modifier: ko.observable(0),
				description: 'How much damage your magical attacks do.'
			},
			{
				name: 'Initiative',
				value: ko.observable(stats[4]),
				modifier: ko.observable(0),
				description: 'Determines who strikes first.'
			}
		])
		
		// Set maximum health to constitution * 10
		this.maxHealth = ko.computed(function() {
			return self.stats()[2].value() * 10;
		});
		
		// Initially set current health to maximum health
		this.currentHealth = ko.observable(this.maxHealth());
		
		// Alive is true as long as current health is above 0
		this.dead = ko.computed(function() {
			return self.currentHealth() <= 0; 
		});
		
		// Armour variable
		this.armour = ko.observable(armour);

		// Magic reistance variable
		this.magicResistance = ko.observable(magicResistance);

		// Critical strike chance
		this.critChance = ko.computed(function() {
			return ((self.stats()[1].value() + self.stats()[1].modifier()) * 0.75) + 5;
		})
	}
	
	// Use dexterity stat to check whether or not attack hits
	checkHit() {
		let dex = this.stats()[1].value() + this.stats()[1].modifier();
		if (dex >= getRandom(1, 20)) {
			return true;
		} else {
			return false;
		}
	}

	// Use crit chance to check whether or not it is a critical strike
	checkCrit(damage) {
		if (this.critChance() >= getRandom(1, 100)) {
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
			return damage - this.armour();
		}
	}
	
	// Mitigate magical damage based on magic resistance stat
	checkMagicResistance(damage) {
		if (damage - this.magicResistance() < 0) {
			return damage = 0;
		} else {
			return damage - this.magicResistance();
		}
	}
	
	// Get physical damage based on strength stat
	getPhysicalDamage() {	
		let str = this.stats()[0].value() + this.stats()[0].modifier();
		return (str + getRandom(1, 6));
	}
	
	// Get magical damage based on intelligence
	getMagicalDamage() {
		let intel = this.stats()[3].value() + this.stats()[3].modifier();
		return (intel + getRandom(1, 6));
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
		this.rerolls = ko.observable(10);
		
		// Skill points the player has acquired for spending
		this.skillPoints = ko.observable(0);
		
		// Inventory
		this.inventory = ko.observable(
			{
				head: ko.observable({ name: 'None' }),
				body: ko.observable({ name: 'None'  }),
				gloves: ko.observable({ name: 'None' }),
				boots: ko.observable({ name: 'None' }),
				weapon: ko.observable({ name: 'None' }),
				misc: ko.observable({ name: 'None' })
			});
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
	constructor(name, portrait, stats, armour = 0, magicResistance = 0, expValue, goldValue) {
		
		// Get name, portrait and stats from parent class
		super(name, portrait, stats, armour, magicResistance);
		
		const self = this;
		
		// Variable for how much experience the enemy is worth
		this.expValue = expValue;
		
		// Variable for how much gold the enemy is worth
		this.goldValue = goldValue;
	}
}
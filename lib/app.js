"use strict";

// Get random number within a specified range
var getRandom = function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// Display the game once loaded
var displayGame = function displayGame() {
	document.getElementById("loader").style.display = "none";
	document.getElementById("game-area").style.display = "flex";
};

// ViewModel section
var ViewModel = function ViewModel() {
	var self = this;

	// Observables for UI screens and starting values
	// Is UI flipped or not
	this.uiCardShow = ko.observable(false);

	// UI back faces
	this.startGameShow = ko.observable(true);
	this.townShow = ko.observable(false);

	// UI front faces
	this.characterCreationShow = ko.observable(true);
	this.rollStatsShow = ko.observable(false);
	this.battleShow = ko.observable(false);
	this.levelUpShow = ko.observable(false);
	this.shopShow = ko.observable(false);
	this.healerShow = ko.observable(false);

	// Player card faces flipper and faces
	this.playerCardShow = ko.observable(false);
	this.playerBackShow = ko.observable(true);
	this.playerInventoryShow = ko.observable(false);

	// Is enemy card flipped or not
	this.enemyCardShow = ko.observable(false);

	// Hide all front faces
	this.hideAllFront = function () {
		self.characterCreationShow(false);
		self.rollStatsShow(false);
		self.battleShow(false);
		self.levelUpShow(false);
		self.shopShow(false);
		self.healerShow(false);
	};

	// Flip the UI card to toggle visibility of start game screen and character creation
	this.toggleStartGame = function () {
		self.characterCreationShow(true);
		self.uiCardShow(true);
	};

	// Switch display from character creation screen to roll stats
	this.toggleRollStats = function () {
		self.characterCreationShow(false);
		self.rollStatsShow(true);
	};

	// Flip player card to reveal character
	// Switch the start game screen with the town screen
	// Flip the UI card
	this.toggleTown = function () {
		self.playerCardShow(true);
		self.startGameShow(false);
		self.townShow(true);
		self.uiCardShow(false);
	};

	// Flip the UI card to reveal the battle screen
	this.toggleBattle = function () {
		// If battle screen is not visible, make it visible and hide other screens
		if (self.battleShow() === false) {
			self.hideAllFront();
			self.battleShow(true);
		}

		// Reset battle log
		self.battleLog('');
		self.logOverflow(true);

		// Get new enemy and flip the enemy card to reveal it
		self.getEnemy();
		self.enemyCardShow(true);

		// Flip the UI card
		self.uiCardShow(true);
	};

	// Return to town after battle by flipping enemy and UI cards
	this.toggleBattleReturn = function () {
		self.enemyCardShow(false);
		self.uiCardShow(false);
		self.logOverflow(false);
	};

	// Set variables for initial stats and skill points when entering level up screen
	this.tempStats = ko.observableArray();
	this.tempSkillPoints;

	// Toggle visibility of town screen and level up screen
	this.toggleLevelUp = function () {

		// Set tempStats and tempSkillPoints to current player stats and skill points
		self.tempStats(self.player().stats().map(function (stat) {
			return { name: stat.name, value: ko.observable(stat.value()), min: stat.value() };
		}));
		self.tempSkillPoints = self.player().skillPoints();

		// Set visibility of levelup screen and flip UI card
		if (self.levelUpShow() === false) {
			self.hideAllFront();
			self.levelUpShow(true);
		}
		self.uiCardShow(true);
	};

	// Change stats on levelup screen
	this.changeStat = function (n) {

		// Check placing or subtracting the point will not be higher than 20 or lower than initial value
		if (self.player().skillPoints() - n >= 0 && this.value() + n >= this.min && this.value() + n <= 20) {

			// Increment/decrement the stat and add or remove a skill point
			this.value(this.value() + n);
			self.player().skillPoints(self.player().skillPoints() - n);
		}
	};

	// Return from level up screen
	this.toggleLevelUpReturn = function () {
		// Update player stats with new values and update player level based on points spent
		self.player().updateStats(self.tempStats());
		self.player().level(self.player().level() + (self.tempSkillPoints - self.player().skillPoints()));

		// Flip UI card
		self.uiCardShow(false);
	};

	// Observable for the healer and shop log
	this.townLog = ko.observable();

	// Toggle visibility of town and shop screens
	// Toggle visibility of player inventory
	this.toggleShop = function () {
		// Reset the town log
		self.townLog('Welcome to the item store!');

		self.playerBackShow(false);
		self.playerInventoryShow(true);
		self.playerCardShow(false);

		if (self.shopShow() === false) {
			self.hideAllFront();
			self.shopShow(true);
		}
		self.uiCardShow(true);
	};

	// Select and item in the shop
	this.toggleItem = function (i) {
		// Set all items to not selected
		items().forEach(function (item) {
			item.active(false);
		});

		// Active clicked on item
		i.active(true);
	};

	// Purchasing an item from the shop
	this.buyItem = function () {
		var selectedItem = void 0;

		// Find which item has been selected
		items().forEach(function (item) {
			if (item.active() === true) {
				selectedItem = item;
			}
		});

		// Check and item is selected and the player has sufficient gold
		if (selectedItem && self.player().gold() >= selectedItem.price) {
			// Deduct gold from player
			self.player().gold(self.player().gold() - selectedItem.price);

			// Match item type to inventory and set inventory accordingly
			for (var prop in self.player().inventory()) {
				if (prop === selectedItem.type) {
					self.player().inventory()[prop](selectedItem);
				}
			}

			// Remove item from the store
			selectedItem.available(false);

			self.townLog(selectedItem.name + " purchased");
		} else if (selectedItem) {
			self.townLog('You do not have enough gold for that');
		} else {
			self.townLog('Please select an item');
		}
	};

	// Return from the shop
	this.toggleShopReturn = function () {
		// Stat modifiers and armour
		var modifiers = [0, 0, 0, 0, 0];
		var a = 0;
		var m = 0;

		// Search inventory for stat values
		for (var prop in self.player().inventory()) {
			var modifier = self.player().inventory()[prop]().modifier;
			var value = self.player().inventory()[prop]().value;
			if (modifier === 'strength') {
				modifiers[0] += value;
			} else if (modifier === 'dexterity') {
				modifiers[1] += value;
			} else if (modifier === 'constitution') {
				modifiers[2] += value;
			} else if (modifier === 'intelligence') {
				modifiers[3] += value;
			} else if (modifier === 'initiative') {
				modifiers[4] += value;
			} else if (modifier === 'armour') {
				a += value;
			} else if (modifier === 'magic resistance') {
				m += value;
			}
		}

		// Set player modifiers to new equipment
		self.player().modifiers = modifiers;
		self.player().armour = a;
		self.player().magicResistance = m;

		// Flip UI and player cards
		self.playerCardShow(true);
		self.uiCardShow(false);
	};

	// Toggle visibility of town screen and healer screen
	this.toggleHealer = function () {
		// Reset the town log
		self.townLog('Welcome to the town healer!');

		// Set visibility of healer screen and flip UI card
		if (self.healerShow() === false) {
			self.hideAllFront();
			self.healerShow(true);
		}
		self.uiCardShow(true);
	};

	// Restore players current health at the price of gold
	this.cureWounds = function (healing, price) {
		// Check player is not at max health
		if (self.player().currentHealth() < self.player().maxHealth()) {

			// Check player has enough gold
			if (self.player().gold() >= price) {

				// Take gold from player
				self.player().gold(self.player().gold() - price);

				// Restore health to maximum of players max health
				if (self.player().currentHealth() + healing > self.player().maxHealth()) {
					self.player().currentHealth(self.player().maxHealth());
				} else {
					self.player().currentHealth(self.player().currentHealth() + healing);
				}
				self.townLog('Wounds cured');
			} else {
				self.townLog('You do not have enough gold for that');
			}
		} else {
			self.townLog('You have no wounds to cure');
		}
	};

	// Return to town from the healer
	this.toggleReturn = function () {
		self.uiCardShow(false);
	};

	// Toggle browse through portraits
	this.togglePortrait = function (n) {

		// Variable for next active portrait
		var currentIndex = void 0;

		// Set all portraits to not active
		// Set currentIndex to the next portrait
		portraits.forEach(function (portrait) {
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
	};

	// Toggle selection of classes
	this.toggleClassSelection = function (cl) {

		// Set all classes to not selected
		classes.forEach(function (c) {
			c.active(false);
		});

		// Activate selected class
		if (cl.active() === false) {
			cl.active(true);
		}
	};

	// Create player and name variables
	this.player = ko.observable();
	this.nameInput = ko.observable();
	this.wins = ko.observable(0);

	// Create character with selected options once form is submitted
	this.createCharacter = function () {

		// Variables for selected character features
		var portrait = void 0;
		var cl = void 0;
		var playerStats = [];

		// Find selected portrait
		portraits.forEach(function (p) {
			if (p.active() === true) {
				portrait = p.path;
			}
		});

		// Find selected class and set stats based on the class selected
		classes.forEach(function (c) {
			if (c.active() === true) {
				cl = c;
				c.maxStats.forEach(function (s) {
					playerStats.push(getRandom(s - 5, s));
				});
			}
		});

		// Create player instance and reveal roll stats screen
		self.player(new Player(self.nameInput(), portrait, cl, playerStats));
		self.toggleRollStats();
	};

	// Create and roll for player stats
	this.rollStats = function () {

		// Find maximum stats for selected class
		var classStats = self.player().cl().maxStats;

		// Check there are rerolls remaining
		if (self.player().rerolls() > 0) {

			// Set each stat as a number up to 5 less than the class maximum
			for (var i = 0; i < self.player().stats().length; i++) {
				self.player().stats()[i].value(getRandom(classStats[i] - 5, classStats[i]));
			}

			// Set current health and subtract one from rerolls
			self.player().currentHealth(self.player().maxHealth());
			self.player().rerolls(self.player().rerolls() - 1);
		}
	};

	// Create current enemy variable and current tier of enemies
	this.currentEnemy = ko.observable();
	this.enemies = ko.computed(function () {
		if (self.wins() > 19) {
			return enemiesThree;
		} else if (self.wins() > 9) {
			return enemiesTwo;
		} else {
			return enemiesOne;
		}
	});

	// Get a random enemy from enemies array
	this.getEnemy = function () {
		var enemy = self.enemies()[getRandom(0, self.enemies().length - 1)];
		self.currentEnemy(new Enemy(enemy.name, enemy.portrait, enemy.stats, enemy.armour, enemy.magicResistance, enemy.expValue, enemy.goldValue));
	};

	// Battle log observable
	this.battleLog = ko.observable('');
	this.logOverflow = ko.observable(false);

	// Check to see if the player hits, calculate the damage and display it in the combat log
	this.playerAttack = function () {
		if (self.player().checkHit()) {

			// Get player damage
			var playerDmg = self.currentEnemy().checkArmour(self.player().getPhysicalDamage());

			// Enemy takes player damage
			self.currentEnemy().takeHit(playerDmg);

			// Display in battle log
			self.battleLog(self.battleLog() + ("<p>You attack the " + self.currentEnemy().name() + " for " + playerDmg + " damage</p>"));
		} else {

			// Log a miss in the battle log
			self.battleLog(self.battleLog() + ("<p>You miss the " + self.currentEnemy().name() + "</p>"));
		}
	};

	// Calculate magic damage and display it in the combat log
	this.playerMagicAttack = function () {

		// Get player damage
		var playerDmg = self.currentEnemy().checkMagicResistance(self.player().getMagicalDamage());

		// Enemy takes player damage
		self.currentEnemy().takeHit(playerDmg);

		// Display in battle log
		self.battleLog(self.battleLog() + ("<p>Your spell hits the " + self.currentEnemy().name() + " for " + playerDmg + " damage</p>"));
	};

	// Check to see if the enemy hits, calculate the damage and display it in the combat log
	this.enemyAttack = function () {
		// Check to see how much damage each attack would do
		var enemyPhyDmg = self.player().checkArmour(self.currentEnemy().getPhysicalDamage());
		var enemyMagDmg = self.player().checkMagicResistance(self.currentEnemy().getMagicalDamage());

		// Check if the enemy uses magic or physical attack
		if (enemyPhyDmg >= enemyMagDmg) {
			if (self.currentEnemy().checkHit()) {

				// Player takes enemy damage
				self.player().takeHit(enemyPhyDmg);

				// Display in battle log
				self.battleLog(self.battleLog() + ("<p>" + self.currentEnemy().name() + " attacks you for " + enemyPhyDmg + " damage</p>"));
			} else {

				// Log a miss in the battle log
				self.battleLog(self.battleLog() + ("<p>" + self.currentEnemy().name() + " misses you</p>"));
			}
		} else {

			// Player takes enemy damage
			self.player().takeHit(enemyMagDmg);

			// Display in battle log
			self.battleLog(self.battleLog() + ("<p>" + self.currentEnemy().name() + "'s spell hits you for " + enemyMagDmg + " damage</p>"));
		}
	};

	// Log enemy death in battle log and gain experience and gold
	this.enemySlain = function () {
		self.wins(self.wins() + 1);
		self.player().experienceGain(self.currentEnemy().expValue);
		self.player().gold(self.player().gold() + self.currentEnemy().goldValue);
		self.battleLog(self.battleLog() + ("<p>You have slain the " + self.currentEnemy().name() + "!</p>\n\t\t<p>You gain " + self.currentEnemy().expValue + " experience</p>\n\t\t<p>" + self.currentEnemy().goldValue + " gold earned</p>"));
	};

	// Player attack and enemy attack when attack button is clicked
	this.physicalAttack = function () {

		// Check who strikes first based on initiative
		if (self.player().stats()[4].value() >= self.currentEnemy().stats()[4].value()) {

			// Attack and check for enemy death, if alive enemy retaliates
			self.playerAttack();
			self.currentEnemy().dead() ? self.enemySlain() : self.enemyAttack();
		} else {

			// Enemy attacks first followed by player and check for enemy death
			self.enemyAttack();
			self.playerAttack();
			if (self.currentEnemy().dead()) {
				self.enemySlain();
			}
		}
	};

	// Player magic attack and enemy attack when magic button is clicked
	this.magicalAttack = function () {

		// Check who strikes first based on initiative
		if (self.player().stats()[4].value() >= self.currentEnemy().stats()[4].value()) {

			// Attack and check for enemy death, if alive enemy retaliates
			self.playerMagicAttack();
			self.currentEnemy().dead() ? self.enemySlain() : self.enemyAttack();
		} else {

			// Enemy attacks first followed by player and check for enemy death
			self.enemyAttack();
			self.playerMagicAttack();
			if (self.currentEnemy().dead()) {
				self.enemySlain();
			}
		}
	};

	// Reset the game back to its starting state
	this.resetGame = function () {

		// Hide player and enemy cards
		self.playerInventoryShow(false);
		self.playerBackShow(true);
		self.playerCardShow(false);
		self.enemyCardShow(false);

		// Set player and enemy objects to null
		self.player(null);
		self.currentEnemy(null);

		// Hide town and battle screens, show start game
		self.townShow(false);
		self.battleShow(false);
		self.startGameShow(true);

		// Flip UI card
		self.uiCardShow(false);

		// Reset store
		items().forEach(function (i) {
			i.active(false);
			i.available(true);
		});

		// Reset portraits
		portraits.forEach(function (p) {
			p.active(false);
		});
		portraits[0].active(true);

		// Reset classes
		classes.forEach(function (c) {
			c.active(false);
		});
		classes[0].active(true);

		// Reset player name and number of wins
		self.nameInput('');
		self.wins(0);
	};
};

ko.applyBindings(new ViewModel());
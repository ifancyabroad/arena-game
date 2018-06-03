'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Superclass for all Game Entities
var GameEntity = function () {
	function GameEntity(name, portrait, stats) {
		var armour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var magicResistance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

		_classCallCheck(this, GameEntity);

		var self = this;

		// Name and picture variables
		this.name = ko.observable(name);
		this.portrait = ko.observable(portrait);

		// Array to hold all player and enemy stats
		this.stats = ko.observableArray([{
			name: 'Strength',
			value: ko.observable(stats[0]),
			modifier: ko.observable(0)
		}, {
			name: 'Dexterity',
			value: ko.observable(stats[1]),
			modifier: ko.observable(0)
		}, {
			name: 'Constitution',
			value: ko.observable(stats[2]),
			modifier: ko.observable(0)
		}, {
			name: 'Intelligence',
			value: ko.observable(stats[3]),
			modifier: ko.observable(0)
		}, {
			name: 'Initiative',
			value: ko.observable(stats[4]),
			modifier: ko.observable(0)
		}]);

		// Set maximum health to constitution * 10
		this.maxHealth = ko.computed(function () {
			return self.stats()[2].value() * 10;
		});

		// Initially set current health to maximum health
		this.currentHealth = ko.observable(this.maxHealth());

		// Alive is true as long as current health is above 0
		this.dead = ko.computed(function () {
			return self.currentHealth() <= 0;
		});

		// Armour variable
		this.armour = ko.observable(armour);

		// Magic reistance variable
		this.magicResistance = ko.observable(magicResistance);

		// Critical strike chance
		this.critChance = ko.computed(function () {
			return (self.stats()[1].value() + self.stats()[1].modifier()) * 0.75 + 5;
		});
	}

	// Use dexterity stat to check whether or not attack hits


	_createClass(GameEntity, [{
		key: 'checkHit',
		value: function checkHit() {
			var dex = this.stats()[1].value() + this.stats()[1].modifier();
			if (dex >= getRandom(1, 20)) {
				return true;
			} else {
				return false;
			}
		}

		// Use crit chance to check whether or not it is a critical strike

	}, {
		key: 'checkCrit',
		value: function checkCrit(damage) {
			if (this.critChance() >= getRandom(1, 100)) {
				return true;
			} else {
				return false;
			}
		}

		// Mitigate physical damage based on armour stat

	}, {
		key: 'checkArmour',
		value: function checkArmour(damage) {
			if (damage - this.armour() < 0) {
				return damage = 0;
			} else {
				return damage - this.armour();
			}
		}

		// Mitigate magical damage based on magic resistance stat

	}, {
		key: 'checkMagicResistance',
		value: function checkMagicResistance(damage) {
			if (damage - this.magicResistance() < 0) {
				return damage = 0;
			} else {
				return damage - this.magicResistance();
			}
		}

		// Get physical damage based on strength stat

	}, {
		key: 'getPhysicalDamage',
		value: function getPhysicalDamage() {
			var str = this.stats()[0].value() + this.stats()[0].modifier();
			return str + getRandom(1, 6);
		}

		// Get magical damage based on intelligence

	}, {
		key: 'getMagicalDamage',
		value: function getMagicalDamage() {
			var intel = this.stats()[3].value() + this.stats()[3].modifier();
			return intel + getRandom(1, 6);
		}

		// Subtract from current health when hit

	}, {
		key: 'takeHit',
		value: function takeHit(damage) {
			this.currentHealth(this.currentHealth() - damage);
			return damage;
		}
	}]);

	return GameEntity;
}();

// Subclass for the player


var Player = function (_GameEntity) {
	_inherits(Player, _GameEntity);

	function Player(name, portrait, cl, stats) {
		_classCallCheck(this, Player);

		var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, name, portrait, stats));

		// Get name, portrait and stats from parent class


		var self = _this;

		// Variable for class selected by player
		_this.cl = ko.observable(cl);

		// Variable for experience obtained by player
		_this.experience = ko.observable(0);

		// Variable for how much gold the player is holding
		_this.gold = ko.observable(0);

		// Experience chart
		_this.levelTier = ko.computed(function () {
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
		_this.level = ko.observable(1);

		// Variable for rerolls the player is allowed
		_this.rerolls = ko.observable(10);

		// Skill points the player has acquired for spending
		_this.skillPoints = ko.observable(0);

		// Inventory
		_this.inventory = ko.observable({
			head: ko.observable({ name: 'None' }),
			body: ko.observable({ name: 'None' }),
			gloves: ko.observable({ name: 'None' }),
			boots: ko.observable({ name: 'None' }),
			weapon: ko.observable({ name: 'None' }),
			misc: ko.observable({ name: 'None' })
		});
		return _this;
	}

	// Update the players stats based on an array of stats taken as a parameter


	_createClass(Player, [{
		key: 'updateStats',
		value: function updateStats(newStats) {
			for (var i = 0; i < this.stats().length; i++) {
				this.stats()[i].value(newStats[i].value());
			}
		}

		// Increase experience

	}, {
		key: 'experienceGain',
		value: function experienceGain(xp) {
			var currentTier = this.levelTier();
			this.experience(this.experience() + xp);
			if (currentTier !== this.levelTier()) {
				this.skillPoints(this.skillPoints() + 1);
			}
		}
	}]);

	return Player;
}(GameEntity);

// Subclass for the enemy


var Enemy = function (_GameEntity2) {
	_inherits(Enemy, _GameEntity2);

	function Enemy(name, portrait, stats) {
		var armour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var magicResistance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var expValue = arguments[5];
		var goldValue = arguments[6];

		_classCallCheck(this, Enemy);

		var _this2 = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, name, portrait, stats, armour, magicResistance));

		// Get name, portrait and stats from parent class


		var self = _this2;

		// Variable for how much experience the enemy is worth
		_this2.expValue = expValue;

		// Variable for how much gold the enemy is worth
		_this2.goldValue = goldValue;
		return _this2;
	}

	return Enemy;
}(GameEntity);
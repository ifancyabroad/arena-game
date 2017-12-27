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

const classes = [
	{
		active: ko.observable(false),
		name: 'Warrior',
		description: 'Some text describing the warrior class'
	},
	{
		active: ko.observable(false),
		name: 'Mage',
		description: 'Some text describing the mage class'
	},
	{
		active: ko.observable(false),
		name: 'Rogue',
		description: 'Some text describing the rogue class'
	}
]

class GameEntity {
	constructor(name, portrait, strength, dexterity, constitution, intelligence, initiative) {
		this.name = ko.observable(name);
		this.portrait = ko.observable(portrait);
		
		this.strength = ko.observable(strength);
		this.dexterity = ko.observable(dexterity);
		this.constitution = ko.observable(constitution);
		this.intelligence = ko.observable(intelligence);
		this.initiative = ko.observable(initiative);
		
		this.maxHealth = ko.observable(this.getMaxHealth());
	}
	
	getMaxHealth() {
		return this.constitution() * 10;
	}
}

class Player extends GameEntity {
	constructor(name, portrait, cl) {
		super(name, portrait);
		this.cl = ko.observable(cl);
		this.experience = ko.observable(0);
		this.level = ko.observable(1);
	} 
}

const ViewModel = function() {
	const self = this;
	
	this.characterCreationHidden = ko.observable(true);
	
	this.toggleCharacterCreation = function() {
		if (self.characterCreationHidden() === true) {
			self.characterCreationHidden(false);
		} else {
			self.characterCreationHidden(true);
		}
	}
	
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
	
	this.player = ko.observable();
	this.nameInput = ko.observable();
	
	this.createCharacter = function() {
		let portrait;
		let cl;
		portraits.forEach(function(p) {
			if (p.active() === true) {
				portrait = p.path;
			}			
		});
		classes.forEach(function(c) {
			if (c.active() === true) {
				cl = c.name;
			}			
		});
		self.player(new Player(self.nameInput(), portrait, cl));
	}
}

ko.applyBindings(new ViewModel());
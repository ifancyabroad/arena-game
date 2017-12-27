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
}

ko.applyBindings(new ViewModel());
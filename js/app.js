const ViewModel = function() {
	const self = this;
	
	this.characterCreationHidden = ko.observable(true);
	
	this.toggleCharacterCreation = function() {
		if (self.characterCreationHidden() === true) {
			self.characterCreationHidden(false);
		}
		else {
			self.characterCreationHidden(true);
		}
	}
}

ko.applyBindings(new ViewModel());
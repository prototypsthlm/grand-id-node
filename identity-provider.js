var grandId = require('./grand-id');

function IdentityProvider(id, config) {
	this._config = config;	
	this.id = id;
}

IdentityProvider.prototype.login = function(callback) {	
	grandId.feteratedLogin(this._config.apiKey, this._config.authenticateServiceKey, this._config.callbackUrl, callback);
};

IdentityProvider.prototype.logout = function(grandIdSessionId, callback) {	
	grandId.logout(this._config.apiKey, this._config.authenticateServiceKey, grandIdSessionId, callback);
};

IdentityProvider.prototype.getUserProfile = function(grandIdSessionId, callback) {
	grandId.getSession(this._config.apiKey, this._config.authenticateServiceKey, grandIdSessionId, callback);
};

module.exports = IdentityProvider;
var _ = require('lodash');
var request = require('request');

// Default config
var config = {
	serviceUrl: {
		test: 'https://client-test.grandid.com/json1.1/',
		prod: 'https://client.grandid.com/json1.1/'
	},
	env: 'test',
	identityProviders: {}
};

var GrandID = {	
	log: log,
	setConfig: setConfig,
	createIdentityProvider: createIdentityProvider,
	feteratedLogin: federatedLogin,
	getSession: getSession,
	logout: logout
};

function log() {
	if(config.debug === true) {
		Function.apply.call(console.log, console, arguments);
	}
}

function url(endpoint) {
	var serviceUrl = config.serviceUrl[config.env];
	return serviceUrl + endpoint;
}

function identityProviderConfig(identityProviderId) {
	var ipConfig = config.identityProviders[identityProviderId];
	if(ipConfig === undefined) {
		new Error(identityProviderId + ' is mising');
	}
	return ipConfig;
}

function setConfig(userConfig) {
	// Validate identity provider config and add defaults
	if(userConfig.identityProviders) {
		var defaults = {};
		_.each(userConfig.identityProviders, function(identityProviderConfig, providerKey) {						
			userConfig.identityProviders[providerKey] = _.defaults(identityProviderConfig, defaults);			
		});
	}
	config = _.defaults(userConfig, config);	
}

function createIdentityProvider(identityProviderId) {
	var ipConfig = identityProviderConfig(identityProviderId);	
	var IdentityProvider = require('./identity-provider');
	return new IdentityProvider(identityProviderId, ipConfig);
}

function validateQuery(query) {
	var missing = [];
	_.each(query, function(value, key) {
		if(value === undefined) {
			missing.push(key);
		}
	});
	if(missing.length > 0) {
		new Error('Missing query params: ' + missing.join(', '));
	}	
}
function makeRequest(url, query, callback) {
	validateQuery(query);
	
	var options = {
		url: url,
		qs: query
	};
	log('makeRequest');
	log('URL:', url);
	log('query:', query);
	request(options, function(error, response, body) {
		log('Response for URL "' + url + '" retrieved. Status code: ' + response.statusCode);
		if (!error && response.statusCode == 200) {
			var obj = JSON.parse(body);
			log('json response');
			log(obj);
			callback(undefined, obj);
		} else {
			callback(error);
		}
	});
}

function federatedLogin(apiKey, authServiceKey, callbackUrl, callback) {	
	var query = {
		apiKey: apiKey,
		authenticateServiceKey: authServiceKey,
		callbackUrl: callbackUrl
	};
	makeRequest(url('FederatedLogin'), query, callback);
}

function getSession(apiKey, authenticateServiceKey, grandIdSessionId, callback) {
	var query = {
		apiKey: apiKey,
		authenticateServiceKey: authenticateServiceKey,
		sessionid: grandIdSessionId
	};
	makeRequest(url('GetSession'), query, callback);
}

function logout(apiKey, authenticateServiceKey, grandIdSessionId, callback) {
	var query = {
		apiKey: apiKey,
		authenticateServiceKey: authenticateServiceKey,
		sessionid: grandIdSessionId
	};
	makeRequest(url('Logout'), query, callback);
}


module.exports = GrandID;
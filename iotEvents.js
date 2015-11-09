var EventAggregator = require("droopy-events");
var Firebase = require("firebase");
var Guid = require("guid"); 

var create = function(url) {
	
	url = url || "https://skyline-iot.firebaseio.com";
	var ref = new Firebase("https://skyline-iot.firebaseio.com");
	var eventTypes = {};

	var fireBaseEvents = new EventAggregator();

	var setupListeners = function() {
		var newItems = false;
		ref.child("eventTypes").once("value", function(snapshot) {
			eventTypes = snapshot.val();
		});

		ref.child("events").orderByChild("timestamp").limitToLast(1).on("child_added", function(snapshot){
			//child_added returns a result for each initial item
			if (!newItems) {
				newItems = true;
				return;
			};
			var event = snapshot.val();
			

			fireBaseEvents.trigger(event.type, event.payload);
			// Trigger 'log' for everything.  
			// This allows people to say iotEvents.subscribe('log', cb) and catch everything
			fireBaseEvents.trigger("log", event);
		});
	};

	var subscribe = function(type, cb) {
		fireBaseEvents.on(type, cb);
	};

	var unsubscribe = function(type, cb) {
		fireBaseEvents.off(type, cb);
	};

	var trigger = function(type, payload) {
		var id = Guid.raw();
		var timestamp = (new Date()).toISOString();
		ref.child("events").child(id).set({ 
			type: type, timestamp: timestamp, payload: payload});
	};

	setupListeners();

	// Public Methods
	return { 
		subscribe: subscribe, 
		unsubscribe: unsubscribe, 
		trigger:trigger 
	};
};

module.exports = create();
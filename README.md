Skyline Iot Events
=========
----------

Allows multiple devices to talk to each other by subscribing and triggering events.  Uses Firebase to implement PubSub.

Install
--------------
If you are using node or a javscript build process (browserify or webpack), just use the NPM module.

```
>> npm install --save skyline-iot-events
```

Otherwise, it also works on any static HTML page.  Just add a script reference to one of the builds in the `/dist` folder.

```html
<script src='skyline-iot-events/dist/iotEvents.min.js'></script> 
```

Methods
--------------
Three methods are exposed to handle pubsub
- `iotEvents.trigger(key, payload)` - Fire off an event of type 'key'. The payload is just an object, but please be a good citizen and at least add a `source` property.
- `iotEvents.subscribe(key, callback)` - Listen for a device to call `.trigger()` on the specified  `key`, your callback will be invoked with the triggering `payload` as the first argument.
- `iotEvents.unsubscribe(key, callback)` - Stop listening to IOT events of the specified key.
- `iotEvents.subscribe('log', callback)` - A quick little backdoor to listen to every event. *Note: the first argument to your callback is an event object, `{ key, payload }`, not just the `payload`.*


Example Usage
--------------
Check out the `/demo` folder for actual working examples... but here's the gist:

You could have a Raspberry PI running node.js to control your lights
```javascript
var iotEvents = require('skyline-iot-events');

var handleLightToggle = function(payload) {
    var newValue = payload.status === "on" ? true : false;
    setLightValue(newValue);
    broadcastStatus();
};
var broadcastStatus = function() {
    var status = myLight.value ? "on" : "off"
    var payload = { source: "node-server", status: status };
    iotEvents.trigger("light-status", payload);
};

iotEvents.subscribe("toggle-light", handleLightToggle);

var setLightValue = function(newValue) {
    // device specific code to actually toggle light bulbs...
    myLight.value = newValue;
}
```

Then you could have a static HTML file (no server required!) that includes a reference to one of the builds in the `/dist` folder.
``` javascript
// === Turn the light on and off ===
var toggleLight = function(status) {
    var payload = { source: "html-page", status: status };
    window.iotEvents.trigger("toggle-light", payload);    
}
document.getElementById('turn-on-btn').onclick = function() { toggleLight("on"); }
document.getElementById('turn-off-btn').onclick = function() { toggleLight("off"); }


// === Real time display of the light's status ===
/*
 * There may be other things toggling the light, so we can see the 
 * realtime status (w/ web sockets) by subscribing to the event
*/
var showLightStatus = function(payload) {
    document.getElementById("light").innerHTML = payload.status;
};
// subscribe to events (fired from the node server in this example
window.iotEvents.subscribe('light-status', showLightStatus);
```

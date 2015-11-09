var iotEvents = window.iotEvents;
var lastCommand = "";

// DOM stuff
var ball = document.querySelector('.ball');
var pad = document.querySelector('.pad');
var maxX = pad.clientWidth
var maxY = pad.clientHeight

// Device Orientation event fires constantly, 
// Throttle it a bit without appearing choppy
var startThrottle = throttle(handleOrientation, 50);

// Methods to start and stop listening to device events
var start = function() {
	window.addEventListener('deviceorientation', startThrottle);
};
var stop = function() {
	window.removeEventListener('deviceorientation', startThrottle);
};

// Hook up buttons
document.querySelector('.start').onclick = start;
document.querySelector('.stop').onclick = stop;

// Big Daddy Handler
function handleOrientation(event) {
	var y = event.beta * (-1.5) + 30; // In degree in the range [-180,180]
	var x = event.gamma * 1.5; // In degree in the range [-90,90]
	var hyp = getHype(x, y);
	var angle = getAngle(x, y);
	var command = getCommand(hyp, angle);


	if (y > 125) {
		y = 125
	};
	if (y < -125) {
		y = -125
	};

	moveBall(x, y);
	// triggerCommand(command);
	if (command !== lastCommand) {
		triggerCommand(command);
		lastCommand = command;
	}
}

//HELPERS
var moveBall = function(x, y) {
	y = (y * -1.2);
	x += 90;
	y += 90;

	ball.style.left = (maxX * x / 180 - 10) + "px";
	ball.style.top = (maxY * y / 180 - 10) + "px";
};

var getAngle = function(x, y) {
	return Math.atan2(y, x) * 180 / Math.PI
}

var getHype = function(x, y) {
	var csquared = (x * x) + (y * y);
	return Math.sqrt(csquared);
};

var getCommand = function(hyp, angle) {
	if (hyp < 10) return "stop";
	if (angle > -15 && angle < 15) return "hardRight";
	if (angle >= 15 && angle < 50) return "right";
	if (angle >= 50 && angle < 130) return "forward";
	if (angle >= 130 && angle < 165) return "left";
	if (angle >= 165 && angle <= 180) return "hardLeft";
	if (angle >= -180 && angle < -165) return "hardLeft";
	if (angle >= -165 && angle < -130) return "backwardLeft";
	if (angle >= -130 && angle < -50) return "backward";
	if (angle >= -50 && angle < -15) return "backwardRight";
};

var triggerCommand = function(command) {
	var payload = {
		action: command,
		source: "deviceorientation api",
		duration: 30000
	};
	iotEvents.trigger("toggleRobotMotor", payload);
};

function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last;
	var deferTimer;
	return function() {
		var context = scope || this;

		var now = +new Date,
			args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
};
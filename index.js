
var util = require('util');

// Default levels
var defaultLevels = ["debug", "info", "error"];
var defaultOptions = {
    'level':'debug',
    'timestamp':true
};

var loggers = {};

exports.get = function(domain, requestedOptions) {
    (domain) || (domain = "default");

    // Re-use existing logger
    if (!loggers[domain]) {

        // Get options
        var options = require('util')._extend({}, defaultOptions);
        options = require('util')._extend(options, requestedOptions);

        // Set up the level mask
        var requiredLevel = Math.max(0, defaultLevels.indexOf(options.level));
        var setLevels = {};
        for (var i = 0; i < defaultLevels.length; i++) {
            setLevels[defaultLevels[i]] = (i >= requiredLevel);
        }

        // Set up the date formatter
        var formatDate = function() {
            if (!options.timestamp) return "";
            return "[" + new Date().toISOString().replace("T", " ").replace("Z", "") + "] ";
        };

        var logF = function(type, args) {
            if (!setLevels[type]) return;
            args = Array.prototype.slice.call(args);
            var message = formatDate() + '[' + domain + '] [' + type + '] ' + util.format.apply(null, args);
            console.log(message);
        };

        loggers[domain] = {
            info:function() {
                logF("info", arguments);
            },

            error:function() {
                logF("error", arguments);
            },

            debug:function() {
                logF("debug", arguments);
            }
        };
    }

    return loggers[domain];
};

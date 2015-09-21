
var util = require('util');

// Default levels
var logLevels = ["debug", "info", "warn", "error"];
var defaultOptions = {
    'level':(process.env && process.env.NODE_ENV == "production") ? "info" : "debug",
    'timestamp':true
};

var loggers = {};

// This is not backward applicable to existing loggers
exports.setLevel = function(level) {
    if (logLevels.indexOf(level) != -1) {
        defaultOptions.level = level;
    }
};

exports.get = function(domain, requestedOptions) {
    (domain) || (domain = "default");

    // Re-use existing logger
    if (!loggers[domain]) {

        // Get options
        var options = require('util')._extend({}, defaultOptions);
        options = require('util')._extend(options, requestedOptions);

        // Set up the level mask
        var requiredLevel = Math.max(0, logLevels.indexOf(options.level));
        var setLevels = {};
        for (var i = 0; i < logLevels.length; i++) {
            setLevels[logLevels[i]] = (i >= requiredLevel);
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

            warn:function() {
                logF("warn", arguments);
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

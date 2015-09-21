var assert = require('chai').assert,
    loggerModule = require('../index');

describe('logger', function() {

    var log = console.log;

    var interceptOnce = function(rule) {
        var first = true;
        console.log = function(message) {
            if (first) {
                first = false;
                return rule(message);
            }

            log.apply(log, arguments);
        };
    };

    it('should log in debug mode with timestamp by default', function(done) {
        var logger = loggerModule.get("yoyo");
        interceptOnce(function(message) {
            var parts = message.split(/]\s(.+)/);
            assert.equal(parts[1], "[yoyo] [debug] Message");
            var timestamp = parts[0].substring(1);
            var date = new Date(timestamp);
            assert.isAbove(date.getTime(), 1);
            done();
        });
        logger.debug("Message");
    });

    it('should allow override timestamp', function(done) {
        var logger = loggerModule.get("yoya", {timestamp:false});
        interceptOnce(function(message) {
            assert.equal(message, "[yoya] [debug] Message");
            done();
        });
        logger.debug("Message");
    });

    it('should respect log level', function(done) {
        var logger = loggerModule.get("yoyu", {level:"info"});
        interceptOnce(function(message) {
            assert.equal(message, "Not called");
            done();
        });
        logger.debug("Message");
        console.log("Not called");
    });

    it('should log info', function(done) {
        var logger = loggerModule.get("yoya");

        interceptOnce(function(message) {
            assert.equal(message, "[yoya] [debug] Message");
            done();
        });
        logger.debug("Message");
    });

    it('should log warn', function(done) {
        var logger = loggerModule.get("yoya");

        interceptOnce(function(message) {
            assert.equal(message, "[yoya] [warn] Message");
            done();
        });
        logger.warn("Message");
    });

    it('should log error', function(done) {
        var logger = loggerModule.get("yoya");

        interceptOnce(function(message) {
            assert.equal(message, "[yoya] [error] Message");
            done();
        });
        logger.error("Message");
    });

    it('should log adapt to global log level if set', function(done) {
        loggerModule.setLevel("info");
        var logger = loggerModule.get("hello", {timestamp:false});
        interceptOnce(function(message) {
            assert.equal(message, "Not called");
            done();
        });
        logger.debug("Message");
        console.log("Not called");
    });

});

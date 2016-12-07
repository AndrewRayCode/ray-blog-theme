var hbs = require('express-hbs');

var contains = function( fn, arr ) {
    if( !arr ) {
        return false;
    }
    for( var x = 0; x < arr.length; x++ ) {
        if( fn( arr[ x ] ) ) {
            return true;
        }
    }
    return false;
};

var registerHelper = function () {

    hbs.registerHelper('compare', function (lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });

    hbs.registerHelper('hasTag', function( tags, pageTag, test, options ) {

        var findTag = function( tag ) {
            return tag.name === test;
        };

        if( contains( findTag, tags ) || pageTag === test ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });

    hbs.registerHelper('notHasTag', function( tags, pageTag, options ) {

        if( ( !tags || !tags.length ) && !pageTag ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    });

    hbs.registerHelper('debug', function( thing, options ) {

        return JSON.stringify( thing );

    });
};

module.exports = registerHelper;


(function ($) {
    /*
     ======== A Handy Little QUnit Reference ========
     http://api.qunitjs.com/

     Test methods:
     module(name, {[setup][ ,teardown]})
     test(name, callback)
     expect(numberOfAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     throws(block, [expected], [message])
     */

    module('jQuery#svgzoompan', {
        // This will run before each test in this module.
        setup: function () {
            this.$svg = $('#qunit-fixture').find('svg');
        }
    });


    test('is chainable', function () {
        expect(2);

        strictEqual(this.$svg.svgzoompan(), this.$svg, 'should be chainable');
        strictEqual(this.$svg.svgzoompan('zoom', 'in'), this.$svg, 'should be chainable after call method');
    });

}(jQuery));

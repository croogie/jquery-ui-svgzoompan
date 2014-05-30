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

  asyncTest('events has been called', function () {
    expect(4);

    // attach event handlers to element
    this.$svg.on({
      'svgzoompanbeforezoom': function () {
        ok(true, 'svgzoompanbeforezoom has been called');
      },
      'svgzoompanafterzoom': function (e, data) {
        ok(true, 'svgzoompanafterzoom has been called');

        if (data.direction === 'out') {
          start();
        }
      }
    });

    // pass inline event on plugin initialization
    this.$svg.svgzoompan({
      beforeZoom: function () {
        ok(true, 'Inline set callback function has been called.');
      }
    });

    this.$svg.svgzoompan('zoom', 'in')
      .svgzoompan('zoom', 'out');
  });

  asyncTest('Zoom event data is passed', function () {
    expect(14);

    var zoomlevel = '100';
    var type = 'in';

    this.$svg.on({
      'svgzoompanbeforezoom': function (e, data) {
        ok(data, 'Data object has been passed');

        strictEqual(data.direction, type, 'Direction has been passed');
        strictEqual(typeof(data.x), 'number', 'X should be float number');
        strictEqual(typeof(data.y), 'number', 'Y should be float number');
        strictEqual(typeof(data.width), 'number', 'WIDTH should be float number');
        strictEqual(typeof(data.height), 'number', 'HEIGHT should be float number');
        strictEqual(data.zoomLevel, zoomlevel, 'HEIGHT should be float number');

        if (data.direction === 'out') {
          start();
        }
      }
    });

    this.$svg.svgzoompan({
      zoomLevels: '500, 1000'
    });

    this.$svg.svgzoompan('zoom', 'in');

    type = 'out';
    zoomlevel = '500';

    this.$svg.svgzoompan('zoom', 'out');
  });

}(jQuery));

var assertDir = require('assert-dir-equal')
var Metalsmith = require('metalsmith')

/**
 * Define a test case.
 *
 * @param name - The folder name for the test fixtures.
 * @param plugins - An associative array of plugin key name, and options for it.
 */
function test (name, plugins) {
  /* globals it describe */
  it(name, function (done) {
    // Ensure we load the Metalsmith JSTransformer Layouts plugin.
    plugins = plugins || {}
    if (!plugins['..']) {
      plugins['..'] = {}
    }

    // Construct Metalsmith with a clean build directory.
    var testPath = 'test/fixtures/' + name
    var metalsmith = Metalsmith(testPath)
    for (var plugin in plugins || {}) {
      metalsmith.use(require(plugin)(plugins[plugin]))
    }
    metalsmith.build(function (err) {
      if (err) {
        throw new Error(err)
      }
      assertDir(testPath + '/build', testPath + '/expected')
      done()
    })
  })
}

describe('metalsmith-jstransformer', function () {
  test('basic')
  test('include')
  test('multiple')
  test('inherited')
  test('sample')
  test('jstransformer', {
    'metalsmith-jstransformer': {}
  })
})

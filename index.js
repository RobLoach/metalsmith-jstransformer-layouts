var jstransformer = require('jstransformer')
var toTransformer = require('inputformat-to-jstransformer')
var extend = require('extend')
var path = require('path')
var async = require('async')
var minimatch = require('minimatch')

var transformers = {}

/**
 * Retrieve the JSTransformer from the given name.
 *
 * @return The JSTransformer; false if it doesn't exist.
 */
function getTransformer(name) {
  if (name in transformers) {
    return transformers[name]
  }
  var transformer = toTransformer(name)
  transformers[name] = transformer ? jstransformer(transformer) : false
  return transformers[name]
}

/**
 * Metalsmith plugin to process layouts with any JSTransformer.
 *
 * @param {String or Object} options
 *   @property {String} default (optional)
 *   @property {String} pattern (optional)
 * @return {Function}
 */
function plugin(opts) {
  // Execute the plugin.
  return function (files, metalsmith, done) {
    // Prepare the options.
    var pattern = opts.pattern || 'layouts/**'
    var defaultLayout = opts.default

    // Retrieve all layouts.
    var templates = {}
    var filesKeys = Object.keys(files)
    var layouts = minimatch.match(filesKeys, pattern, {matchBase: true})

    /**
     * Compile the given layout and store it in templates.
     */
    function compileLayout(layout, done) {
      // Find which JSTransformer to compile with.
      var transform = path.extname(layout).substring(1)
      transform = getTransformer(transform)
      if (transform) {
        // Retrieve the options for the JSTransformer.
        var options = extend({}, files[layout], {
          filename: path.join(metalsmith._directory, metalsmith._source, layout)
        })

        // Compile the content.
        var content = files[layout].contents.toString()
        transform.compileAsync(content, options).then(function (results) {
          // Wire up the template for the layout.
          templates[layout] = results

          // Set the layout as the default layout, if desired.
          if (files[layout].defaultLayout) {
            defaultLayout = layout
          }

          // Finished compiling the layout into a template.
          done()
        }, function (err) {
          done(err)
        })
      } else {
        done('The layout ' + layout + ' has an unsupported transform of ' + transform + '.')
      }
    }

    /**
     * Render the given file in its layout templates.
     */
    function renderContent(file, done) {
      // Only render content, skip rendering layouts.
      if (!(file in layouts)) {
        var layoutName = files[file].layout || defaultLayout
        while (layoutName && templates[layoutName]) {
          // Build the options/locals.
          var locals = extend({}, metalsmith.metadata(), files[layoutName], files[file], {
            contents: files[file].contents.toString(),
            filename: path.join(metalsmith._directory, metalsmith._source, layoutName)
          })

          // Render the content using the template function and options.
          var output = templates[layoutName].fn(locals)
          files[file].contents = new Buffer(output)

          // Allow for recursive explicit layouts.
          layoutName = files[layoutName].layout
        }
      }
      done()
    }

    /**
     * Delete the given file from the files array.
     */
    function deleteFile(file, done) {
      if (file in files) {
        delete files[file]
      }
      done()
    }

    // Compile all layouts.
    async.map(layouts, compileLayout, function (err) {
      if (err) {
        done(err)
      } else {
        // Now that the layouts are available, render the content.
        async.mapSeries(filesKeys, renderContent, function (err) {
          if (err) {
            done(err)
          } else {
            // All layouts have been rendered, get rid of them.
            async.map(layouts, deleteFile, done)
          }
        })
      }
    })
  }
}

module.exports = plugin

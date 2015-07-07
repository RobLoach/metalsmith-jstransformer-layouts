var jstransformer = require('jstransformer')
var listOfJsTransformers = require('list-of-jstransformers')
var extend = require('extend')
var path = require('path')
var transformers = {}

/**
 * Get the transformer from the given name.
 *
 * @return The JSTransformer; null if it doesn't exist.
 */
function getTransformer (name) {
  if (listOfJsTransformers.indexOf(name) >= 0) {
    if (transformers[name]) {
      return transformers[name]
    }
    transformers[name] = jstransformer(require('jstransformer-' + name))
    return transformers[name]
  }
}

module.exports = function (opts) {
  return function (files, metalsmith, done) {
    var layouts = {}

    // Loop through every file.
    for (var file in files) {
      // Find the layout.
      var layout = files[file].layout
      if (layout) {
        // Cache the layout data.
        if (!layouts[layout] && files[layout]) {
          layouts[layout] = files[layout]
          delete files[layout]
        }

        // Process the content through the layout.
        if (layouts[layout]) {
          var extensions = layout.split('.')
          if (extensions.length > 1) {
            // Retrieve the transformer.
            var transformer = getTransformer(extensions[1])
            if (transformer) {
              // Get the layout input and construct the layout options.
              var input = layouts[layout].contents
              var locals = extend({}, layouts[layout], files[file], {
                contents: files[file].contents,
                filename: path.join(metalsmith._directory, metalsmith._source, file)
              })
              var output = transformer.render(input, locals, locals)
              files[file].contents = new Buffer(output.body)

              // TODO: Recursive layouts? For example... layout: _layout.html-minifier.jade
              // TODO: Inherited layouts? For example... layout: _layout.jade with a layout: _parent-layout.jade definition itself.
              // TODO: Retrieve the options from the JSTransformer name. No engine option conflicts.
            }
          }
        }
      }
    }

    done()
  }
}

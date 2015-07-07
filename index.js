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
    var processFiles = []
    var file
    var layout

    // Retrieve all layouts.
    for (file in files) {
      layout = files[file].layout
      // Ensure the layout exists.
      if (layout && !layouts[layout] && files[layout]) {
        // Remove it from the Metalsmith database, and add it to the layouts.
        layouts[layout] = files[layout]
        processFiles.push(file)
        delete files[layout]
      }
    }

    // Process all content through their respective layouts.
    for (var i in processFiles) {
      file = processFiles[i]
      var layoutName = files[file].layout
      var extensions = layoutName.split('.')
      layout = layouts[layoutName]
      if (extensions.length > 1) {
        // Retrieve the transformer.
        var transformer = getTransformer(extensions[1])
        if (transformer) {
          // Get the layout input and construct the layout options.
          var input = layout.contents
          var locals = extend({}, layout, files[file], {
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

    done()
  }
}

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
  if (transformers[name]) {
    return transformers[name]
  }
  if (listOfJsTransformers.indexOf(name) >= 0) {
    try {
      transformers[name] = jstransformer(require('jstransformer-' + name))
    } catch (e) {
      transformers[name] = false
    }
  } else {
    transformers[name] = false
  }
  return transformers[name]
}

module.exports = function (opts) {
  return function (files, metalsmith, done) {
    // Retrieve all layouts.
    for (var filename in files) {
      // Find the current file's given layout.
      var file = files[filename]
      var layoutName = file.layout
      // Loop through each of the file's layouts, allowing inherited layouts.
      while (layoutName && files[layoutName]) {
        var layout = files[layoutName]
        var extensions = layoutName.split('.')
        if (extensions.length > 1) {
          // Retrieve the transformer.
          var transformer = getTransformer(extensions[1])
          if (transformer) {
            // Get the layout input and construct the layout options.
            var filepath = path.join(metalsmith._directory, metalsmith._source, layoutName)
            // We want to render with the layout's original content, rather than its own rendering.
            var input = layout.originalcontents || layout.contents
            // Build the options/locals.
            var locals = extend({}, metalsmith.metadata(), layout, file, {
              contents: files[filename].contents.toString(),
              filename: filepath
            })
            var output = transformer.render(input.toString(), locals, locals)
            // Keep a hold of the original content of the file, in case we want to render with it again.
            if (!files[filename].originalcontents) {
              files[filename].originalcontents = files[filename].contents
            }
            // Update the output of the file.
            files[filename].contents = new Buffer(output.body)

            // TODO: Recursive layouts? For example... layout: _layout.html-minifier.jade
            // TODO: Retrieve the options from the JSTransformer name. No engine option conflicts.
          }
        }
        layoutName = files[layoutName].layout
      }
    }

    done()
  }
}

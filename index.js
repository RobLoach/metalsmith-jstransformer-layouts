var jstransformer = require('jstransformer')
var toTransformer = require('inputformat-to-jstransformer')
var extend = require('extend')
var path = require('path')
var transformers = {}

/**
 * Retrieve the JSTransformer from the given name.
 *
 * @return The JSTransformer; false if it doesn't exist.
 */
function getTransformer (name) {
  if (name in transformers) {
    return transformers[name]
  }
  var transformer = toTransformer(name)
  transformers[name] = transformer ? jstransformer(transformer) : false
  return transformers[name]
}

module.exports = function (opts) {
  return function (files, metalsmith, done) {
    // Retrieve all layouts.
    for (var filename in files) {
      // Find the current file's given layout.
      var file = files[filename]
      var layoutName = file.layout

      // Back up the file's original content is available so that we can process on it when needed.
      if (!file.originalcontents) {
        files[filename].originalcontents = file.contents
      }

      // Loop through each of the file's layouts, allowing inherited layouts.
      while (layoutName && files[layoutName]) {
        var layout = files[layoutName]

        // Save the layout's original content, and start from it.
        if (!layout.originalcontents) {
          files[layoutName].originalcontents = layout.contents
        }
        var content = files[layoutName].originalcontents.toString()

        // Iterate through each extension and process them with JSTransformers.
        var extensions = layoutName.split('.')
        for (var i = extensions.length - 1; i > 0; i--) {
          // Retrieve the transformer.
          var transformer = getTransformer(extensions[i])
          if (transformer) {
            // Get the layout input and construct the layout options.
            var filepath = path.join(metalsmith._directory, metalsmith._source, layoutName)
            // Build the options/locals.
            var locals = extend({}, metalsmith.metadata(), layout, file, {
              contents: files[filename].contents.toString(),
              filename: filepath
            })
            var output = transformer.render(content, locals, locals)
            // Update the content of the file.
            content = output.body

            // TODO: Retrieve the options from the JSTransformer name. No engine option conflicts.
          } else {
            // Since the transformer is not available, skip the rest of the extensions.
            break
          }
        }

        // Save the file's new content string in a buffer.
        files[filename].contents = new Buffer(content)

        // Move onto the file's parent layout.
        layoutName = files[layoutName].layout
      }
    }

    done()
  }
}

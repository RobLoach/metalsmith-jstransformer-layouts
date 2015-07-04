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
    var templates = {}

    // Loop through every file.
    for (var file in files) {
      // Find the template.
      var template = files[file].template
      if (template) {
        // Cache the template data.
        if (!templates[template] && files[template]) {
          templates[template] = files[template]
          delete files[template]
        }

        // Process the content through the template.
        if (templates[template]) {
          var extensions = template.split('.')
          if (extensions.length > 1) {
            // Retrieve the transformer.
            var transformer = getTransformer(extensions[1])
            if (transformer) {
              // Get the template input and construct the template options.
              var input = templates[template].contents
              var locals = extend({}, templates[template], files[file], {
                contents: files[file].contents,
                filename: path.join(metalsmith._directory, metalsmith._source, file)
              })
              var output = transformer.render(input, locals, locals)
              files[file].contents = new Buffer(output.body)

              // TODO: Recursive templates? For example... template: _template.html-minifier.jade
              // TODO: Inherited templates? For example... template: _template.jade with a template: _parent-template.jade definition itself.
              // TODO: Retrieve the options from the JSTransformer name. No engine option conflicts.
            }
          }
        }
        else {

        }
      }
    }

    done()
  }
}

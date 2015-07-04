# Metalsmith JSTransformer Templates Plugin [![NPM version](https://img.shields.io/npm/v/metalsmith-jstransformer-templates.svg)](https://www.npmjs.org/package/metalsmith-jstransformer-templates)

[![Build Status](https://img.shields.io/travis/RobLoach/metalsmith-jstransformer-templates/master.svg)](https://travis-ci.org/RobLoach/metalsmith-jstransformer-templates)
[![Dependency Status](https://david-dm.org/RobLoach/metalsmith-jstransformer-templates.png)](https://david-dm.org/RobLoach/metalsmith-jstransformer-templates)

[Metalsmith](http://metalsmith.io) plugin to process templates with any [JSTransformer](http://github.com/jstransformers).

## Installation

    npm install --save metalsmith-jstransformer-templates

## Usage

### CLI

If you are using the command-line version of Metalsmith, you can install via npm, and then add the `metalsmith-jstransformer` key to your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-jstransformer-templates-templates": {}
  }
}
```

### JavaScript

If you are using the JS Api for Metalsmith, then you can require the module and add it to your `.use()` directives:

```js
var templates = require('metalsmith-jstransformer-templates');

metalsmith.use(templates());
```

### Convention

Within the metadata of files in your `src` directory, declare which template the file should use:

#### index.html
``` yaml
---
template: _template.jade
---
<p>This is my site!</p>
```

Use the extension of the template file to declare which engine the template should use:

#### _template.jade
``` jade
---
pretty: true
---
doctype html
html
  head
    title My Site
  body!= contents
```

#### Result
``` html
<!doctype html>
<html>
  <head>
    <title>My Site</title>
  </head>
  <body>
    <p>This is my site!</p>
  </body>
</html>
```

## License

MIT

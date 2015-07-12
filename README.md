# Metalsmith JSTransformer Layouts [![NPM version](https://img.shields.io/npm/v/metalsmith-jstransformer-layouts.svg)](https://www.npmjs.org/package/metalsmith-jstransformer-layouts)

[![Build Status](https://img.shields.io/travis/RobLoach/metalsmith-jstransformer-layouts/master.svg)](https://travis-ci.org/RobLoach/metalsmith-jstransformer-layouts)
[![Dependency Status](https://david-dm.org/RobLoach/metalsmith-jstransformer-layouts.png)](https://david-dm.org/RobLoach/metalsmith-jstransformer-layouts)

[Metalsmith](http://metalsmith.io) plugin to process layouts with any [JSTransformer](http://github.com/jstransformers).

## Installation

    npm install --save metalsmith-jstransformer-layouts

## Usage

Within the metadata of files in your `src` directory, declare which layout to use:

#### src/index.html
``` yaml
---
layout: _layout.jade
---
<p>This is my site!</p>
```

Use the extension of the layout file to declare the template engine:

#### src/_layout.jade
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

### CLI

If you are using the command-line version of Metalsmith, you can install via npm, and then add the `metalsmith-jstransformer` key to your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-jstransformer-layouts": {}
  }
}
```

### JavaScript

If you are using the JS Api for Metalsmith, then you can require the module and add it to your `.use()` directives:

```js
var layouts = require('metalsmith-jstransformer-layouts');

metalsmith.use(layouts());
```

## License

MIT

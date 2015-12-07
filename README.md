# Metalsmith JSTransformer Layouts [![NPM version](https://img.shields.io/npm/v/metalsmith-jstransformer-layouts.svg)](https://www.npmjs.org/package/metalsmith-jstransformer-layouts)

[![Build Status](https://img.shields.io/travis/RobLoach/metalsmith-jstransformer-layouts/master.svg)](https://travis-ci.org/RobLoach/metalsmith-jstransformer-layouts)
[![Dependency Status](https://david-dm.org/RobLoach/metalsmith-jstransformer-layouts.png)](https://david-dm.org/RobLoach/metalsmith-jstransformer-layouts)

[Metalsmith](http://metalsmith.io) plugin to process layouts with any [JSTransformer](http://github.com/jstransformers).

## Installation

    npm install --save metalsmith-jstransformer-layouts

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

## Example

Use the extension of the layout file to declare which template engine is being used for the templates:

##### `src/layouts/default.jade`

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

Within the metadata of content in your `src` directory, declare which layout to use:

##### `src/index.html`

``` yaml
---
layout: default.jade
---
<p>This is my site!</p>
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

## Configuration

The plugin introduces the following file convention and configuration options.

### File Convention

Each document should have a file extension of which [JSTransformer](https://github.com/jstransformers/) engine it uses. It can also contain the following metadata:

#### `layout`

A string which represents the layout the document should use when rendering. This is absolute path from Metalsmith's `src` path. If not provided, will use the default layout, if available.

##### `src/content/article.md`

``` md
---
layout: layouts/default.twig
---
This is a Markdown file, rendering within a Twig.js layout.
```

#### `defaultLayout`

A boolean to state whether the given document should be the default layout for all content. Overrides the plugin option [`default`](#default).

##### src/layouts/default.twig

``` twig
---
defaultLayout: true
---
<!doctype html>
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    {{ contents }}
  </body>
</html>
```

### Options

You can pass options to `metalsmith-jstransformer-layouts` with either the [JavaScript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli).

### `default`

When provided, will set the default layout for all content. Can be overriden with the `layout` key in each file's YAML frontmatter.

```json
{
  "plugins": {
    "metalsmith-jstransformer-layouts": {
      "default": "layout/mylayout.swig"
    }
  }
}
```

### `pattern`

The discovery pattern used to find layouts. Defaults to `layouts/*`.

```json
{
  "plugins": {
    "metalsmith-jstransformer-layouts": {
      "pattern": "layouts/**"
    }
  }
}
```

## License

MIT

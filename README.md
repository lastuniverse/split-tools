# split-tools

> advanced text splitter

> Turn a text string into a array (optional items as tokens)


[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

## Installation

```
npm install split-tools --save
```

## Usage

```javascript
var Splitter = require('split-tools');

var splitter = new Splitter(options?);
```

- **options**
  - **matchers** An associative array in which the key is an arbitrary token ID, the value is a string or a regular expression to match
  - **parsers** An associative array in which the key is an arbitrary token ID, the value is a converter function that takes values:
    - **text** part of the text matched with RegExp specified for identical ID
    - **group1, group2, ..., groupN** bracket groups specified in RegExp
    - **text** other parameters, such as offset and source string (see string.replace). By virtue of the algorithm used to separate lines, they do not carry reliable values.




## Participation in development
```
https://github.com/lastuniverse/split-tools/issues
```
## License

MIT

[![NPM](https://nodei.co/npm/split-tools.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/split-tools/)

[npm-image]: https://img.shields.io/npm/v/split-tools.svg?style=flat
[npm-url]: https://npmjs.org/package/split-tools
[david-image]: http://img.shields.io/david/lastuniverse/split-tools.svg?style=flat
[david-url]: https://david-dm.org/lastuniverse/split-tools
[license-image]: http://img.shields.io/npm/l/split-tools.svg?style=flat
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/split-tools.svg?style=flat
[downloads-url]: https://npmjs.org/package/split-tools

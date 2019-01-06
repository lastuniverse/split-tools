# split-tools

> Advanced text splitter. Turn a text string into a array (optional items as tokens)


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
const Splitter = require('split-tools');

const splitter = new Splitter(options?);
```
- **options**
  - **matchers** An associative array in which the key is an arbitrary token ID, the value is a string or a regular expression to match
  - **parsers** An associative array in which the key is an arbitrary token ID, the value is a converter function that takes values:
    - **text** part of the text matched with RegExp specified for identical ID
    - **group1, group2, ..., groupN** bracket groups specified in RegExp
    - **text** other parameters, such as offset and source string (see string.replace). By virtue of the algorithm used to separate lines, they do not carry reliable values.

## Sample
It is important to understand how the key `:key` is interpreted depending on the pattern `:key(.*)` used and quantifiers `:key*`. The following examples will help you understand the logic for obtaining key values.
```
const Splitter = require('split-tools');

const text = `
111
222 // aaaaaaaaaaaaaa
222 // aaaaaaaaaaaaaa
333 333333333333333 /*ccccc*/ 33333333333333333333 333333 33333333333 
444 ## bbbbbbbbbbbbbb
555
666 /* cccccccccccccc */
777
/* cccccccccccccc */
888
// aaaaaaaaaaaaaa
999
`;


const splitter = new Splitter({
	matchers: {
		comment1: /\/\/(.*)/g,
		comment2: /\#\#(.*)/g,
		multicomment: /\/\*([\s\S]*?)\*\//g
	}
});

splitter.addParser("unmatched",(match)=>{
	return {
		type: "text",
		data: match
	};
});

splitter.addParser("comment1",(match,text)=>{
	return {
		type: "comment1",
		data: text
	};
});

splitter.addParser("comment2",(match,text)=>{
	return {
		type: "comment2",
		data: text
	};
});

splitter.addParser("multicomment",(match,text)=>{
	return {
		type: "multicomment",
		data: text
	};
});

const list = splitter.process(text);

console.log("\n\nresult:\n",list);
```

>result:
> [ { type: 'text', data: '\n111\n222 ' },
>  { type: 'comment1', data: ' aaaaaaaaaaaaaa' },
>  { type: 'text', data: '\n222 ' },
>  { type: 'comment1', data: ' aaaaaaaaaaaaaa' },
>  { type: 'text', data: '\n333 333333333333333 ' },
>  { type: 'multicomment', data: 'ccccc' },
>  { type: 'text',
>    data: ' 33333333333333333333 333333 33333333333 \n444 ' },
>  { type: 'comment2', data: ' bbbbbbbbbbbbbb' },
>  { type: 'text', data: '\n555\n666 ' },
>  { type: 'multicomment', data: ' cccccccccccccc ' },
>  { type: 'text', data: '\n777\n' },
>  { type: 'multicomment', data: ' cccccccccccccc ' },
>  { type: 'text', data: '\n888\n' },
>  { type: 'comment1', data: ' aaaaaaaaaaaaaa' },
>  { type: 'text', data: '\n999\n' } ]




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

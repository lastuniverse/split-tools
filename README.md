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
  - **matchers** аn associative array in which the key is an arbitrary token ID, the value is a string or a regular expression to match
  - **parsers** аn associative array in which the key is an arbitrary token ID, the value is a converter function that takes values:
    - **text** part of the text matched with RegExp specified for identical ID
    - **group1, group2, ..., groupN** bracket groups specified in RegExp
    - **other parameters** such as offset and source string (see string.replace). By virtue of the algorithm used to separate lines, they do not carry reliable values.

## It is important!!!
The order of adding matchers does matter. Matchers will be processed in the same order in which they were added.


## Samples

### simple (array out)
```javascript
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
		comment1: /\/\/\s*(.*)/g,
		comment2: /\#\#\s*(.*)/g,
		multicomment: /\/\*\s*([\s\S]*?)\s*\*\//g
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

console.log(list);
```

**result:**
```javascript
[ 
  { type: 'text', data: '\n111\n222 ' },
  { type: 'comment1', data: 'aaaaaaaaaaaaaa' },
  { type: 'text', data: '\n222 ' },
  { type: 'comment1', data: 'aaaaaaaaaaaaaa' },
  { type: 'text', data: '\n333 333333333333333 ' },
  { type: 'multicomment', data: 'ccccc' },
  { type: 'text', data: ' 33333333333333333333 333333 33333333333 \n444 ' },
  { type: 'comment2', data: 'bbbbbbbbbbbbbb' },
  { type: 'text', data: '\n555\n666 ' },
  { type: 'multicomment', data: 'cccccccccccccc' },
  { type: 'text', data: '\n777\n' },
  { type: 'multicomment', data: 'cccccccccccccc' },
  { type: 'text', data: '\n888\n' },
  { type: 'comment1', data: 'aaaaaaaaaaaaaa' },
  { type: 'text', data: '\n999\n' }
]
```

### advanced (tree out)
```javascript
const Splitter = require('split-tools');
const text = `
<html param1="1111" param2=2222	param3="333 333 333" >
	<head>
		<script>
			var script = 1;
		</script>
		<style>
			body {color: #000;}
		</style>
	</head>
	<body>
		<image src="test.png"/>
	</body>
</html>
`;




const splitter = new Splitter({
	matchers: {
		tag1: /\<(\w+)\s*([\s\S]*?)\>([\s\S]*)\<\/\1\>/g,
		tag2: /\<(\w+)\s*([\s\S]*?)\/\>/g,
		space: /(^\s+|\s+$)/g,
		param: /(\w+)=((["'])(.+?)\3|()(\S+))/g
	}
});


const 	tree = {
	"tags": ["tag1","tag2","space"],
	"params": ["param","space"]
};

function subSplit(id, text) {
	console.log("subSplit:", id, "[", text, "]");
	if(tree[id] && tree[id].length)
		return splitter.process(text, tree[id]);
	return text;
}

splitter.addParser("space",(match)=>{
	return;
});

splitter.addParser("tag1",(match,tag,params,body)=>{
	return {
		type: "tag",
		tag: tag,
		params: subSplit("params", params),
		body: subSplit("tags", body)
	};
});

splitter.addParser("tag2",(match,tag,params)=>{
	return {
		type: "tag",
		tag: tag,
		params: subSplit("params", params)
	};
});


splitter.addParser("param",(match,name,tmp,isStr,value)=>{
	console.log("param:",match,name,tmp,isStr,value);
	return {
		type: "param",
		name: name,
		value: isStr?value:tmp
	};
});


const list = splitter.process(text, tree.tags);

console.log("\n\nresult:\n",JSON.stringify(list, null, '  '));
```

**result:**
```javascript
[
  {
    "type": "tag",
    "tag": "html",
    "params": [
      {
        "type": "param",
        "name": "param1",
        "value": "1111"
      },
      {
        "type": "param",
        "name": "param2",
        "value": "2222"
      },
      {
        "type": "param",
        "name": "param3",
        "value": "333 333 333"
      }
    ],
    "body": [
      {
        "type": "tag",
        "tag": "head",
        "params": [],
        "body": [
          {
            "type": "tag",
            "tag": "script",
            "params": [],
            "body": [
              "var script = 1;"
            ]
          },
          {
            "type": "tag",
            "tag": "style",
            "params": [],
            "body": [
              "body {color: #000;}"
            ]
          }
        ]
      },
      {
        "type": "tag",
        "tag": "body",
        "params": [],
        "body": [
          {
            "type": "tag",
            "tag": "image",
            "params": [
              {
                "type": "param",
                "name": "src",
                "value": "test.png"
              }
            ]
          }
        ]
      }
    ]
  }
]
```

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

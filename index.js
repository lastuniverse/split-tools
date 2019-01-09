class Splitter {
	constructor(options={}){
		this.options = options;
		this.matchers = {};
		this.parsers = {};
		this.index = 0;
		
		if(!options || typeof options !== "object" )
			return;

		this.addMatchers(options.matchers);
		this.addParsers(options.parsers);
	}

	addParsers(json){
		if(json && typeof json === "object")
			Object
				.keys(json)
				.forEach(id=>{
					this.addParser(id, json[id]);
				});	
	}

	addParser(id,cb){
		if(!id || typeof id !== "string" )
			return;

		if( !cb || typeof cb !== "function" )
			return;

		this.parsers[id] = cb;
	}


	addMatchers(json){
		if(json && typeof json === "object")
			Object
				.keys(json)
				.forEach(id=>{
					this.addMatcher(id, json[id]);
				});	
	}

	addMatcher(id, matcher){
		if(!id || typeof id !== "string" )
			return;

		if( !matcher )
			return;

		if( typeof matcher === "string" )
			matcher = new RegExp(matcher,"g");

		if( !(matcher instanceof RegExp) ){
			if( this.matchers[id] )
				delete this.matchers[id];
			return;
		}

		if( !this.matchers[id] )
			this.index++;

		let index = this.index;
		if( this.matchers[id] )
			index = this.matchers[id].index;

		this.matchers[id] = {
			id: id,
			index: index,
			matcher: matcher	
		};
	}


	parse(id,...data){
		if(	this.parsers[id] )
			return this.parsers[id](...data);
		return data[0];
	}

	process(text, matchers){
		if(!matchers)
			matchers = Object
				.values(this.matchers)
				.sort( (a,b)=>{
					return a.index-b.index;
				})
				.map(a=>a.id);
		const list = [];
		this.subProcess(text, matchers, list);
		
		return list;
	}
	
	subProcess(text, matchers, list){
		// console.log("\n\nSTART:",text,"\n", matchers,"\n", list);
		if( !matchers.length ){
			// console.log("subProcess: text 00");
			const item = this.parse("unmatched",text);
			if( item !== undefined )
				list.push( item );

			return;
		}

		matchers = matchers.slice(0);
		
		// console.log("matchers", matchers);
		const id = matchers.shift();
		const matcher = this.matchers[id];
		// console.log("matcher", id, matcher);

		let offset = 0;
		
		text.replace(
			matcher.matcher,
			(...argv)=>{
				const index = argv[argv.length-2];
				const sub_text = argv[0];
				
				if( index > offset ){
					const pre_text = text.substring(offset, index);
					// console.log("\subProcess: pre_text 00", pre_text);
					this.subProcess(pre_text, matchers, list);	
				}

				offset = index+sub_text.length;

				// console.log("\subProcess: sub_text 00", sub_text);
				const item = this.parse(matcher.id, ...argv);
				if( item !== undefined )
					list.push( item );

			}
		);

		// console.log("\nCENTER");
		if( offset < text.length ){
			const post_text = text.substring(offset, text.length);
			// console.log("\subProcess: post_text 00", post_text);
			this.subProcess(post_text, matchers, list);	
		}

		// console.log("\END");

	}

}
module.exports = Splitter;
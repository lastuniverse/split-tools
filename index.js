class Splitter {
	constructor(options={}){
		this.options = options;
		this.matchers = {};
		this.parsers = {};
		this.index = 0;
		if(options.matchers && typeof options.matchers === "object")
			Object
				.keys(options.matchers)
				.forEach(id=>{
					this.matcher(id, options.matchers[id]);
				});
	}

	parser(id,cb){
		this.parsers[id] = cb;
	}

	parse(id,...data){
		if(	this.parsers[id] )
			return this.parsers[id](...data);
	}

	matcher(id, matcher){
		if( !id )
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

	process(text){
		const matchers = Object
			.values(this.matchers)
			.sort( (a,b)=>{
				return a.index-b.index;
			})
			.map(a=>a.id);

		const list = [];

		this.subproccess(text, matchers, list);
		
		return list;
	}
	
	subproccess(text, matchers, list){
		console.log("\n\nSTART:",text,"\n", matchers,"\n", list);
		if( !matchers.length ){
			console.log("subproccess: text 00");
			list.push(	this.parse("unmatched",text)||text );
			return;
		}


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
					console.log("\nsubproccess: pre_text 00", pre_text);
					this.subproccess(pre_text, matchers.slice(0), list);	
				}

				offset = index+sub_text.length;

				console.log("\nsubproccess: sub_text 00", sub_text);
				list.push(	this.parse(matcher.id, ...argv) || sub_text );

			}
		);

		console.log("\nCENTER");
		if( offset < text.length ){
			const post_text = text.substring(offset, text.length);
			console.log("\nsubproccess: post_text 00", post_text);
			this.subproccess(post_text, matchers.slice(0), list);	
		}

		console.log("\END");

	}

}
module.exports = Splitter;
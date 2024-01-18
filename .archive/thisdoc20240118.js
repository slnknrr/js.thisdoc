//archived; bad english content {:
/*troubleshooting--*/try{var env;
	try{if(process.versions.node.match(/^(0|[1-9][0-9]{0,})(\.(0|[1-9][0-9]{0,})){0,}$/)) {
		env='node'
	}else{throw('next')}}catch{};
	try{if(window.navigator.userAgent.match(/^[^\r\n]{1,}$/)){
		env='browser'
	}else{throw('next')}}catch{};
	try{if(Deno.version.deno.match(/^(0|[1-9][0-9]{0,})(\.(0|[1-9][0-9]{0,})){0,}$/)) {
		env='deno'
	}else{throw('next')}}catch{};
	env=Object.assign(env);
/*--troubleshooting*/((thisdoc)=>{/*module:thisdoc--*/
thisdoc={
	lib:((env,ver)=>{
		ver={
			ver:Object.assign('0.1.1',
			{
				name: 'simple',
				edit: '2024-01-15+3'
			}),
			env:env,      //detect app (deno,node,browser); you can use (web!=null) for browser detect
			src:null,     //node.js, deno and browser path to script
			web:null,     //
			min:false,    //self-reading for docstrings <- true in min means 'no comments' and 'js minify'
			pak:false     //addations injected (reactjs, typescript, coffescript, bython); thisdoc vs @niknils/thisdoc
		}
		if (env=='browser') {
			try{ver.src=window.document.currentScript.attributes.src.value}catch{};
			if (window.location.host!='') {
				sites: for (var sites of [
					['repo', 'codeberg.page:codeberg.org','github.io:github.com'],
					['site', 'sites.google.com'],
					['host', 'localhost']
				]) { var type=sites[0], sites=sites.slice(1,);
					for (var site of sites) {
						if (('.'+site.split(':')[0]).match(eval(`/\.${window.location.host.replaceAll('.','\.')}$/`))) {
							ver.web=type+':'+site.split(':').slice(-1);
							break sites;
						}
					}
				}
				if (ver.web==null) {
					ver.web='prod'+':'+window.location.host;
				}
			} else {
				ver.web='read'+':'+window.location.protocol.replace(':',''); //means file:// but you can using browser with another protocols
			}
		} else if (env=='node') { //load func uses for . . . to response .tar.gz .gz etc
			ver.src=__filename;
		} else if (env=='deno') { /*#todo: review;*/
			ver.src=eval(`new URL('', import.meta.url).pathname`); //browser issue -> eval() <- meme: see var declare check in troubleshooting
			ver.web='deno';
		}
		if (typeof ver.web=='string') {
			if (ver.web.match(/^read\:/)==null) {
				ver.web=ver.web+':'+window.location.protocol.replace(':','');
			}
		}
		if (ver.src!=null) {
			return Object.assign('thisdoc'+';'+ver.ver.toString()+';'+ver.src.replace(/\\/g,'/'), ver);
		} else {
			return Object.assign('thisdoc'+';'+ver.ver.toString(), ver);
		}
	})(env.toString()),
	app:function(app='/%M.thisdocrc') {
		if (arguments.length>1) {
			throw(`(ferr:thisdoc/app) a lot of options`);
		} else { var mode=thisdoc.lib.web.toString().split(':')[0];
			if (typeof app=='string') {
				app=app.replace(/\%M/g,mode);
			} else {
				throw(`(ferr:thisdoc/app) invalid argument`);
			}
			thisdoc.load(app, '.js') //it's js and invisible (when thisdoc is backend; backend return not a real file)
			.then(200,(win)=>{ //returns 'window' object
				//TODO: test compatible;
				//TODO: thisdoc.exports(()=>{/*export in scope*/}) for running
				if (win.hasOwnProperty(mode)) {
					return win[mode](thisdoc);
				} else if (win.hasOwnProperty('beta')&&!['prod'].includes(mode)) {
					return win.beta(thisdoc); //test reserved
				} else if (win.hasOwnProperty('main')) { //stable or new design
					return win.main(thisdoc);
				} else if (win.hasOwnProperty('base')) { //legacy
					return win.base(thisdoc);
				} else {
					for (var prop in win) {
						if (!(parseInt(prop)==prop&&prop>-1)) {
							if (typeof win[prop]=='function'&&!['beta','test'].includes(prop)) {
								return win[prop](thisdoc);
								break;
							}
						}
					}
					if (typeof win.beta=='function') {
						return win.beta(thisdoc); //log wrn
					} else if (typeof win.test=='function') {
						return win.test(thisdoc); //log wrn
					} else {
						//log wrn
					}
				}
			});
		}
	},
	api:Object.assign(function() {
		
	},{
		/*backend--*/backend:Object.assign(((env)=>{
			if (env=='browser') {
				return function(global, rewrite, equal, then) {
					var args=Object.assign([global,rewrite,equal,then].slice(0,arguments.length),
					{
						boolean:
						{
							accept: 1,
							parse:(v)=>{
								global=v;
							}
						},
						function:
						{
							accept: 1,
							parse:(v)=>{
								then=v;
							}
						},
						object:
						{
							accept: 2,
							parse:(v)=>{
								if (typeof rewrite=='undefined') {
									rewrite=v;
								} else {
									equal=v;
								}
							}
						}
					});[global,rewrite,equal,then] = [true,undefined,null,()=>{}];
					for (var arg of args) {
						if (typeof args[typeof arg]?.parse!='function') {
							throw(`(ferr:thisdoc/api:backend) invalid types`);
						} else if (args[typeof arg].accept<1) {
							throw(`(ferr:thisdoc/api:backend) a lot of options in single type`);
						} else {
							args[typeof arg].accept=args[typeof arg].accept-1;
							args[typeof arg].parse(arg);
						}
					}
					/*about*/var behavior={};/* 'bad english content'
					 *
					 * uses for no server hostings (404.html abuse)
					 * and for parallel website frameworks, CMS, etc (when backend compatible)
					 * don't use thisdoc.api.backend() in 404.html and similar if backend isn't compatible with it
					 *
					 * uri:   fragment with thisdoc expression or ''
					 *   use: boolean value: ^ 
					 *   fix: .url + .app.obj validation URL
					 * app:   boolean value: localStorage uses this?
					 *   obj: localStorage value (null or object)
					 * fix:   function that redict page by .url.fix; <- force rewrite
					 *
					 * indev:
					 *   sessionStorage mode
					*/
					console.log(`--thisdoc.api.backend <- inreview and dev <- main issue <- two synopsis todo, do secure localStorage and URI parsing and see inside code todo list`)
					behavior.uri=(()=>{
						try {
							return Object.assign(window.location.pathname.match(/^\/\:[^\/]{1,}/)[0].replace(/^\//,''),
							{
								use: true,
								fix: ((url)=>{ var prototype={}, fix=[];
									try {
										if (window.localStorage.getItem('thisdoc').match(/^[^\n\;\,\. ]{1,}(\,[^\n\;\,\. ]{1,}){0,}$/)!=null) {
											for (var val of window.localStorage.getItem('thisdoc').match(/^[^\n\;\,\. ]{1,}(\,[^\n\;\,\. ]{1,}){0,}$/)[0].split(',')) {
												if (window.localStorage.getItem(`thisdoc.${val}`)==null) {
													try{window.localStorage.removeItem(`thisdoc.${val}`)}catch{};
												} else {
													prototype[val]=window.localStorage.getItem(`thisdoc.${val}`);
												}
											}
											behavior.obj=prototype;
										} else {
											throw(`invalid value -> next`);
											return null;
										}
									} catch { try{window.localStorage.removeItem('thisdoc')}catch{};
										//
									}
									for (var val of url.replace(/^\:/,'').split(',')) { //insecure; indev;
										prototype[val.split(':')[0]]=val.split(':')[1];
									}
									for (var val in prototype) {
										fix.push(`${val}:${prototype[val]}`);
									}
									return Object.assign(window.location.protocol+'//'+(window.location.hostname+'/'+':'+fix.join(',')+'/'+window.location.pathname.replace('/'+url,'')).replace(/(\/){1,}/g,'\/'),prototype);
								})(window.location.pathname.match(/^\/\:[^\/]{1,}/)[0].replace(/^\//,''))
							})
						} catch {
							return Object.assign('',
							{
								use: false,
								fix: (()=>{ var prototype={}, fix=[];
									for (var val of window.localStorage.getItem('thisdoc').match(/^[^\n\;\,\. ]{1,}(\,[^\n\;\,\. ]{1,}){0,}$/)[0].split(',')) {
										if (window.localStorage.getItem(`thisdoc.${val}`)==null) {
											try{window.localStorage.removeItem(`thisdoc.${val}`)}catch{};
										} else {
											prototype[val]=window.localStorage.getItem(`thisdoc.${val}`);
											fix.push(`${val}:${prototype[val]}`)
										}
									}
									behavior.obj=fix;
									return window.location.protocol+'//'+window.location.hostname+'/:'+fix.join(',')+window.location.pathname
								})()
							})
						}
					})();
					behavior.fix=function() {
						//console.log(behavior.uri.fix)
						if (thisdoc.api.backend.fix!=true) { //uses in code
							if (behavior.uri==''&&behavior.uri.fix!=null) {
								window.location.href=behavior.uri;
							} else { var equal=true;
								var oldState={},newState={};
								for (var val of behavior.uri.toString().replace(/^\:/,'').split(',')) {
									oldState[val.split(':')[0]]=val.split(':')[1];
								}
								for (var val of (behavior.uri.fix.replace(window.location.protocol+'//'+window.location.hostname,'').match(/^\/\:[^\/]{1,}/)[0].replace(/^\//,'').replace(/^\:/,'')).split(',')) {
									newState[val.split(':')[0]]=val.split(':')[1];
								}
								if (Object.keys(oldState).sort().join(',')==Object.keys(newState).sort().join(',')) {
									for (var val in oldState) {
										if (oldState[val]!=newState[val]) {
											equal=false;
											break;
										}
									}
									for (var val in newState) {
										if (newState[val]!=oldState[val]) {
											equal=false;
											break;
										}
									}
								} else {
									equal=false;
								}
							}
							if (equal) thisdoc.api.backend.fix=true;
						}
						if (thisdoc.api.backend.fix!=true) {
							window.location.href=behavior.uri.fix;
						}
					}
					behavior.fix(); //issue -> loop; {:
					window.history.pushState('unused', 'unused too', window.location.pathname.replace(/^\/\:[^\/]{1,}/,'/').replace(/^\/\//,'/'));
					//TODO: behavior:
					//obj:
					//{now:'z',new:'z',old:'z',std:'z'}
					//now - sessionStorage, new - by URI, old - localStorage, std - by server configuration
					//always sync sessionStorage and localStorage
					// '/:rw:1' <- enable rewrite
					then(behavior.obj,thisdoc.api.backend);
				}
			} else {
				return function(wrn='unsupported') {
					return 'Node.js and Deno version INDEV'
				}
			}
		})(env.toString()),{
			fix:null //in review; backend.this; fix->this
		})/*--backend*/
	}),
	on:Object.assign(function() {
		
	},{
		change:function() {
			
		},
		mouse:function() {
			
		},
		touch:function() {
			
		}
	}),
	uri:window.location.href,urn:window.location.hostname,url:window.location.pathname.slice(1,),
	cors:null,
	util:Object.assign(function(){
		
	},{
		encode:function(s) {
			var r="",i=0,len=s.length,c1,c2,c3,
				A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			while (i < len) { c1 = s.charCodeAt(i++) & 0xff;
				if (i == len) {
					r += A.charAt(c1 >> 2); r += A.charAt((c1 & 0x3) << 4); r += "=="; break;
				}
				c2 = s.charCodeAt(i++);
				if (i == len) {
					r += A.charAt(c1 >> 2); r += A.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4)); r += A.charAt((c2 & 0xF) << 2); r += "="; break;
				}
				c3 = s.charCodeAt(i++); r += A.charAt(c1 >> 2); r += A.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4)); r += A.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6)); r += A.charAt(c3 & 0x3F);
			}
			return r;
		},
		decode:function(s) {
			var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length,
				A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			for(i=0;i<64;i++){e[A.charAt(i)]=i;}
			for(x=0;x<L;x++){
				c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
				while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
			}
			return r;
		},
		aes:(()=>{//https://codeberg.org/slnknrr, 2024, Yuriyi Slinkin, MIT
		//https://github.com/chrisveness/crypto, 2005-2019, Chris Veness, MIT
		//https://github.com/davidchambers/Base64.js, 2013-2024, David Chambers (Base64.js stems from a gist by https://github.com/yahiko (c)), no license <- public domain? (OSI de-facto)
			[btoa, atob] = (function() {
			  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			  function InvalidCharacterError(message) {
				this.message = message;
			  }
			  InvalidCharacterError.prototype = new Error ();
			  InvalidCharacterError.prototype.name = 'InvalidCharacterError';
			  function btoa(input) {
				var data = String (input), o1, o2, o3, bits, i = 0, acc = '';
				while (i < data.length) {
				  o1 = data.charCodeAt (i++);
				  o2 = data.charCodeAt (i++);
				  o3 = data.charCodeAt (i++);
				  if (o1 > 255 || o2 > 255 || o3 > 255) {
					throw new InvalidCharacterError ("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
				  }
				  bits = (o1 << 16) | (o2 << 8) | o3;
				  acc += chars.charAt ((bits >> 18) & 0x3F) +
						 chars.charAt ((bits >> 12) & 0x3F) +
						 chars.charAt ((bits >>  6) & 0x3F) +
						 chars.charAt ((bits)       & 0x3F);
				}
				switch (data.length % 3) {
				  case 0: return acc;
				  case 1: return acc.slice (0, -2) + '==';
				  case 2: return acc.slice (0, -1) + '=';
				}
			  }
			  function atob(input) {
				var str = (String (input)).replace (/[=]+$/, ''); // #31: ExtendScript bad parse of /=
				if (str.length % 4 === 1) {
				  throw new InvalidCharacterError ("'atob' failed: The string to be decoded is not correctly encoded.");
				}
				for (
				  var bc = 0, bs, buffer, idx = 0, output = '';
				  buffer = str.charAt (idx++);
				  ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
					bc++ % 4) ? output += String.fromCharCode (255 & bs >> (-2 * bc & 6)) : 0
				) {
				  buffer = chars.indexOf (buffer);
				}
				return output;
			  }
			  return [ btoa, atob];
			})();
			class Aes {
				static cipher(input, w) {
					const Nb = 4;
					const Nr = w.length/Nb - 1;
					let state = [ [], [], [], [] ];
					for (let i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];
					state = Aes.addRoundKey(state, w, 0, Nb);
					for (let round=1; round<Nr; round++) {
						state = Aes.subBytes(state, Nb);
						state = Aes.shiftRows(state, Nb);
						state = Aes.mixColumns(state, Nb);
						state = Aes.addRoundKey(state, w, round, Nb);
					}
					state = Aes.subBytes(state, Nb);
					state = Aes.shiftRows(state, Nb);
					state = Aes.addRoundKey(state, w, Nr, Nb);
					const output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
					for (let i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
					return output;
				}
				static keyExpansion(key) {
					const Nb = 4;
					const Nk = key.length/4;
					const Nr = Nk + 6;
					const w = new Array(Nb*(Nr+1));
					let temp = new Array(4);
					for (let i=0; i<Nk; i++) {
						const r = [ key[4*i], key[4*i+1], key[4*i+2], key[4*i+3] ];
						w[i] = r;
					}
					for (let i=Nk; i<(Nb*(Nr+1)); i++) {
						w[i] = new Array(4);
						for (let t=0; t<4; t++) temp[t] = w[i-1][t];
						if (i % Nk == 0) {
							temp = Aes.subWord(Aes.rotWord(temp));
							for (let t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
						}
						else if (Nk > 6 && i%Nk == 4) {
							temp = Aes.subWord(temp);
						}
						for (let t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
					}
					return w;
				}
				static subBytes(s, Nb) {
					for (let r=0; r<4; r++) {
						for (let c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
					}
					return s;
				}
				static shiftRows(s, Nb) {
					const t = new Array(4);
					for (let r=1; r<4; r++) {
						for (let c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
						for (let c=0; c<4; c++) s[r][c] = t[c];         // and copy back
					}          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
					return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
				}
				static mixColumns(s, Nb) {
					for (let c=0; c<Nb; c++) {
						const a = new Array(Nb);  // 'a' is a copy of the current column from 's'
						const b = new Array(Nb);  // 'b' is a•{02} in GF(2^8)
						for (let r=0; r<4; r++) {
							a[r] = s[r][c];
							b[r] = s[r][c]&0x80 ? s[r][c]<<1 ^ 0x011b : s[r][c]<<1;
						}
						// a[n] ^ b[n] is a•{03} in GF(2^8)
						s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // {02}•a0 + {03}•a1 + a2 + a3
						s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 • {02}•a1 + {03}•a2 + a3
						s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + {02}•a2 + {03}•a3
						s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // {03}•a0 + a1 + a2 + {02}•a3
					}
					return s;
				}
				static addRoundKey(state, w, rnd, Nb) {
					for (let r=0; r<4; r++) {
						for (let c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
					}
					return state;
				}
				static subWord(w) {
					for (let i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
					return w;
				}
				static rotWord(w) {
					const tmp = w[0];
					for (let i=0; i<3; i++) w[i] = w[i+1];
					w[3] = tmp;
					return w;
				}
			}
			Aes.sBox = [
				0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
				0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
				0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
				0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
				0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
				0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
				0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
				0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
				0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
				0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
				0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
				0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
				0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
				0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
				0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
				0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
			];
			Aes.rCon = [
				[ 0x00, 0x00, 0x00, 0x00 ],
				[ 0x01, 0x00, 0x00, 0x00 ],
				[ 0x02, 0x00, 0x00, 0x00 ],
				[ 0x04, 0x00, 0x00, 0x00 ],
				[ 0x08, 0x00, 0x00, 0x00 ],
				[ 0x10, 0x00, 0x00, 0x00 ],
				[ 0x20, 0x00, 0x00, 0x00 ],
				[ 0x40, 0x00, 0x00, 0x00 ],
				[ 0x80, 0x00, 0x00, 0x00 ],
				[ 0x1b, 0x00, 0x00, 0x00 ],
				[ 0x36, 0x00, 0x00, 0x00 ],
			];
			class AesCtr extends Aes {
				static encrypt(plaintext, password, nBits) {
					if (![ 128, 192, 256 ].includes(nBits)) throw new Error('Key size is not 128 / 192 / 256');
					plaintext = AesCtr.utf8Encode(String(plaintext));
					password = AesCtr.utf8Encode(String(password));
					const nBytes = nBits/8;
					const pwBytes = new Array(nBytes);
					for (let i=0; i<nBytes; i++) {
						pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
					}
					let key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
					key = key.concat(key.slice(0, nBytes-16));
					const timestamp = (new Date()).getTime();
					const nonceMs = timestamp%1000;
					const nonceSec = Math.floor(timestamp/1000);
					const nonceRnd = Math.floor(Math.random()*0xffff);
					const counterBlock = [
						nonceMs  & 0xff, nonceMs >>>8 & 0xff,
						nonceRnd & 0xff, nonceRnd>>>8 & 0xff,
						nonceSec & 0xff, nonceSec>>>8 & 0xff, nonceSec>>>16 & 0xff, nonceSec>>>24 & 0xff,
						0, 0, 0, 0, 0, 0, 0, 0,
					];
					const nonceStr = counterBlock.slice(0, 8).map(i => String.fromCharCode(i)).join('');
					const plaintextBytes = plaintext.split('').map(ch => ch.charCodeAt(0));
					const ciphertextBytes = AesCtr.nistEncryption(plaintextBytes, key, counterBlock);
					const ciphertextUtf8 = ciphertextBytes.map(i => String.fromCharCode(i)).join('');
					const ciphertextB64 =  AesCtr.base64Encode(nonceStr+ciphertextUtf8);
					return ciphertextB64;
				}
				static nistEncryption(plaintext, key, counterBlock) {
					const blockSize = 16;
					const keySchedule = Aes.keyExpansion(key);
					const blockCount = Math.ceil(plaintext.length/blockSize);
					const ciphertext = new Array(plaintext.length);
					for (let b=0; b<blockCount; b++) {
						const cipherCntr = Aes.cipher(counterBlock, keySchedule);
						const blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize + 1;
						for (let i=0; i<blockLength; i++) {
							ciphertext[b*blockSize + i] = cipherCntr[i] ^ plaintext[b*blockSize + i];
						}
						counterBlock[blockSize-1]++;
						for (let i=blockSize-1; i>=8; i--) {
							counterBlock[i-1] += counterBlock[i] >> 8;
							counterBlock[i] &= 0xff;
						}
						if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
							if (b%1000 == 0) self.postMessage({ progress: b/blockCount });
						}
					}
					return ciphertext;
				}
				static decrypt(ciphertext, password, nBits) {
					if (![ 128, 192, 256 ].includes(nBits)) throw new Error('Key size is not 128 / 192 / 256');
					ciphertext = AesCtr.base64Decode(String(ciphertext));
					password = AesCtr.utf8Encode(String(password));
					const nBytes = nBits/8;
					const pwBytes = new Array(nBytes);
					for (let i=0; i<nBytes; i++) {
						pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
					}
					let key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
					key = key.concat(key.slice(0, nBytes-16));
					const counterBlock = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
					for (let i=0; i<8; i++) counterBlock[i] = ciphertext.charCodeAt(i);
					const ciphertextBytes = new Array(ciphertext.length-8);
					for (let i=8; i<ciphertext.length; i++) ciphertextBytes[i-8] = ciphertext.charCodeAt(i);
					const plaintextBytes = AesCtr.nistDecryption(ciphertextBytes, key, counterBlock);
					const plaintextUtf8 = plaintextBytes.map(i => String.fromCharCode(i)).join('');
					const plaintext = AesCtr.utf8Decode(plaintextUtf8);
					return plaintext;
				}
				static nistDecryption(ciphertext, key, counterBlock) {
					const blockSize = 16;
					const keySchedule = Aes.keyExpansion(key);
					const blockCount = Math.ceil(ciphertext.length/blockSize);
					const plaintext = new Array(ciphertext.length);
					for (let b=0; b<blockCount; b++) {
						const cipherCntr = Aes.cipher(counterBlock, keySchedule);
						const blockLength = b<blockCount-1 ? blockSize : (ciphertext.length-1)%blockSize + 1;
						for (let i=0; i<blockLength; i++) {
							plaintext[b*blockSize + i] = cipherCntr[i] ^ ciphertext[b*blockSize + i];
						}
						counterBlock[blockSize-1]++;
						for (let i=blockSize-1; i>=8; i--) {
							counterBlock[i-1] += counterBlock[i] >> 8;
							counterBlock[i] &= 0xff;
						}
						if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
							if (b%1000 == 0) self.postMessage({ progress: b/blockCount });
						}
					}
					return plaintext;
				}
				static utf8Encode(str) {
					try {
						return new TextEncoder().encode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
					} catch (e) {
						return unescape(encodeURIComponent(str));
					}
				}
				static utf8Decode(str) {
					try {
						return new TextEncoder().decode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
					} catch (e) {
						return decodeURIComponent(escape(str));
					}
				}
				static base64Encode(str) {
					if (typeof btoa != 'undefined') return btoa(str); // browser
					if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64'); // Node.js
					throw new Error('No Base64 Encode');
				}
				static base64Decode(str) {
					if (typeof atob != 'undefined') return atob(str); // browser
					if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary'); // Node.js
					throw new Error('No Base64 Decode');
				}
			}
			//https://slnknrr.codeberg.page/
			var aes=Object.assign(function(bol, dat, pwd, num) {
				if (arguments.length==0) {
					throw(`(ferr:aes) miss arguments\n`,aes.toString());
				} else if (arguments.length>4) {
					throw(`(ferr:aes) a lot of options <- invalid usage\n`,aes.toString());
				}
				var args=Object.assign([bol,dat,pwd,num].slice(0,arguments.length),
				{
					boolean:
					{
						accept: 1,
						parse(v) {
							bol=v;
						}
					},
					string:
					{
						accept: 2,
						parse(v) {
							if (dat==null) {
								dat=v;
							} else {
								pwd=v;
							}
						}
					},
					number:
					{
						accept: 1,
						parse(v) {
							num=v;
						}
					}
				}); [bol,dat,pwd,num] = [true,null,(()=>{
					try { //nodejs,browser<-deno->window
						if (typeof window.location.host=='string'&&window.location.host!='') { return window.location.host } else { return 'password' }
					} catch {
						return require('os').hostname();
					}
				})(),192];
				for (var arg of args) {
					if (typeof args[typeof arg]?.parse=='function') {
						if (args[typeof arg].accept<1) {
							throw(`(ferr:aes) a lot of options in type`);
						} else { args[typeof arg].accept=args[typeof arg].accept-1;
							args[typeof arg].parse(arg);
						}
					} else {
						throw(`(ferr:aes) invalid type`);
					}
				}
				if (dat==null|dat=='') {
					throw(`(ferr:aes) miss data for crypt`);
				} else if (pwd=='') {
					throw(`(ferr:aes) empty password`);
				} else if (bol) {
					return aes.encrypt(dat,pwd,num);
				} else {
					return aes.decrypt(dat,pwd,num);
				}
			},{
				encrypt:AesCtr.encrypt,
				decrypt:AesCtr.decrypt
			});
			return aes;
		})()
	}),
	load:Object.assign(((env)=>{ //sync loader with custumization
		if (env=='browser') {
			return function(URI, MIME=true, onsuccess=()=>{}, onerror=()=>{}) {
				if (arguments.length==0) {
					throw(`(fwrn:thisdoc/load) miss param <- != string <- no URI -> no job -> source:\n`,thisdoc.load.toString());
				}
				var parseURI=function(URI) {
					if (Array.isArray(URI)) { var types=[];
						for (var uri of URI) {
							if (!types.includes(typeof uri)) types.push(typeof uri);
						}
						if (types.length!=1) {
							throw(`(ferr:thisdoc/load) empty array or a lot of types <- != strings only`);
						} else if (!types.includes('string')) {
							throw(`(ferr:thisdoc/load) invalid params <- != URI/URL <- != string type`);
						} else {
							for (var uri of URI) {
								if (URI.match(/\//)==null) {
									throw(`(ferr:thisdoc/load) not a URI/URL`);
								}
							}
						}
					} else {
						if (typeof URI!='string') {
							throw(`(ferr:thisdoc/load) miss URI or invalid param <- ${typeof URI}!=string <- err`);
						} if (URI.match(/\//)==null) {
							throw(`(ferr:thisdoc/load) not a URI/URL`);
						} else {
							URI=[URI];
						}
					}
					var URIs=[];
					for (var uri of URI) {
						URIs.push(thisdoc.load.resolve(uri));
					}
					return URIs;
				}
				var parseMIME=function(MIME) {
					if (typeof MIME!='string'&&typeof MIME!='boolean') throw(`(ferr:thisdoc/load) MIME isn't string`);
					return MIME;
				}
				var parseFunc=function(v) {
					if (Array.isArray(v)) {
						if (v.length==0) {
							throw(`(ferr:thisdoc/load) array with empty functions`);
						} else {
							for (var f of v) {
								if (typeof f!='function') throw(`(ferr:thisdoc/load) invalid functions`);
							}
						}
					} else {
						if (typeof v!='function') throw(`(ferr:thisdoc/load) invalid functions`);
						v=[v];
					}
					return v;
				}
				if (arguments.length==4) {
					throw(`(ferr:thisdoc/load) a lot of options -> invalid usage -> no job -> source\n`,thisdoc.load.toString());
				} else {
					URI=parseURI(URI);
					MIME=parseMIME(MIME);
					onsuccess=parseFunc(onsuccess);
					onerror=parseFunc(onerror);
				}
				var responses=[];
				var xhr=new XMLHttpRequest();
				for (var uri of URI) {
					xhr.open('GET', uri, false);
					xhr.overrideMimeType("text/plain; charset=x-user-defined");
					xhr.send(null);
					try {
						responses.push({
							uri:uri,
							code:xhr.status,
							data:thisdoc.load.mime(MIME,uri,xhr.responseText)
						});
					} catch { //CORS error
						responses.push({
							uri: uri,
							code: -0,
							data: null
						});
					}
				}
				responses.completed=[];
				for (var response of responses) {
					responses.completed.push(new(class{
						constructor(o)
						{
							this.uri  =o.uri;  //@niknils/requests for more (it's incompatible)
							this.code =o.code; //
							this.data =o.data; //
							this.last =null;   //
						}
						then(c,f)
						{
							if (arguments.length==0) {
								throw(`(ferr:thisdoc/load:then) miss params -> invalid usage -> no job -> source\n`,this.then.toString());
							} else if (arguments.length==1) { f=c;c=0;
								if (typeof f!='function') throw(`(ferr:thisdoc/load:then) invalid usage`);
							} else if (arguments.length==2) {
								if (typeof c!='number'||typeof f!='function') throw(`(ferr:thisdoc/load:then) invalid usage`);
							} else {
								throw(`(ferr:thisdoc/load:then) a lot of options`);
							}
							if (this.last!=false) {
								if (c==this.code||this.code>0&&c==0||this.code<0&&c<0) {
									try{
										this.last=true;
										f(this.data,this);
									}catch{
										this.last=null; //feature != compatible with @niknils/requests
									}
								} else {
									this.last=false;
								}
							}
							return this;
						}
						else(c,f)
						{
							if (arguments.length==0) {
								throw(`(ferr:thisdoc/load:then) miss params -> invalid usage -> no job -> source\n`,this.then.toString());
							} else if (arguments.length==1) { f=c;c=0;
								if (typeof f!='function') throw(`(ferr:thisdoc/load:then) invalid usage`);
							} else if (arguments.length==2) {
								if (typeof c!='number'||typeof f!='function') throw(`(ferr:thisdoc/load:then) invalid usage`);
							} else {
								throw(`(ferr:thisdoc/load:then) a lot of options`);
							}
							if (this.last==false) {
								if (c==this.code||this.code>0&&c==0||this.code<0&&c<0) {
									try{
										this.last=true;
										f(this.data,this);
									}catch{
										this.last=null; //feature != compatible with @niknils/requests
									}
								} else {
									this.last=false;
								}
							}
							return this;
						}
					})(response));
				}
				return Object.assign(responses.completed[0], responses.completed.slice(1,));
			}
		}
		return ()=>{return 'unsupported'};
	})(env.toString()),
	{
		resolve:Object.assign(function(URI) {
			if (typeof URI!='string'||arguments.length!=1) {
				throw(`(ferr:thisdoc/load:resolve) invalid URI`);
			} else { var to;
				if (URI.match('./')!=null&&typeof thisdoc.load.resolve['.']!='undefined') {
					to=thisdoc.load.resolve['.']; if (typeof to!='string') to=to();
					URI=URI.replace('./', to);
				}
				if (URI.match('%/')!=null&&typeof thisdoc.load.resolve['%']!='undefined') {
					to=thisdoc.load.resolve['%']; if (typeof to!='string') to=to();
					URI=URI.replace('%/', to);
				}
				//TODO for-in resolve for some websites <- strings and functions support in resolve()
			}
			return URI; /*#todo: fully resolve by thisdoc.lib.env;*/
		},{
			'.': ()=>{return thisdoc.lib.src.split('/').slice(0,-1).join('/')+'/'},
			'%': '/',
			'github.com': {
				api: function() {
					//indev
				}
			},
			'codeberg.org': {
				//"sameorigin meme or why GitHub Pages better" {:
			}
		}),
		//thisdoc.load(URIs,MIME) -> for-in mimes or `.ext`
		mime : function(MIME,URI,data) {
			if (['string','boolean'].includes(typeof MIME)) { var x;
				if (MIME===true) {
					try{
						x=URI.match(/[^\/]{1,}\.[^\/]{1,}$/)[0];
					} catch {
						return thisdoc.load.false(data);
					}
				} else if (MIME===false) {
					return thisdoc.load.false(data);
				} else {
					x=MIME;
				}
				var real=null,exp=null;
				while (x.match(/\.[^\/]{1,}$/)!=null) {
					x=x.match(/\.[^\/]{1,}$/)[0].replace(/^\./,'');
					for(var mime in thisdoc.load){if(['string','function'].includes(typeof thisdoc.load[mime])&&!['resolve','false','true','mime'].includes(mime)) {
						eval(`exp=/^([^\\?]{1,}\\|){0,1}\\.${x.toLowerCase().replaceAll('.','\\.')}(\\|[^\\?]{1,}){0,1}$/`); //prototype
						if (mime.match(exp)) {
							if (typeof thisdoc.load[mime]=='string') {
								return thisdoc.load.true(thisdoc.load[mime], data);
							} else if (typeof thisdoc.load[mime]=='function') {
								return thisdoc.load[mime](data);
							} else if (typeof thisdoc.load[mime]=='boolean') {
								if (thisdoc.load[mime]==true) {
									return data;
								} else {
									return thisdoc.load.false(data);
								}
							} else {
								throw(`(ferr:thisdoc/load:mime) external modify`);
							}
							break;
						}
					}}
				}
			}
			return thisdoc.load.false(data);
		},
		//native
			true: function(mime,data){
				data='data:'+mime+';base64,'+thisdoc.util.encode(data);
				if (mime.match(/^image/)) {
					data=Object.assign(data,
					{
						img:function(where='', assign={}) {
							switch(arguments.length) {
								case 0:
									break;
								case 1:
									break;
									if (typeof where=='object'&&!Array.isArray(where)&&where!=null) {
										assign=where;where='';
									} else if (typeof where=='string') {
										try{where=where.toString()}catch{} //Object.assign abuse
									} else {
										throw(`(ferr:thisdoc/load:mime<-image->method?img) invalid usage`);
									}
								case 2:
									break;
									var types=[typeof where];
									if (!types.includes(typeof assign)) types.push(typeof assign);
									if (types.length!=2||!types.includes('string')||!types.includes('object')) {
										throw(`(ferr:thisdoc/load:mime<-image->method?img) invalid usage`);
									} else {
										if (typeof where=='string') {
											try{where=where.toString()}catch{}
										} else {
											[where,assign] = [assign,where];
											try{where=where.toString()}catch{}
											if (Array.isArray(where)||where==null) {
												throw(`(ferr:thisdoc/load:mime<-image->method?img) invalid usage`);
											}
										}
									}
								default:
									throw(`(ferr:thisdoc/load:mime<-image->method?img) a lot of options`);
							}
							if (where=='') {
								return Object.assign(document.createElement('img'),
								assign,
								{
									src: data
								});	
							} else if (where.match(/^body$/i)!=null) {
								window.document.body.appendChild(Object.assign(document.createElement('img'),
								assign,
								{
									src: data
								}));
								return true;
							} else {
								try {
									window.document.getElementById(where).appendChild(Object.assign(document.createElement('img'),
									assign,
									{
										src: data
									}));
									return true;
								} catch {
									return false;
								}
							}
						}
					});
				} else if (mime.match(/^audio/)) {
					data=Object.assign(data,
					{
						audio:function(where='', assign={}) {
							switch(arguments.length) {
								case 0:
									break;
								case 1:
									break;
									if (typeof where=='object'&&!Array.isArray(where)&&where!=null) {
										assign=where;where='';
									} else if (typeof where=='string') {
										try{where=where.toString()}catch{} //Object.assign abuse
									} else {
										throw(`(ferr:thisdoc/load:mime<-audio->method?audio) invalid usage`);
									}
								case 2:
									break;
									var types=[typeof where];
									if (!types.includes(typeof assign)) types.push(typeof assign);
									if (types.length!=2||!types.includes('string')||!types.includes('object')) {
										throw(`(ferr:thisdoc/load:mime<-audio->method?audio) invalid usage`);
									} else {
										if (typeof where=='string') {
											try{where=where.toString()}catch{}
										} else {
											[where,assign] = [assign,where];
											try{where=where.toString()}catch{}
											if (Array.isArray(where)||where==null) {
												throw(`(ferr:thisdoc/load:mime<-audio->method?audio) invalid usage`);
											}
										}
									}
								default:
									throw(`(ferr:thisdoc/load:mime<-audio->method?audio) a lot of options`);
							}
							if (where=='') {
								return Object.assign(document.createElement('audio'),
								assign,
								{
									src: data
								});	
							} else if (where.match(/^body$/i)!=null) {
								window.document.body.appendChild(Object.assign(document.createElement('audio'),
								assign,
								{
									src: data
								}));
								return true;
							} else {
								try {
									window.document.getElementById(where).appendChild(Object.assign(document.createElement('audio'),
									assign,
									{
										src: data
									}));
									return true;
								} catch {
									return false;
								}
							}
						}
					});
				} else if (mime.match(/^video/)) {
					
				}
				return data;
			},
			false: function(data) {
				return thisdoc.util.encode(data);
			},
			'.json':function(data) {
				try{
					return JSON.parse(data);
				}catch{
					return thisdoc.load.false(data); //lol
				}
			},
			'.js':function(data,isntWindowObject) {
				try {
					return (()=>{
						isntWindowObject={};
						data=data //insecure
							.replaceAll('window.','isntWindowObject.');
						eval(data);
						return Object.assign(data,isntWindowObject);
					})();
				} catch {
					return null;
				}
			},
			'.wasm':function(data) { //eval
				return window.WebAssembly.instantiate(data);
			},
			'.htm|.xhtml|.html':function() {
				var r={html:data,head:'',body:''};
				try{r.head=data.match(/<head[^>]*>((.|[\n\r])*)<\/head>/im)[0]}catch{};
				try{r.body=data.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im)[0]}catch{};
				return r;
			},
			'.txt|.log': false,
			'.css': function(data){
				return new(class{
					constructor()
					{
						this.data=data;
					}
					beautify()
					{
						
					}
					minify()
					{
						
					}
					append()//thisdoc.load('my.css').then(css=>css.append())
					{
						window.document.head.appendChild(Object.assign(window.document.createElement('style'),
						{
							innerText: this.datadata
						}));
					}
				})(data);
			},
			'.tsv': function(data,tsv=[]) {
				try {
					data=data.replace(/\r/g,'\n').replace(/(\n){1,}/g, '\n');
					data.split('\n')[0].split('\t').forEach((table)=>{
						tsv.push(table);
						tsv[table]=[];
					});
					data.split('\n').slice(1,).forEach((line) => {
						for (var iterator in line.split('\t')) {
							tsv[tsv[iterator]].push(line.split('\t')[iterator]);
						}
					});
					return tsv;
				} catch {
					return null;
				}
			},
			'.csv': function(data,csv=[]){
				try {
					data=data.replace(/\r/g,'\n').replace(/(\n){1,}/g, '\n');
					data.split('\n')[0].split(';').forEach((table)=>{
						csv.push(table);
						csv[table]=[];
					});
					data.split('\n').slice(1,).forEach((line) => {
						for (var iterator in line.split(';')) {
							csv[csv[iterator]].push(line.split(';')[iterator]);
						}
					});
					return csv;
				} catch {
					return null;
				}
			},
		/*fonts*/
			'.otf'  : 'font/otf',
			'.ttf'  : 'font/ttf',
			'.woff' : 'font/woff',
			'.woff2': 'font/woff2',
		/*documents*/
			'.pdf' : 'application/pdf',
			'.rtf' : 'text/rtf',
			/*OpenDocument*/         '.odt':'application/vnd.oasis.opendocument.text','.ott':'application/vnd.oasis.opendocument.text-template','.odg':'application/vnd.oasis.opendocument.graphics','.otg':'application/vnd.oasis.opendocument.graphics-template','.odp':'application/vnd.oasis.opendocument.presentation','.otp':'application/vnd.oasis.opendocument.presentation-template','.ods':'application/vnd.oasis.opendocument.spreadsheet','.ots':'application/vnd.oasis.opendocument.spreadsheet-template','.odc':'application/vnd.oasis.opendocument.chart','.otc':'application/vnd.oasis.opendocument.chart-template','.odi':'application/vnd.oasis.opendocument.image','.oti':'application/vnd.oasis.opendocument.image-template','.odf':'application/vnd.oasis.opendocument.formula','.otf':'application/vnd.oasis.opendocument.formula-template','.odm':'application/vnd.oasis.opendocument.text-master','.oth':'application/vnd.oasis.opendocument.text-web',
			/*Microsoft Office*/     /*Visio*/'.vsd':'application/vnd.visio',/*Word*/'.doc|.dot':'application/msword','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.dotx':'application/vnd.openxmlformats-officedocument.wordprocessingml.template','.docm':'application/vnd.ms-word.document.macroEnabled.12','.dotm':'application/vnd.ms-word.template.macroEnabled.12',/*Excel*/'.xls|.xlt|.xla':'application/vnd.ms-excel','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.xltx':'application/vnd.openxmlformats-officedocument.spreadsheetml.template','.xlsm':'application/vnd.ms-excel.sheet.macroEnabled.12','.xltm':'application/vnd.ms-excel.template.macroEnabled.12','.xlam':'application/vnd.ms-excel.addin.macroEnabled.12','.xlsb':'application/vnd.ms-excel.sheet.binary.macroEnabled.12',/*PowerPoint*/'.ppt|.pot|.pps|.ppa':'application/vnd.ms-powerpoint','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation','.potx':'application/vnd.openxmlformats-officedocument.presentationml.template','.ppsx':'application/vnd.openxmlformats-officedocument.presentationml.slideshow','.ppam':'application/vnd.ms-powerpoint.addin.macroEnabled.12','.pptm':'application/vnd.ms-powerpoint.presentation.macroEnabled.12','.potm':'application/vnd.ms-powerpoint.template.macroEnabled.12','.ppsm':'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
		//videos
			'.ogv':'video/ogg',
			'.mpeg':'video/mpeg',
			'.mov|.mqv':'video/quicktime',
			'.mp4':'video/mp4',
			'.webm':'video/webm',
			'.3gp':'video/3gpp',
			'.3g2':'video/3gpp2',
			'.avi':'video/x-msvideo',
			'.flv':'video/x-flv',
			'.mkv':'video/x-matroska',
			'.asf':'video/x-ms-asf',
			'.m4v':'video/x-m4v',
			'.ts':'video/mp2t',
		//audios
			'.oga':'audio/ogg',
			'.ogx':'application/ogg',
			'.opus':'audio/opus',
			'.mp3':'audio/mp3',
			'.flac':'audio/flac',
			'.midi':'audio/x-midi',
			'.ape':'audio/ape',
			'.mpc':'audio/musepack',
			'.amr':'audio/amr',
			'.wav':'audio/x-wav',
			'.aiff':'audio/x-aiff',
			'.au':'audio/basic',
			'.aac':'audio/aac',
			'.voc':'audio/x-unknown',
			'.mp4':'audio/mp4',
			'.m4a':'audio/x-m4a',
			'.m3u':'application/vnd.apple.mpegurl',
			'.weba':'audi/webm',
		//images
			'.tif|.tiff':'image/tiff',
			'.png':'image/png',
			'.jpeg':'image/jpeg',
			'.jpg':'image/jpg',
			'.gif':'image/gif',
			'.bmp':'image/bmp',
			'.ico':'image/x-icon',
			'.svg':'image/svg+xml',
			'.webp':'image/webp',
		//archives
			'.zip':'application/zip',
			'.arc':'application/x-freearc',
			'.bz':'application/x-bzip',
			'.bz2':'application/x-bzip2',
			'.gz':'application/gzip',
			'.tar':'application/x-tar',
			'.7z':'application/x-7z-compressed',
			'.rar.':'application/vnd.rar',
		//databases
			'.mdb|.accdb':'application/x-msaccess',
			'.sqlite':'application/x-sqlite3',
		//etc
			'.torrent':'application/x-bittorrent',
			'.jar':'application/java-archive',
	}),
	wrap:function(f,o) { //uses for generate alias of function with standard params
		return f;//o <- {prefix:[], postfix:[],defaults:[]}; if miss all values or detect another value -> throw
	},
	vars:function(w,v,f) { //crutch
		if (typeof f=='string') {
			eval(`${v}=${f}`);
			setInterval(()=>{
				eval(`${f}=${v}`);
			}, w);
		} else if (typeof f=='function') { var oldState,newState;
			try{eval(`oldState=${v}`)}catch{}
			setInterval(async()=>{
				try{eval(`newState=${v}`)}catch{};
				if (oldState!==newState) {
					try {
						await eval(`f(v,oldState,newState)`);
					} catch {}
					oldState=newState;
				}
			}, w);
		}
	},
	async:
	{
		wait()
		{
			
		}
	},
	sync:
	{
		wait()
		{
			
		}
	},
	exports:Object.assign(function() {
		
	},{
		global:function() {
			//sync variables like thisdoc.title, thisdoc.mouse, thisdoc.uri and etc to window[var] / process[var])
		}
	}),
	html:Object.assign(function(){
		//usage: html(identifyElement,function)
		//usage: html(identifyElement,function,timeout) //on change runing
		//usage: html(identifyElement,function,timeout,true) //on change running (and run before timeout)
		//identifyElement means '#class', '.id', '!tag', 'any' (in priority tag,id,class) or 'any?PRIORITY' ('any?#.!')
		//function executes for all elements; use 'thisdoc.html.stop(IF_OR_NOW)';
		//html(id,null) -> rm
		//html(id,false) -> invisible or disable (specific)
		//html(id,false,null) //if invisible - remove
		//html(id,{},{}) //if match rewrite too; strict or not ? html(id, this_match_to_id, if_yes_rewrite, full_equal_or_match_by_template=bol)
		for (var TAG of window.document.getElementsByTagName('script')) {
			try{TAG.remove()}catch{};
		}
		for (var TAG of window.document.getElementsByTagName('script')) {
			try{TAG.remove()}catch{};
		}
		for (var TAG of window.document.getElementsByTagName('noscript')) {
			try{TAG.remove()}catch{};
		}
		try{window.document.getElementById('thisdoc.egg').remove()}catch{}
	},{
		
	})
}

/*crutch--*/
thisdoc.req=thisdoc.wrap(thisdoc.load, {postfix: [false]}); //less mime type and some features
/*--crutch*/

/*addons*/
;((addons,addon)=>{
	addons={
		'./requests.js': ['req']
	}
	for (var addon in addons) {
		thisdoc.load(addon).then(200, (_window)=>{
			if (_window.match(/\<slnknrr\@(noreply\.){0,1}codeberg\.org\>/)) {
				for (var addin of addons[addon]) {
					thisdoc[addin.split(':')[0]]=_window[addin.split(':').slice(-1)[0]];
				}
			}
		})
	}
})();

/*postprocessing--*/
	if (thisdoc.lib.env=='browser') {
		//sync vars
		if (env.toString()=='browser') {
			thisdoc.vars(500, 'thisdoc.title', 'window.document.title');
			thisdoc.vars(500, 'thisdoc.url', ()=>{
				if (typeof thisdoc.url!='string') thisdoc.url=window.location.pathname.slice(1,);
				window.history.pushState('unused', 'unused too', '/'+thisdoc.url);
			});
			thisdoc.vars(1000, 'thisdoc.uri', ()=>{
				if (typeof thisdoc.uri!='string') thisdoc.uri=window.location.href;
				if (thisdoc.uri!=window.location.href) window.location=thisdoc.uri;
			});
		}
		//detect CORS settings
		if (thisdoc.lib.web.match(/^read\:/i)==null) {
			thisdoc.load("https://captive.apple.com").then(200, ()=>{
				thisdoc.cors=false;
				for (var cors of [
					"https://apple.com",
					"https://google.com/"
				]) {
					try {
						thisdoc.load(cors).else(()=>{thisdoc.cors=true});
					} catch {
						thisdoc.cors=true;
					}
					if (thisdoc.cors) break;
				}
			})
		}
		//thisdoc.egg
		setTimeout(()=>{try{if(window.document.getElementById('thisdoc.egg').innerText=='404 - not a bug'){
			window.document.getElementById('thisdoc.egg').innerText+=` it's feature`;
		}}catch{}},2000);
		//browser warns? we love browser warns
		console.clear();
	}
	//aliases
	thisdoc.async=Object.assign(thisdoc.wrap(thisdoc.req, {prefix: [true]}), thisdoc.async);
	thisdoc.sync=Object.assign(thisdoc.wrap(thisdoc.req, {prefix: [false]}), thisdoc.sync);
/*--postprocessing*/


/*--module:thisdoc*/env.export=thisdoc})();/*declare--*/
if (env=='browser') {
	window.thisdoc=env.export;
} else if (env=='node') {
	module.exports.thisdoc=env.export;
}
/*--declare*/}catch{console.log(`(ferr:thisdoc) can't declare thisdoc object`)};


/* TODO
 - move thisdoc.load{inLoad(less mime)} (includes 'mime') ->  thisdoc.includes[<-'mime']{inLoad(less mime)}
 - thisdoc can be assigned in any level (full scanning, like it -> thisdoc={backend:{byBackendIMakedThisJsCodeForMethodToAssign(){}}} -> assign it correct
*/

//'use strict';
/** prototypes.js **/
String.prototype.find = function(chr) {
    return this.indexOf(chr) === -1 ? false : true;
};

Number.prototype.countDecimals = function() {
    if (Math.floor(this.valueOf()) === this.valueOf() || isInt(this.valueOf())) return 0;
    return this.toString().split(".")[1].length || 0;
};

Number.prototype.toFix = function(n) {
    return parseFloat(this.toString().substring(0, (this.toString().indexOf(".") + n)));
};

Array.prototype.unique = function() {
    return this.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
};
/** /prototypes.js **/



/** helpers.j **/
function ValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
};

function isImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function generateId() {
    return Math.floor((Math.random() * 1000000) + 1);
}

function utf8_encode (argString) { // eslint-disable-line camelcase
  //  discuss at: https://locutus.io/php/utf8_encode/
  // original by: Webtoolkit.info (https://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Ulrich
  // bugfixed by: Rafał Kukawski (https://blog.kukawski.pl)
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'
  if (argString === null || typeof argString === 'undefined') {
    return ''
  }
  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const string = (argString + '')
  let utftext = ''
  let start
  let end
  let stringl = 0
  start = end = 0
  stringl = string.length
  for (let n = 0; n < stringl; n++) {
    let c1 = string.charCodeAt(n)
    let enc = null
    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      )
    } else if ((c1 & 0xF800) !== 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) !== 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n)
      }
      const c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) !== 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }
  if (end > start) {
    utftext += string.slice(start, stringl)
  }
  return utftext
}

function utf8_decode (strData) { // eslint-disable-line camelcase
  //  discuss at: https://locutus.io/php/utf8_decode/
  // original by: Webtoolkit.info (https://www.webtoolkit.info/)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (https://brett-zamir.me)
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Norman "zEh" Fuchs
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: kirilloid
  // bugfixed by: w35l3y (https://www.wesley.eti.br)
  //   example 1: utf8_decode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'
  const tmpArr = []
  let i = 0
  let c1 = 0
  let seqlen = 0
  strData += ''
  while (i < strData.length) {
    c1 = strData.charCodeAt(i) & 0xFF
    seqlen = 0
    // https://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    if (c1 <= 0xBF) {
      c1 = (c1 & 0x7F)
      seqlen = 1
    } else if (c1 <= 0xDF) {
      c1 = (c1 & 0x1F)
      seqlen = 2
    } else if (c1 <= 0xEF) {
      c1 = (c1 & 0x0F)
      seqlen = 3
    } else {
      c1 = (c1 & 0x07)
      seqlen = 4
    }
    for (let ai = 1; ai < seqlen; ++ai) {
      c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
    }
    if (seqlen === 4) {
      c1 -= 0x10000
      tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
      tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
    } else {
      tmpArr.push(String.fromCharCode(c1))
    }
    i += seqlen
  }
  return tmpArr.join('')
}

function empty(mixedVar) {
    //  discuss at: http://locutus.io/php/empty/
    // original by: Philippe Baumann
    //    input by: Onno Marsman (https://twitter.com/onnomarsman)
    //    input by: LH
    //    input by: Stoyan Kyosev (http://www.svest.org/)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Francesco
    // improved by: Marc Jansen
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //   example 1: empty(null)
    //   returns 1: true
    //   example 2: empty(undefined)
    //   returns 2: true
    //   example 3: empty([])
    //   returns 3: true
    //   example 4: empty({})
    //   returns 4: true
    //   example 5: empty({'aFunc' : function () { alert('humpty'); } })
    //   returns 5: false

    var undef
    var key
    var i
    var len
    var emptyValues = [undef, null, false, 0, '', '0']

    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true
        }
    }

    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            if (mixedVar.hasOwnProperty(key)) {
                return false
            }
        }
        return true
    }

    return false
}

function isset() {
    //  discuss at: http://locutus.io/php/isset/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: FremyCompany
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //   example 1: isset( undefined, true)
    //   returns 1: false
    //   example 2: isset( 'Kevin van Zonneveld' )
    //   returns 2: true

    var a = arguments
    var l = a.length
    var i = 0
    var undef

    if (l === 0) {
        throw new Error('Empty isset')
    }

    while (i !== l) {
        if (a[i] === undef || a[i] === null) {
            return false
        }
        i++
    }

    return true
}

function rtrim(str, charlist) {
    //  discuss at: http://locutus.io/php/rtrim/
    // original by: Kevin van Zonneveld (http://kvz.io)
    //    input by: Erkekjetter
    //    input by: rem
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rtrim('    Kevin van Zonneveld    ')
    //   returns 1: '    Kevin van Zonneveld'

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([[\]().?/*{}+$^:])/g, '\\$1')

    var re = new RegExp('[' + charlist + ']+$', 'g')

    return (str + '').replace(re, '')
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
function is_array (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: https://locutus.io/php/is_array/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // improved by: Legaev Andrey
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (https://brett-zamir.me)
  // improved by: Nathan Sepulveda
  // improved by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: Cord
  // bugfixed by: Manish
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  //      note 1: In Locutus, javascript objects are like php associative arrays,
  //      note 1: thus JavaScript objects will also
  //      note 1: return true in this function (except for objects which inherit properties,
  //      note 1: being thus used as objects),
  //      note 1: unless you do ini_set('locutus.objectsAsArrays', 0),
  //      note 1: in which case only genuine JavaScript arrays
  //      note 1: will return true
  //   example 1: is_array(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: true
  //   example 2: is_array('Kevin van Zonneveld')
  //   returns 2: false
  //   example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 3: true
  //   example 4: ini_set('locutus.objectsAsArrays', 0)
  //   example 4: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 4: false
  //   example 5: is_array(function tmp_a (){ this.name = 'Kevin' })
  //   returns 5: false
  const _getFuncName = function (fn) {
    const name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }
  const _isArray = function (mixedVar) {
    // return Object.prototype.toString.call(mixedVar) === '[object Array]';
    // The above works, but let's do the even more stringent approach:
    // (since Object.prototype.toString could be overridden)
    // Null, Not an object, no length property so couldn't be an Array (or String)
    if (!mixedVar || typeof mixedVar !== 'object' || typeof mixedVar.length !== 'number') {
      return false
    }
    const len = mixedVar.length
    mixedVar[mixedVar.length] = 'bogus'
    // The only way I can think of to get around this (or where there would be trouble)
    // would be to have an object defined
    // with a custom "length" getter which changed behavior on each call
    // (or a setter to mess up the following below) or a custom
    // setter for numeric properties, but even that would need to listen for
    // specific indexes; but there should be no false negatives
    // and such a false positive would need to rely on later JavaScript
    // innovations like __defineSetter__
    if (len !== mixedVar.length) {
      // We know it's an array since length auto-changed with the addition of a
      // numeric property at its length end, so safely get rid of our bogus element
      mixedVar.length -= 1
      return true
    }
    // Get rid of the property we added onto a non-array object; only possible
    // side-effect is if the user adds back the property later, it will iterate
    // this property in the older order placement in IE (an order which should not
    // be depended on anyways)
    delete mixedVar[mixedVar.length]
    return false
  }
  if (!mixedVar || typeof mixedVar !== 'object') {
    return false
  }
  const isArray = _isArray(mixedVar)
  if (isArray) {
    return true
  }
  const iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.objectsAsArrays') : undefined) || 'on'
  if (iniVal === 'on') {
    const asString = Object.prototype.toString.call(mixedVar)
    const asFunc = _getFuncName(mixedVar.constructor)
    if (asString === '[object Object]' && asFunc === 'Object') {
      // Most likely a literal and intended as assoc. array
      return true
    }
  }
  return false
}
window.__cData = window.__cData || {};
dataInit();
function dataInit() {
	window.__cData = localStorage.getItem('meliStorage');
}

function set(key, value, subkey = null) {
	dataInit();
	if (!isset(key)) return false;

    localStorage.setItem('meli_'+key, value);
}

function get(key, subkey = null) {
	if (!isset(key)) return false;
    return localStorage.getItem('meli_'+key);
}

function del(key, subkey = null) {
    if (isset(key) && isset(window.__cData[key]) && isset(subkey) && !empty(subkey)) {
        delete window.__cData[key][subkey];
    } else if (isset(key) && !empty(key)) {
        delete window.__cData[key];
    } else {
        window.__cData = null;
    }
}
function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
/*
      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
*/
      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
function getUrl() {
    return window.location.href;
}
/** /helpers.js **/

set('app_id', '2579747270284694');
set('app_secret', 'zwWhmJNBYDNq1NuO0hXB8sMGdxJFoxfJ');
set('redirect_url', 'https://www.amazon.com/');
set('meli_site', 'MLV');

let urlParams = getAllUrlParams( getUrl() );
if (!!urlParams.code) set('meli_code', urlParams.code);

let results = [];
let log = console.log;

let s = document.createElement('script');
s.src = 'https://static.mlstatic.com/org-img/sdk/mercadolibre-1.0.4.js';
document.querySelector('body').appendChild(s);

const container = overlayHelper();
drawPrefixForm();

function meli_loaded() {
	return !!MELI;
}

function meli_auth_url() {
	return `https://auth.mercadolibre.com/authorization?redirect_uri=${get('redirect_url')}&response_type=code&client_id=${get('app_id')}`
}

function meli_access_token_url() {
	return `https://api.mercadolibre.com/oauth/token`;
}

function meli_login(cb=null) {
	
	if (!get('meli_code')) {
		window.location.href = meli_auth_url();
	}
	
	if (!get('meli_access_token')) {
		postData( meli_access_token_url(), {
			grant_type:'authorization_code',
			client_id:get('app_id'),
			client_secret:get('app_secret'),
			code:get('meli_code'),
			redirect_uri:get('redirect_url') 
		}, response => {
			
			set('meli_access_token', response.access_token);
			set('meli_refresh_token', response.refresh_token);
			set('meli_user_id', response.user_id);
			set('meli_auth_data', JSON.stringify(response));
			
			if (typeof cb == 'function') cb( response );
			
			log(response);
		});
	}
}

function get_meli_auth() {
	if (get('meli_access_token')) {
		return {
			access_token: get('meli_access_token'),
			refresh_token: get('meli_refresh_token'),
			user_id: get('meli_user_id')
		};
	}
	return false;
}

function meli_publish(data, cb){
	let meli_auth = get_meli_auth();
	if (!meli_auth) return false;
	if (typeof meli_auth.access_token == 'undefined') {
		MELI.login(function() {
			MELI.getLoginStatus(function(data) {
            	let url = `https://api.mercadolibre.com/items?access_token=${get('meli_access_token')}`;
            	return postData(url, JSON.stringify( data ), cb);
			});
		});
	} else {
    	let url = `https://api.mercadolibre.com/items?access_token=${meli_auth.access_token}`;
    	return postData(url, JSON.stringify( data ), cb);
	}
}

async function postData(url = '', data = {}, cb = null) {
  // Default options are marked with *
  let headers;
  if (get('meli_access_token')) {
  	headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Authorization': 'Bearer '+ get('meli_access_token'),
    };
    
    $.ajaxSetup({
	   headers
	});
  }
  
  $.post(url, data).done(resp => {
  	if (typeof cb == 'function') {
  		cb( resp );
  	}
  });
}

let timer = setInterval(function(){
	if (meli_loaded()) {
	    log('meli_loaded');
		MELI.getLoginStatus(function(data) {
		    log('getLoginStatus');
    		if (data.state == 'UNKNOWN') {
    		    log('meli_login');
    		    meli_login();
    		}
		});
		
		clearInterval( timer );
		
    		    log(get_meli_auth());
		if (!get_meli_auth()) {
    		log('meli_login');
			meli_login();
		}
	}
}, 1000 * 3);


function getProductsFromLists( dom ) {
	if (dom.find('#mainResults').length) {
		dom.find('#mainResults > ul [data-asin]').each((i, item) => {
			if (!empty($(item).attr('data-asin'))) results.push( $(item).attr('data-asin') );
		});
	}
	
	if (dom.find('.s-result-list.s-search-results').length) {
		dom.find('.s-result-list.s-search-results [data-asin]').each((i, item) => {
			if (!empty($(item).attr('data-asin'))) results.push( $(item).attr('data-asin') );
		});
	}
}

var pages = 1;
function getPagesFromLists() {
	pages = $('[cel_widget_id*=MAIN-PAGINATION] ul > li:last-child').prev().text();
	if (isNaN( parseInt( pages ))) pages = 1;
}

function startScrapping() {
	getProductsFromLists( $('body') );
	if (results) {
		getPagesFromLists();
		log({ pages })
		Array( parseInt( pages ) ).fill().map((x,i) => {
			log( { i })
			$.get( window.location.href.replace('page=', '__page=') +'&page='+ ( i*1+1 ) )
			.then(resp => {
				let dom = $( resp );
				getProductsFromLists( dom );
				
			});
		});
	}
}

$(function(){
	startScrapping();	
});


var csvContent = [];
var products = [];
let queueCounter = false;
function drawPrefixForm() {
	
	let form = container.querySelector('form');
	if (!form || typeof form == 'undefined' || ul.length == 0) {
		form = document.createElement('form');
        form.id = 'necoyoad_form_settings';
		container.prepend( form );
		
		const renderInput = (props) => {
			if (typeof props.name == 'undefined') return;
			
			
			let time = new Date;
			
			let input;
			if (typeof props.type != 'undefined' && props.type == 'textarea') {
				input = document.createElement('textarea');
				input.id = !!props.id ? props.id : generateId()+'_'+props.name;
				input.name = !!props.name ? props.name : 'undefined';
				input.value = !!props.defaultValue ? props.defaultValue : '';
				input.placeholder = !!props.placeholder ? props.placeholder : '';
			} else if (typeof props.type != 'undefined' && props.type == 'separator') {
				input = document.createElement('div');
				input.style.clear = 'both';
				input.style.width = '100%';
				input.style.height = '1px';
				input.style.display = 'block';
				input.id = !!props.id ? props.id : generateId()+'_'+props.name;
			} else if (typeof props.type != 'undefined' && props.type == 'button') {
				input = document.createElement('button');
				input.id = !!props.id ? props.id : generateId()+'_'+props.name;
				input.name = !!props.name ? props.name : 'undefined';
				input.innerHTML = !!props.defaultValue ? props.defaultValue : '';
			} else {
				input = document.createElement('input');
				input.id = !!props.id ? props.id : generateId()+'_'+props.name;
				input.type = !!props.type ? props.type : 'text';
				input.name = !!props.name ? props.name : 'undefined';
				input.value = !!props.defaultValue ? props.defaultValue : '';
				input.placeholder = !!props.placeholder ? props.placeholder : '';
			}
			
			if (typeof props.onLoad != 'undefined' && typeof props.onLoad == 'function') {
				input.onLoad = function(event) {
					props.onLoad(event, input);
				}
			}
			
			if (typeof props.onChange != 'undefined' && typeof props.onChange == 'function') {
				input.onchange = function(event) {
					props.onChange(event, input);
				}
			}
			
			if (typeof props.onClick != 'undefined' && typeof props.onClick == 'function') {
				input.onclick = function(event) {
					props.onClick(event, input);
				}
			}
			
			form.append( input );
		}
		
		renderInput({
			name:'prefix_title',
			placeholder:'Ingresa Prefijo del Titulo',
			defaultValue:get('prefix_title'),
			onChange:function(e, input) {
				set('prefix_title', input.value);
			}
		});
		
		renderInput({
			type:'textarea',
			name:'prefix_description',
			placeholder:'Ingresa Prefijo de la descripcion',
			defaultValue:get('prefix_description'),
			onChange:function(e, input) {
				set('prefix_description', input.value);
			}
		});
		
		renderInput({
			type:'textarea',
			name:'warranty',
			placeholder:'Ingresa las condiciones de la garantia',
			defaultValue:get('warranty'),
			onChange:function(e, input) {
				set('warranty', input.value);
			}
		});
		
		renderInput({
			name:'currency_rate',
			type:'number',
			placeholder:'Ingresa Tasa del Dollar',
			defaultValue:get('currency_rate'),
			onChange:function(e, input) {
				set('currency_rate', input.value);
			}
		});
		
		renderInput({
			name:'publish_all',
			type:'submit',
			defaultValue:'Publicar Todos',
			onClick:function(e, input) {
			    e.preventDefault();
			    e.stopPropagation();
			    csvContent = [];
			    input.disabled = true;
			    input.value = 'Por Favor Espere...';
			    
			    let ul = document.querySelector('#necoyoad_logs');
			    if (ul) ul.innerHTML = '';
                if (!!results) {
                	results = results.filter(asin => { return !!asin });
                	queueCounter = results.length;
                	results.unique().map( (asin, k) => {
                		queueCounter = queueCounter - 1;
	    			    setTimeout(()=>{
	    			    }, 1000 * 30);
	    			    log({k, queueCounter});
	                    if (queueCounter <= 0) {
	    			        input.disabled = false;
	    			    	input.value = 'Publicar Todos';
	    			    	loadProduct( asin, true );
	                    }
	                    else  loadProduct( asin );
	                });
                }
                
                if (!!document.querySelector('#ASIN')) {
                	let data = prepareToPublish(getProductData($('body')));
                	if (data) {
                		meli_publish(data)
                	    .then(resp => {
                            	        
            			    input.disabled = false;
            			    input.value = 'Publicar Todos';
            			    
                		    if (resp.status === 401 && resp.message === "expired_token") {
                		        meli_login(()=>{
                		            meli_publish(data)
                		        });
                		    }
                		}).catch(err => {
                		    log({err});
                		});
                	}
                	
                }
                return false;
			}
		});
		
		renderInput({
			name:'downloadcsv',
			type:'button',
			defaultValue:'Descargar CSV',
			onClick:function(e, input) {
			    e.preventDefault();
			    e.stopPropagation();
				download_csv( csvContent );
                return false;
			}
		});
		
	}
}

function download_csv(data) {
    var csv = '';
    
    products.forEach(function(r) {
    	if (!empty(r)) {
	    	row = Object.keys(r).map( i => {
	    		let v = r[i];
	    		log(v);
	    		log(typeof v);
	    		return is_array(v) ? 
	    			'"'+ v.join(',') +'"' : 
	    				typeof v != 'number' && typeof v != 'boolean' ?  
	    				'"'+ v.trim().replace(/"/gi, "''").replace(/,/gi, ".").replace(/#/g,'') +'"' :
	    				v;
	    			
	    	}).join(',');
	        log({row});
	        csv += row;
	        csv += "\n";
    	}
    });
 
	csv = ['ASIN', 'url', 'Title', 'Price', 'Unit', 'Weight', 'Stock', 'Pictures', 'Description'].join(',') +"\n"+ csv;
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'amazon_products.csv';
    hiddenElement.click();
}


function loadProduct( asin=null, download = false ) {
	if (!asin) return;
	let url = 'https://www.amazon.com/dp/'+asin;
	$.get( url ).then(resp => {
		let dom = $( resp );
		
		log({download});
		if (download) {
			download_csv( csvContent );
		}
		
		let _data = getProductData( dom );
		if (!_data) return false;
		
		csvContent.push( Object.values( _data ) );
		
		let data = prepareToPublish( _data );
    	
    	if (data) {
    	    let ul = document.querySelector('#necoyoadWrapperContent #necoyoad_logs');
    	    if (!ul) {
    	        ul = document.createElement('ul');
    	        ul.id = 'necoyoad_logs';
    	        document.querySelector('#necoyoadWrapperContent').append( ul );
    	    }
    	    
    	    //remove innerhtml 
    	    //show spiinner 
    	    let li = document.createElement('li');
    	    li.id = 'necoyoad_logs_li_'+ _data.asin;
    	    li.innerHTML = `<img src="${data.pictures[0].source}" alt="${data.title}" width="24" /> ${data.title}`;
    	    ul.append( li );
    	    /*
    	    meli_publish(data, resp => {
    	    	console.log( resp );
			    let li = document.querySelector('#necoyoad_logs_li_'+ _data.asin);
    		    if (resp.status === 401 && resp.message === "expired_token") {
    		        meli_login(meli_publish(data));
    		        li.innerHTML = `Error: Ha caducado la sesion de MercadoLibre, iniciando sesion de nuevo. Intente de nuevo en unos segundos`;
    		    }
    		    if (resp.status === 400 && resp.error === "validation_error") {
    		        let msg = `Error: Hubo validaciones no cumplidas. Los errores son los siguientes:`;
    		        resp.cause.map(cause => {
    		            msg += `<p><small>${cause.message}</small></p>`;
    		        })
    		        li.innerHTML = msg;
    		        resp.error = null;
    		    }
    		    if (resp.status === 400 && resp.error) {
    		        let msg = resp.message;
    		        li.innerHTML = `Error: (${resp.error}) ${resp.message}`;
    		    }
    		    if (resp.status == "active") {
    		        li.innerHTML = `<a href="${resp.permalink}"><img src="${data.pictures[0].source}" alt="${data.title}" width="24" /></a>Todo Bien! <a href="${resp.permalink}"><small>Ver Publicacion</small></a>`;
    		    }
			});
			*/
    	}
    	
	})
}

function prepareToPublish(data) {
	if (
		!isset(data.title) || 
		empty(data.title) || 
		!isset(data.price) || 
		empty(data.price)
	) return false;
	
	let form = document.querySelector('#necoyoad_form_settings');
	
	category_id = form.querySelector('select:last-child').value;
	
	data.price = data.price.replace('$', '');
	let title = get('prefix_title') ? get('prefix_title') +' '+ data.title : data.title;
	let description = get('prefix_description') ? get('prefix_description') +"\n\r"+ data.specs : data.specs;
	
	if (data.price.find(' - ')) {
	    let prices = data.price.split('-');
	    data.price = prices[1].replace('$','').trim();
	}
	let price = get('currency_rate') ? (parseFloat(data.price) * parseFloat(get('currency_rate'))).toFixed(2) : parseFloat(data.price).toFixed(2);
	
	let warranty = get('prefix_warranty') ? get('prefix_warranty') : '';
	
	if (title.length > 60) title = title.substr(0,60);
	if (data.images.length > 12) data.images = data.images.slice(0,12);
	
	let pictures = data.images.map(source => { return { source }}).unique();
	
	return {
		title,
		price,
		description: {
			"plain_text": description
		},
		warranty,
		pictures,
		category_id,
		"currency_id":"VES",
		"available_quantity":1,
		"buying_mode":"buy_it_now",
		"listing_type_id":"bronze",
		"condition":"new"
	};
}
getMeliCategories();
function getMeliCategories() {
    fetch(`https://api.mercadolibre.com/sites/${get('meli_site')}/categories`)
        .then(response => { return response.json() })
        .then(categories => {
            
            const addOption = args => {
                let opt = document.createElement('option');
                
                opt.selected = isset(args.selected) && args.selected ? args.selected : false;
                opt.value = args.value;
                opt.innerHTML = args.text;
                return opt;
            }
            
            const drawCategoriesSelect = categories => {
                let form = document.querySelector('#necoyoad_form_settings');
                let select = document.createElement('select');
                
                select.append( addOption({
                    value:0,
                    text:'Selecciona una categoria'
                }) );
                
                for (let i in categories) {
                    if (isNaN(i)) continue;
                    let category = categories[i];
                    
                    let option = addOption({
                        value:category.id,
                        text:category.name
                    });
                    
                    select.append( option );
                }
                
                select.onchange = async function(e) {
                    let category_id = this.value;
                    if (!category_id) return;
                    
                    //remove all next cats rendered 
                    let selects = form.querySelectorAll('select');
                    let hasToRemove = false;
                    for (let j in selects) {
                        if (isNaN(j)) continue;
                        let sibling = selects[j];
                        
                        if (hasToRemove) {
                            form.removeChild( sibling );
                        }
                        
                        if (sibling === this) {
                            hasToRemove = true;
                        }
                    }
                    
                    fetch(`https://api.mercadolibre.com/categories/${category_id}`)
                        .then(r => { return r.json() })
                        .then(category_data => {
                            if (!empty(category_data.children_categories))
                                drawCategoriesSelect( category_data.children_categories );
                        });
                };
                
                form.append( select );
            }
            drawCategoriesSelect( categories );
            
    });
}

function getProductData( dom ) {
    if (dom.find('#ASIN').length === 0) return false;
    
	queueCounter = queueCounter - 1;
	
	let title = unescape( dom.find('#productTitle').text().trim() ).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	let specs = "";
	
	dom.find('#feature-bullets li').each(function(){
		log( $(this).text() );
		log( {specs} );
	    if (typeof $(this).text() != 'undefined')
		    specs +=  $(this).text().trim() +'  ';
	});
	specs = unescape( specs ).normalize("NFD").replace(/[\u0300-\u036f|\u00aa]/g, "");
	
	let weight = 0;
	let unit = '';
	if ($('#technicalSpecifications_feature_div').length != 0) {
		let details = $('#technicalSpecifications_feature_div').text();
		let str_peso = findWeight( details );
		weight = str_peso.replace(/[^\d\.]/gi, '').trim();
		unit = str_peso.replace(weight, '').trim();
		log({weight, unit});
	}
	
	if (weight===0 && $('#productDetails_techSpec_section_2').length != 0) {
		let details = $('#productDetails_techSpec_section_2').text();
		let str_peso = findWeight( details );
		weight = str_peso.replace(/[^\d\.]/gi, '').trim();
		unit = str_peso.replace(weight, '').trim();
		log({weight, unit});
	}
	
	let asin = dom.find('#ASIN').val();
	let url = 'https://www.amazon.com/dp/'+asin;
	//let details = dom.find('#prodDetails').text().trim();
	//let description = dom.find('#productDescription').text().trim();
	let price = sanitizePrice( dom.find('#priceblock_ourprice').text().replace('$', '').replace(',', '').trim() );
	let stock = dom.find('#availability').text().replace(/\D/gi, '').trim();
	
	if (!sanitizePrice( price )) {
		price = dom.find('#olp-upd-new .a-color-price').text().replace('$', '').replace(',', '').trim();
	}
	
	if (!sanitizePrice( price )) {
		price = dom.find('#olp-upd-new-used .a-color-price').text().replace('$', '').replace(',', '').trim();
	}
	
	if (!sanitizePrice( price )) {
		price = dom.find('.swatchSelect .a-color-price').text().replace(/[^\d\.]/gi, '').replace(',', '').trim();
	}
	
	price = sanitizePrice( price );
	
	//images preload 
	let images = dom.text().match(/(?<="hiRes":")([^"]+)(?=")/gi)
		.map( v => { return decodeURIComponent(v) })
		.filter( (v, i, s) => { return s.indexOf(v) === i })
		.filter( (v, i, s) => { return ValidURL(v) && isImageURL(v) });
		
	if ( !stock ) stock = 1;
	if (price) {
		let r = {
			asin,
			url,
			title,
			price,
			unit,
			weight,
			stock,
			images,
			specs,
			//description,
			//details
		};
		
		log( r );
		products.push( r );
		return r;
	}
		
}

function findWeight( txt ) {
  var rx = /Peso(.*)([\n\r]?)+(\d.+)+[\n\r]/g;
  var arr = rx.exec( txt );
  return arr[3];
}

function sanitizePrice( price ) {
	if (typeof price == 'undefined' || !price) return false;
	console.log({ line:884, price });
	
	if (price.find(' - ')) {
	    let prices = price.split('-');
	    price = prices[1].replace('$','').trim();
	}
	console.log({ line:890, price });
	
	price = price.replace(/[^\d\.]/gi, '').trim();
	console.log({ price });
	let _price = parseFloat( price );
	console.log({ _price });
	if (!isNaN( _price )) return _price.toFixed( 2 );
	else return false;
}
//helper functions
// renderTools()
// helperMarkPublished()


function removeFromMyWrapper(id) {
    if (typeof id === 'undefined') return;
    var el = document.getElementById(id);
    if (el) el.parentNode.removeChild(el);
}

function appendToMyWrapper(str, id, attributes) {
    if (typeof id === 'undefined') id = '';
    if (typeof attributes === 'undefined') attributes = {};

    var wrapper = document.getElementById('necoyoadWrapper');
    var exists = document.getElementById(id);
    var li;

    if (id) {
        li = document.getElementById(id);
        if (!li) {
            li = document.createElement('li');
        }
        li.setAttribute('id', id);
    } else {
        li = document.createElement('li');
    }

    li.innerHTML = str;
    li.style.float = 'left';
    li.style.cursor = 'default';
    li.style.background = 'rgba(0, 0, 0, 0.3)';
    li.style.padding = '4px';

    for (let k in attributes) {
        li.setAttribute(k, attributes[k]);
    }

    if (!exists) wrapper.appendChild(li);
}


function overlayHelper() {
	let container = document.querySelector('#necoyoadWrapper');
	let div;
	
	if (!container || typeof container == 'undefined' || container.length == 0) {
		container = document.createElement('div');
		container.setAttribute('id', 'necoyoadWrapper');
		container.setAttribute('class', 'necoyad_overlay necoyoad_light');
		
		container.style.maxHeight = (window.innerHeight - 200) +'px';

		document.querySelector('body').appendChild( container );
		/*
        container.onmousedown = myDrag;
        document.onmousemove = myMove;
        document.onmouseup = myDrop;
        */
		
		
		
		let footerLink = document.createElement('a');
		let footerImg = document.createElement('img');
		
		div = document.createElement('div');
		div.setAttribute('id', 'necoyoadWrapperContent');
		div.style.width = '90%';
		div.style.padding = '5%';
		div.style.cursor = 'default';
		div.style.margin = 'auto';
		div.style.position = 'relative';
		
		p = document.createElement('p');
		p.setAttribute('id','necoyoadShareLinks');
		
		shareOnFacebook = document.createElement('a');
		shareOnFacebook.setAttribute('href','https://www.necoyoad.com/api/facebook&redirect=promote');
		shareOnFacebook.setAttribute('target','__blank');
		shareOnFacebook.innerHTML = 'Facebook';
		p.append( shareOnFacebook );
		
		shareOnGoogle = document.createElement('a');
		shareOnGoogle.setAttribute('href','https://www.necoyoad.com/api/google&redirect=invite_friends');
		shareOnGoogle.setAttribute('target','__blank');
		shareOnGoogle.innerHTML = 'Google';
		p.append( shareOnGoogle );
		
		shareOnOutlook = document.createElement('a');
		shareOnOutlook.setAttribute('href','https://www.necoyoad.com/api/live&redirect=invite_friends');
		shareOnOutlook.setAttribute('target','__blank');
		shareOnOutlook.innerHTML = 'Outlook';
		p.append( shareOnOutlook );
		
		shareOnLinkedIn = document.createElement('a');
		shareOnLinkedIn.setAttribute('href','https://www.linkedin.com/in/yosietserga/');
		shareOnLinkedIn.setAttribute('target','__blank');
		shareOnLinkedIn.innerHTML = 'LinkedIn';
		p.append( shareOnLinkedIn );
		
		footerLink.setAttribute('href','https://www.necoyoad.com/web/?ref=chromeExtension');
		footerLink.setAttribute('target','__blank');
		
		footerImg.setAttribute('src','https://www.necoyoad.com/web/index.php?r=common/home/getimage&image=data/footprints/developed-by-necoyoad.png&t=1');
		footerImg.setAttribute('title','Developed By Necoyoad');
		
		footerLink.style.marginTop = '10px';
		
		footerLink.append( footerImg );
		
		render('header');
		render('theme_switch');
		container.append( p );
		container.append( div );
		container.append( footerLink );
	} else {
		div = document.querySelector('#necoyoadWrapperContent');
	}
	
	return div;
}

function render(what, where=null) {
	let container = document.querySelector('#necoyoadWrapper');
	
    if (
        !isset(what) 
        || empty(what) 
        || !container 
        || typeof container == 'undefined' 
        || container.length == 0
    ) return false;
    
    let prefix = 'necoyoad_';
    
    const convertToHTML = (tpl) => {
        let doc = new DOMParser().parseFromString(tpl, "text/html");
        let el = doc.querySelector('body').firstChild;
		
		doc = null;
        return el;		
    }
    
    if (what == 'header') {
        let tpl = 
        `<div class="${prefix}header"></div>`;
        
		container.append( convertToHTML(tpl) );
		
		let header = document.querySelector(`.${prefix}header`);
		
		let headerLink = document.createElement('a');
		let headerImg = document.createElement('img');
		
		headerLink.setAttribute('href','https://www.necoyoad.com/web/?ref=chromeExtension');
		headerLink.setAttribute('target','__blank');
		
		headerImg.setAttribute('src','https://www.necoyoad.com/web/index.php?r=common/home/getimage&image=data/footprints/developed-by-necoyoad-header.png&t=1');
		headerImg.setAttribute('title','Developed By Necoyoad');
		headerLink.append( headerImg );
		
		header.append( headerLink );
    }
    
    if (what == 'footer') {
        let tpl = 
        `<div class="${prefix}header"></div>`;
        
		container.append( convertToHTML(tpl) );
		
		let header = document.querySelector(`.${prefix}header`);
		
		let headerLink = document.createElement('a');
		let headerImg = document.createElement('img');
		
		headerLink.setAttribute('href','https://www.necoyoad.com/web/?ref=chromeExtension');
		headerLink.setAttribute('target','__blank');
		
		headerImg.setAttribute('src','https://www.necoyoad.com/web/index.php?r=common/home/getimage&image=data/footprints/developed-by-necoyoad-header.png&t=1');
		headerImg.setAttribute('title','Developed By Necoyoad');
		headerLink.append( headerImg );
		
		header.append( headerLink );
    }
    
    if (what == 'theme_switch') {
		let header = document.querySelector(`.${prefix}header`);
        let tpl = 
        `<div class="onoffswitch">
            <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked>
            <label class="onoffswitch-label" for="myonoffswitch">
                <span class="onoffswitch-inner"></span>
            </label>
        </div>`;
		header.append( convertToHTML(tpl) );
		let switcher = document.querySelector(`.onoffswitch-checkbox`);
		switcher.onclick = function(e) {
		    if (e.target.checked) {
		        container.classList.add("necoyoad_light");
		        container.classList.remove("necoyoad_dark");
		    } else {
		        container.classList.add("necoyoad_dark");
		        container.classList.remove("necoyoad_light");
		    }
		}
    }
}

/*
// adapted from https://codepen.io/depthdev/pen/epKDk
*/
function getClosest(elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }

    return null;

}
var obj, prev_x, prev_y, x, y;
function myDrag(e) {
    obj = e.target;

    prev_x = x - obj.offsetLeft;
    prev_y = y - obj.offsetTop;
}

function myMove(e) {
    if (e.pageX) {
        x = e.pageX; // X coordinate based on page, not viewport.
        y = e.pageY; // Y coordinate based on page, not viewport.
    }
    //  else if (e.clientX) {
    //    x=clientX; // X coordinate based on viewport.
    //    y=clientY; // Y coordinate based on viewport.
    //  }

    if (obj) {
        obj.style.left = (x - prev_x) + 'px';
        obj.style.top = (y - prev_y) + 'px';
    }
}

function myDrop(e) {
    obj = false;
}

var opent = true;

function slideToggle() {
    let ul = document.getElementById('necoyoadWrapper');

    if (opent) {
        opent = false;
        ul.querySelectorAll('li:nth-child(n+2)').forEach((v, k) => {
            v.style.display = 'none';
        });
    } else {
        opent = true;
        ul.querySelectorAll('li').forEach((v, k) => {
            v.style.display = 'block';
        });
    }
}



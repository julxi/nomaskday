(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.eT.f9 === region.fJ.f9)
	{
		return 'on line ' + region.eT.f9;
	}
	return 'on lines ' + region.eT.f9 + ' through ' + region.fJ.f9;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.iG,
		impl.kz,
		impl.j1,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		aw: func(record.aw),
		eU: record.eU,
		ez: record.ez
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.aw;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.eU;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ez) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.iG,
		impl.kz,
		impl.j1,
		function(sendToApp, initialModel) {
			var view = impl.kB;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.iG,
		impl.kz,
		impl.j1,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.eJ && impl.eJ(sendToApp)
			var view = impl.kB;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.getElementById("elmIsolationContainer");
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('elm-node')(_List_Nil)(doc.bJ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.kn) && (_VirtualDom_doc.title = title = doc.kn);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.jh;
	var onUrlRequest = impl.ji;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		eJ: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.gx === next.gx
							&& curr.fV === next.fV
							&& curr.gu.a === next.gu.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		iG: function(flags)
		{
			return A3(impl.iG, flags, _Browser_getUrl(), key);
		},
		kB: impl.kB,
		kz: impl.kz,
		j1: impl.j1
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { ix: 'hidden', hN: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { ix: 'mozHidden', hN: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { ix: 'msHidden', hN: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { ix: 'webkitHidden', hN: 'webkitvisibilitychange' }
		: { ix: 'hidden', hN: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		gG: _Browser_getScene(),
		g4: {
			g9: _Browser_window.pageXOffset,
			ha: _Browser_window.pageYOffset,
			kD: _Browser_doc.documentElement.clientWidth,
			iv: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		kD: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		iv: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			gG: {
				kD: node.scrollWidth,
				iv: node.scrollHeight
			},
			g4: {
				g9: node.scrollLeft,
				ha: node.scrollTop,
				kD: node.clientWidth,
				iv: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			gG: _Browser_getScene(),
			g4: {
				g9: x,
				ha: y,
				kD: _Browser_doc.documentElement.clientWidth,
				iv: _Browser_doc.documentElement.clientHeight
			},
			fF: {
				g9: x + rect.left,
				ha: y + rect.top,
				kD: rect.width,
				iv: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.b$.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.b$.b, xhr)); });
		$elm$core$Maybe$isJust(request.cD) && _Http_track(router, xhr, request.cD.a);

		try {
			xhr.open(request.Z, request.cG, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.cG));
		}

		_Http_configureRequest(xhr, request);

		request.bJ.a && xhr.setRequestHeader('Content-Type', request.bJ.a);
		xhr.send(request.bJ.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.b1; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.cx.a || 0;
	xhr.responseType = request.b$.d;
	xhr.withCredentials = request.hq;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		cG: xhr.responseURL,
		jX: xhr.status,
		jY: xhr.statusText,
		b1: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			jP: event.loaded,
			aX: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			jz: event.loaded,
			aX: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.n) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.q),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.q);
		} else {
			var treeLen = builder.n * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.u) : builder.u;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.n);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.q) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.q);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{u: nodeList, n: (len / $elm$core$Array$branchFactor) | 0, q: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fR: fragment, fV: host, js: path, gu: port_, gx: protocol, eC: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Logic$Logic$InputAllowed = 0;
var $author$project$Logic$Page$Loading = 1;
var $author$project$User$User$NewUser = function (a) {
	return {$: 0, a: a};
};
var $author$project$Logic$Logic$ProcessLogin = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Logic$Logic$SetToday = function (a) {
	return {$: 2, a: a};
};
var $author$project$Logic$Logic$Till2022 = 0;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return function (s) {
		var _v0 = A5(_Parser_findSubString, str, s.jb, s.gE, s.ft, s.bx);
		var newOffset = _v0.a;
		var newRow = _v0.b;
		var newCol = _v0.c;
		var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.bx) : newOffset;
		return A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.jb, adjustedOffset) < 0,
			0,
			{ft: newCol, f: s.f, i: s.i, jb: adjustedOffset, gE: newRow, bx: s.bx});
	};
};
var $elm$parser$Parser$chompUntilEndOr = $elm$parser$Parser$Advanced$chompUntilEndOr;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $author$project$User$Guest$Guest = $elm$core$Basics$identity;
var $author$project$User$Guest$NoInvite = {$: 0};
var $author$project$Valid$Certified$Certified = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Valid$Certified$Unknown = {$: 0};
var $author$project$Valid$Certified$uncertified = function (object) {
	return A2($author$project$Valid$Certified$Certified, object, $author$project$Valid$Certified$Unknown);
};
var $author$project$User$Guest$init = {
	ij: $author$project$Valid$Certified$uncertified(''),
	iQ: $author$project$User$Guest$NoInvite,
	i6: $author$project$Valid$Certified$uncertified('')
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {aI: frag, aR: params, aE: unvisited, kA: value, a0: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.aE;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.kA);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.kA);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.js),
					$elm$url$Url$Parser$prepareQuery(url.eC),
					url.fR,
					$elm$core$Basics$identity)));
	});
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$query = function (_v0) {
	var queryParser = _v0;
	return function (_v1) {
		var visited = _v1.a0;
		var unvisited = _v1.aE;
		var params = _v1.aR;
		var frag = _v1.aI;
		var value = _v1.kA;
		return _List_fromArray(
			[
				A5(
				$elm$url$Url$Parser$State,
				visited,
				unvisited,
				params,
				frag,
				value(
					queryParser(params)))
			]);
	};
};
var $elm$url$Url$Parser$Internal$Parser = $elm$core$Basics$identity;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$url$Url$Parser$Query$custom = F2(
	function (key, func) {
		return function (dict) {
			return func(
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, key, dict)));
		};
	});
var $elm$url$Url$Parser$Query$string = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$Maybe$Just(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $author$project$User$Guest$PossiblyInvite = function (a) {
	return {$: 1, a: a};
};
var $author$project$User$Guest$updateInvite = F2(
	function (newInvite, _v0) {
		var details = _v0;
		if (newInvite === '') {
			return _Utils_update(
				details,
				{iQ: $author$project$User$Guest$NoInvite});
		} else {
			var str = newInvite;
			return _Utils_update(
				details,
				{
					iQ: $author$project$User$Guest$PossiblyInvite(str)
				});
		}
	});
var $author$project$User$Guest$initFromUrl = function (url) {
	var normalizedUrl = _Utils_update(
		url,
		{js: ''});
	var _v0 = A2(
		$elm$url$Url$Parser$parse,
		$elm$url$Url$Parser$query(
			$elm$url$Url$Parser$Query$string('invite')),
		normalizedUrl);
	if ((!_v0.$) && (!_v0.a.$)) {
		var invite = _v0.a.a;
		return A2($author$project$User$Guest$updateInvite, invite, $author$project$User$Guest$init);
	} else {
		return $author$project$User$Guest$init;
	}
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Logic$Utils$noCmd = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $elm$core$Basics$not = _Basics_not;
var $elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {ft: col, eB: problem, gE: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.gE, p.ft, p.eB);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{ft: 1, f: _List_Nil, i: 1, jb: 0, gE: 1, bx: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.gx;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fR,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.eC,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.gu,
					_Utils_ap(http, url.fV)),
				url.js)));
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {ft: col, h_: contextStack, eB: problem, gE: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.gE, s.ft, x, s.f));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.jb, s.gE, s.ft, s.bx);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{ft: newCol, f: s.f, i: s.i, jb: newOffset, gE: newRow, bx: s.bx});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $author$project$Logic$Logic$eatInvite = F2(
	function (url, key) {
		var inviteParser = A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$token('invite=')),
			$elm$parser$Parser$chompUntilEndOr('&'));
		var isInvite = function (string) {
			var _v3 = A2($elm$parser$Parser$run, inviteParser, string);
			if (!_v3.$) {
				return true;
			} else {
				return false;
			}
		};
		var _v0 = url.eC;
		if (!_v0.$) {
			var someQuery = _v0.a;
			var queryList = A2($elm$core$String$split, '&', someQuery);
			var newList = A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeR, isInvite, $elm$core$Basics$not),
				queryList);
			var _v1 = _Utils_eq(queryList, newList);
			if (_v1) {
				return $author$project$Logic$Utils$noCmd($author$project$User$Guest$init);
			} else {
				if (!newList.b) {
					return _Utils_Tuple2(
						$author$project$User$Guest$initFromUrl(url),
						A2(
							$elm$browser$Browser$Navigation$replaceUrl,
							key,
							$elm$url$Url$toString(
								_Utils_update(
									url,
									{eC: $elm$core$Maybe$Nothing}))));
				} else {
					return _Utils_Tuple2(
						$author$project$User$Guest$initFromUrl(url),
						A2(
							$elm$browser$Browser$Navigation$replaceUrl,
							key,
							$elm$url$Url$toString(
								_Utils_update(
									url,
									{
										eC: $elm$core$Maybe$Just(
											A2($elm$core$String$join, '&', newList))
									}))));
				}
			}
		} else {
			return $author$project$Logic$Utils$noCmd($author$project$User$Guest$init);
		}
	});
var $justinmimbs$date$Date$RD = $elm$core$Basics$identity;
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m) {
			case 0:
				return 0;
			case 1:
				return 31;
			case 2:
				return 59 + leapDays;
			case 3:
				return 90 + leapDays;
			case 4:
				return 120 + leapDays;
			case 5:
				return 151 + leapDays;
			case 6:
				return 181 + leapDays;
			case 7:
				return 212 + leapDays;
			case 8:
				return 243 + leapDays;
			case 9:
				return 273 + leapDays;
			case 10:
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return $elm$core$Basics$floor(a / b);
	});
var $justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100)) + A2($justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var $justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m) {
			case 0:
				return 31;
			case 1:
				return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
			$elm$core$Basics$clamp,
			1,
			A2($justinmimbs$date$Date$daysInMonth, y, m),
			d);
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $justinmimbs$date$Date$numberToMonth = function (mn) {
	var _v0 = A2($elm$core$Basics$max, 1, mn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		case 7:
			return 6;
		case 8:
			return 7;
		case 9:
			return 8;
		case 10:
			return 9;
		case 11:
			return 10;
		default:
			return 11;
	}
};
var $author$project$Field$Date$fromCalendarDate = F3(
	function (year, month, day) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			year,
			$justinmimbs$date$Date$numberToMonth(month),
			day);
	});
var $author$project$Logic$Logic$endOfBet = A3($author$project$Field$Date$fromCalendarDate, 2024, 12, 31);
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Field$Confidence$Confidence = $elm$core$Basics$identity;
var $author$project$Field$Confidence$fromInt = function (_int) {
	return (_int < 0) ? $elm$core$Maybe$Nothing : ((100 < _int) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(_int));
};
var $author$project$Field$Confidence$fromString = function (str) {
	return A2(
		$elm$core$Maybe$andThen,
		$author$project$Field$Confidence$fromInt,
		$elm$core$String$toInt(str));
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.jb, s.bx);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{ft: 1, f: s.f, i: s.i, jb: s.jb + 1, gE: s.gE + 1, bx: s.bx}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{ft: s.ft + 1, f: s.f, i: s.i, jb: newOffset, gE: s.gE, bx: s.bx}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $justinmimbs$date$Date$deadEndToString = function (_v0) {
	var problem = _v0.eB;
	if (problem.$ === 12) {
		var message = problem.a;
		return message;
	} else {
		return 'Expected a date in ISO 8601 format';
	}
};
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.bx),
			s.jb) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $justinmimbs$date$Date$MonthAndDay = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $justinmimbs$date$Date$OrdinalDay = function (a) {
	return {$: 2, a: a};
};
var $justinmimbs$date$Date$WeekAndWeekday = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$Advanced$commit = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, true, a, s);
	};
};
var $elm$parser$Parser$commit = $elm$parser$Parser$Advanced$commit;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.jb, s1.jb, s0.bx),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$mapChompedString = $elm$parser$Parser$Advanced$mapChompedString;
var $justinmimbs$date$Date$int1 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	$elm$parser$Parser$chompIf($elm$core$Char$isDigit));
var $justinmimbs$date$Date$int2 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(0),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $justinmimbs$date$Date$int3 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $justinmimbs$date$Date$dayOfYear = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$token('-')),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$backtrackable(
						A2(
							$elm$parser$Parser$andThen,
							$elm$parser$Parser$commit,
							A2($elm$parser$Parser$map, $justinmimbs$date$Date$OrdinalDay, $justinmimbs$date$Date$int3))),
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed($justinmimbs$date$Date$MonthAndDay),
							$justinmimbs$date$Date$int2),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$token('-')),
									$justinmimbs$date$Date$int2),
									$elm$parser$Parser$succeed(1)
								]))),
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($justinmimbs$date$Date$WeekAndWeekday),
								$elm$parser$Parser$token('W')),
							$justinmimbs$date$Date$int2),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$token('-')),
									$justinmimbs$date$Date$int1),
									$elm$parser$Parser$succeed(1)
								])))
					]))),
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$andThen,
				$elm$parser$Parser$commit,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed($justinmimbs$date$Date$MonthAndDay),
						$justinmimbs$date$Date$int2),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$justinmimbs$date$Date$int2,
								$elm$parser$Parser$succeed(1)
							]))))),
			A2($elm$parser$Parser$map, $justinmimbs$date$Date$OrdinalDay, $justinmimbs$date$Date$int3),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($justinmimbs$date$Date$WeekAndWeekday),
					$elm$parser$Parser$token('W')),
				$justinmimbs$date$Date$int2),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$justinmimbs$date$Date$int1,
						$elm$parser$Parser$succeed(1)
					]))),
			$elm$parser$Parser$succeed(
			$justinmimbs$date$Date$OrdinalDay(1))
		]));
var $justinmimbs$date$Date$isBetweenInt = F3(
	function (a, b, x) {
		return (_Utils_cmp(a, x) < 1) && (_Utils_cmp(x, b) < 1);
	});
var $justinmimbs$date$Date$fromCalendarParts = F3(
	function (y, mn, d) {
		return (A3($justinmimbs$date$Date$isBetweenInt, 1, 12, mn) && A3(
			$justinmimbs$date$Date$isBetweenInt,
			1,
			A2(
				$justinmimbs$date$Date$daysInMonth,
				y,
				$justinmimbs$date$Date$numberToMonth(mn)),
			d)) ? $elm$core$Result$Ok(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2(
				$justinmimbs$date$Date$daysBeforeMonth,
				y,
				$justinmimbs$date$Date$numberToMonth(mn))) + d) : $elm$core$Result$Err(
			'Invalid calendar date (' + ($elm$core$String$fromInt(y) + (', ' + ($elm$core$String$fromInt(mn) + (', ' + ($elm$core$String$fromInt(d) + ')'))))));
	});
var $justinmimbs$date$Date$fromOrdinalParts = F2(
	function (y, od) {
		return (A3($justinmimbs$date$Date$isBetweenInt, 1, 365, od) || ((od === 366) && $justinmimbs$date$Date$isLeapYear(y))) ? $elm$core$Result$Ok(
			$justinmimbs$date$Date$daysBeforeYear(y) + od) : $elm$core$Result$Err(
			'Invalid ordinal date (' + ($elm$core$String$fromInt(y) + (', ' + ($elm$core$String$fromInt(od) + ')'))));
	});
var $justinmimbs$date$Date$weekdayNumber = function (_v0) {
	var rd = _v0;
	var _v1 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v1) {
		return 7;
	} else {
		var n = _v1;
		return n;
	}
};
var $justinmimbs$date$Date$daysBeforeWeekYear = function (y) {
	var jan4 = $justinmimbs$date$Date$daysBeforeYear(y) + 4;
	return jan4 - $justinmimbs$date$Date$weekdayNumber(jan4);
};
var $justinmimbs$date$Date$firstOfYear = function (y) {
	return $justinmimbs$date$Date$daysBeforeYear(y) + 1;
};
var $justinmimbs$date$Date$is53WeekYear = function (y) {
	var wdnJan1 = $justinmimbs$date$Date$weekdayNumber(
		$justinmimbs$date$Date$firstOfYear(y));
	return (wdnJan1 === 4) || ((wdnJan1 === 3) && $justinmimbs$date$Date$isLeapYear(y));
};
var $justinmimbs$date$Date$fromWeekParts = F3(
	function (wy, wn, wdn) {
		return (A3($justinmimbs$date$Date$isBetweenInt, 1, 7, wdn) && (A3($justinmimbs$date$Date$isBetweenInt, 1, 52, wn) || ((wn === 53) && $justinmimbs$date$Date$is53WeekYear(wy)))) ? $elm$core$Result$Ok(
			($justinmimbs$date$Date$daysBeforeWeekYear(wy) + ((wn - 1) * 7)) + wdn) : $elm$core$Result$Err(
			'Invalid week date (' + ($elm$core$String$fromInt(wy) + (', ' + ($elm$core$String$fromInt(wn) + (', ' + ($elm$core$String$fromInt(wdn) + ')'))))));
	});
var $justinmimbs$date$Date$fromYearAndDayOfYear = function (_v0) {
	var y = _v0.a;
	var doy = _v0.b;
	switch (doy.$) {
		case 0:
			var mn = doy.a;
			var d = doy.b;
			return A3($justinmimbs$date$Date$fromCalendarParts, y, mn, d);
		case 1:
			var wn = doy.a;
			var wdn = doy.b;
			return A3($justinmimbs$date$Date$fromWeekParts, y, wn, wdn);
		default:
			var od = doy.a;
			return A2($justinmimbs$date$Date$fromOrdinalParts, y, od);
	}
};
var $justinmimbs$date$Date$int4 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(0),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									$elm$parser$Parser$chompIf(
									function (c) {
										return c === '-';
									}),
									$elm$parser$Parser$succeed(0)
								]))),
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
				$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $justinmimbs$date$Date$resultToParser = function (result) {
	if (!result.$) {
		var x = result.a;
		return $elm$parser$Parser$succeed(x);
	} else {
		var message = result.a;
		return $elm$parser$Parser$problem(message);
	}
};
var $justinmimbs$date$Date$parser = A2(
	$elm$parser$Parser$andThen,
	A2($elm$core$Basics$composeR, $justinmimbs$date$Date$fromYearAndDayOfYear, $justinmimbs$date$Date$resultToParser),
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			$justinmimbs$date$Date$int4),
		$justinmimbs$date$Date$dayOfYear));
var $justinmimbs$date$Date$fromIsoString = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run(
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			A2(
				$elm$parser$Parser$ignorer,
				$justinmimbs$date$Date$parser,
				A2(
					$elm$parser$Parser$andThen,
					$justinmimbs$date$Date$resultToParser,
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2($elm$parser$Parser$map, $elm$core$Result$Ok, $elm$parser$Parser$end),
								A2(
								$elm$parser$Parser$map,
								$elm$core$Basics$always(
									$elm$core$Result$Err('Expected a date only, not a date and time')),
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$eq('T'))),
								$elm$parser$Parser$succeed(
								$elm$core$Result$Err('Expected a date only'))
							])))))),
	$elm$core$Result$mapError(
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map($justinmimbs$date$Date$deadEndToString),
				$elm$core$Maybe$withDefault('')))));
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Field$Date$fromString = A2($elm$core$Basics$composeL, $elm$core$Result$toMaybe, $justinmimbs$date$Date$fromIsoString);
var $author$project$User$Passcode$Passcode = $elm$core$Basics$identity;
var $author$project$User$Passcode$fromUrl = function (url) {
	var normalizedUrl = _Utils_update(
		url,
		{js: ''});
	var _v0 = A2(
		$elm$url$Url$Parser$parse,
		$elm$url$Url$Parser$query(
			$elm$url$Url$Parser$Query$string('p')),
		normalizedUrl);
	if ((!_v0.$) && (!_v0.a.$)) {
		var passcode = _v0.a.a;
		return $elm$core$Maybe$Just(passcode);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AccuracyPlot$AccuracyPlot$init = function () {
	var initDateRight = A3($justinmimbs$date$Date$fromCalendarDate, 2021, 11, 31);
	var initDateLeft = A3($justinmimbs$date$Date$fromCalendarDate, 2021, 0, 1);
	return {
		dJ: $elm$core$Maybe$Nothing,
		b_: 0,
		bf: $elm$core$Maybe$Nothing,
		ab: {bL: 35, bk: 60, bu: 25, cB: 30},
		ax: {bL: 10, bk: 10, bu: 10, cB: 10},
		an: 0,
		az: 0,
		dr: 0,
		cm: 0
	};
}();
var $author$project$Logic$InputCounter$init = {cQ: 0, dK: 0, ij: 0, iQ: 0, i6: 0};
var $author$project$Valid$AutoCheck$AutoChecking = $elm$core$Basics$identity;
var $author$project$Valid$AutoCheck$initFromString = F3(
	function (toString, fromString, str) {
		var translator = {c3: fromString, dv: toString};
		return {
			aH: fromString(str),
			aM: false,
			co: str,
			dw: translator
		};
	});
var $author$project$DatePicker$DatePicker$Model = $elm$core$Basics$identity;
var $author$project$DatePicker$DatePicker$initWithToday = function (today) {
	return {bB: today, Q: today};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$User$Passcode$encode = function (_v0) {
	var token = _v0;
	return _Utils_Tuple2(
		'passcode',
		$elm$json$Json$Encode$string(token));
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.jX));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Api$Api$ApiError = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Api$Api$Failure = function (a) {
	return {$: 1, a: a};
};
var $author$project$Api$Api$ResponseError = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Api$Api$Success = function (a) {
	return {$: 0, a: a};
};
var $author$project$User$Member$Member = F4(
	function (passcode, name, bet, isWagerPayed) {
		return {dC: bet, iU: isWagerPayed, i6: name, jr: passcode};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$User$MemberBet$MemberBet = F2(
	function (confidence, date) {
		return {cQ: confidence, dK: date};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Field$Confidence$decode = function () {
	var constructor = function (_int) {
		return (_int < 0) ? 0 : ((_int <= 100) ? _int : 100);
	};
	return A2(
		$elm$json$Json$Decode$map,
		constructor,
		A2($elm$json$Json$Decode$field, 'spread', $elm$json$Json$Decode$int));
}();
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Field$Date$decode = function () {
	var constructor = F3(
		function (year, month, day) {
			return A3(
				$justinmimbs$date$Date$fromCalendarDate,
				year,
				$justinmimbs$date$Date$numberToMonth(month),
				day);
		});
	return A2(
		$elm$json$Json$Decode$field,
		'date',
		A4(
			$elm$json$Json$Decode$map3,
			constructor,
			A2($elm$json$Json$Decode$field, 'year', $elm$json$Json$Decode$int),
			A2($elm$json$Json$Decode$field, 'month', $elm$json$Json$Decode$int),
			A2($elm$json$Json$Decode$field, 'day', $elm$json$Json$Decode$int)));
}();
var $author$project$User$MemberBet$decode = A2(
	$elm$json$Json$Decode$field,
	'bet',
	A3($elm$json$Json$Decode$map2, $author$project$User$MemberBet$MemberBet, $author$project$Field$Confidence$decode, $author$project$Field$Date$decode));
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$User$Passcode$decode = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Basics$identity,
	A2($elm$json$Json$Decode$field, 'passcode', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$User$Member$decode = function () {
	var constructor = $author$project$User$Member$Member;
	return A2(
		$elm$json$Json$Decode$field,
		'member',
		A5(
			$elm$json$Json$Decode$map4,
			constructor,
			$author$project$User$Passcode$decode,
			A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
			$author$project$User$MemberBet$decode,
			A2($elm$json$Json$Decode$field, 'isWagerPayed', $elm$json$Json$Decode$bool)));
}();
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $author$project$Api$Decoder$decodeErrors = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Array$toList,
	A2(
		$elm$json$Json$Decode$field,
		'errors',
		$elm$json$Json$Decode$array($elm$json$Json$Decode$string)));
var $author$project$Api$Decoder$decodeIssues = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Array$toList,
	A2(
		$elm$json$Json$Decode$field,
		'issues',
		$elm$json$Json$Decode$array($elm$json$Json$Decode$string)));
var $author$project$Api$Decoder$decodeStatus = A2($elm$json$Json$Decode$field, 'status', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Api$Api$memberResponseDecoder = function (method) {
	var toResult = F4(
		function (status, maybeMember, issues, errors) {
			switch (status) {
				case 'ok':
					if (!maybeMember.$) {
						var member = maybeMember.a;
						return $author$project$Api$Api$Success(member);
					} else {
						return A2(
							$author$project$Api$Api$ResponseError,
							method,
							_List_fromArray(
								['Problem with Json: status ' + (status + ' but no member-attribute')]));
					}
				case 'nok':
					return $author$project$Api$Api$Failure(issues);
				case 'error':
					return A2($author$project$Api$Api$ApiError, method, errors);
				default:
					return A2(
						$author$project$Api$Api$ResponseError,
						method,
						_List_fromArray(
							['I got an unexpected response from the server. The procedure ' + (method + (' did sent the unknown status ' + (status + '.')))]));
			}
		});
	return A5(
		$elm$json$Json$Decode$map4,
		toResult,
		$author$project$Api$Decoder$decodeStatus,
		$elm$json$Json$Decode$maybe($author$project$User$Member$decode),
		$author$project$Api$Decoder$decodeIssues,
		$author$project$Api$Decoder$decodeErrors);
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {gA: reqs, gS: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.cD;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.gA));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.gS)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					hq: r.hq,
					bJ: r.bJ,
					b$: A2(_Http_mapExpect, func, r.b$),
					b1: r.b1,
					Z: r.Z,
					cx: r.cx,
					cD: r.cD,
					cG: r.cG
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{hq: false, bJ: r.bJ, b$: r.b$, b1: r.b1, Z: r.Z, cx: r.cx, cD: r.cD, cG: r.cG}));
};
var $author$project$Api$Api$login = F2(
	function (toMsg, passcode) {
		var method = 'LOGIN';
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					$author$project$User$Passcode$encode(passcode)
				]));
		return $elm$http$Http$request(
			{
				bJ: $elm$http$Http$jsonBody(body),
				b$: A2(
					$elm$http$Http$expectJson,
					toMsg,
					$author$project$Api$Api$memberResponseDecoder(method)),
				b1: _List_Nil,
				Z: method,
				cx: $elm$core$Maybe$Just(5000),
				cD: $elm$core$Maybe$Nothing,
				cG: './php/api.php'
			});
	});
var $author$project$Logic$Page$Home = 2;
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $author$project$Field$Field$Email = 1;
var $author$project$Field$Field$Guest = function (a) {
	return {$: 0, a: a};
};
var $author$project$Field$Field$Name = 0;
var $author$project$Logic$Utils$addCmd = F2(
	function (msgCmd, model) {
		return _Utils_Tuple2(model, msgCmd);
	});
var $author$project$Logic$Logic$NoOp = {$: 0};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Logic$Logic$focusInviteForm = A2(
	$elm$core$Task$attempt,
	function (_v0) {
		return $author$project$Logic$Logic$NoOp;
	},
	$elm$browser$Browser$Dom$focus('invite-form'));
var $author$project$Logic$Logic$focusNameBox = A2(
	$elm$core$Task$attempt,
	function (_v0) {
		return $author$project$Logic$Logic$NoOp;
	},
	$elm$browser$Browser$Dom$focus('name-box'));
var $author$project$Logic$Logic$removeHints = F2(
	function (field, model) {
		var noHints = {bb: 0, cH: false};
		switch (field.$) {
			case 0:
				var guestField = field.a;
				if (!guestField) {
					return _Utils_update(
						model,
						{b3: noHints});
				} else {
					return _Utils_update(
						model,
						{b2: noHints});
				}
			case 2:
				return model;
			default:
				return model;
		}
	});
var $author$project$Logic$Logic$setPage = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{dj: x});
	});
var $author$project$Logic$Logic$UpdatePlotSize = function (a) {
	return {$: 27, a: a};
};
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$Logic$Logic$updatePlotSize = function (domId) {
	return A2(
		$elm$core$Task$attempt,
		$author$project$Logic$Logic$UpdatePlotSize,
		$elm$browser$Browser$Dom$getElement(domId));
};
var $author$project$Logic$Logic$openPage = F2(
	function (page, model) {
		switch (page) {
			case 7:
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$focusNameBox,
					A2(
						$author$project$Logic$Logic$setPage,
						page,
						A2(
							$author$project$Logic$Logic$removeHints,
							$author$project$Field$Field$Guest(1),
							A2(
								$author$project$Logic$Logic$removeHints,
								$author$project$Field$Field$Guest(0),
								model))));
			case 8:
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$updatePlotSize(model.dl),
					A2($author$project$Logic$Logic$setPage, page, model));
			case 6:
				return $author$project$Logic$Utils$noCmd(
					A2(
						$author$project$Logic$Logic$setPage,
						page,
						_Utils_update(
							model,
							{O: false})));
			case 4:
				return $author$project$Logic$Utils$noCmd(
					A2(
						$author$project$Logic$Logic$setPage,
						page,
						_Utils_update(
							model,
							{O: false})));
			case 5:
				return $author$project$Logic$Utils$noCmd(
					A2(
						$author$project$Logic$Logic$setPage,
						page,
						_Utils_update(
							model,
							{O: false})));
			case 11:
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$focusInviteForm,
					A2($author$project$Logic$Logic$setPage, page, model));
			default:
				return $author$project$Logic$Utils$noCmd(
					A2($author$project$Logic$Logic$setPage, page, model));
		}
	});
var $author$project$Logic$Logic$makeSureItsHome = function (model) {
	var _v0 = A2($author$project$Logic$Logic$openPage, 2, model);
	var newModel = _v0.a;
	var pageCmd = _v0.b;
	var urlChange = function () {
		var _v1 = model.cG.js;
		if (_v1 === '/') {
			return pageCmd;
		} else {
			return $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2(
						$elm$browser$Browser$Navigation$replaceUrl,
						model.X,
						A2(
							$elm$url$Url$Builder$absolute,
							_List_fromArray(
								['..']),
							_List_Nil)),
						pageCmd
					]));
		}
	}();
	return _Utils_Tuple2(newModel, urlChange);
};
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $justinmimbs$date$Date$toRataDie = function (_v0) {
	var rd = _v0;
	return rd;
};
var $author$project$AccuracyPlot$AccuracyPlot$setStartAndEnd = F3(
	function (startOfBet, endOfBet, model) {
		return _Utils_update(
			model,
			{
				b_: $justinmimbs$date$Date$toRataDie(endOfBet),
				cm: $justinmimbs$date$Date$toRataDie(startOfBet)
			});
	});
var $author$project$Logic$Logic$startOfBet = A3($author$project$Field$Date$fromCalendarDate, 2022, 1, 1);
var $author$project$Logic$Page$NotFound = 0;
var $author$project$Logic$Page$AccuracyFunction = 6;
var $author$project$Logic$Page$Bet = 8;
var $author$project$Logic$Page$CheckInvitation = 11;
var $author$project$Logic$Page$ConfirmationSubmitGuest = 9;
var $author$project$Logic$Page$ContactInfo = 7;
var $author$project$Logic$Page$HowToBet = 4;
var $author$project$Logic$Page$RemarksAndDetailedExplanations = 5;
var $author$project$Logic$Page$WhatIsNoMaskDay = 3;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.a0;
		var unvisited = _v0.aE;
		var params = _v0.aR;
		var frag = _v0.aI;
		var value = _v0.kA;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.a0;
			var unvisited = _v1.aE;
			var params = _v1.aR;
			var frag = _v1.aI;
			var value = _v1.kA;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.a0;
		var unvisited = _v0.aE;
		var params = _v0.aR;
		var frag = _v0.aI;
		var value = _v0.kA;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $author$project$Logic$Page$toPath = function (page) {
	var noPath = '404';
	switch (page) {
		case 0:
			return noPath;
		case 1:
			return noPath;
		case 2:
			return noPath;
		case 3:
			return 'nmd';
		case 4:
			return 'how-to-bet';
		case 5:
			return 'remarks';
		case 6:
			return 'accuracy';
		case 7:
			return 'contact';
		case 8:
			return 'bet';
		case 9:
			return 'success';
		case 10:
			return noPath;
		default:
			return 'invitation';
	}
};
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Logic$Router$route = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, 2, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			3,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(3))),
			A2(
			$elm$url$Url$Parser$map,
			4,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(4))),
			A2(
			$elm$url$Url$Parser$map,
			6,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(6))),
			A2(
			$elm$url$Url$Parser$map,
			7,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(7))),
			A2(
			$elm$url$Url$Parser$map,
			8,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(8))),
			A2(
			$elm$url$Url$Parser$map,
			9,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(9))),
			A2(
			$elm$url$Url$Parser$map,
			11,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(11))),
			A2(
			$elm$url$Url$Parser$map,
			5,
			$elm$url$Url$Parser$s(
				$author$project$Logic$Page$toPath(5)))
		]));
var $author$project$Logic$Router$toPage = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2($elm$url$Url$Parser$parse, $author$project$Logic$Router$route, url));
};
var $author$project$Field$Confidence$toInt = function (_v0) {
	var _int = _v0;
	return _int;
};
var $author$project$Field$Confidence$toString = A2($elm$core$Basics$composeR, $author$project$Field$Confidence$toInt, $elm$core$String$fromInt);
var $justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
			var mn = $justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {fA: d, ge: m, hc: y};
			}
		}
	});
var $justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2($justinmimbs$date$Date$floorDiv, a, b),
			A2($elm$core$Basics$modBy, b, a));
	});
var $justinmimbs$date$Date$year = function (_v0) {
	var rd = _v0;
	var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _v1.a;
	var r400 = _v1.b;
	var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _v2.a;
	var r100 = _v2.b;
	var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _v3.a;
	var r4 = _v3.b;
	var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _v4.a;
	var r1 = _v4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var $justinmimbs$date$Date$toOrdinalDate = function (_v0) {
	var rd = _v0;
	var y = $justinmimbs$date$Date$year(rd);
	return {
		eu: rd - $justinmimbs$date$Date$daysBeforeYear(y),
		hc: y
	};
};
var $justinmimbs$date$Date$toCalendarDate = function (_v0) {
	var rd = _v0;
	var date = $justinmimbs$date$Date$toOrdinalDate(rd);
	return A3($justinmimbs$date$Date$toCalendarDateHelp, date.hc, 0, date.eu);
};
var $justinmimbs$date$Date$day = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.fA;
	});
var $justinmimbs$date$Date$month = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.ge;
	});
var $justinmimbs$date$Date$monthNumber = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToNumber);
var $justinmimbs$date$Date$ordinalDay = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toOrdinalDate,
	function ($) {
		return $.eu;
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $justinmimbs$date$Date$padSignedInt = F2(
	function (length, _int) {
		return _Utils_ap(
			(_int < 0) ? '-' : '',
			A3(
				$elm$core$String$padLeft,
				length,
				'0',
				$elm$core$String$fromInt(
					$elm$core$Basics$abs(_int))));
	});
var $justinmimbs$date$Date$monthToQuarter = function (m) {
	return (($justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $justinmimbs$date$Date$numberToWeekday = function (wdn) {
	var _v0 = A2($elm$core$Basics$max, 1, wdn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		default:
			return 6;
	}
};
var $justinmimbs$date$Date$toWeekDate = function (_v0) {
	var rd = _v0;
	var wdn = $justinmimbs$date$Date$weekdayNumber(rd);
	var wy = $justinmimbs$date$Date$year(rd + (4 - wdn));
	var week1Day1 = $justinmimbs$date$Date$daysBeforeWeekYear(wy) + 1;
	return {
		g5: 1 + (((rd - week1Day1) / 7) | 0),
		g6: wy,
		kC: $justinmimbs$date$Date$numberToWeekday(wdn)
	};
};
var $justinmimbs$date$Date$weekNumber = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.g5;
	});
var $justinmimbs$date$Date$weekYear = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.g6;
	});
var $justinmimbs$date$Date$weekday = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$weekdayNumber, $justinmimbs$date$Date$numberToWeekday);
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $justinmimbs$date$Date$ordinalSuffix = function (n) {
	var nn = A2($elm$core$Basics$modBy, 100, n);
	var _v0 = A2(
		$elm$core$Basics$min,
		(nn < 20) ? nn : A2($elm$core$Basics$modBy, 10, nn),
		4);
	switch (_v0) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
};
var $justinmimbs$date$Date$withOrdinalSuffix = function (n) {
	return _Utils_ap(
		$elm$core$String$fromInt(n),
		$justinmimbs$date$Date$ordinalSuffix(n));
};
var $justinmimbs$date$Date$formatField = F4(
	function (language, _char, length, date) {
		switch (_char) {
			case 'y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$year(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$year(date));
				}
			case 'Y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekYear(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$weekYear(date));
				}
			case 'Q':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 3:
						return 'Q' + $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 4:
						return $justinmimbs$date$Date$withOrdinalSuffix(
							$justinmimbs$date$Date$quarter(date));
					case 5:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					default:
						return '';
				}
			case 'M':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$monthNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$monthNumber(date)));
					case 3:
						return language.db(
							$justinmimbs$date$Date$month(date));
					case 4:
						return language.eo(
							$justinmimbs$date$Date$month(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.db(
								$justinmimbs$date$Date$month(date)));
					default:
						return '';
				}
			case 'w':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekNumber(date)));
					default:
						return '';
				}
			case 'd':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$day(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$day(date)));
					case 3:
						return language.dN(
							$justinmimbs$date$Date$day(date));
					default:
						return '';
				}
			case 'D':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$ordinalDay(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					case 3:
						return A3(
							$elm$core$String$padLeft,
							3,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					default:
						return '';
				}
			case 'E':
				switch (length) {
					case 1:
						return language.a1(
							$justinmimbs$date$Date$weekday(date));
					case 2:
						return language.a1(
							$justinmimbs$date$Date$weekday(date));
					case 3:
						return language.a1(
							$justinmimbs$date$Date$weekday(date));
					case 4:
						return language.e6(
							$justinmimbs$date$Date$weekday(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.a1(
								$justinmimbs$date$Date$weekday(date)));
					case 6:
						return A2(
							$elm$core$String$left,
							2,
							language.a1(
								$justinmimbs$date$Date$weekday(date)));
					default:
						return '';
				}
			case 'e':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					default:
						return A4($justinmimbs$date$Date$formatField, language, 'E', length, date);
				}
			default:
				return '';
		}
	});
var $justinmimbs$date$Date$formatWithTokens = F3(
	function (language, tokens, date) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (token, formatted) {
					if (!token.$) {
						var _char = token.a;
						var length = token.b;
						return _Utils_ap(
							A4($justinmimbs$date$Date$formatField, language, _char, length, date),
							formatted);
					} else {
						var str = token.a;
						return _Utils_ap(str, formatted);
					}
				}),
			'',
			tokens);
	});
var $justinmimbs$date$Pattern$Literal = function (a) {
	return {$: 1, a: a};
};
var $justinmimbs$date$Pattern$escapedQuote = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$justinmimbs$date$Pattern$Literal('\'')),
	$elm$parser$Parser$token('\'\''));
var $justinmimbs$date$Pattern$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.bx);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.jb, offset) < 0,
					0,
					{ft: col, f: s0.f, i: s0.i, jb: offset, gE: row, bx: s0.bx});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.jb, s.gE, s.ft, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.jb, s);
};
var $elm$parser$Parser$getOffset = $elm$parser$Parser$Advanced$getOffset;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $justinmimbs$date$Pattern$fieldRepeats = function (str) {
	var _v0 = $elm$core$String$toList(str);
	if (_v0.b && (!_v0.b.b)) {
		var _char = _v0.a;
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (x, y) {
							return A2($justinmimbs$date$Pattern$Field, _char, 1 + (y - x));
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getOffset,
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq(_char)))),
			$elm$parser$Parser$getOffset);
	} else {
		return $elm$parser$Parser$problem('expected exactly one char');
	}
};
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $justinmimbs$date$Pattern$field = A2(
	$elm$parser$Parser$andThen,
	$justinmimbs$date$Pattern$fieldRepeats,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf($elm$core$Char$isAlpha)));
var $justinmimbs$date$Pattern$finalize = A2(
	$elm$core$List$foldl,
	F2(
		function (token, tokens) {
			var _v0 = _Utils_Tuple2(token, tokens);
			if (((_v0.a.$ === 1) && _v0.b.b) && (_v0.b.a.$ === 1)) {
				var x = _v0.a.a;
				var _v1 = _v0.b;
				var y = _v1.a.a;
				var rest = _v1.b;
				return A2(
					$elm$core$List$cons,
					$justinmimbs$date$Pattern$Literal(
						_Utils_ap(x, y)),
					rest);
			} else {
				return A2($elm$core$List$cons, token, tokens);
			}
		}),
	_List_Nil);
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $justinmimbs$date$Pattern$isLiteralChar = function (_char) {
	return (_char !== '\'') && (!$elm$core$Char$isAlpha(_char));
};
var $justinmimbs$date$Pattern$literal = A2(
	$elm$parser$Parser$map,
	$justinmimbs$date$Pattern$Literal,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($justinmimbs$date$Pattern$isLiteralChar)),
			$elm$parser$Parser$chompWhile($justinmimbs$date$Pattern$isLiteralChar))));
var $justinmimbs$date$Pattern$quotedHelp = function (result) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (str) {
					return $justinmimbs$date$Pattern$quotedHelp(
						_Utils_ap(result, str));
				},
				$elm$parser$Parser$getChompedString(
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(0),
							$elm$parser$Parser$chompIf(
								$elm$core$Basics$neq('\''))),
						$elm$parser$Parser$chompWhile(
							$elm$core$Basics$neq('\''))))),
				A2(
				$elm$parser$Parser$andThen,
				function (_v0) {
					return $justinmimbs$date$Pattern$quotedHelp(result + '\'');
				},
				$elm$parser$Parser$token('\'\'')),
				$elm$parser$Parser$succeed(result)
			]));
};
var $justinmimbs$date$Pattern$quoted = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($justinmimbs$date$Pattern$Literal),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('\''))),
	A2(
		$elm$parser$Parser$ignorer,
		$justinmimbs$date$Pattern$quotedHelp(''),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq('\'')),
					$elm$parser$Parser$end
				]))));
var $justinmimbs$date$Pattern$patternHelp = function (tokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (token) {
					return $justinmimbs$date$Pattern$patternHelp(
						A2($elm$core$List$cons, token, tokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[$justinmimbs$date$Pattern$field, $justinmimbs$date$Pattern$literal, $justinmimbs$date$Pattern$escapedQuote, $justinmimbs$date$Pattern$quoted]))),
				$elm$parser$Parser$lazy(
				function (_v0) {
					return $elm$parser$Parser$succeed(
						$justinmimbs$date$Pattern$finalize(tokens));
				})
			]));
};
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $justinmimbs$date$Pattern$fromString = function (str) {
	return A2(
		$elm$core$Result$withDefault,
		_List_fromArray(
			[
				$justinmimbs$date$Pattern$Literal(str)
			]),
		A2(
			$elm$parser$Parser$run,
			$justinmimbs$date$Pattern$patternHelp(_List_Nil),
			str));
};
var $justinmimbs$date$Date$formatWithLanguage = F2(
	function (language, pattern) {
		var tokens = $elm$core$List$reverse(
			$justinmimbs$date$Pattern$fromString(pattern));
		return A2($justinmimbs$date$Date$formatWithTokens, language, tokens);
	});
var $justinmimbs$date$Date$monthToName = function (m) {
	switch (m) {
		case 0:
			return 'January';
		case 1:
			return 'February';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		default:
			return 'December';
	}
};
var $justinmimbs$date$Date$weekdayToName = function (wd) {
	switch (wd) {
		case 0:
			return 'Monday';
		case 1:
			return 'Tuesday';
		case 2:
			return 'Wednesday';
		case 3:
			return 'Thursday';
		case 4:
			return 'Friday';
		case 5:
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $justinmimbs$date$Date$language_en = {
	dN: $justinmimbs$date$Date$withOrdinalSuffix,
	eo: $justinmimbs$date$Date$monthToName,
	db: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$monthToName,
		$elm$core$String$left(3)),
	e6: $justinmimbs$date$Date$weekdayToName,
	a1: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$weekdayToName,
		$elm$core$String$left(3))
};
var $justinmimbs$date$Date$format = function (pattern) {
	return A2($justinmimbs$date$Date$formatWithLanguage, $justinmimbs$date$Date$language_en, pattern);
};
var $justinmimbs$date$Date$toIsoString = $justinmimbs$date$Date$format('yyyy-MM-dd');
var $author$project$Field$Date$toString = $justinmimbs$date$Date$toIsoString;
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.eT, posixMinutes) < 0) {
					return posixMinutes + era.jb;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		fA: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		ge: month,
		hc: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).fA;
	});
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).ge;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).hc;
	});
var $justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			A2($elm$time$Time$toYear, zone, posix),
			A2($elm$time$Time$toMonth, zone, posix),
			A2($elm$time$Time$toDay, zone, posix));
	});
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$here = _Time_here(0);
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $justinmimbs$date$Date$today = A3($elm$core$Task$map2, $justinmimbs$date$Date$fromPosix, $elm$time$Time$here, $elm$time$Time$now);
var $author$project$Logic$Logic$init = F3(
	function (_v0, url, key) {
		var targetPage = $author$project$Logic$Router$toPage(url);
		var maybePasscode = $author$project$User$Passcode$fromUrl(url);
		var loginCmd = function () {
			if (!maybePasscode.$) {
				var passcode = maybePasscode.a;
				return _List_fromArray(
					[
						A2(
						$author$project$Api$Api$login,
						$author$project$Logic$Logic$ProcessLogin(targetPage),
						passcode)
					]);
			} else {
				return _List_Nil;
			}
		}();
		var _v1 = A2($author$project$Logic$Logic$eatInvite, url, key);
		var guest = _v1.a;
		var removeInvite = _v1.b;
		var model = {
			cQ: A3($author$project$Valid$AutoCheck$initFromString, $author$project$Field$Confidence$toString, $author$project$Field$Confidence$fromString, ''),
			dK: A3($author$project$Valid$AutoCheck$initFromString, $author$project$Field$Date$toString, $author$project$Field$Date$fromString, ''),
			cY: $author$project$DatePicker$DatePicker$initWithToday($author$project$Logic$Logic$startOfBet),
			b2: {bb: 0, cH: false},
			b3: {bb: 0, cH: false},
			ak: 0,
			al: $author$project$Logic$InputCounter$init,
			X: key,
			aO: $elm$core$Maybe$Nothing,
			ca: $elm$core$Maybe$Just(0),
			O: false,
			dj: 1,
			bo: A3($author$project$AccuracyPlot$AccuracyPlot$setStartAndEnd, $author$project$Logic$Logic$startOfBet, $author$project$Logic$Logic$endOfBet, $author$project$AccuracyPlot$AccuracyPlot$init),
			dl: 'accuracyPlot',
			dm: 0,
			ey: $elm$time$Time$millisToPosix(0),
			eB: $elm$core$Maybe$Nothing,
			ck: $elm$core$Dict$empty,
			cl: false,
			eL: true,
			eW: $elm$core$Maybe$Nothing,
			gV: 0,
			gW: $elm$core$Maybe$Nothing,
			gX: $elm$core$Maybe$Nothing,
			gY: '',
			bB: $elm$core$Maybe$Nothing,
			cG: url,
			p: $author$project$User$User$NewUser(guest)
		};
		var initCmds = _List_fromArray(
			[
				A2($elm$core$Task$perform, $author$project$Logic$Logic$SetToday, $justinmimbs$date$Date$today),
				$author$project$Logic$Logic$updatePlotSize('accuracyPlot'),
				removeInvite
			]);
		if (!maybePasscode.$) {
			var passcode = maybePasscode.a;
			return _Utils_Tuple2(
				A2($author$project$Logic$Logic$setPage, 1, model),
				$elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$cons,
						A2(
							$author$project$Api$Api$login,
							$author$project$Logic$Logic$ProcessLogin(targetPage),
							passcode),
						_Utils_ap(loginCmd, initCmds))));
		} else {
			var _v3 = $author$project$Logic$Logic$makeSureItsHome(model);
			var newModel = _v3.a;
			var homeCmd = _v3.b;
			return _Utils_Tuple2(
				newModel,
				$elm$core$Platform$Cmd$batch(
					_Utils_ap(
						initCmds,
						_List_fromArray(
							[homeCmd]))));
		}
	});
var $author$project$Logic$Logic$ProcessUrlChange = function (a) {
	return {$: 4, a: a};
};
var $author$project$Logic$Logic$onUrlChange = $author$project$Logic$Logic$ProcessUrlChange;
var $author$project$Logic$Logic$ProcessUrlRequest = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$Logic$onUrlRequest = $author$project$Logic$Logic$ProcessUrlRequest;
var $author$project$Logic$Logic$RequestPlotSizeUpdate = {$: 26};
var $author$project$Logic$Logic$TestRenderMath = {$: 31};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {et: oldTime, gB: request, gS: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.gB;
		var oldTime = _v0.et;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.gS;
		var oldTime = _v0.et;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $elm$browser$Browser$Events$Window = 1;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {gt: pids, gS: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {fL: event, X: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.gt,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.X;
		var event = _v0.fL;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.gS);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Logic$Logic$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize(
				F2(
					function (_v0, _v1) {
						return $author$project$Logic$Logic$RequestPlotSizeUpdate;
					})),
				function () {
				var _v2 = !model.O;
				if (_v2) {
					return $elm$browser$Browser$Events$onAnimationFrame(
						function (_v3) {
							return $author$project$Logic$Logic$TestRenderMath;
						});
				} else {
					return $elm$core$Platform$Sub$none;
				}
			}()
			]));
};
var $author$project$Logic$Logic$Check = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Logic$Logic$ErrorInLogin = function (a) {
	return {$: 1, a: a};
};
var $author$project$Logic$Logic$HttpError = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$Logic$InputNotAllowed = 1;
var $author$project$Logic$Logic$PlotMsg = function (a) {
	return {$: 25, a: a};
};
var $author$project$Logic$Logic$ProcessSubmit = function (a) {
	return {$: 17, a: a};
};
var $author$project$Logic$Logic$SuccessForNewUser = 0;
var $author$project$Logic$Logic$Unspecified = function (a) {
	return {$: 0, a: a};
};
var $author$project$Logic$Logic$ProcessCertified = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Valid$Certified$Bad = function (a) {
	return {$: 3, a: a};
};
var $author$project$Valid$Certified$Error = function (a) {
	return {$: 4, a: a};
};
var $author$project$Valid$Certified$Good = {$: 2};
var $author$project$Valid$Certified$decoder = function (obj) {
	var transform = F3(
		function (status, issues, errors) {
			switch (status) {
				case 'ok':
					return A2($author$project$Valid$Certified$Certified, obj, $author$project$Valid$Certified$Good);
				case 'nok':
					return A2(
						$author$project$Valid$Certified$Certified,
						obj,
						$author$project$Valid$Certified$Bad(issues));
				case 'error':
					return A2(
						$author$project$Valid$Certified$Certified,
						obj,
						$author$project$Valid$Certified$Error(errors));
				default:
					var errorMessage = A2(
						$elm$core$String$join,
						'',
						_List_fromArray(
							['Unexpected status \"', status, '\"']));
					return A2(
						$author$project$Valid$Certified$Certified,
						obj,
						$author$project$Valid$Certified$Error(
							A2($elm$core$List$cons, errorMessage, errors)));
			}
		});
	return A4($elm$json$Json$Decode$map3, transform, $author$project$Api$Decoder$decodeStatus, $author$project$Api$Decoder$decodeIssues, $author$project$Api$Decoder$decodeErrors);
};
var $author$project$Field$Email$encode = function (email) {
	return _Utils_Tuple2(
		'email',
		$elm$json$Json$Encode$string(email));
};
var $author$project$Api$Api$expectJsonExtended = F3(
	function (info, toMsg, decoder) {
		var extend = function (error) {
			return {bK: info.bK, fK: error, Z: info.Z};
		};
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			function (response) {
				switch (response.$) {
					case 0:
						var url = response.a;
						return $elm$core$Result$Err(
							extend(
								$elm$http$Http$BadUrl(url)));
					case 1:
						return $elm$core$Result$Err(
							extend($elm$http$Http$Timeout));
					case 2:
						return $elm$core$Result$Err(
							extend($elm$http$Http$NetworkError));
					case 3:
						var metadata = response.a;
						var body = response.b;
						return $elm$core$Result$Err(
							extend(
								$elm$http$Http$BadStatus(metadata.jX)));
					default:
						var metadata = response.a;
						var body = response.b;
						var _v1 = A2($elm$json$Json$Decode$decodeString, decoder, body);
						if (!_v1.$) {
							var value = _v1.a;
							return $elm$core$Result$Ok(value);
						} else {
							var err = _v1.a;
							return $elm$core$Result$Err(
								extend(
									$elm$http$Http$BadBody(
										$elm$json$Json$Decode$errorToString(err))));
						}
				}
			});
	});
var $author$project$Api$Api$checkEmail = F2(
	function (toMsg, email) {
		var method = 'VERIFY_EMAIL';
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					$author$project$Field$Email$encode(email)
				]));
		return $elm$http$Http$request(
			{
				bJ: $elm$http$Http$jsonBody(body),
				b$: A3(
					$author$project$Api$Api$expectJsonExtended,
					{bK: body, Z: method},
					toMsg,
					$author$project$Valid$Certified$decoder(email)),
				b1: _List_Nil,
				Z: method,
				cx: $elm$core$Maybe$Nothing,
				cD: $elm$core$Maybe$Nothing,
				cG: './php/api.php'
			});
	});
var $author$project$Field$Name$encode = function (name) {
	return _Utils_Tuple2(
		'name',
		$elm$json$Json$Encode$string(name));
};
var $author$project$Api$Api$checkName = F2(
	function (toMsg, name) {
		var method = 'VERIFY_NAME';
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					$author$project$Field$Name$encode(name)
				]));
		return $elm$http$Http$request(
			{
				bJ: $elm$http$Http$jsonBody(body),
				b$: A3(
					$author$project$Api$Api$expectJsonExtended,
					{bK: body, Z: method},
					toMsg,
					$author$project$Valid$Certified$decoder(name)),
				b1: _List_Nil,
				Z: method,
				cx: $elm$core$Maybe$Nothing,
				cD: $elm$core$Maybe$Nothing,
				cG: './php/api.php'
			});
	});
var $author$project$Valid$Certified$getObject = function (_v0) {
	var object = _v0.a;
	var certificate = _v0.b;
	return object;
};
var $author$project$User$Guest$getEmail = function (_v0) {
	var details = _v0;
	return $author$project$Valid$Certified$getObject(details.ij);
};
var $author$project$User$Guest$getName = function (_v0) {
	var details = _v0;
	return $author$project$Valid$Certified$getObject(details.i6);
};
var $author$project$Logic$Logic$setGuest = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{
				p: $author$project$User$User$NewUser(x)
			});
	});
var $author$project$Valid$Certified$Checking = {$: 1};
var $author$project$Valid$Certified$checking = function (_v0) {
	var object = _v0.a;
	return A2($author$project$Valid$Certified$Certified, object, $author$project$Valid$Certified$Checking);
};
var $author$project$User$Guest$waitForEmailVerification = function (_v0) {
	var details = _v0;
	return _Utils_update(
		details,
		{
			ij: $author$project$Valid$Certified$checking(details.ij)
		});
};
var $author$project$User$Guest$waitForNameVerification = function (_v0) {
	var details = _v0;
	return _Utils_update(
		details,
		{
			i6: $author$project$Valid$Certified$checking(details.i6)
		});
};
var $author$project$Logic$Logic$certify = F3(
	function (field, guest, model) {
		if (!field) {
			return A2(
				$author$project$Logic$Utils$addCmd,
				A2(
					$author$project$Api$Api$checkName,
					$author$project$Logic$Logic$ProcessCertified(field),
					$author$project$User$Guest$getName(guest)),
				A2(
					$author$project$Logic$Logic$setGuest,
					$author$project$User$Guest$waitForNameVerification(guest),
					model));
		} else {
			return A2(
				$author$project$Logic$Utils$addCmd,
				A2(
					$author$project$Api$Api$checkEmail,
					$author$project$Logic$Logic$ProcessCertified(field),
					$author$project$User$Guest$getEmail(guest)),
				A2(
					$author$project$Logic$Logic$setGuest,
					$author$project$User$Guest$waitForEmailVerification(guest),
					model));
		}
	});
var $author$project$Logic$Logic$focusEmailBox = A2(
	$elm$core$Task$attempt,
	function (_v0) {
		return $author$project$Logic$Logic$NoOp;
	},
	$elm$browser$Browser$Dom$focus('email-box'));
var $author$project$Valid$Certified$getCertificate = function (_v0) {
	var object = _v0.a;
	var certificate = _v0.b;
	return certificate;
};
var $author$project$User$Guest$getEmailCertificate = function (_v0) {
	var details = _v0;
	return $author$project$Valid$Certified$getCertificate(details.ij);
};
var $author$project$User$Guest$getNameCertificate = function (_v0) {
	var details = _v0;
	return $author$project$Valid$Certified$getCertificate(details.i6);
};
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Logic$Logic$goHome = function (model) {
	return A2(
		$elm$browser$Browser$Navigation$pushUrl,
		model.X,
		A2(
			$elm$url$Url$Builder$absolute,
			_List_fromArray(
				['..']),
			_List_Nil));
};
var $author$project$Logic$Logic$activateHints = F2(
	function (field, model) {
		switch (field.$) {
			case 0:
				var guestField = field.a;
				var f = function () {
					if (!guestField) {
						return {
							dF: $author$project$Logic$Logic$focusEmailBox,
							dY: $author$project$User$Guest$getNameCertificate,
							dZ: $author$project$User$Guest$getName,
							d3: model.b3,
							aW: F2(
								function (h, m) {
									return _Utils_update(
										m,
										{b3: h});
								})
						};
					} else {
						return {
							dF: $author$project$Logic$Logic$goHome(model),
							dY: $author$project$User$Guest$getEmailCertificate,
							dZ: $author$project$User$Guest$getEmail,
							d3: model.b2,
							aW: F2(
								function (h, m) {
									return _Utils_update(
										m,
										{b2: h});
								})
						};
					}
				}();
				var oldHint = f.d3;
				var nextErrorColor = _Utils_update(
					oldHint,
					{bb: oldHint.bb + 1});
				var verbose = _Utils_update(
					oldHint,
					{cH: true});
				var _v1 = model.p;
				if (!_v1.$) {
					var guest = _v1.a;
					var _v2 = f.dY(guest);
					switch (_v2.$) {
						case 0:
							return (f.dZ(guest) !== '') ? $author$project$Logic$Utils$noCmd(
								A2(f.aW, verbose, model)) : $author$project$Logic$Utils$noCmd(model);
						case 1:
							return $author$project$Logic$Utils$noCmd(
								A2(f.aW, verbose, model));
						case 2:
							return A2(
								$author$project$Logic$Utils$addCmd,
								f.dF,
								A2(
									f.aW,
									{bb: 0, cH: false},
									model));
						case 3:
							return $author$project$Logic$Utils$noCmd(
								A2(f.aW, nextErrorColor, model));
						default:
							return A3(
								$author$project$Logic$Logic$certify,
								guestField,
								guest,
								A2(f.aW, verbose, model));
					}
				} else {
					var member = _v1.a;
					return $author$project$Logic$Utils$noCmd(model);
				}
			case 2:
				return $author$project$Logic$Utils$noCmd(model);
			default:
				return $author$project$Logic$Utils$noCmd(model);
		}
	});
var $author$project$User$Guest$FailedInvite = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$User$Guest$getInvite = function (_v0) {
	var details = _v0;
	var _v1 = details.iQ;
	switch (_v1.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var invite = _v1.a;
			return $elm$core$Maybe$Just(invite);
		default:
			var invite = _v1.a;
			return $elm$core$Maybe$Just(invite);
	}
};
var $author$project$User$Guest$badInvite = F2(
	function (issue, _v0) {
		var details = _v0;
		var _v1 = $author$project$User$Guest$getInvite(details);
		if (!_v1.$) {
			var invite = _v1.a;
			return _Utils_update(
				details,
				{
					iQ: A2($author$project$User$Guest$FailedInvite, invite, issue)
				});
		} else {
			return details;
		}
	});
var $author$project$Field$Confidence$default = 100;
var $author$project$Api$Api$errorToString = function (error) {
	switch (error.$) {
		case 0:
			var url = error.a;
			return 'BadUrl: ' + url;
		case 1:
			return 'Timeout';
		case 2:
			return 'NetworkError';
		case 3:
			var status = error.a;
			return 'Badstatus: ' + $elm$core$String$fromInt(status);
		default:
			var response = error.a;
			return 'BadBody: ' + response;
	}
};
var $author$project$Valid$Valid$Valid = $elm$core$Basics$identity;
var $author$project$Valid$Valid$fromCertified = function (_v0) {
	var obj = _v0.a;
	var certificate = _v0.b;
	if (certificate.$ === 2) {
		return $elm$core$Maybe$Just(obj);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$User$Guest$getCertifiedEmail = function (_v0) {
	var details = _v0;
	return details.ij;
};
var $author$project$Logic$Logic$validateEmail = function (model) {
	var _v0 = model.p;
	if (!_v0.$) {
		var guest = _v0.a;
		return $author$project$Valid$Valid$fromCertified(
			$author$project$User$Guest$getCertifiedEmail(guest));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$User$Guest$getCertifiedName = function (_v0) {
	var details = _v0;
	return details.i6;
};
var $author$project$Logic$Logic$validateName = function (model) {
	var _v0 = model.p;
	if (!_v0.$) {
		var guest = _v0.a;
		return $author$project$Valid$Valid$fromCertified(
			$author$project$User$Guest$getCertifiedName(guest));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$Logic$focusContactInputs = function (model) {
	var _v0 = _Utils_Tuple2(
		$author$project$Logic$Logic$validateName(model),
		$author$project$Logic$Logic$validateEmail(model));
	if (_v0.a.$ === 1) {
		var _v1 = _v0.a;
		return A2(
			$elm$core$Task$attempt,
			function (_v2) {
				return $author$project$Logic$Logic$NoOp;
			},
			$elm$browser$Browser$Dom$focus('name-box'));
	} else {
		if (_v0.b.$ === 1) {
			var _v3 = _v0.b;
			return A2(
				$elm$core$Task$attempt,
				function (_v4) {
					return $author$project$Logic$Logic$NoOp;
				},
				$elm$browser$Browser$Dom$focus('email-box'));
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	}
};
var $author$project$Logic$InputCounter$get = F2(
	function (field, inputCounter) {
		switch (field.$) {
			case 0:
				if (!field.a) {
					var _v1 = field.a;
					return inputCounter.i6;
				} else {
					var _v2 = field.a;
					return inputCounter.ij;
				}
			case 1:
				if (!field.a) {
					var _v3 = field.a;
					return inputCounter.cQ;
				} else {
					var _v4 = field.a;
					return inputCounter.dK;
				}
			default:
				return inputCounter.iQ;
		}
	});
var $author$project$Logic$InputCounter$match = F3(
	function (field, lastInput, _v0) {
		var modelInput = _v0.a;
		var inputCounter = _v0.b;
		return _Utils_eq(
			lastInput.dI,
			A2($author$project$Logic$InputCounter$get, field, inputCounter)) && _Utils_eq(lastInput.ed, modelInput);
	});
var $author$project$Valid$AutoCheck$string = function (_v0) {
	var auto = _v0;
	return auto.co;
};
var $author$project$Logic$Logic$isLastInput = F3(
	function (field, lastInput, model) {
		var _v0 = _Utils_Tuple2(field, model.p);
		switch (_v0.a.$) {
			case 0:
				if (!_v0.b.$) {
					var guestField = _v0.a.a;
					var guest = _v0.b.a;
					if (!guestField) {
						return A3(
							$author$project$Logic$InputCounter$match,
							field,
							lastInput,
							_Utils_Tuple2(
								$author$project$User$Guest$getName(guest),
								model.al));
					} else {
						return A3(
							$author$project$Logic$InputCounter$match,
							field,
							lastInput,
							_Utils_Tuple2(
								$author$project$User$Guest$getEmail(guest),
								model.al));
					}
				} else {
					return false;
				}
			case 2:
				if (!_v0.b.$) {
					var _v2 = _v0.a;
					var guest = _v0.b.a;
					return A3(
						$author$project$Logic$InputCounter$match,
						field,
						lastInput,
						_Utils_Tuple2(
							A2(
								$elm$core$Maybe$withDefault,
								'',
								$author$project$User$Guest$getInvite(guest)),
							model.al));
				} else {
					var _v3 = _v0.a;
					return false;
				}
			default:
				var betField = _v0.a.a;
				if (!betField) {
					return A3(
						$author$project$Logic$InputCounter$match,
						field,
						lastInput,
						_Utils_Tuple2(
							$author$project$Valid$AutoCheck$string(model.cQ),
							model.al));
				} else {
					return A3(
						$author$project$Logic$InputCounter$match,
						field,
						lastInput,
						_Utils_Tuple2(
							$author$project$Valid$AutoCheck$string(model.dK),
							model.al));
				}
		}
	});
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Logic$Logic$mapToConfidence = F2(
	function (fun, m) {
		return _Utils_update(
			m,
			{
				cQ: fun(m.cQ)
			});
	});
var $author$project$Logic$Logic$mapToDate = F2(
	function (fun, m) {
		return _Utils_update(
			m,
			{
				dK: fun(m.dK)
			});
	});
var $author$project$Logic$Logic$mapToDatePicker = F2(
	function (fun, m) {
		return _Utils_update(
			m,
			{
				cY: fun(m.cY)
			});
	});
var $author$project$Logic$Logic$mapToPlot = F2(
	function (fun, m) {
		return _Utils_update(
			m,
			{
				bo: fun(m.bo)
			});
	});
var $author$project$Field$Email$compareEncoding = F2(
	function (value, email) {
		return _Utils_eq(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						$author$project$Field$Email$encode(email)
					])),
			value);
	});
var $author$project$Field$Name$compareEncoding = F2(
	function (value, name) {
		return _Utils_eq(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						$author$project$Field$Name$encode(name)
					])),
			value);
	});
var $author$project$Valid$Certified$error = F2(
	function (errors, _v0) {
		var object = _v0.a;
		var certificate = _v0.b;
		return A2(
			$author$project$Valid$Certified$Certified,
			object,
			$author$project$Valid$Certified$Error(errors));
	});
var $author$project$User$Guest$errorInEmailCertificate = F2(
	function (errors, _v0) {
		var details = _v0;
		return _Utils_update(
			details,
			{
				ij: A2($author$project$Valid$Certified$error, errors, details.ij)
			});
	});
var $author$project$User$Guest$errorInNameCertificate = F2(
	function (errors, _v0) {
		var details = _v0;
		return _Utils_update(
			details,
			{
				i6: A2($author$project$Valid$Certified$error, errors, details.i6)
			});
	});
var $author$project$User$Guest$setCertifiedEmail = F2(
	function (email, _v0) {
		var details = _v0;
		return _Utils_update(
			details,
			{ij: email});
	});
var $author$project$User$Guest$setCertifiedName = F2(
	function (name, _v0) {
		var details = _v0;
		return _Utils_update(
			details,
			{i6: name});
	});
var $author$project$User$Guest$processCertificateResponse = F3(
	function (field, response, guest) {
		var f = function () {
			if (!field) {
				return {dH: $author$project$Field$Name$compareEncoding, c4: $author$project$User$Guest$getName, cg: $author$project$User$Guest$errorInNameCertificate, eI: $author$project$User$Guest$setCertifiedName};
			} else {
				return {dH: $author$project$Field$Email$compareEncoding, c4: $author$project$User$Guest$getEmail, cg: $author$project$User$Guest$errorInEmailCertificate, eI: $author$project$User$Guest$setCertifiedEmail};
			}
		}();
		if (!response.$) {
			var certified = response.a;
			var _v1 = _Utils_eq(
				$author$project$Valid$Certified$getObject(certified),
				f.c4(guest));
			if (_v1) {
				return A2(f.eI, certified, guest);
			} else {
				return guest;
			}
		} else {
			var method = response.a.Z;
			var bodySent = response.a.bK;
			var error = response.a.fK;
			var _v2 = A2(
				f.dH,
				bodySent,
				f.c4(guest));
			if (_v2) {
				_v3$2:
				while (true) {
					switch (error.$) {
						case 2:
							return A2(
								f.cg,
								_List_fromArray(
									['It seems like you don\'t have a stable internet connection. Maybe it helps if you submit it again?']),
								guest);
						case 3:
							if (error.a === 400) {
								return A2(
									f.cg,
									_List_fromArray(
										['I got a badstatus 400. This means... it could be anything. If you see this, you should contact me 😅']),
									guest);
							} else {
								break _v3$2;
							}
						default:
							break _v3$2;
					}
				}
				return A2(
					f.cg,
					_List_fromArray(
						[
							'Problem with',
							method,
							'Body send',
							A2($elm$json$Json$Encode$encode, 4, bodySent),
							'Http.Error',
							$author$project$Api$Api$errorToString(error)
						]),
					guest);
			} else {
				return guest;
			}
		}
	});
var $author$project$Logic$Logic$IssuesInBet = function (a) {
	return {$: 2, a: a};
};
var $author$project$User$Passcode$toString = function (_v0) {
	var str = _v0;
	return str;
};
var $author$project$User$Member$passcodeAsString = function (details) {
	return $author$project$User$Passcode$toString(details.jr);
};
var $elm$url$Url$Builder$relative = F2(
	function (pathSegments, parameters) {
		return _Utils_ap(
			A2($elm$core$String$join, '/', pathSegments),
			$elm$url$Url$Builder$toQuery(parameters));
	});
var $author$project$Logic$Logic$setInputControl = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{ak: x});
	});
var $author$project$User$User$OldUser = function (a) {
	return {$: 1, a: a};
};
var $author$project$Logic$Logic$setMember = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{
				p: $author$project$User$User$OldUser(x)
			});
	});
var $author$project$Logic$Logic$setProblem = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{eB: x});
	});
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$Logic$Logic$processGeneralSubmitResponse = F2(
	function (response, model) {
		switch (response.$) {
			case 0:
				var member = response.a;
				var _v1 = model.p;
				if (!_v1.$) {
					return A2(
						$author$project$Logic$Utils$addCmd,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.X,
							A2(
								$elm$url$Url$Builder$relative,
								_List_fromArray(
									[
										$author$project$Logic$Page$toPath(9)
									]),
								_List_fromArray(
									[
										A2(
										$elm$url$Url$Builder$string,
										'p',
										$author$project$User$Member$passcodeAsString(member))
									]))),
						A2(
							$author$project$Logic$Logic$setInputControl,
							0,
							A2($author$project$Logic$Logic$setMember, member, model)));
				} else {
					return $author$project$Logic$Utils$noCmd(
						A2(
							$author$project$Logic$Logic$setInputControl,
							0,
							A2($author$project$Logic$Logic$setMember, member, model)));
				}
			case 1:
				var issues = response.a;
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$goHome(model),
					A2(
						$author$project$Logic$Logic$setInputControl,
						0,
						A2(
							$author$project$Logic$Logic$setProblem,
							$elm$core$Maybe$Just(
								$author$project$Logic$Logic$IssuesInBet(issues)),
							model)));
			case 2:
				var method = response.a;
				var errors = response.b;
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$goHome(model),
					A2(
						$author$project$Logic$Logic$setInputControl,
						0,
						A2(
							$author$project$Logic$Logic$setProblem,
							$elm$core$Maybe$Just(
								$author$project$Logic$Logic$Unspecified(errors)),
							model)));
			default:
				var method = response.a;
				var errors = response.b;
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$goHome(model),
					A2(
						$author$project$Logic$Logic$setInputControl,
						0,
						A2(
							$author$project$Logic$Logic$setProblem,
							$elm$core$Maybe$Just(
								$author$project$Logic$Logic$Unspecified(errors)),
							model)));
		}
	});
var $author$project$Valid$AutoCheck$makePublic = function (_v0) {
	var auto = _v0;
	return _Utils_update(
		auto,
		{aM: true});
};
var $author$project$Logic$Logic$setConfidence = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{cQ: x});
	});
var $author$project$Logic$Logic$setDate = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{dK: x});
	});
var $author$project$Logic$Logic$publishBet = F2(
	function (field, model) {
		if (!field) {
			return $author$project$Logic$Utils$noCmd(
				A2(
					$author$project$Logic$Logic$setConfidence,
					$author$project$Valid$AutoCheck$makePublic(model.cQ),
					model));
		} else {
			return $author$project$Logic$Utils$noCmd(
				A2(
					$author$project$Logic$Logic$setDate,
					$author$project$Valid$AutoCheck$makePublic(model.dK),
					model));
		}
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Logic$Logic$renderMath = _Platform_outgoingPort(
	'renderMath',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Logic$Logic$setPlot = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{bo: x});
	});
var $author$project$AccuracyPlot$AccuracyPlot$setSize = F2(
	function (_v0, model) {
		var width = _v0.kD;
		var height = _v0.iv;
		return _Utils_update(
			model,
			{an: height, az: width});
	});
var $author$project$Logic$Logic$setSuccessMessage = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{eW: x});
	});
var $author$project$Logic$Logic$setVisibilityRnDSection = F3(
	function (sectionId, visibility, model) {
		return _Utils_update(
			model,
			{
				O: false,
				ck: A3($elm$core$Dict$insert, sectionId, visibility, model.ck)
			});
	});
var $author$project$DatePicker$DatePicker$setVisibleMonth = F2(
	function (date, _v0) {
		var picker = _v0;
		return _Utils_update(
			picker,
			{Q: date});
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Field$Confidence$encode = function (_v0) {
	var _int = _v0;
	return _Utils_Tuple2(
		'spread',
		$elm$json$Json$Encode$int(_int));
};
var $author$project$Field$Date$encode = function (date) {
	return _Utils_Tuple2(
		'date',
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'year',
					$elm$json$Json$Encode$int(
						$justinmimbs$date$Date$year(date))),
					_Utils_Tuple2(
					'month',
					$elm$json$Json$Encode$int(
						$justinmimbs$date$Date$monthNumber(date))),
					_Utils_Tuple2(
					'day',
					$elm$json$Json$Encode$int(
						$justinmimbs$date$Date$day(date)))
				])));
};
var $author$project$User$MemberBet$encode = function (bet) {
	return _Utils_Tuple2(
		'bet',
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					$author$project$Field$Confidence$encode(bet.cQ),
					$author$project$Field$Date$encode(bet.dK)
				])));
};
var $author$project$Valid$Valid$object = function (_v0) {
	var obj = _v0;
	return obj;
};
var $author$project$Api$Api$submitBetMember = F2(
	function (toMsg, param) {
		var method = 'UPDATE_BET';
		var bet = {
			cQ: $author$project$Valid$Valid$object(param.cQ),
			dK: $author$project$Valid$Valid$object(param.dK)
		};
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					$author$project$User$Passcode$encode(param.jr),
					$author$project$User$MemberBet$encode(bet)
				]));
		return $elm$http$Http$request(
			{
				bJ: $elm$http$Http$jsonBody(body),
				b$: A2(
					$elm$http$Http$expectJson,
					toMsg,
					$author$project$Api$Api$memberResponseDecoder(method)),
				b1: _List_Nil,
				Z: method,
				cx: $elm$core$Maybe$Just(5000),
				cD: $elm$core$Maybe$Nothing,
				cG: './php/api.php'
			});
	});
var $author$project$Logic$Logic$ProcessSubmitGuest = function (a) {
	return {$: 16, a: a};
};
var $author$project$Api$Api$InviteIssue = function (a) {
	return {$: 1, a: a};
};
var $author$project$Api$Api$NormalResponse = function (a) {
	return {$: 0, a: a};
};
var $author$project$Api$Api$guestSubmitResponseDecoder = function (method) {
	var toResult = F4(
		function (status, maybeMember, issues, errors) {
			switch (status) {
				case 'ok':
					if (!maybeMember.$) {
						var member = maybeMember.a;
						return $author$project$Api$Api$NormalResponse(
							$author$project$Api$Api$Success(member));
					} else {
						return $author$project$Api$Api$NormalResponse(
							A2(
								$author$project$Api$Api$ResponseError,
								method,
								_List_fromArray(
									['Problem with Json: status ' + (status + ' but no member-attribute')])));
					}
				case 'inviteIssue':
					return $author$project$Api$Api$InviteIssue(
						A2($elm$core$String$join, ', ', issues));
				case 'nok':
					return $author$project$Api$Api$NormalResponse(
						$author$project$Api$Api$Failure(issues));
				case 'error':
					return $author$project$Api$Api$NormalResponse(
						A2($author$project$Api$Api$ApiError, method, errors));
				default:
					return $author$project$Api$Api$NormalResponse(
						A2(
							$author$project$Api$Api$ResponseError,
							method,
							_List_fromArray(
								['I got an unexpected response from the server. The procedure ' + (method + (' did sent the unknown status ' + (status + '.')))])));
			}
		});
	return A5(
		$elm$json$Json$Decode$map4,
		toResult,
		$author$project$Api$Decoder$decodeStatus,
		$elm$json$Json$Decode$maybe($author$project$User$Member$decode),
		$author$project$Api$Decoder$decodeIssues,
		$author$project$Api$Decoder$decodeErrors);
};
var $author$project$Api$Api$submitBetGuest = F2(
	function (toMsg, param) {
		var method = 'REGISTER_NEW_BET';
		var guest = param.it;
		var bet = {
			cQ: $author$project$Valid$Valid$object(guest.cQ),
			dK: $author$project$Valid$Valid$object(guest.dK)
		};
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'invite',
					$elm$json$Json$Encode$string(param.iQ)),
					$author$project$Field$Name$encode(
					$author$project$Valid$Valid$object(guest.i6)),
					$author$project$Field$Email$encode(
					$author$project$Valid$Valid$object(guest.ij)),
					$author$project$User$MemberBet$encode(bet)
				]));
		return $elm$http$Http$request(
			{
				bJ: $elm$http$Http$jsonBody(body),
				b$: A2(
					$elm$http$Http$expectJson,
					toMsg,
					$author$project$Api$Api$guestSubmitResponseDecoder(method)),
				b1: _List_Nil,
				Z: method,
				cx: $elm$core$Maybe$Just(5000),
				cD: $elm$core$Maybe$Nothing,
				cG: './php/api.php'
			});
	});
var $author$project$Valid$AutoCheck$publicObject = function (_v0) {
	var auto = _v0;
	var _v1 = auto.aM;
	if (_v1) {
		return auto.aH;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Valid$Valid$fromAutoChecking = function (auto) {
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Basics$identity,
		$author$project$Valid$AutoCheck$publicObject(auto));
};
var $author$project$Logic$Logic$validateConfidence = function (model) {
	return $author$project$Valid$Valid$fromAutoChecking(model.cQ);
};
var $author$project$Logic$Logic$validateDate = function (model) {
	return $author$project$Valid$Valid$fromAutoChecking(model.dK);
};
var $author$project$Logic$Logic$validateGuestBet = function (model) {
	var _v0 = model.ak;
	if (!_v0) {
		var _v1 = model.p;
		if (!_v1.$) {
			var guest = _v1.a;
			var _v2 = _Utils_Tuple2(
				$author$project$Logic$Logic$validateName(model),
				$author$project$Logic$Logic$validateEmail(model));
			if ((!_v2.a.$) && (!_v2.b.$)) {
				var name = _v2.a.a;
				var email = _v2.b.a;
				var _v3 = _Utils_Tuple2(
					$author$project$Logic$Logic$validateConfidence(model),
					$author$project$Logic$Logic$validateDate(model));
				if ((!_v3.a.$) && (!_v3.b.$)) {
					var confidence = _v3.a.a;
					var date = _v3.b.a;
					return $elm$core$Maybe$Just(
						{cQ: confidence, dK: date, ij: email, i6: name});
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			var member = _v1.a;
			return $elm$core$Maybe$Nothing;
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$Logic$tryToSubmitBetForGuest = function (model) {
	var _v0 = model.p;
	if (!_v0.$) {
		var guest = _v0.a;
		var _v1 = $author$project$User$Guest$getInvite(guest);
		if (_v1.$ === 1) {
			return A2(
				$author$project$Logic$Utils$addCmd,
				A2(
					$elm$browser$Browser$Navigation$pushUrl,
					model.X,
					A2(
						$elm$url$Url$Builder$relative,
						_List_fromArray(
							[
								$author$project$Logic$Page$toPath(11)
							]),
						_List_Nil)),
				model);
		} else {
			var invite = _v1.a;
			var _v2 = $author$project$Logic$Logic$validateGuestBet(model);
			if (!_v2.$) {
				var validBet = _v2.a;
				return A2(
					$author$project$Logic$Utils$addCmd,
					A2(
						$author$project$Api$Api$submitBetGuest,
						$author$project$Logic$Logic$ProcessSubmitGuest,
						{it: validBet, iQ: invite}),
					_Utils_update(
						model,
						{ak: 1, cl: false}));
			} else {
				return A2(
					$author$project$Logic$Utils$addCmd,
					$author$project$Logic$Logic$goHome(model),
					A2(
						$author$project$Logic$Logic$setProblem,
						$elm$core$Maybe$Just(
							$author$project$Logic$Logic$Unspecified(
								_List_fromArray(
									['Ahm, I got an error. I thought your bet is valid and you could bit. But then not even a second later I changed my mind (or my model). Can you contact Julian about this?']))),
						model));
			}
		}
	} else {
		return A2(
			$author$project$Logic$Utils$addCmd,
			$author$project$Logic$Logic$goHome(model),
			A2(
				$author$project$Logic$Logic$setProblem,
				$elm$core$Maybe$Just(
					$author$project$Logic$Logic$Unspecified(
						_List_fromArray(
							['Wow, not bad. You encoountered a strange error. You\'re already logged in, but still you made me try to submit a completely new bet. Obviously I cannot do that, but maybe you should contact Julian about this.']))),
				model));
	}
};
var $author$project$AccuracyPlot$AccuracyPlot$linearTransform = F3(
	function (rng, dom, x) {
		return (((dom.d - x) * rng.e) + ((x - dom.e) * rng.d)) / (dom.d - dom.e);
	});
var $author$project$AccuracyPlot$AccuracyPlot$removeHighlight = function (model) {
	return _Utils_update(
		model,
		{dJ: $elm$core$Maybe$Nothing, bf: $elm$core$Maybe$Nothing});
};
var $myrho$elm_round$Round$truncate = function (n) {
	return (n < 0) ? $elm$core$Basics$ceiling(n) : $elm$core$Basics$floor(n);
};
var $author$project$AccuracyPlot$AccuracyPlot$update = F2(
	function (msg, model) {
		var convertToDate = F2(
			function (text, fallback) {
				var _v1 = $justinmimbs$date$Date$fromIsoString(text);
				if (!_v1.$) {
					var date = _v1.a;
					return date;
				} else {
					return fallback;
				}
			});
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var date = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bf: $elm$core$Maybe$Just(date)
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var dateRange = msg.a;
				var touchPos = msg.b;
				var highlightedDataPoint = $myrho$elm_round$Round$truncate(
					A3(
						$author$project$AccuracyPlot$AccuracyPlot$linearTransform,
						{d: dateRange.d, e: dateRange.e},
						{d: 1000, e: 0},
						touchPos));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bf: $elm$core$Maybe$Just(highlightedDataPoint),
							dr: touchPos
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					$author$project$AccuracyPlot$AccuracyPlot$removeHighlight(model),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$DatePicker$DatePicker$update = F2(
	function (msg, _v0) {
		var picker = _v0;
		if (!msg.$) {
			var month = msg.a;
			return _Utils_update(
				picker,
				{Q: month});
		} else {
			return picker;
		}
	});
var $author$project$User$Guest$setEmail = F2(
	function (email, guest) {
		return A2(
			$author$project$User$Guest$setCertifiedEmail,
			$author$project$Valid$Certified$uncertified(email),
			guest);
	});
var $author$project$User$Guest$setName = F2(
	function (name, guest) {
		return A2(
			$author$project$User$Guest$setCertifiedName,
			$author$project$Valid$Certified$uncertified(name),
			guest);
	});
var $author$project$User$Guest$setField = F3(
	function (field, input, guest) {
		if (!field) {
			return A2($author$project$User$Guest$setName, input, guest);
		} else {
			return A2($author$project$User$Guest$setEmail, input, guest);
		}
	});
var $author$project$Valid$AutoCheck$updateString = F2(
	function (str, _v0) {
		var auto = _v0;
		return _Utils_update(
			auto,
			{
				aH: auto.dw.c3(str),
				aM: false,
				co: str
			});
	});
var $author$project$Logic$Logic$updateBet = F3(
	function (field, input, model) {
		if (!field) {
			return A2(
				$author$project$Logic$Logic$mapToConfidence,
				$author$project$Valid$AutoCheck$updateString(input),
				model);
		} else {
			return A2(
				$author$project$Logic$Logic$mapToPlot,
				$author$project$AccuracyPlot$AccuracyPlot$removeHighlight,
				A2(
					$author$project$Logic$Logic$mapToDate,
					$author$project$Valid$AutoCheck$updateString(input),
					model));
		}
	});
var $author$project$Logic$Logic$updateFieldValue = F3(
	function (field, input, model) {
		var _v0 = _Utils_Tuple2(field, model.p);
		switch (_v0.a.$) {
			case 0:
				if (!_v0.b.$) {
					var guestField = _v0.a.a;
					var guest = _v0.b.a;
					return A2(
						$author$project$Logic$Logic$setGuest,
						A3($author$project$User$Guest$setField, guestField, input, guest),
						model);
				} else {
					return model;
				}
			case 2:
				if (!_v0.b.$) {
					var _v1 = _v0.a;
					var guest = _v0.b.a;
					return A2(
						$author$project$Logic$Logic$setGuest,
						A2($author$project$User$Guest$updateInvite, input, guest),
						model);
				} else {
					var _v2 = _v0.a;
					return model;
				}
			default:
				var betField = _v0.a.a;
				return A3($author$project$Logic$Logic$updateBet, betField, input, model);
		}
	});
var $author$project$Valid$AutoCheck$updateObject = F2(
	function (obj, _v0) {
		var auto = _v0;
		return _Utils_update(
			auto,
			{
				aH: $elm$core$Maybe$Just(obj),
				aM: true,
				co: auto.dw.dv(obj)
			});
	});
var $author$project$Logic$Logic$urlWithPasscode = F2(
	function (model, url) {
		var _v0 = model.p;
		if (!_v0.$) {
			var guest = _v0.a;
			return $elm$core$Platform$Cmd$none;
		} else {
			var member = _v0.a;
			return (!_Utils_eq(
				$author$project$User$Passcode$fromUrl(url),
				$elm$core$Maybe$Just(member.jr))) ? A2(
				$elm$browser$Browser$Navigation$replaceUrl,
				model.X,
				A2(
					$elm$url$Url$Builder$relative,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$url$Url$Builder$string,
							'p',
							$author$project$User$Passcode$toString(member.jr))
						]))) : $elm$core$Platform$Cmd$none;
		}
	});
var $elm$core$Process$sleep = _Process_sleep;
var $andrewMacmurray$elm_delay$Delay$after = F2(
	function (time, msg) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$always(msg),
			$elm$core$Process$sleep(time));
	});
var $author$project$Logic$InputCounter$update = F3(
	function (field, counter, inputCounter) {
		switch (field.$) {
			case 0:
				if (!field.a) {
					var _v1 = field.a;
					return _Utils_update(
						inputCounter,
						{i6: counter});
				} else {
					var _v2 = field.a;
					return _Utils_update(
						inputCounter,
						{ij: counter});
				}
			case 1:
				if (!field.a) {
					var _v3 = field.a;
					return _Utils_update(
						inputCounter,
						{cQ: counter});
				} else {
					var _v4 = field.a;
					return _Utils_update(
						inputCounter,
						{dK: counter});
				}
			default:
				return _Utils_update(
					inputCounter,
					{iQ: counter});
		}
	});
var $author$project$Logic$InputCounter$newInput = F3(
	function (field, input, inputCounter) {
		var newCounter = A2(
			$elm$core$Basics$modBy,
			255,
			A2($author$project$Logic$InputCounter$get, field, inputCounter) + 1);
		var newLastInput = {dI: newCounter, ed: input};
		return _Utils_Tuple2(
			A3($author$project$Logic$InputCounter$update, field, newCounter, inputCounter),
			newLastInput);
	});
var $author$project$Logic$Logic$waitForLastInput = F4(
	function (field, input, toMsg, model) {
		var _v0 = A3($author$project$Logic$InputCounter$newInput, field, input, model.al);
		var inputCounter = _v0.a;
		var lastInput = _v0.b;
		if (input === '') {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{al: inputCounter}),
				A2(
					$andrewMacmurray$elm_delay$Delay$after,
					700,
					toMsg(lastInput)));
		}
	});
var $author$project$Logic$Logic$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.ak);
		_v0$31:
		while (true) {
			switch (_v0.a.$) {
				case 1:
					var _v1 = _v0.a;
					var page = _v1.a;
					var response = _v1.b;
					if (!response.$) {
						var result = response.a;
						switch (result.$) {
							case 0:
								var member = result.a;
								return $author$project$Logic$Logic$makeSureItsHome(
									A2(
										$author$project$Logic$Logic$mapToDatePicker,
										$author$project$DatePicker$DatePicker$setVisibleMonth(member.dC.dK),
										A2(
											$author$project$Logic$Logic$mapToDate,
											$author$project$Valid$AutoCheck$updateObject(member.dC.dK),
											A2(
												$author$project$Logic$Logic$mapToConfidence,
												$author$project$Valid$AutoCheck$updateObject(member.dC.cQ),
												A2($author$project$Logic$Logic$setMember, member, model)))));
							case 1:
								var description = result.a;
								return $author$project$Logic$Logic$makeSureItsHome(
									A2(
										$author$project$Logic$Logic$setProblem,
										$elm$core$Maybe$Just(
											$author$project$Logic$Logic$ErrorInLogin(description)),
										model));
							case 3:
								var method = result.a;
								var error = result.b;
								return $author$project$Logic$Logic$makeSureItsHome(
									A2(
										$author$project$Logic$Logic$setProblem,
										$elm$core$Maybe$Just(
											$author$project$Logic$Logic$ErrorInLogin(
												A2($elm$core$List$cons, method, error))),
										model));
							default:
								return $author$project$Logic$Logic$makeSureItsHome(model);
						}
					} else {
						var error = response.a;
						return $author$project$Logic$Logic$makeSureItsHome(
							A2(
								$author$project$Logic$Logic$setProblem,
								$elm$core$Maybe$Just(
									$author$project$Logic$Logic$ErrorInLogin(
										_List_fromArray(
											[
												$author$project$Api$Api$errorToString(error)
											]))),
								model));
					}
				case 2:
					var date = _v0.a.a;
					return $author$project$Logic$Utils$noCmd(
						_Utils_update(
							model,
							{
								bB: $elm$core$Maybe$Just(date)
							}));
				case 3:
					if (!_v0.b) {
						var urlRequest = _v0.a.a;
						var _v4 = _v0.b;
						if (!urlRequest.$) {
							var url = urlRequest.a;
							return A2(
								$author$project$Logic$Utils$addCmd,
								A2(
									$elm$browser$Browser$Navigation$pushUrl,
									model.X,
									$elm$url$Url$toString(url)),
								model);
						} else {
							var url = urlRequest.a;
							return A2(
								$author$project$Logic$Utils$addCmd,
								$elm$browser$Browser$Navigation$load(url),
								model);
						}
					} else {
						break _v0$31;
					}
				case 4:
					var url = _v0.a.a;
					var _v6 = A2(
						$author$project$Logic$Logic$openPage,
						$author$project$Logic$Router$toPage(url),
						model);
					var newModel = _v6.a;
					var pageCmd = _v6.b;
					return A2(
						$author$project$Logic$Utils$addCmd,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Logic$Logic$urlWithPasscode, model, url),
									pageCmd
								])),
						newModel);
				case 5:
					if (!_v0.b) {
						var _v7 = _v0.a;
						var _v8 = _v0.b;
						return A2(
							$author$project$Logic$Utils$addCmd,
							$author$project$Logic$Logic$goHome(model),
							model);
					} else {
						break _v0$31;
					}
				case 6:
					if (!_v0.b) {
						var _v9 = _v0.a;
						var field = _v9.a;
						var input = _v9.b;
						var _v10 = _v0.b;
						return A4(
							$author$project$Logic$Logic$waitForLastInput,
							field,
							input,
							$author$project$Logic$Logic$Check(field),
							A2(
								$author$project$Logic$Logic$removeHints,
								field,
								A3($author$project$Logic$Logic$updateFieldValue, field, input, model)));
					} else {
						break _v0$31;
					}
				case 7:
					var _v11 = _v0.a;
					var field = _v11.a;
					var lastInput = _v11.b;
					var _v12 = A3($author$project$Logic$Logic$isLastInput, field, lastInput, model);
					if (_v12) {
						var _v13 = _Utils_Tuple2(field, model.p);
						switch (_v13.a.$) {
							case 0:
								if (!_v13.b.$) {
									var guestField = _v13.a.a;
									var guest = _v13.b.a;
									return A3($author$project$Logic$Logic$certify, guestField, guest, model);
								} else {
									return $author$project$Logic$Utils$noCmd(model);
								}
							case 2:
								if (!_v13.b.$) {
									var _v14 = _v13.a;
									var guest = _v13.b.a;
									return $author$project$Logic$Logic$tryToSubmitBetForGuest(model);
								} else {
									var _v15 = _v13.a;
									return $author$project$Logic$Utils$noCmd(model);
								}
							default:
								var betField = _v13.a.a;
								return A2($author$project$Logic$Logic$publishBet, betField, model);
						}
					} else {
						return $author$project$Logic$Utils$noCmd(model);
					}
				case 8:
					var _v16 = _v0.a;
					var field = _v16.a;
					var response = _v16.b;
					var _v17 = model.p;
					if (!_v17.$) {
						var guest = _v17.a;
						return $author$project$Logic$Utils$noCmd(
							A2(
								$author$project$Logic$Logic$setGuest,
								A3($author$project$User$Guest$processCertificateResponse, field, response, guest),
								model));
					} else {
						return $author$project$Logic$Utils$noCmd(model);
					}
				case 9:
					if (!_v0.b) {
						var field = _v0.a.a;
						var _v18 = _v0.b;
						var cmd = function () {
							var _v19 = _Utils_Tuple3(
								0,
								$author$project$Logic$Logic$validateName(model),
								$author$project$Logic$Logic$validateEmail(model));
							_v19$2:
							while (true) {
								_v19$3:
								while (true) {
									if (!_v19.a) {
										if (_v19.b.$ === 1) {
											var _v20 = _v19.a;
											var _v21 = _v19.b;
											return $elm$core$Platform$Cmd$none;
										} else {
											if (!_v19.c.$) {
												break _v19$2;
											} else {
												break _v19$3;
											}
										}
									} else {
										if (_v19.c.$ === 1) {
											var _v22 = _v19.a;
											var _v23 = _v19.c;
											return $elm$core$Platform$Cmd$none;
										} else {
											if (!_v19.b.$) {
												break _v19$2;
											} else {
												break _v19$3;
											}
										}
									}
								}
								return $author$project$Logic$Logic$focusContactInputs(model);
							}
							return A2(
								$elm$browser$Browser$Navigation$pushUrl,
								model.X,
								A2(
									$elm$url$Url$Builder$absolute,
									_List_fromArray(
										['..']),
									_List_Nil));
						}();
						return A2($author$project$Logic$Utils$addCmd, cmd, model);
					} else {
						break _v0$31;
					}
				case 10:
					if (!_v0.b) {
						var _v24 = _v0.a;
						var _v25 = _v0.b;
						return A2(
							$author$project$Logic$Logic$activateHints,
							$author$project$Field$Field$Guest(0),
							model);
					} else {
						break _v0$31;
					}
				case 12:
					var field = _v0.a.a;
					return $author$project$Logic$Utils$noCmd(
						A2($author$project$Logic$Logic$removeHints, field, model));
				case 11:
					if (!_v0.b) {
						var _v26 = _v0.a;
						var _v27 = _v0.b;
						return A2(
							$author$project$Logic$Logic$activateHints,
							$author$project$Field$Field$Guest(1),
							model);
					} else {
						break _v0$31;
					}
				case 23:
					if (!_v0.b) {
						var _int = _v0.a.a;
						var _v28 = _v0.b;
						var confidence = A2(
							$elm$core$Maybe$withDefault,
							$author$project$Field$Confidence$default,
							$author$project$Field$Confidence$fromInt(_int));
						return $author$project$Logic$Utils$noCmd(
							A2(
								$author$project$Logic$Logic$setConfidence,
								A2($author$project$Valid$AutoCheck$updateObject, confidence, model.cQ),
								model));
					} else {
						break _v0$31;
					}
				case 24:
					var event = _v0.a.a;
					if (!event.$) {
						var date = event.a;
						var _v30 = model.ak;
						if (!_v30) {
							return $author$project$Logic$Utils$noCmd(
								A2(
									$author$project$Logic$Logic$mapToDate,
									$author$project$Valid$AutoCheck$updateObject(date),
									model));
						} else {
							return $author$project$Logic$Utils$noCmd(model);
						}
					} else {
						var subMsg = event.a;
						return $author$project$Logic$Utils$noCmd(
							A2(
								$author$project$Logic$Logic$mapToDatePicker,
								$author$project$DatePicker$DatePicker$update(subMsg),
								model));
					}
				case 13:
					var bool = _v0.a.a;
					return $author$project$Logic$Utils$noCmd(
						_Utils_update(
							model,
							{cl: bool}));
				case 14:
					if (!_v0.b) {
						var _v31 = _v0.a;
						var _v32 = _v0.b;
						return $author$project$Logic$Logic$tryToSubmitBetForGuest(model);
					} else {
						break _v0$31;
					}
				case 15:
					if (!_v0.b) {
						var validBet = _v0.a.a;
						var _v33 = _v0.b;
						return A2(
							$author$project$Logic$Utils$addCmd,
							A2($author$project$Api$Api$submitBetMember, $author$project$Logic$Logic$ProcessSubmit, validBet),
							_Utils_update(
								model,
								{ak: 1, cl: false}));
					} else {
						break _v0$31;
					}
				case 16:
					var result = _v0.a.a;
					if (!result.$) {
						var response = result.a;
						if (!response.$) {
							var normalResponse = response.a;
							return A2($author$project$Logic$Logic$processGeneralSubmitResponse, normalResponse, model);
						} else {
							var issue = response.a;
							var _v36 = model.p;
							if (!_v36.$) {
								var guest = _v36.a;
								return A2(
									$author$project$Logic$Logic$openPage,
									11,
									A2(
										$author$project$Logic$Logic$setInputControl,
										0,
										A2(
											$author$project$Logic$Logic$setGuest,
											A2($author$project$User$Guest$badInvite, issue, guest),
											model)));
							} else {
								var member = _v36.a;
								return $author$project$Logic$Utils$noCmd(model);
							}
						}
					} else {
						var httpError = result.a;
						return A2(
							$author$project$Logic$Utils$addCmd,
							$author$project$Logic$Logic$goHome(model),
							A2(
								$author$project$Logic$Logic$setInputControl,
								0,
								A2(
									$author$project$Logic$Logic$setProblem,
									$elm$core$Maybe$Just(
										$author$project$Logic$Logic$HttpError(httpError)),
									model)));
					}
				case 17:
					var result = _v0.a.a;
					if (!result.$) {
						var response = result.a;
						return A2($author$project$Logic$Logic$processGeneralSubmitResponse, response, model);
					} else {
						var httpError = result.a;
						return A2(
							$author$project$Logic$Utils$addCmd,
							$author$project$Logic$Logic$goHome(model),
							A2(
								$author$project$Logic$Logic$setInputControl,
								0,
								A2(
									$author$project$Logic$Logic$setProblem,
									$elm$core$Maybe$Just(
										$author$project$Logic$Logic$HttpError(httpError)),
									model)));
					}
				case 18:
					var _v38 = _v0.a;
					return $author$project$Logic$Utils$noCmd(
						A2($author$project$Logic$Logic$setProblem, $elm$core$Maybe$Nothing, model));
				case 19:
					var _v39 = _v0.a;
					return $author$project$Logic$Utils$noCmd(
						A2($author$project$Logic$Logic$setSuccessMessage, $elm$core$Maybe$Nothing, model));
				case 25:
					var subMsg = _v0.a.a;
					var _v40 = A2($author$project$AccuracyPlot$AccuracyPlot$update, subMsg, model.bo);
					var newPlot = _v40.a;
					var cmd = _v40.b;
					return A2(
						$author$project$Logic$Utils$addCmd,
						A2($elm$core$Platform$Cmd$map, $author$project$Logic$Logic$PlotMsg, cmd),
						A2($author$project$Logic$Logic$setPlot, newPlot, model));
				case 26:
					var _v41 = _v0.a;
					return A2(
						$author$project$Logic$Utils$addCmd,
						$author$project$Logic$Logic$updatePlotSize(model.dl),
						model);
				case 27:
					var res = _v0.a.a;
					if (!res.$) {
						var elm = res.a;
						return $author$project$Logic$Utils$noCmd(
							A2(
								$author$project$Logic$Logic$mapToPlot,
								$author$project$AccuracyPlot$AccuracyPlot$setSize(
									{iv: elm.fF.iv, kD: elm.fF.kD}),
								model));
					} else {
						return $author$project$Logic$Utils$noCmd(model);
					}
				case 20:
					var plotRange = _v0.a.a;
					return $author$project$Logic$Utils$noCmd(
						_Utils_update(
							model,
							{dm: plotRange}));
				case 22:
					var answer = _v0.a.a;
					var _v43 = _Utils_Tuple2(model.aO, model.ca);
					if (_v43.b.$ === 1) {
						var _v44 = _v43.b;
						return $author$project$Logic$Utils$noCmd(
							_Utils_update(
								model,
								{
									aO: $elm$core$Maybe$Just(answer),
									O: false
								}));
					} else {
						if ((!_v43.a.$) && (!_v43.a.a)) {
							var _v45 = _v43.a.a;
							return $author$project$Logic$Utils$noCmd(
								_Utils_update(
									model,
									{
										aO: $elm$core$Maybe$Just(answer),
										ca: $elm$core$Maybe$Nothing,
										O: false
									}));
						} else {
							var currentTries = _v43.b.a;
							if (!answer) {
								return $author$project$Logic$Utils$noCmd(
									_Utils_update(
										model,
										{
											aO: $elm$core$Maybe$Just(answer),
											O: false
										}));
							} else {
								return $author$project$Logic$Utils$noCmd(
									_Utils_update(
										model,
										{
											aO: $elm$core$Maybe$Just(answer),
											ca: $elm$core$Maybe$Just(currentTries + 1),
											O: false
										}));
							}
						}
					}
				case 21:
					var bool = _v0.a.a;
					return $author$project$Logic$Utils$noCmd(
						_Utils_update(
							model,
							{eL: bool}));
				case 28:
					var _v47 = _v0.a;
					var sectionId = _v47.a;
					var bool = _v47.b;
					return $author$project$Logic$Utils$noCmd(
						A3($author$project$Logic$Logic$setVisibilityRnDSection, sectionId, bool, model));
				case 30:
					var _v48 = _v0.a;
					return $author$project$Logic$Utils$noCmd(
						A2(
							$author$project$Logic$Logic$setSuccessMessage,
							$elm$core$Maybe$Just(0),
							A2(
								$author$project$Logic$Logic$setProblem,
								$elm$core$Maybe$Just(
									$author$project$Logic$Logic$Unspecified(
										_List_fromArray(
											['Hey', 'Problem :)']))),
								model)));
				case 31:
					var _v49 = _v0.a;
					return A2(
						$author$project$Logic$Utils$addCmd,
						$author$project$Logic$Logic$renderMath(0),
						_Utils_update(
							model,
							{O: true}));
				case 29:
					var posix = _v0.a.a;
					var _v50 = model.dj;
					if (_v50 === 1) {
						return $author$project$Logic$Utils$noCmd(
							_Utils_update(
								model,
								{ey: posix}));
					} else {
						return $author$project$Logic$Utils$noCmd(model);
					}
				default:
					break _v0$31;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $mdgriffith$elm_ui$Internal$Model$FocusStyleOption = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Element$focusStyle = $mdgriffith$elm_ui$Internal$Model$FocusStyleOption;
var $mdgriffith$elm_ui$Internal$Style$classes = {hf: 'a', fh: 'atv', hi: 'ab', hj: 'cx', hk: 'cy', hl: 'acb', hm: 'accx', hn: 'accy', ho: 'acr', fj: 'al', fk: 'ar', hp: 'at', dy: 'ah', dz: 'av', hu: 's', hB: 'bh', hC: 'b', hF: 'w7', hH: 'bd', hI: 'bdt', cL: 'bn', hJ: 'bs', cN: 'cpe', hS: 'cp', hT: 'cpx', hU: 'cpy', fw: 'c', cR: 'ctr', cS: 'cb', cT: 'ccx', at: 'ccy', fx: 'cl', cU: 'cr', hZ: 'ct', h0: 'cptr', h1: 'ctxt', $9: 'fcs', fQ: 'focus-within', ip: 'fs', is: 'g', d$: 'hbh', d1: 'hc', fT: 'he', d2: 'hf', fU: 'hfp', iy: 'hv', iC: 'ic', iE: 'fr', c6: 'lbl', iH: 'iml', iI: 'imlf', iJ: 'imlp', iK: 'implw', iL: 'it', iV: 'i', gb: 'lnk', bn: 'nb', gj: 'notxt', jf: 'ol', jg: 'or', aQ: 'oq', jo: 'oh', dj: 'pg', gr: 'p', jq: 'ppe', jG: 'ui', gE: 'r', jL: 'sb', jM: 'sbx', jN: 'sby', jO: 'sbt', jS: 'e', jT: 'cap', jU: 'sev', j$: 'sk', gZ: 't', j6: 'tc', j7: 'w8', j8: 'w2', j9: 'w9', ka: 'tj', du: 'tja', kb: 'tl', kc: 'w3', kd: 'w5', ke: 'w4', kf: 'tr', kg: 'w6', kh: 'w1', ki: 'tun', kx: 'ts', a_: 'clr', ky: 'u', e7: 'wc', g7: 'we', e8: 'wf', g8: 'wfp', fa: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var $mdgriffith$elm_ui$Internal$Model$asEl = 2;
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fw);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.is);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dj);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gr);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gE);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.jS);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var $mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 13:
			var name = style.a;
			return name;
		case 12:
			var name = style.a;
			var o = style.b;
			return name;
		case 0:
			var _class = style.a;
			return _class;
		case 1:
			var name = style.a;
			return name;
		case 2:
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 3:
			var _class = style.a;
			return _class;
		case 4:
			var _class = style.a;
			return _class;
		case 5:
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 7:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 6:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 8:
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.jH)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.hV)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.jV.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.jV.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.gE) + ('-' + ($elm$core$String$fromInt(pos.ft) + ('-' + ($elm$core$String$fromInt(pos.kD) + ('-' + $elm$core$String$fromInt(pos.iv)))))));
		case 11:
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector) {
					case 0:
						return 'fs';
					case 1:
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.f$ ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.jb.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.jb.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.hE) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.aX) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.fv))
				])));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fQ) + ':focus-within',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.hG),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.hz),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										hE: shadow.hE,
										fv: shadow.fv,
										f$: false,
										jb: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.jb)),
										aX: shadow.aX
									}));
						},
						focus.jQ),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + ':focus .focusable, ') + (($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + '.focusable:focus, ') + ('.ui-slide-bar:focus + ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + ' .focusable-thumb'))),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.hG),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.hz),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										hE: shadow.hE,
										fv: shadow.fv,
										f$: false,
										jb: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.jb)),
										aX: shadow.aX
									}));
						},
						focus.jQ),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Style$AllChildren = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = 3;
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = 2;
var $mdgriffith$elm_ui$Internal$Style$Self = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var $mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var $mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var $mdgriffith$elm_ui$Internal$Style$Top = 0;
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hZ);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cS);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cU);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fx);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cT);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.at);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hp);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hi);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fk);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fj);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hj);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d$),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hB),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jO),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d1),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g8),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e7),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = 0;
var $mdgriffith$elm_ui$Internal$Style$Behind = 5;
var $mdgriffith$elm_ui$Internal$Style$Below = 1;
var $mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var $mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var $mdgriffith$elm_ui$Internal$Style$Within = 4;
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _v0 = function () {
		switch (loc) {
			case 0:
				return 0;
			case 1:
				return 0;
			case 2:
				return 0;
			case 3:
				return 0;
			case 4:
				return 0;
			default:
				return 0;
		}
	}();
	return _List_fromArray(
		[0, 1, 2, 3, 4, 5]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iC))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-height', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jG),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iE),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bn),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bn),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hf),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hC),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jg),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jf),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iE),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hB),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fa),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gj),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.h0),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.h1),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jq),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.a_),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.aQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.iy, $mdgriffith$elm_ui$Internal$Style$classes.a_)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.iy, $mdgriffith$elm_ui$Internal$Style$classes.aQ)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.$9, $mdgriffith$elm_ui$Internal$Style$classes.a_)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.$9, $mdgriffith$elm_ui$Internal$Style$classes.aQ)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fh, $mdgriffith$elm_ui$Internal$Style$classes.a_)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fh, $mdgriffith$elm_ui$Internal$Style$classes.aQ)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kx),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jL),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jM),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fw),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hS),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e7),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cL),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iL),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'inherit')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g7),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gb),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fU),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cR),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.ho,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hm,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hj),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hm,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hj),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hm,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.hm + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.ho + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.hm)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jU),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c6),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'baseline')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fw),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0px'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', 'min-content'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fT),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d2),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e8),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g8),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e7),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hl,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hn,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hn,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.hn,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.hn + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.hl + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.hn)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cR),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jU),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.is),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dj),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.hu + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.hu))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.hu + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.hu))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iK),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iI),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gr),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-wrap', 'break-word'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d$),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hB),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gr),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::after',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::before',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g7),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iE),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hB),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hf),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hC),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jg),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jf),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fw),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.is),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kh),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j8),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kc),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ke),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kd),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hF),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j7),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iV),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j$),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ky),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ky),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j$)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ki),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ka),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.du),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j6),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kf),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.hu + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.hu + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cR) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {cP: closing, z: _List_Nil, aC: _List_Nil, ad: selector};
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								aC: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.aC)
							});
					case 3:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								z: A2(
									$elm$core$List$cons,
									{cP: '\n}', z: _List_Nil, aC: props, ad: '@supports (' + (prop + (':' + (value + (') {' + parent.ad))))},
									rendered.z)
							});
					case 5:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.ad + (' + ' + selector), ''),
										adjRules),
									rendered.z)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.ad + (' > ' + child), ''),
										childRules),
									rendered.z)
							});
					case 2:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.ad + (' ' + child), ''),
										childRules),
									rendered.z)
							});
					case 4:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.ad, descriptor),
											''),
										descriptorRules),
									rendered.z)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.ad, ''),
										batched),
									rendered.z)
							});
				}
			});
		return A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.aC;
		if (!_v2.b) {
			return '';
		} else {
			return rule.ad + ('{' + (renderValues(rule.aC) + (rule.cP + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.z)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.i2;
	switch (_v0) {
		case 0:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'div',
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$elm$virtual_dom$VirtualDom$node,
						'style',
						_List_Nil,
						_List_fromArray(
							[
								$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
							]))
					]));
		case 1:
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 0:
			return 'serif';
		case 1:
			return 'sans-serif';
		case 2:
			return 'monospace';
		case 3:
			var name = font.a;
			return '\"' + (name + '\"');
		case 4:
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.i6;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return name === 'smcp';
		case 1:
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.g0);
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 1) {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo) {
				case 1:
					var _v2 = options.iy;
					switch (_v2) {
						case 0:
							return _List_Nil;
						case 2:
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 0:
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[
							selector + ('-fs:focus {' + (renderedProps + '\n}')),
							('.' + ($mdgriffith$elm_ui$Internal$Style$classes.hu + (':focus ' + (selector + '-fs  {')))) + (renderedProps + '\n}'),
							(selector + '-fs:focus-within {') + (renderedProps + '\n}'),
							('.ui-slide-bar:focus + ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hu) + (' .focusable-thumb' + (selector + '-fs {')))) + (renderedProps + '\n}')
						]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return '\"' + (name + '\"');
		case 1:
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.g0)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 0:
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 13:
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
						]));
			case 12:
				var name = rule.a;
				var transparency = rule.b;
				var opacity = A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, 1, 1 - transparency));
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'opacity',
							$elm$core$String$fromFloat(opacity))
						]));
			case 2:
				var i = rule.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			case 1:
				var name = rule.a;
				var typefaces = rule.b;
				var features = A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
				var families = _List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-family',
						A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-variant',
						A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
					]);
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 3:
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
						]));
			case 4:
				var _class = rule.a;
				var prop = rule.b;
				var color = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							prop,
							$mdgriffith$elm_ui$Internal$Model$formatColor(color))
						]));
			case 5:
				var cls = rule.a;
				var x = rule.b;
				var y = rule.c;
				var yPx = $elm$core$String$fromInt(y) + 'px';
				var xPx = $elm$core$String$fromInt(x) + 'px';
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.jS;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.gE;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.fa + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.fk;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.gr;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.dj;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.fj;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.fw;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.hu;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::after'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-top',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::before'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-bottom',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								]))
						]));
			case 7:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'padding',
							$elm$core$String$fromFloat(top) + ('px ' + ($elm$core$String$fromFloat(right) + ('px ' + ($elm$core$String$fromFloat(bottom) + ('px ' + ($elm$core$String$fromFloat(left) + 'px')))))))
						]));
			case 6:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-width',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 8:
				var template = rule.a;
				var toGridLengthHelper = F3(
					function (minimum, maximum, x) {
						toGridLengthHelper:
						while (true) {
							switch (x.$) {
								case 0:
									var px = x.a;
									return $elm$core$String$fromInt(px) + 'px';
								case 1:
									var _v2 = _Utils_Tuple2(minimum, maximum);
									if (_v2.a.$ === 1) {
										if (_v2.b.$ === 1) {
											var _v3 = _v2.a;
											var _v4 = _v2.b;
											return 'max-content';
										} else {
											var _v6 = _v2.a;
											var maxSize = _v2.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v2.b.$ === 1) {
											var minSize = _v2.a.a;
											var _v5 = _v2.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
										} else {
											var minSize = _v2.a.a;
											var maxSize = _v2.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 2:
									var i = x.a;
									var _v7 = _Utils_Tuple2(minimum, maximum);
									if (_v7.a.$ === 1) {
										if (_v7.b.$ === 1) {
											var _v8 = _v7.a;
											var _v9 = _v7.b;
											return $elm$core$String$fromInt(i) + 'fr';
										} else {
											var _v11 = _v7.a;
											var maxSize = _v7.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v7.b.$ === 1) {
											var minSize = _v7.a.a;
											var _v10 = _v7.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
										} else {
											var minSize = _v7.a.a;
											var maxSize = _v7.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 3:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = $elm$core$Maybe$Just(m),
										$temp$maximum = maximum,
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
								default:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = minimum,
										$temp$maximum = $elm$core$Maybe$Just(m),
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
							}
						}
					});
				var toGridLength = function (x) {
					return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
				};
				var xSpacing = toGridLength(template.jV.a);
				var ySpacing = toGridLength(template.jV.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.jH)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.hV)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.hV)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.jV.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.jV.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.hV)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.jH)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.hV)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.jV.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.jV.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 9:
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.gE) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.iv) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.ft) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.kD) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.gE) + (' / ' + ($elm$core$String$fromInt(position.gE + position.iv) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.ft) + (' / ' + ($elm$core$String$fromInt(position.ft + position.kD) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.gE) + ('-' + ($elm$core$String$fromInt(position.ft) + ('-' + ($elm$core$String$fromInt(position.kD) + ('-' + $elm$core$String$fromInt(position.iv)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 11:
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((!_v12.a.$) && (!_v12.b.$)) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.gZ + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.gZ)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.jT, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.ip, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.jT + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.jT))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.jT + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.gZ + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.jT + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.gZ)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {iv: height / size, aX: size, g3: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.hM, adjustment.hA, adjustment.ic, adjustment.i$]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.ic,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.hA,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.hM,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		hM: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		fS: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.iv)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.g3) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.aX) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _v2 = _with.hh;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.fS;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.hM;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					dp: _Utils_ap(
						rendered.dp,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					cC: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 1) {
							return rendered.cC;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.cC);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{dp: _List_Nil, cC: _List_Nil},
			stylesheet);
		var topLevel = _v0.cC;
		var rules = _v0.dp;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.i2;
		switch (_v0) {
			case 0:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			case 1:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.$9)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.$9)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return unkeyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 0:
					return A2(createNode, 'div', attributes);
				case 1:
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.jS))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.hu, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.cR, $mdgriffith$elm_ui$Internal$Style$classes.at, $mdgriffith$elm_ui$Internal$Style$classes.ho])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.hu, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.cR, $mdgriffith$elm_ui$Internal$Style$classes.at, $mdgriffith$elm_ui$Internal$Style$classes.hm])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.hu, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.cR, $mdgriffith$elm_ui$Internal$Style$classes.hn])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.hu, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.cR, $mdgriffith$elm_ui$Internal$Style$classes.hl])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.gZ + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.e7 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d1)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.hu + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.gZ + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.e8 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d2)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.j0 : _Utils_ap(styled.j0, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.j0 : _Utils_ap(styled.j0, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.j0 : _Utils_ap(styled.j0, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.j0 : _Utils_ap(styled.j0, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.j0 : _Utils_ap(rendered.j0, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.aK,
						rendered.aP,
						rendered.dB,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.cO)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						iz: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.aK,
							rendered.aP,
							rendered.dB,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.cO))),
						j0: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.j0 : _Utils_ap(rendered.j0, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.aK,
						rendered.aP,
						rendered.dB,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.cO)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						iz: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.aK,
							rendered.aP,
							rendered.dB,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.cO))),
						j0: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.bn, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.hf]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.bn, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.hC]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.bn, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.jg]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.bn, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.jf]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.bn, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.iE]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.bn, $mdgriffith$elm_ui$Internal$Style$classes.jS, $mdgriffith$elm_ui$Internal$Style$classes.hB]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return $elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.dy + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fj);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.dy + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fk);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.dy + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.hj);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.dz + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.hp);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.dz + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.hi);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.dz + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.hk);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 1:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.fT + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.d1,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.d2,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.fU + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.hu + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.fw + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px !important');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.g7 + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.e7,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.e8,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.g8 + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.hu + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gE + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 3) {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 2:
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 7:
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 1) {
					return {
						dB: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						cO: children,
						aK: has,
						aP: node,
						j0: styles
					};
				} else {
					var _class = _v1.a;
					return {
						dB: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						cO: children,
						aK: has,
						aP: node,
						j0: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 0:
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 3:
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 1:
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 4:
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 10:
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 7:
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 0:
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.g7 + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e7),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e8),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.g8 + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.hu + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gE + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 8:
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 0:
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.fT + (' ' + (name + (' ' + classes))),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.d1 + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.d2 + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.fU + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.hu + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.fw + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 2:
						var description = attribute.a;
						switch (description.$) {
							case 0:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 1:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 2:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 3:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 4:
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 9:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 8:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 5:
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 6:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 9:
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 3:
									return styles;
								case 2:
									var str = elem.a;
									return styles;
								case 0:
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.j0);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 6:
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var $mdgriffith$elm_ui$Internal$Model$Layout = 0;
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	hz: $elm$core$Maybe$Nothing,
	hG: $elm$core$Maybe$Nothing,
	jQ: $elm$core$Maybe$Just(
		{
			hE: 0,
			fv: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			jb: _Utils_Tuple2(0, 0),
			aX: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.iy;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								iy: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.$9;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								$9: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.i2;
					if (_v6.$ === 1) {
						return _Utils_update(
							record,
							{
								i2: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			$9: function () {
				var _v0 = record.$9;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			iy: function () {
				var _v1 = record.iy;
				if (_v1.$ === 1) {
					return 1;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			i2: function () {
				var _v2 = record.i2;
				if (_v2.$ === 1) {
					return 0;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{$9: $elm$core$Maybe$Nothing, iy: $elm$core$Maybe$Nothing, i2: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.j0;
				var html = el.a.iz;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.i2;
			if (_v0 === 1) {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 0:
						return 'serif';
					case 1:
						return 'sans-serif';
					case 2:
						return 'monospace';
					case 3:
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.i6;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.jn;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.jG, $mdgriffith$elm_ui$Internal$Style$classes.hu, $mdgriffith$elm_ui$Internal$Style$classes.jS]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $author$project$Ui$Palette$Distance$M = 0;
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$bold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.hF);
var $mdgriffith$elm_ui$Internal$Flag$fontAlignment = $mdgriffith$elm_ui$Internal$Flag$flag(12);
var $mdgriffith$elm_ui$Element$Font$center = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.j6);
var $author$project$Ui$Palette$Color$NeonOrange = 12;
var $author$project$Ui$CustomElements$colorAccuracyFunction = 12;
var $author$project$Page$AccuracyFunction$dateGuessed = A3($author$project$Field$Date$fromCalendarDate, 2022, 8, 1);
var $author$project$Page$AccuracyFunction$dateNMD = A3($author$project$Field$Date$fromCalendarDate, 2022, 10, 10);
var $yotamDvir$elm_katex$Katex$Configs$Math = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $yotamDvir$elm_katex$Katex$Configs$display = $yotamDvir$elm_katex$Katex$Configs$Math(true);
var $yotamDvir$elm_katex$Katex$display = A2($elm$core$Basics$composeL, $yotamDvir$elm_katex$Katex$Configs$display, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $author$project$Ui$Palette$Distance$S = 6;
var $author$project$Ui$Palette$Distance$XB = 2;
var $author$project$Ui$Palette$Color$Black = 6;
var $author$project$Ui$Palette$FontSize$M = 0;
var $author$project$Ui$Palette$Color$White = 7;
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX(1);
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $mdgriffith$elm_ui$Element$rgb255 = F3(
	function (red, green, blue) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, 1);
	});
var $author$project$Ui$Palette$Color$toTuple = function (color) {
	switch (color) {
		case 0:
			return _Utils_Tuple3(0, 0, 0);
		case 4:
			return _Utils_Tuple3(55, 64, 69);
		case 5:
			return _Utils_Tuple3(44, 6, 31);
		case 2:
			return _Utils_Tuple3(255, 255, 255);
		case 3:
			return _Utils_Tuple3(255, 216, 159);
		case 1:
			return _Utils_Tuple3(216, 146, 22);
		case 6:
			return _Utils_Tuple3(0, 0, 0);
		case 7:
			return _Utils_Tuple3(255, 255, 255);
		case 8:
			return _Utils_Tuple3(151, 153, 155);
		case 9:
			return _Utils_Tuple3(199, 35, 177);
		case 10:
			return _Utils_Tuple3(77, 77, 255);
		case 11:
			return _Utils_Tuple3(224, 231, 34);
		case 12:
			return _Utils_Tuple3(255, 173, 0);
		case 13:
			return _Utils_Tuple3(210, 39, 48);
		case 14:
			return _Utils_Tuple3(219, 62, 177);
		default:
			return _Utils_Tuple3(68, 214, 44);
	}
};
var $author$project$Ui$Palette$Color$translate = function (color) {
	var _v0 = $author$project$Ui$Palette$Color$toTuple(color);
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return A3($mdgriffith$elm_ui$Element$rgb255, r, g, b);
};
var $elm$core$Basics$pow = _Basics_pow;
var $mdgriffith$elm_ui$Element$modular = F3(
	function (normal, ratio, rescale) {
		return (!rescale) ? normal : ((rescale < 0) ? (normal * A2($elm$core$Basics$pow, ratio, rescale)) : (normal * A2($elm$core$Basics$pow, ratio, rescale - 1)));
	});
var $author$project$Ui$Palette$FontSize$translate = function (size) {
	var m = 16;
	var fontSize = A2(
		$elm$core$Basics$composeR,
		A2($mdgriffith$elm_ui$Element$modular, 16, 1.25),
		$myrho$elm_round$Round$truncate);
	switch (size) {
		case 0:
			return fontSize(1);
		case 1:
			return fontSize(2);
		case 2:
			return fontSize(3);
		case 3:
			return fontSize(4);
		case 4:
			return fontSize(5);
		case 5:
			return fontSize(6);
		case 6:
			return fontSize(-1);
		case 7:
			return fontSize(-2);
		case 8:
			return fontSize(-3);
		default:
			return fontSize(-4);
	}
};
var $author$project$Ui$CustomElements$basicPageLayout = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$width(
		A2($mdgriffith$elm_ui$Element$maximum, 600, $mdgriffith$elm_ui$Element$fill)),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$Background$color(
		$author$project$Ui$Palette$Color$translate(6)),
		$mdgriffith$elm_ui$Element$Font$color(
		$author$project$Ui$Palette$Color$translate(7)),
		$mdgriffith$elm_ui$Element$Font$size(
		$author$project$Ui$Palette$FontSize$translate(0)),
		$mdgriffith$elm_ui$Element$centerX
	]);
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.hZ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fx)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$padding = function (x) {
	var f = x;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			f,
			f,
			f,
			f));
};
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $author$project$Ui$Palette$Distance$translate = function (size) {
	switch (size) {
		case 0:
			return 8;
		case 1:
			return 13;
		case 2:
			return 21;
		case 3:
			return 34;
		case 4:
			return 55;
		case 5:
			return 89;
		case 6:
			return 5;
		case 7:
			return 3;
		case 8:
			return 2;
		default:
			return 1;
	}
};
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $author$project$Ui$CustomElements$explanationPage = F2(
	function (frameColor, content) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(0)),
				$author$project$Ui$CustomElements$basicPageLayout),
			A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$color(
						$author$project$Ui$Palette$Color$translate(frameColor)),
						$mdgriffith$elm_ui$Element$Border$width(
						$author$project$Ui$Palette$Distance$translate(6)),
						$mdgriffith$elm_ui$Element$padding(
						$author$project$Ui$Palette$Distance$translate(0)),
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(2)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				content));
	});
var $yotamDvir$elm_katex$Katex$Configs$inline = $yotamDvir$elm_katex$Katex$Configs$Math(false);
var $yotamDvir$elm_katex$Katex$inline = A2($elm$core$Basics$composeL, $yotamDvir$elm_katex$Katex$Configs$inline, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 9};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $yotamDvir$elm_katex$Katex$Configs$generate = F4(
	function (g, m, h, latex) {
		var g_ = A2(g, m, h);
		if (!latex.$) {
			var f = latex.a;
			return A2(
				g_,
				$elm$core$Maybe$Nothing,
				f(h));
		} else {
			var b = latex.a;
			var f = latex.b;
			var env = b ? 'display' : 'inline';
			return A2(
				g_,
				$elm$core$Maybe$Just(b),
				'$begin-' + (env + ('$' + (f(m) + ('$end-' + (env + '$'))))));
		}
	});
var $yotamDvir$elm_katex$Katex$generate = function (g) {
	return A3(
		$yotamDvir$elm_katex$Katex$Configs$generate,
		F2(
			function (_v0, _v1) {
				return g;
			}),
		'',
		'');
};
var $yotamDvir$elm_katex$Katex$print = $yotamDvir$elm_katex$Katex$generate(
	function (_v0) {
		return $elm$core$Basics$identity;
	});
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $mdgriffith$elm_ui$Internal$Model$AsTextColumn = 5;
var $mdgriffith$elm_ui$Internal$Model$asTextColumn = 5;
var $mdgriffith$elm_ui$Internal$Model$Min = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$minimum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Min, i, l);
	});
var $mdgriffith$elm_ui$Element$textColumn = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asTextColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width(
					A2(
						$mdgriffith$elm_ui$Element$maximum,
						750,
						A2($mdgriffith$elm_ui$Element$minimum, 500, $mdgriffith$elm_ui$Element$fill))),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $author$project$Field$Date$toPrettyString = $justinmimbs$date$Date$format('MMMM ddd, y');
var $author$project$Page$AccuracyFunction$view = function (model) {
	return A2(
		$author$project$Ui$CustomElements$explanationPage,
		$author$project$Ui$CustomElements$colorAccuracyFunction,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$bold]),
				$mdgriffith$elm_ui$Element$text('How is my accuracy computed?')),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(0))
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('Let\'s say you guessed '),
								$mdgriffith$elm_ui$Element$text(
								$author$project$Field$Date$toPrettyString($author$project$Page$AccuracyFunction$dateGuessed)),
								$mdgriffith$elm_ui$Element$text(' with a confidence of 34% and the No-Mask-Day falls on '),
								$mdgriffith$elm_ui$Element$text(
								$author$project$Field$Date$toPrettyString($author$project$Page$AccuracyFunction$dateNMD)),
								$mdgriffith$elm_ui$Element$text('. What is your accuracy then? Easy! Just plug in the numbers into this formula')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$center]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$display('c \\cdot \\exp\\bigg(-\\left( \\frac{c \\cdot \\Delta d}{36} \\right)^2\\bigg) + \\frac{1 - c}{4}')))
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('where '),
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$inline('c'))),
								$mdgriffith$elm_ui$Element$text(' is your confidence as decimal number and '),
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$inline('\\Delta d'))),
								$mdgriffith$elm_ui$Element$text(' the differenc in days between your guessed date and the actual No-Mask-Day. So in our example we have '),
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$inline('c = 0.34'))),
								$mdgriffith$elm_ui$Element$text(' and '),
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$inline(
										'\\Delta d = ' + $elm$core$String$fromInt(
											$justinmimbs$date$Date$toRataDie($author$project$Page$AccuracyFunction$dateNMD) - $justinmimbs$date$Date$toRataDie($author$project$Page$AccuracyFunction$dateGuessed))))),
								$mdgriffith$elm_ui$Element$text('. That checks out to be an accuracy of roughly 0.38.')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('Ok... maybe it\'s not that easy. But you don\'t have to understand this formula in order to bet. The page for filling in the details of your bet shows you a plot of the accuracy for every day. Just play with it! You will quickly get a feel for it.')
							]))
					]))
			]));
};
var $author$project$Ui$Palette$Distance$B = 1;
var $author$project$Ui$Palette$Color$NeonRed = 13;
var $mdgriffith$elm_ui$Internal$Model$Left = 0;
var $mdgriffith$elm_ui$Element$alignLeft = $mdgriffith$elm_ui$Internal$Model$AlignX(0);
var $author$project$Ui$Palette$FontSize$XXB = 3;
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Bottom = 2;
var $mdgriffith$elm_ui$Element$alignBottom = $mdgriffith$elm_ui$Internal$Model$AlignY(2);
var $mdgriffith$elm_ui$Internal$Model$Right = 2;
var $mdgriffith$elm_ui$Element$alignRight = $mdgriffith$elm_ui$Internal$Model$AlignX(2);
var $author$project$Ui$Palette$Distance$XXS = 8;
var $author$project$Ui$CustomElements$coloredBoxSize = 75;
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $author$project$Ui$CustomElements$colorBox = F2(
	function (color, content) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$color(
						$author$project$Ui$Palette$Color$translate(color)),
						$mdgriffith$elm_ui$Element$Border$width(
						$author$project$Ui$Palette$Distance$translate(8))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px($author$project$Ui$CustomElements$coloredBoxSize)),
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px($author$project$Ui$CustomElements$coloredBoxSize))
					])),
			content);
	});
var $mdgriffith$elm_ui$Element$Font$underline = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ky);
var $author$project$Ui$CustomElements$betBox = A2(
	$author$project$Ui$CustomElements$colorBox,
	13,
	_List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$Font$size(
					$author$project$Ui$Palette$FontSize$translate(3)),
					$mdgriffith$elm_ui$Element$Font$underline,
					$mdgriffith$elm_ui$Element$alignBottom
				]),
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$alignRight]),
				$mdgriffith$elm_ui$Element$text('bet')))
		]));
var $author$project$Ui$CustomElements$noBorder = {bL: 0, bk: 0, bu: 0, cB: 0};
var $mdgriffith$elm_ui$Internal$Model$AsRow = 0;
var $mdgriffith$elm_ui$Internal$Model$asRow = 0;
var $mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fx + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.at)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$Border$widthXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$borderWidth,
			A5(
				$mdgriffith$elm_ui$Internal$Model$BorderWidth,
				'b-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Element$Border$widthEach = function (_v0) {
	var bottom = _v0.bL;
	var top = _v0.cB;
	var left = _v0.bk;
	var right = _v0.bu;
	return (_Utils_eq(top, bottom) && _Utils_eq(left, right)) ? (_Utils_eq(top, right) ? $mdgriffith$elm_ui$Element$Border$width(top) : A2($mdgriffith$elm_ui$Element$Border$widthXY, left, top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left))))))),
			top,
			right,
			bottom,
			left));
};
var $author$project$Ui$CustomElements$betLayout = function (content) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_Utils_ap(
			$author$project$Ui$CustomElements$basicPageLayout,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(1))
				])),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignLeft]),
						$author$project$Ui$CustomElements$betBox),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$Border$widthEach(
								_Utils_update(
									$author$project$Ui$CustomElements$noBorder,
									{bL: 2})),
								$mdgriffith$elm_ui$Element$Border$color(
								$author$project$Ui$Palette$Color$translate(13))
							]),
						A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$padding(
									$author$project$Ui$Palette$Distance$translate(6))
								]),
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('choose your points distribution by selecting date and spread')
								])))
					])),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$padding(
						$author$project$Ui$Palette$Distance$translate(1)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				content)
			]));
};
var $author$project$Ui$Palette$Color$NeonBlue = 10;
var $mdgriffith$elm_ui$Internal$Model$Top = 0;
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY(0);
var $author$project$Ui$CustomElements$betInputWrapper = F2(
	function (param, content) {
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$alignTop,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(6))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$alignTop,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(param.f6),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							_Utils_update(
								$author$project$Ui$CustomElements$noBorder,
								{bu: 1})),
							$mdgriffith$elm_ui$Element$Border$color(
							$author$project$Ui$Palette$Color$translate(param.fv))
						]),
					A2(
						$elm$core$List$map,
						function (c) {
							return A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerX]),
								$mdgriffith$elm_ui$Element$text(c));
						},
						A2($elm$core$String$split, '', param.gZ))),
					content
				]));
	});
var $author$project$Logic$Logic$SetConfidence = function (a) {
	return {$: 23, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Behind = 5;
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 3) {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 5, element);
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $mdgriffith$elm_ui$Element$Input$Thumb = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $mdgriffith$elm_ui$Element$Input$defaultThumb = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$width(
		$mdgriffith$elm_ui$Element$px(16)),
		$mdgriffith$elm_ui$Element$height(
		$mdgriffith$elm_ui$Element$px(16)),
		$mdgriffith$elm_ui$Element$Border$rounded(8),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$Border$color(
		A3($mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5)),
		$mdgriffith$elm_ui$Element$Background$color(
		A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
	]);
var $mdgriffith$elm_ui$Element$Input$HiddenLabel = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Element$Input$labelHidden = $mdgriffith$elm_ui$Element$Input$HiddenLabel;
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $mdgriffith$elm_ui$Internal$Flag$active = $mdgriffith$elm_ui$Internal$Flag$flag(32);
var $mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 6};
var $mdgriffith$elm_ui$Element$Region$announce = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$LivePolite);
var $mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 1) {
			var labelText = label.a;
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asColumn,
				$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position) {
				case 2:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.c6),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 3:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.c6),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 0:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.c6),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.c6),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Internal$Flag$focus = $mdgriffith$elm_ui$Internal$Flag$flag(31);
var $mdgriffith$elm_ui$Internal$Model$getHeight = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (attr, acc) {
				if (!acc.$) {
					var x = acc.a;
					return $elm$core$Maybe$Just(x);
				} else {
					if (attr.$ === 8) {
						var len = attr.a;
						return $elm$core$Maybe$Just(len);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			}),
		$elm$core$Maybe$Nothing,
		attrs);
};
var $mdgriffith$elm_ui$Internal$Model$getSpacing = F2(
	function (attrs, _default) {
		return A2(
			$elm$core$Maybe$withDefault,
			_default,
			A3(
				$elm$core$List$foldr,
				F2(
					function (attr, acc) {
						if (!acc.$) {
							var x = acc.a;
							return $elm$core$Maybe$Just(x);
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 5)) {
								var _v2 = attr.b;
								var x = _v2.b;
								var y = _v2.c;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(x, y));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}),
				$elm$core$Maybe$Nothing,
				attrs));
	});
var $mdgriffith$elm_ui$Internal$Model$getWidth = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (attr, acc) {
				if (!acc.$) {
					var x = acc.a;
					return $elm$core$Maybe$Just(x);
				} else {
					if (attr.$ === 7) {
						var len = attr.a;
						return $elm$core$Maybe$Just(len);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			}),
		$elm$core$Maybe$Nothing,
		attrs);
};
var $mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 1) {
		var textLabel = label.a;
		return $mdgriffith$elm_ui$Internal$Model$Describe(
			$mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var $mdgriffith$elm_ui$Internal$Flag$hover = $mdgriffith$elm_ui$Internal$Flag$flag(33);
var $mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $mdgriffith$elm_ui$Element$spacingXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$spacing,
			A3(
				$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
				A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, y),
				x,
				y));
	});
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$core$String$toFloat = _String_toFloat;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$fillPortion = $mdgriffith$elm_ui$Internal$Model$Fill;
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 1:
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						iz: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.iz, add, context));
							}),
						j0: styled.j0
					});
			case 0:
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 2:
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $mdgriffith$elm_ui$Internal$Model$mapAttr = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Element$Input$viewHorizontalThumb = F3(
	function (factor, thumbAttributes, trackHeight) {
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height(
					A2($elm$core$Maybe$withDefault, $mdgriffith$elm_ui$Element$fill, trackHeight)),
					$mdgriffith$elm_ui$Element$centerY
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$fillPortion(
								$elm$core$Basics$round(factor * 10000)))
						]),
					$mdgriffith$elm_ui$Element$none),
					A2(
					$mdgriffith$elm_ui$Element$el,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$centerY,
						A2(
							$elm$core$List$map,
							$mdgriffith$elm_ui$Internal$Model$mapAttr($elm$core$Basics$never),
							thumbAttributes)),
					$mdgriffith$elm_ui$Element$none),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$fillPortion(
								$elm$core$Basics$round(
									$elm$core$Basics$abs(1 - factor) * 10000)))
						]),
					$mdgriffith$elm_ui$Element$none)
				]));
	});
var $mdgriffith$elm_ui$Element$Input$viewVerticalThumb = F3(
	function (factor, thumbAttributes, trackWidth) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$width(
					A2($elm$core$Maybe$withDefault, $mdgriffith$elm_ui$Element$fill, trackWidth)),
					$mdgriffith$elm_ui$Element$centerX
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$fillPortion(
								$elm$core$Basics$round(
									$elm$core$Basics$abs(1 - factor) * 10000)))
						]),
					$mdgriffith$elm_ui$Element$none),
					A2(
					$mdgriffith$elm_ui$Element$el,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$centerX,
						A2(
							$elm$core$List$map,
							$mdgriffith$elm_ui$Internal$Model$mapAttr($elm$core$Basics$never),
							thumbAttributes)),
					$mdgriffith$elm_ui$Element$none),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$fillPortion(
								$elm$core$Basics$round(factor * 10000)))
						]),
					$mdgriffith$elm_ui$Element$none)
				]));
	});
var $mdgriffith$elm_ui$Element$Input$slider = F2(
	function (attributes, input) {
		var trackWidth = $mdgriffith$elm_ui$Internal$Model$getWidth(attributes);
		var trackHeight = $mdgriffith$elm_ui$Internal$Model$getHeight(attributes);
		var vertical = function () {
			var _v8 = _Utils_Tuple2(trackWidth, trackHeight);
			_v8$3:
			while (true) {
				if (_v8.a.$ === 1) {
					if (_v8.b.$ === 1) {
						var _v9 = _v8.a;
						var _v10 = _v8.b;
						return false;
					} else {
						break _v8$3;
					}
				} else {
					if ((!_v8.a.a.$) && (!_v8.b.$)) {
						switch (_v8.b.a.$) {
							case 0:
								var w = _v8.a.a.a;
								var h = _v8.b.a.a;
								return _Utils_cmp(h, w) > 0;
							case 2:
								return true;
							default:
								break _v8$3;
						}
					} else {
						break _v8$3;
					}
				}
			}
			return false;
		}();
		var factor = (input.kA - input.e) / (input.d - input.e);
		var _v0 = input.kj;
		var thumbAttributes = _v0;
		var height = $mdgriffith$elm_ui$Internal$Model$getHeight(thumbAttributes);
		var thumbHeightString = function () {
			if (height.$ === 1) {
				return '20px';
			} else {
				if (!height.a.$) {
					var px = height.a.a;
					return $elm$core$String$fromInt(px) + 'px';
				} else {
					return '100%';
				}
			}
		}();
		var width = $mdgriffith$elm_ui$Internal$Model$getWidth(thumbAttributes);
		var thumbWidthString = function () {
			if (width.$ === 1) {
				return '20px';
			} else {
				if (!width.a.$) {
					var px = width.a.a;
					return $elm$core$String$fromInt(px) + 'px';
				} else {
					return '100%';
				}
			}
		}();
		var className = 'thmb-' + (thumbWidthString + ('-' + thumbHeightString));
		var thumbShadowStyle = _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', thumbWidthString),
				A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', thumbHeightString)
			]);
		var _v1 = A2(
			$mdgriffith$elm_ui$Internal$Model$getSpacing,
			attributes,
			_Utils_Tuple2(5, 5));
		var spacingX = _v1.a;
		var spacingY = _v1.b;
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(input.iX) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : A2($mdgriffith$elm_ui$Element$spacingXY, spacingX, spacingY),
					$mdgriffith$elm_ui$Element$Region$announce,
					$mdgriffith$elm_ui$Element$width(
					function () {
						if (trackWidth.$ === 1) {
							return $mdgriffith$elm_ui$Element$fill;
						} else {
							if (!trackWidth.a.$) {
								return $mdgriffith$elm_ui$Element$shrink;
							} else {
								var x = trackWidth.a;
								return x;
							}
						}
					}()),
					$mdgriffith$elm_ui$Element$height(
					function () {
						if (trackHeight.$ === 1) {
							return $mdgriffith$elm_ui$Element$shrink;
						} else {
							if (!trackHeight.a.$) {
								return $mdgriffith$elm_ui$Element$shrink;
							} else {
								var x = trackHeight.a;
								return x;
							}
						}
					}())
				]),
			input.iX,
			A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						A2($elm$core$Maybe$withDefault, $mdgriffith$elm_ui$Element$fill, trackWidth)),
						$mdgriffith$elm_ui$Element$height(
						A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Element$px(20),
							trackHeight))
					]),
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName('input'),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(input.iX),
								A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$active,
								A2($mdgriffith$elm_ui$Internal$Model$Style, 'input[type=\"range\"].' + (className + '::-moz-range-thumb'), thumbShadowStyle)),
								A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$hover,
								A2($mdgriffith$elm_ui$Internal$Model$Style, 'input[type=\"range\"].' + (className + '::-webkit-slider-thumb'), thumbShadowStyle)),
								A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$focus,
								A2($mdgriffith$elm_ui$Internal$Model$Style, 'input[type=\"range\"].' + (className + '::-ms-thumb'), thumbShadowStyle)),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$class(className + ' ui-slide-bar focusable-parent')),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Events$onInput(
									function (str) {
										var _v4 = $elm$core$String$toFloat(str);
										if (_v4.$ === 1) {
											return input.jd(0);
										} else {
											var val = _v4.a;
											return input.jd(val);
										}
									})),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_('range')),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$step(
									function () {
										var _v5 = input.jZ;
										if (_v5.$ === 1) {
											return 'any';
										} else {
											var step = _v5.a;
											return $elm$core$String$fromFloat(step);
										}
									}())),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$min(
									$elm$core$String$fromFloat(input.e))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$max(
									$elm$core$String$fromFloat(input.d))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$value(
									$elm$core$String$fromFloat(input.kA))),
								vertical ? $mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$attribute, 'orient', 'vertical')) : $mdgriffith$elm_ui$Internal$Model$NoAttribute,
								$mdgriffith$elm_ui$Element$width(
								vertical ? A2(
									$elm$core$Maybe$withDefault,
									$mdgriffith$elm_ui$Element$px(20),
									trackHeight) : A2($elm$core$Maybe$withDefault, $mdgriffith$elm_ui$Element$fill, trackWidth)),
								$mdgriffith$elm_ui$Element$height(
								vertical ? A2($elm$core$Maybe$withDefault, $mdgriffith$elm_ui$Element$fill, trackWidth) : A2(
									$elm$core$Maybe$withDefault,
									$mdgriffith$elm_ui$Element$px(20),
									trackHeight))
							]),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil)),
						A2(
						$mdgriffith$elm_ui$Element$el,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width(
								A2($elm$core$Maybe$withDefault, $mdgriffith$elm_ui$Element$fill, trackWidth)),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height(
									A2(
										$elm$core$Maybe$withDefault,
										$mdgriffith$elm_ui$Element$px(20),
										trackHeight)),
								_Utils_ap(
									attributes,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$behindContent(
											vertical ? A3(
												$mdgriffith$elm_ui$Element$Input$viewVerticalThumb,
												factor,
												A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$htmlClass('focusable-thumb'),
													thumbAttributes),
												trackWidth) : A3(
												$mdgriffith$elm_ui$Element$Input$viewHorizontalThumb,
												factor,
												A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$htmlClass('focusable-thumb'),
													thumbAttributes),
												trackHeight))
										])))),
						$mdgriffith$elm_ui$Element$none)
					])));
	});
var $author$project$Page$Bet$confidenceSlider = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(30)),
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px(30)),
						$mdgriffith$elm_ui$Element$Font$color(
						$author$project$Ui$Palette$Color$translate(10)),
						$mdgriffith$elm_ui$Element$Font$bold
					]),
				function () {
					var _v0 = $author$project$Valid$AutoCheck$publicObject(model.cQ);
					if (!_v0.$) {
						var confidence = _v0.a;
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$Border$width(1)
								]),
							A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
								$mdgriffith$elm_ui$Element$text(
									$author$project$Field$Confidence$toString(confidence))));
					} else {
						return $mdgriffith$elm_ui$Element$none;
					}
				}()),
				A2(
				$mdgriffith$elm_ui$Element$Input$slider,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(30)),
						$mdgriffith$elm_ui$Element$behindContent(
						A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(2)),
									$mdgriffith$elm_ui$Element$centerX,
									$mdgriffith$elm_ui$Element$Background$color(
									$author$project$Ui$Palette$Color$translate(7)),
									$mdgriffith$elm_ui$Element$Border$rounded(2)
								]),
							$mdgriffith$elm_ui$Element$none))
					]),
				{
					iX: $mdgriffith$elm_ui$Element$Input$labelHidden('spread slider'),
					d: 100,
					e: 0,
					jd: A2($elm$core$Basics$composeR, $elm$core$Basics$round, $author$project$Logic$Logic$SetConfidence),
					jZ: $elm$core$Maybe$Just(1),
					kj: $mdgriffith$elm_ui$Element$Input$defaultThumb,
					kA: A2(
						$elm$core$Maybe$withDefault,
						0,
						A2(
							$elm$core$Maybe$map,
							$author$project$Field$Confidence$toInt,
							$author$project$Valid$AutoCheck$publicObject(model.cQ)))
				})
			]));
};
var $author$project$Page$Bet$chooseConfidence = function (model) {
	return A2(
		$author$project$Ui$CustomElements$betInputWrapper,
		{fv: 10, f6: -1, gZ: 'spread'},
		$author$project$Page$Bet$confidenceSlider(model));
};
var $author$project$Logic$Logic$DatePickerEvent = function (a) {
	return {$: 24, a: a};
};
var $author$project$Ui$Palette$Color$VeryGray = 8;
var $author$project$Ui$Palette$Distance$XS = 7;
var $justinmimbs$date$Date$isBetween = F3(
	function (_v0, _v1, _v2) {
		var a = _v0;
		var b = _v1;
		var x = _v2;
		return A3($justinmimbs$date$Date$isBetweenInt, a, b, x);
	});
var $mdgriffith$elm_ui$Element$Font$strike = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.j$);
var $author$project$Page$Bet$datePickerSettings = {
	dM: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$height(
			$mdgriffith$elm_ui$Element$px(30)),
			$mdgriffith$elm_ui$Element$width(
			$mdgriffith$elm_ui$Element$px(30)),
			$mdgriffith$elm_ui$Element$Font$center
		]),
	dP: function (d) {
		return !A3($justinmimbs$date$Date$isBetween, $author$project$Logic$Logic$startOfBet, $author$project$Logic$Logic$endOfBet, d);
	},
	dQ: _List_fromArray(
		[$mdgriffith$elm_ui$Element$Font$strike]),
	c1: 0,
	d0: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
			$mdgriffith$elm_ui$Element$padding(
			$author$project$Ui$Palette$Distance$translate(7))
		]),
	b9: $elm$core$Maybe$Nothing,
	er: $mdgriffith$elm_ui$Element$text('▶'),
	ew: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$centerX,
			$mdgriffith$elm_ui$Element$alignTop,
			$mdgriffith$elm_ui$Element$Font$size(
			$author$project$Ui$Palette$FontSize$translate(0)),
			$mdgriffith$elm_ui$Element$Font$center
		]),
	eA: A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$padding(
				$author$project$Ui$Palette$Distance$translate(0))
			]),
		$mdgriffith$elm_ui$Element$text('◀')),
	eH: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Font$color(
			$author$project$Ui$Palette$Color$translate(13)),
			$mdgriffith$elm_ui$Element$Font$bold,
			$mdgriffith$elm_ui$Element$Border$width(1)
		]),
	eY: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$centerX,
			$mdgriffith$elm_ui$Element$centerY,
			$mdgriffith$elm_ui$Element$height(
			$mdgriffith$elm_ui$Element$px(25 + (30 * 6))),
			$mdgriffith$elm_ui$Element$width(
			$mdgriffith$elm_ui$Element$px(30 * 7))
		]),
	e$: _List_Nil,
	e5: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$alignTop,
			$mdgriffith$elm_ui$Element$height(
			$mdgriffith$elm_ui$Element$px(25))
		]),
	fb: _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Font$color(
			$author$project$Ui$Palette$Color$translate(8))
		])
};
var $author$project$DatePicker$Internal$TestHelper$testAttribute = function (name) {
	return A2($elm$html$Html$Attributes$attribute, 'elm-test', name);
};
var $author$project$DatePicker$Internal$TestHelper$calendarAttrHtml = $author$project$DatePicker$Internal$TestHelper$testAttribute('calendar');
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $author$project$DatePicker$Internal$TestHelper$calendarAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$calendarAttrHtml);
var $mdgriffith$elm_ui$Element$mapAttribute = $mdgriffith$elm_ui$Internal$Model$mapAttr;
var $author$project$DatePicker$DatePicker$extAttrs = $elm$core$List$map(
	$mdgriffith$elm_ui$Element$mapAttribute($elm$core$Basics$never));
var $author$project$DatePicker$DatePicker$ChangeMonth = function (a) {
	return {$: 0, a: a};
};
var $justinmimbs$date$Date$Months = 1;
var $author$project$DatePicker$DatePicker$PickerChanged = function (a) {
	return {$: 1, a: a};
};
var $justinmimbs$date$Date$add = F3(
	function (unit, n, _v0) {
		var rd = _v0;
		switch (unit) {
			case 0:
				return A3($justinmimbs$date$Date$add, 1, 12 * n, rd);
			case 1:
				var date = $justinmimbs$date$Date$toCalendarDate(rd);
				var wholeMonths = ((12 * (date.hc - 1)) + ($justinmimbs$date$Date$monthToNumber(date.ge) - 1)) + n;
				var m = $justinmimbs$date$Date$numberToMonth(
					A2($elm$core$Basics$modBy, 12, wholeMonths) + 1);
				var y = A2($justinmimbs$date$Date$floorDiv, wholeMonths, 12) + 1;
				return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A2(
					$elm$core$Basics$min,
					date.fA,
					A2($justinmimbs$date$Date$daysInMonth, y, m));
			case 2:
				return rd + (7 * n);
			default:
				return rd + n;
		}
	});
var $mdgriffith$elm_ui$Element$map = $mdgriffith$elm_ui$Internal$Model$map;
var $author$project$DatePicker$DatePicker$extEle = $mdgriffith$elm_ui$Element$map($elm$core$Basics$never);
var $author$project$DatePicker$Internal$Date$formatMaybeLanguage = F2(
	function (maybeLanguage, string) {
		if (!maybeLanguage.$) {
			var language = maybeLanguage.a;
			return A2($justinmimbs$date$Date$formatWithLanguage, language, string);
		} else {
			return $justinmimbs$date$Date$format(string);
		}
	});
var $author$project$DatePicker$Internal$TestHelper$nextMonthAttrHtml = $author$project$DatePicker$Internal$TestHelper$testAttribute('nextMonth');
var $author$project$DatePicker$Internal$TestHelper$nextMonthAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$nextMonthAttrHtml);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.h0);
var $author$project$DatePicker$Internal$TestHelper$previousMonthAttrHtml = $author$project$DatePicker$Internal$TestHelper$testAttribute('previousMonth');
var $author$project$DatePicker$Internal$TestHelper$previousMonthAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$previousMonthAttrHtml);
var $author$project$DatePicker$DatePicker$pickerHeader = function (_v0) {
	var picker = _v0.ce;
	var onChange = _v0.jd;
	var settings = _v0.ap;
	return A2(
		$mdgriffith$elm_ui$Element$row,
		$author$project$DatePicker$DatePicker$extAttrs(settings.d0),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignLeft,
						$mdgriffith$elm_ui$Element$pointer,
						$mdgriffith$elm_ui$Element$Events$onClick(
						onChange(
							$author$project$DatePicker$DatePicker$PickerChanged(
								$author$project$DatePicker$DatePicker$ChangeMonth(
									A3($justinmimbs$date$Date$add, 1, -1, picker.Q))))),
						$author$project$DatePicker$Internal$TestHelper$previousMonthAttr
					]),
				$author$project$DatePicker$DatePicker$extEle(settings.eA)),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$centerX]),
				$mdgriffith$elm_ui$Element$text(
					A3($author$project$DatePicker$Internal$Date$formatMaybeLanguage, settings.b9, 'MMMM yyyy', picker.Q))),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignRight,
						$mdgriffith$elm_ui$Element$pointer,
						$mdgriffith$elm_ui$Element$Events$onClick(
						onChange(
							$author$project$DatePicker$DatePicker$PickerChanged(
								$author$project$DatePicker$DatePicker$ChangeMonth(
									A3($justinmimbs$date$Date$add, 1, 1, picker.Q))))),
						$author$project$DatePicker$Internal$TestHelper$nextMonthAttr
					]),
				$author$project$DatePicker$DatePicker$extEle(settings.er))
			]));
};
var $justinmimbs$date$Date$Day = 11;
var $justinmimbs$date$Date$Days = 3;
var $justinmimbs$date$Date$weekdayToNumber = function (wd) {
	switch (wd) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		default:
			return 7;
	}
};
var $justinmimbs$date$Date$daysSincePreviousWeekday = F2(
	function (wd, date) {
		return A2(
			$elm$core$Basics$modBy,
			7,
			($justinmimbs$date$Date$weekdayNumber(date) + 7) - $justinmimbs$date$Date$weekdayToNumber(wd));
	});
var $justinmimbs$date$Date$firstOfMonth = F2(
	function (y, m) {
		return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + 1;
	});
var $justinmimbs$date$Date$quarterToMonth = function (q) {
	return $justinmimbs$date$Date$numberToMonth((q * 3) - 2);
};
var $justinmimbs$date$Date$floor = F2(
	function (interval, date) {
		var rd = date;
		switch (interval) {
			case 0:
				return $justinmimbs$date$Date$firstOfYear(
					$justinmimbs$date$Date$year(date));
			case 1:
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$quarterToMonth(
						$justinmimbs$date$Date$quarter(date)));
			case 2:
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$month(date));
			case 3:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 0, date);
			case 4:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 0, date);
			case 5:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 1, date);
			case 6:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 2, date);
			case 7:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 3, date);
			case 8:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 4, date);
			case 9:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 5, date);
			case 10:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 6, date);
			default:
				return date;
		}
	});
var $author$project$DatePicker$Internal$Week$Week = $elm$core$Basics$identity;
var $author$project$DatePicker$Internal$Week$WeekModel = F7(
	function (day0, day1, day2, day3, day4, day5, day6) {
		return {bP: day0, bQ: day1, bR: day2, bS: day3, bT: day4, bU: day5, bV: day6};
	});
var $author$project$DatePicker$Internal$Week$addNextDay = function (_v0) {
	var _default = _v0.a;
	var days = _v0.b;
	var fn = _v0.c;
	if (days.b) {
		var day = days.a;
		var rest = days.b;
		return _Utils_Tuple3(
			_default,
			rest,
			fn(day));
	} else {
		return _Utils_Tuple3(
			_default,
			_List_Nil,
			fn(_default));
	}
};
var $author$project$DatePicker$Internal$Week$fromListWithDefault = F2(
	function (_default, items) {
		var _v0 = $author$project$DatePicker$Internal$Week$addNextDay(
			$author$project$DatePicker$Internal$Week$addNextDay(
				$author$project$DatePicker$Internal$Week$addNextDay(
					$author$project$DatePicker$Internal$Week$addNextDay(
						$author$project$DatePicker$Internal$Week$addNextDay(
							$author$project$DatePicker$Internal$Week$addNextDay(
								$author$project$DatePicker$Internal$Week$addNextDay(
									_Utils_Tuple3(_default, items, $author$project$DatePicker$Internal$Week$WeekModel))))))));
		var week = _v0.c;
		return week;
	});
var $justinmimbs$date$Date$Weeks = 2;
var $justinmimbs$date$Date$Years = 0;
var $justinmimbs$date$Date$intervalToUnits = function (interval) {
	switch (interval) {
		case 0:
			return _Utils_Tuple2(1, 0);
		case 1:
			return _Utils_Tuple2(3, 1);
		case 2:
			return _Utils_Tuple2(1, 1);
		case 11:
			return _Utils_Tuple2(1, 3);
		default:
			var week = interval;
			return _Utils_Tuple2(1, 2);
	}
};
var $justinmimbs$date$Date$ceiling = F2(
	function (interval, date) {
		var floored = A2($justinmimbs$date$Date$floor, interval, date);
		if (_Utils_eq(date, floored)) {
			return date;
		} else {
			var _v0 = $justinmimbs$date$Date$intervalToUnits(interval);
			var n = _v0.a;
			var unit = _v0.b;
			return A3($justinmimbs$date$Date$add, unit, n, floored);
		}
	});
var $justinmimbs$date$Date$rangeHelp = F5(
	function (unit, step, until, revList, current) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(current, until) < 0) {
				var _v0 = A3($justinmimbs$date$Date$add, unit, step, current);
				var next = _v0;
				var $temp$unit = unit,
					$temp$step = step,
					$temp$until = until,
					$temp$revList = A2($elm$core$List$cons, current, revList),
					$temp$current = next;
				unit = $temp$unit;
				step = $temp$step;
				until = $temp$until;
				revList = $temp$revList;
				current = $temp$current;
				continue rangeHelp;
			} else {
				return $elm$core$List$reverse(revList);
			}
		}
	});
var $justinmimbs$date$Date$range = F4(
	function (interval, step, _v0, _v1) {
		var start = _v0;
		var until = _v1;
		var _v2 = $justinmimbs$date$Date$intervalToUnits(interval);
		var n = _v2.a;
		var unit = _v2.b;
		var _v3 = A2($justinmimbs$date$Date$ceiling, interval, start);
		var first = _v3;
		return (_Utils_cmp(first, until) < 0) ? A5(
			$justinmimbs$date$Date$rangeHelp,
			unit,
			A2($elm$core$Basics$max, 1, step) * n,
			until,
			_List_Nil,
			first) : _List_Nil;
	});
var $justinmimbs$date$Date$Friday = 8;
var $justinmimbs$date$Date$Monday = 4;
var $justinmimbs$date$Date$Saturday = 9;
var $justinmimbs$date$Date$Sunday = 10;
var $justinmimbs$date$Date$Thursday = 7;
var $justinmimbs$date$Date$Tuesday = 5;
var $justinmimbs$date$Date$Wednesday = 6;
var $author$project$DatePicker$Internal$Week$weekdayToInterval = function (weekday) {
	switch (weekday) {
		case 0:
			return 4;
		case 1:
			return 5;
		case 2:
			return 6;
		case 3:
			return 7;
		case 4:
			return 8;
		case 5:
			return 9;
		default:
			return 10;
	}
};
var $author$project$DatePicker$Internal$Week$calendarWeekDays = F2(
	function (firstDayOfWeek, maybeLanguage) {
		var startDay = A2(
			$justinmimbs$date$Date$floor,
			$author$project$DatePicker$Internal$Week$weekdayToInterval(firstDayOfWeek),
			A3($justinmimbs$date$Date$fromCalendarDate, 2020, 0, 1));
		var days = A4(
			$justinmimbs$date$Date$range,
			11,
			1,
			startDay,
			A3($justinmimbs$date$Date$add, 3, 7, startDay));
		return A2(
			$author$project$DatePicker$Internal$Week$fromListWithDefault,
			'X',
			A2(
				$elm$core$List$map,
				A2($author$project$DatePicker$Internal$Date$formatMaybeLanguage, maybeLanguage, 'EEEEEE'),
				days));
	});
var $author$project$DatePicker$DatePicker$DateChanged = function (a) {
	return {$: 0, a: a};
};
var $author$project$DatePicker$Internal$TestHelper$dayInMonthAttrHtml = $author$project$DatePicker$Internal$TestHelper$testAttribute('dayInMonth');
var $author$project$DatePicker$Internal$TestHelper$dayInMonthAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$dayInMonthAttrHtml);
var $author$project$DatePicker$Internal$TestHelper$selectedAttrHtml = $author$project$DatePicker$Internal$TestHelper$testAttribute('selected');
var $author$project$DatePicker$Internal$TestHelper$selectedAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$selectedAttrHtml);
var $author$project$DatePicker$Internal$TestHelper$todayAttrHtml = A2($elm$html$Html$Attributes$attribute, 'elm-test-alt', 'today');
var $author$project$DatePicker$Internal$TestHelper$todayAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$todayAttrHtml);
var $author$project$DatePicker$DatePicker$dayView = F2(
	function (config, day) {
		var picker = config.ce;
		var settings = config.ap;
		var attributesForThisDay = $elm$core$List$concat(
			_List_fromArray(
				[
					$author$project$DatePicker$DatePicker$extAttrs(settings.dM),
					(!_Utils_eq(
					$justinmimbs$date$Date$month(config.ce.Q),
					$justinmimbs$date$Date$month(day))) ? $author$project$DatePicker$DatePicker$extAttrs(settings.fb) : _List_fromArray(
					[$author$project$DatePicker$Internal$TestHelper$dayInMonthAttr]),
					_Utils_eq(picker.bB, day) ? A2(
					$elm$core$List$cons,
					$author$project$DatePicker$Internal$TestHelper$todayAttr,
					$author$project$DatePicker$DatePicker$extAttrs(settings.e$)) : _List_Nil,
					_Utils_eq(
					config.gJ,
					$elm$core$Maybe$Just(day)) ? A2(
					$elm$core$List$cons,
					$author$project$DatePicker$Internal$TestHelper$selectedAttr,
					$author$project$DatePicker$DatePicker$extAttrs(settings.eH)) : _List_Nil,
					settings.dP(day) ? $author$project$DatePicker$DatePicker$extAttrs(settings.dQ) : _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Events$onClick(
						config.jd(
							$author$project$DatePicker$DatePicker$DateChanged(day))),
						$mdgriffith$elm_ui$Element$pointer
					])
				]));
		return A2(
			$mdgriffith$elm_ui$Element$el,
			attributesForThisDay,
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
				$mdgriffith$elm_ui$Element$text(
					A3($author$project$DatePicker$Internal$Date$formatMaybeLanguage, settings.b9, 'dd', day))));
	});
var $author$project$DatePicker$Internal$Week$getDay = F2(
	function (index, _v0) {
		var week = _v0;
		switch (index) {
			case 0:
				return week.bP;
			case 1:
				return week.bQ;
			case 2:
				return week.bR;
			case 3:
				return week.bS;
			case 4:
				return week.bT;
			case 5:
				return week.bU;
			default:
				return week.bV;
		}
	});
var $author$project$DatePicker$Internal$Week$Day0 = 0;
var $author$project$DatePicker$Internal$Week$Day1 = 1;
var $author$project$DatePicker$Internal$Week$Day2 = 2;
var $author$project$DatePicker$Internal$Week$Day3 = 3;
var $author$project$DatePicker$Internal$Week$Day4 = 4;
var $author$project$DatePicker$Internal$Week$Day5 = 5;
var $author$project$DatePicker$Internal$Week$Day6 = 6;
var $author$project$DatePicker$Internal$Week$indexedMap = F2(
	function (fn, _v0) {
		var week = _v0;
		return {
			bP: A2(fn, 0, week.bP),
			bQ: A2(fn, 1, week.bQ),
			bR: A2(fn, 2, week.bR),
			bS: A2(fn, 3, week.bS),
			bT: A2(fn, 4, week.bT),
			bU: A2(fn, 5, week.bU),
			bV: A2(fn, 6, week.bV)
		};
	});
var $author$project$DatePicker$Internal$Week$toList = function (_v0) {
	var week = _v0;
	return _List_fromArray(
		[week.bP, week.bQ, week.bR, week.bS, week.bT, week.bU, week.bV]);
};
var $author$project$DatePicker$DatePicker$pickerColumns = function (config) {
	var weekdays = A2($author$project$DatePicker$Internal$Week$calendarWeekDays, config.ap.c1, config.ap.b9);
	var toColumn = F2(
		function (index, weekday) {
			return {
				iu: A2(
					$mdgriffith$elm_ui$Element$el,
					$author$project$DatePicker$DatePicker$extAttrs(config.ap.e5),
					$mdgriffith$elm_ui$Element$text(weekday)),
				kB: function (week) {
					return A2(
						$author$project$DatePicker$DatePicker$dayView,
						config,
						A2($author$project$DatePicker$Internal$Week$getDay, index, week));
				},
				kD: $mdgriffith$elm_ui$Element$fill
			};
		});
	return $author$project$DatePicker$Internal$Week$toList(
		A2($author$project$DatePicker$Internal$Week$indexedMap, toColumn, weekdays));
};
var $mdgriffith$elm_ui$Element$InternalColumn = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$GridPosition = function (a) {
	return {$: 9, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$GridTemplateStyle = function (a) {
	return {$: 8, a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $mdgriffith$elm_ui$Internal$Model$AsGrid = 3;
var $mdgriffith$elm_ui$Internal$Model$asGrid = 3;
var $mdgriffith$elm_ui$Internal$Flag$gridPosition = $mdgriffith$elm_ui$Internal$Flag$flag(35);
var $mdgriffith$elm_ui$Internal$Flag$gridTemplate = $mdgriffith$elm_ui$Internal$Flag$flag(34);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $mdgriffith$elm_ui$Element$tableHelper = F2(
	function (attrs, config) {
		var onGrid = F3(
			function (rowLevel, columnLevel, elem) {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$StyleClass,
							$mdgriffith$elm_ui$Internal$Flag$gridPosition,
							$mdgriffith$elm_ui$Internal$Model$GridPosition(
								{ft: columnLevel, iv: 1, gE: rowLevel, kD: 1}))
						]),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[elem])));
			});
		var columnWidth = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.kD;
			} else {
				var colConfig = col.a;
				return colConfig.kD;
			}
		};
		var columnHeader = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.iu;
			} else {
				var colConfig = col.a;
				return colConfig.iu;
			}
		};
		var maybeHeaders = function (headers) {
			return A2(
				$elm$core$List$all,
				$elm$core$Basics$eq($mdgriffith$elm_ui$Internal$Model$Empty),
				headers) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (col, header) {
							return A3(onGrid, 1, col + 1, header);
						}),
					headers));
		}(
			A2($elm$core$List$map, columnHeader, config.hV));
		var add = F3(
			function (cell, columnConfig, cursor) {
				if (!columnConfig.$) {
					var col = columnConfig.a;
					return _Utils_update(
						cursor,
						{
							fw: cursor.fw + 1,
							ag: A2(
								$elm$core$List$cons,
								A3(
									onGrid,
									cursor.gE,
									cursor.fw,
									A2(
										col.kB,
										_Utils_eq(maybeHeaders, $elm$core$Maybe$Nothing) ? (cursor.gE - 1) : (cursor.gE - 2),
										cell)),
								cursor.ag)
						});
				} else {
					var col = columnConfig.a;
					return {
						fw: cursor.fw + 1,
						ag: A2(
							$elm$core$List$cons,
							A3(
								onGrid,
								cursor.gE,
								cursor.fw,
								col.kB(cell)),
							cursor.ag),
						gE: cursor.gE
					};
				}
			});
		var build = F3(
			function (columns, rowData, cursor) {
				var newCursor = A3(
					$elm$core$List$foldl,
					add(rowData),
					cursor,
					columns);
				return {fw: 1, ag: newCursor.ag, gE: cursor.gE + 1};
			});
		var children = A3(
			$elm$core$List$foldl,
			build(config.hV),
			{
				fw: 1,
				ag: _List_Nil,
				gE: _Utils_eq(maybeHeaders, $elm$core$Maybe$Nothing) ? 1 : 2
			},
			config.h3);
		var _v0 = A2(
			$mdgriffith$elm_ui$Internal$Model$getSpacing,
			attrs,
			_Utils_Tuple2(0, 0));
		var sX = _v0.a;
		var sY = _v0.b;
		var template = A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$gridTemplate,
			$mdgriffith$elm_ui$Internal$Model$GridTemplateStyle(
				{
					hV: A2($elm$core$List$map, columnWidth, config.hV),
					jH: A2(
						$elm$core$List$repeat,
						$elm$core$List$length(config.h3),
						$mdgriffith$elm_ui$Internal$Model$Content),
					jV: _Utils_Tuple2(
						$mdgriffith$elm_ui$Element$px(sX),
						$mdgriffith$elm_ui$Element$px(sY))
				}));
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asGrid,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				A2($elm$core$List$cons, template, attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				function () {
					if (maybeHeaders.$ === 1) {
						return children.ag;
					} else {
						var renderedHeaders = maybeHeaders.a;
						return _Utils_ap(
							renderedHeaders,
							$elm$core$List$reverse(children.ag));
					}
				}()));
	});
var $mdgriffith$elm_ui$Element$table = F2(
	function (attrs, config) {
		return A2(
			$mdgriffith$elm_ui$Element$tableHelper,
			attrs,
			{
				hV: A2($elm$core$List$map, $mdgriffith$elm_ui$Element$InternalColumn, config.hV),
				h3: config.h3
			});
	});
var $author$project$DatePicker$Internal$TestHelper$tableAttrHtml = $author$project$DatePicker$Internal$TestHelper$testAttribute('table');
var $author$project$DatePicker$Internal$TestHelper$tableAttr = $mdgriffith$elm_ui$Element$htmlAttribute($author$project$DatePicker$Internal$TestHelper$tableAttrHtml);
var $justinmimbs$date$Date$fromOrdinalDate = F2(
	function (y, od) {
		var daysInY = $justinmimbs$date$Date$isLeapYear(y) ? 366 : 365;
		return $justinmimbs$date$Date$daysBeforeYear(y) + A3($elm$core$Basics$clamp, 1, daysInY, od);
	});
var $author$project$DatePicker$Internal$Week$weeksInMonth = F2(
	function (month, firstDayOfWeek) {
		var weekdayInterval = $author$project$DatePicker$Internal$Week$weekdayToInterval(firstDayOfWeek);
		var weekDays = function (startDay) {
			return A4(
				$justinmimbs$date$Date$range,
				11,
				1,
				startDay,
				A3($justinmimbs$date$Date$add, 3, 7, startDay));
		};
		var toWeek = function (list) {
			return A2(
				$author$project$DatePicker$Internal$Week$fromListWithDefault,
				A2($justinmimbs$date$Date$fromOrdinalDate, 2020, 1),
				list);
		};
		var firstOfMonth = A3(
			$justinmimbs$date$Date$fromCalendarDate,
			$justinmimbs$date$Date$year(month),
			$justinmimbs$date$Date$month(month),
			1);
		var start = A2($justinmimbs$date$Date$floor, weekdayInterval, firstOfMonth);
		var end = A2(
			$justinmimbs$date$Date$ceiling,
			weekdayInterval,
			A3($justinmimbs$date$Date$add, 1, 1, firstOfMonth));
		return A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeR, weekDays, toWeek),
			A4($justinmimbs$date$Date$range, 11, 7, start, end));
	});
var $author$project$DatePicker$DatePicker$pickerTable = function (config) {
	var settings = config.ap;
	return A2(
		$mdgriffith$elm_ui$Element$table,
		A2(
			$elm$core$List$cons,
			$author$project$DatePicker$Internal$TestHelper$tableAttr,
			$author$project$DatePicker$DatePicker$extAttrs(settings.eY)),
		{
			hV: $author$project$DatePicker$DatePicker$pickerColumns(config),
			h3: A2($author$project$DatePicker$Internal$Week$weeksInMonth, config.ce.Q, config.ap.c1)
		});
};
var $author$project$DatePicker$DatePicker$NothingToDo = {$: 1};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$DatePicker$DatePicker$preventDefaultOnMouseDown = function (config) {
	return $mdgriffith$elm_ui$Element$htmlAttribute(
		A2(
			$elm$html$Html$Events$preventDefaultOn,
			'mousedown',
			$elm$json$Json$Decode$succeed(
				_Utils_Tuple2(
					config.jd(
						$author$project$DatePicker$DatePicker$PickerChanged($author$project$DatePicker$DatePicker$NothingToDo)),
					true))));
};
var $author$project$DatePicker$DatePicker$pickerView = function (config) {
	var settings = config.ap;
	return A2(
		$mdgriffith$elm_ui$Element$column,
		A2(
			$elm$core$List$cons,
			$author$project$DatePicker$Internal$TestHelper$calendarAttr,
			A2(
				$elm$core$List$cons,
				$author$project$DatePicker$DatePicker$preventDefaultOnMouseDown(config),
				$author$project$DatePicker$DatePicker$extAttrs(settings.ew))),
		_List_fromArray(
			[
				$author$project$DatePicker$DatePicker$pickerHeader(config),
				$author$project$DatePicker$DatePicker$pickerTable(config)
			]));
};
var $author$project$DatePicker$DatePicker$toPicker = function (_v0) {
	var picker = _v0;
	return picker;
};
var $author$project$Page$Bet$chooseDate = function (model) {
	return A2(
		$author$project$Ui$CustomElements$betInputWrapper,
		{fv: 13, f6: 1, gZ: 'date'},
		$author$project$DatePicker$DatePicker$pickerView(
			{
				jd: $author$project$Logic$Logic$DatePickerEvent,
				ce: $author$project$DatePicker$DatePicker$toPicker(model.cY),
				gJ: $author$project$Valid$AutoCheck$publicObject(model.dK),
				ap: $author$project$Page$Bet$datePickerSettings
			}));
};
var $author$project$Logic$Logic$PlotYears = function (a) {
	return {$: 20, a: a};
};
var $author$project$Logic$Logic$Till2023 = 1;
var $author$project$Logic$Logic$Till2024 = 2;
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.hS);
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $mdgriffith$elm_ui$Internal$Model$InFront = 4;
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 4, element);
};
var $author$project$Valid$AutoCheck$object = function (_v0) {
	var auto = _v0;
	return auto.aH;
};
var $mdgriffith$elm_ui$Element$Input$Row = 0;
var $mdgriffith$elm_ui$Element$Input$AfterFound = 2;
var $mdgriffith$elm_ui$Element$Input$BeforeFound = 1;
var $mdgriffith$elm_ui$Element$Input$Idle = 0;
var $mdgriffith$elm_ui$Element$Input$NotFound = 0;
var $mdgriffith$elm_ui$Element$Input$Selected = 2;
var $mdgriffith$elm_ui$Element$Input$column = F2(
	function (attributes, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					attributes)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$Input$downArrow = 'ArrowDown';
var $mdgriffith$elm_ui$Internal$Model$filter = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (x, _v0) {
				var found = _v0.a;
				var has = _v0.b;
				switch (x.$) {
					case 0:
						return _Utils_Tuple2(found, has);
					case 3:
						var key = x.a;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 1:
						var attr = x.a;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 4:
						var style = x.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 7:
						var width = x.a;
						return A2($elm$core$Set$member, 'width', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'width', has));
					case 8:
						var height = x.a;
						return A2($elm$core$Set$member, 'height', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'height', has));
					case 2:
						var description = x.a;
						return A2($elm$core$Set$member, 'described', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'described', has));
					case 9:
						var location = x.a;
						var elem = x.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 6:
						return A2($elm$core$Set$member, 'align-x', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'align-x', has));
					case 5:
						return A2($elm$core$Set$member, 'align-y', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'align-y', has));
					default:
						return A2($elm$core$Set$member, 'transform', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'transform', has));
				}
			}),
		_Utils_Tuple2(_List_Nil, $elm$core$Set$empty),
		attrs).a;
};
var $mdgriffith$elm_ui$Internal$Model$get = F2(
	function (attrs, isAttr) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, found) {
					return isAttr(x) ? A2($elm$core$List$cons, x, found) : found;
				}),
			_List_Nil,
			$mdgriffith$elm_ui$Internal$Model$filter(attrs));
	});
var $mdgriffith$elm_ui$Element$Input$leftArrow = 'ArrowLeft';
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $mdgriffith$elm_ui$Element$Input$onKeyLookup = function (lookup) {
	var decode = function (code) {
		var _v0 = lookup(code);
		if (_v0.$ === 1) {
			return $elm$json$Json$Decode$fail('No key matched');
		} else {
			var msg = _v0.a;
			return $elm$json$Json$Decode$succeed(msg);
		}
	};
	var isKey = A2(
		$elm$json$Json$Decode$andThen,
		decode,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		A2(
			$elm$html$Html$Events$preventDefaultOn,
			'keydown',
			A2(
				$elm$json$Json$Decode$map,
				function (fired) {
					return _Utils_Tuple2(fired, true);
				},
				isKey)));
};
var $mdgriffith$elm_ui$Element$Input$rightArrow = 'ArrowRight';
var $mdgriffith$elm_ui$Element$Input$row = F2(
	function (attributes, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				attributes),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$Input$space = ' ';
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$tabindex = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$tabindex);
var $mdgriffith$elm_ui$Element$Input$upArrow = 'ArrowUp';
var $mdgriffith$elm_ui$Element$Input$radioHelper = F3(
	function (orientation, attrs, input) {
		var track = F2(
			function (opt, _v14) {
				var found = _v14.a;
				var prev = _v14.b;
				var nxt = _v14.c;
				var val = opt.a;
				switch (found) {
					case 0:
						return _Utils_eq(
							$elm$core$Maybe$Just(val),
							input.gJ) ? _Utils_Tuple3(1, prev, nxt) : _Utils_Tuple3(found, val, nxt);
					case 1:
						return _Utils_Tuple3(2, prev, val);
					default:
						return _Utils_Tuple3(found, prev, nxt);
				}
			});
		var renderOption = function (_v11) {
			var val = _v11.a;
			var view = _v11.b;
			var status = _Utils_eq(
				$elm$core$Maybe$Just(val),
				input.gJ) ? 2 : 0;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$pointer,
						function () {
						if (!orientation) {
							return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink);
						} else {
							return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
						}
					}(),
						$mdgriffith$elm_ui$Element$Events$onClick(
						input.jd(val)),
						function () {
						if (status === 2) {
							return $mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$attribute, 'aria-checked', 'true'));
						} else {
							return $mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$attribute, 'aria-checked', 'false'));
						}
					}(),
						$mdgriffith$elm_ui$Internal$Model$Attr(
						A2($elm$html$Html$Attributes$attribute, 'role', 'radio'))
					]),
				view(status));
		};
		var prevNext = function () {
			var _v5 = input.jn;
			if (!_v5.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v6 = _v5.a;
				var val = _v6.a;
				return function (_v7) {
					var found = _v7.a;
					var b = _v7.b;
					var a = _v7.c;
					switch (found) {
						case 0:
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(b, val));
						case 1:
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(b, val));
						default:
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(b, a));
					}
				}(
					A3(
						$elm$core$List$foldl,
						track,
						_Utils_Tuple3(0, val, val),
						input.jn));
			}
		}();
		var optionArea = function () {
			if (!orientation) {
				return A2(
					$mdgriffith$elm_ui$Element$Input$row,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(input.iX),
						attrs),
					A2($elm$core$List$map, renderOption, input.jn));
			} else {
				return A2(
					$mdgriffith$elm_ui$Element$Input$column,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(input.iX),
						attrs),
					A2($elm$core$List$map, renderOption, input.jn));
			}
		}();
		var events = A2(
			$mdgriffith$elm_ui$Internal$Model$get,
			attrs,
			function (attr) {
				_v3$3:
				while (true) {
					switch (attr.$) {
						case 7:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _v3$3;
							}
						case 8:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _v3$3;
							}
						case 1:
							return true;
						default:
							break _v3$3;
					}
				}
				return false;
			});
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$elm$core$Maybe$Just($mdgriffith$elm_ui$Element$alignLeft),
							$elm$core$Maybe$Just(
							$mdgriffith$elm_ui$Element$Input$tabindex(0)),
							$elm$core$Maybe$Just(
							$mdgriffith$elm_ui$Internal$Model$htmlClass('focus')),
							$elm$core$Maybe$Just($mdgriffith$elm_ui$Element$Region$announce),
							$elm$core$Maybe$Just(
							$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$attribute, 'role', 'radiogroup'))),
							function () {
							if (prevNext.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var _v1 = prevNext.a;
								var prev = _v1.a;
								var next = _v1.b;
								return $elm$core$Maybe$Just(
									$mdgriffith$elm_ui$Element$Input$onKeyLookup(
										function (code) {
											if (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$leftArrow)) {
												return $elm$core$Maybe$Just(
													input.jd(prev));
											} else {
												if (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$upArrow)) {
													return $elm$core$Maybe$Just(
														input.jd(prev));
												} else {
													if (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$rightArrow)) {
														return $elm$core$Maybe$Just(
															input.jd(next));
													} else {
														if (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$downArrow)) {
															return $elm$core$Maybe$Just(
																input.jd(next));
														} else {
															if (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$space)) {
																var _v2 = input.gJ;
																if (_v2.$ === 1) {
																	return $elm$core$Maybe$Just(
																		input.jd(prev));
																} else {
																	return $elm$core$Maybe$Nothing;
																}
															} else {
																return $elm$core$Maybe$Nothing;
															}
														}
													}
												}
											}
										}));
							}
						}()
						])),
				events),
			input.iX,
			optionArea);
	});
var $mdgriffith$elm_ui$Element$Input$radioRow = $mdgriffith$elm_ui$Element$Input$radioHelper(0);
var $author$project$Ui$Palette$Distance$XXXS = 9;
var $author$project$Ui$CustomElements$optionStyling = F2(
	function (message, optionState) {
		var color = function () {
			switch (optionState) {
				case 0:
					return 8;
				case 1:
					return 10;
				default:
					return 10;
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Border$width(
					$author$project$Ui$Palette$Distance$translate(9)),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(7))
				]),
			$mdgriffith$elm_ui$Element$text(message));
	});
var $mdgriffith$elm_ui$Element$Input$Option = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$optionWith = F2(
	function (val, view) {
		return A2($mdgriffith$elm_ui$Element$Input$Option, val, view);
	});
var $author$project$Ui$CustomElements$textOption = F2(
	function (value, message) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$optionWith,
			value,
			$author$project$Ui$CustomElements$optionStyling(message));
	});
var $justinmimbs$date$Date$max = F2(
	function (dateA, dateB) {
		var a = dateA;
		var b = dateB;
		return (_Utils_cmp(a, b) < 0) ? dateB : dateA;
	});
var $justinmimbs$date$Date$min = F2(
	function (dateA, dateB) {
		var a = dateA;
		var b = dateB;
		return (_Utils_cmp(a, b) < 0) ? dateA : dateB;
	});
var $author$project$Logic$Utils$dateIntervalWithin = F4(
	function (borders, date, unit, length) {
		var right = A3($justinmimbs$date$Date$add, unit, (-2) * length, borders.d);
		var left = A3($justinmimbs$date$Date$add, unit, 2 * length, borders.e);
		return {
			d: A2(
				$justinmimbs$date$Date$min,
				A2(
					$justinmimbs$date$Date$max,
					left,
					A3($justinmimbs$date$Date$add, unit, length, date)),
				borders.d),
			e: A2(
				$justinmimbs$date$Date$max,
				A2(
					$justinmimbs$date$Date$min,
					right,
					A3($justinmimbs$date$Date$add, unit, -length, date)),
				borders.e)
		};
	});
var $author$project$Logic$Logic$dateRange = function (model) {
	var _v0 = $author$project$Valid$AutoCheck$object(model.dK);
	if (!_v0.$) {
		var date = _v0.a;
		var makeRange = A2(
			$author$project$Logic$Utils$dateIntervalWithin,
			{d: $author$project$Logic$Logic$endOfBet, e: $author$project$Logic$Logic$startOfBet},
			date);
		var _v1 = model.dm;
		switch (_v1) {
			case 0:
				return A2(makeRange, 3, 15);
			case 1:
				return A2(makeRange, 1, 3);
			default:
				return {d: $author$project$Logic$Logic$endOfBet, e: $author$project$Logic$Logic$startOfBet};
		}
	} else {
		return {d: $author$project$Logic$Logic$endOfBet, e: $author$project$Logic$Logic$startOfBet};
	}
};
var $mdgriffith$elm_ui$Element$Font$justify = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.ka);
var $author$project$AccuracyPlot$AccuracyPlot$RemoveHighlight = {$: 2};
var $author$project$AccuracyPlot$AccuracyPlot$TouchOnXAxis = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$AccuracyPlot$Function$calculateFunctionRecursively = F3(
	function (fun, start, goal) {
		var recConstruct = function (step) {
			recConstruct:
			while (true) {
				var _this = step.eq;
				var thisValue = fun(_this);
				var _v0 = _Utils_cmp(_this, goal) < 1;
				if (_v0) {
					var $temp$step = {
						iq: A2(
							$elm$core$List$cons,
							_Utils_Tuple2(_this, thisValue),
							step.iq),
						eq: _this + 1,
						dt: step.dt + thisValue
					};
					step = $temp$step;
					continue recConstruct;
				} else {
					return step;
				}
			}
		};
		var preComputation = recConstruct(
			{iq: _List_Nil, eq: start, dt: 0});
		var normalizer = preComputation.dt / 1000;
		return {
			iq: A2(
				$elm$core$List$map,
				function (_v1) {
					var d = _v1.a;
					var v = _v1.b;
					return _Utils_Tuple2(d, v / normalizer);
				},
				preComputation.iq),
			ek: function (d) {
				return fun(d) / normalizer;
			}
		};
	});
var $elm$core$Basics$e = _Basics_e;
var $author$project$AccuracyPlot$Function$calculateFunction = F3(
	function (spread, date, model) {
		var totalPoints = 1000;
		var s = spread;
		var d = $justinmimbs$date$Date$toRataDie(date);
		var allDays = A2($elm$core$List$range, model.cm, model.b_);
		if (s <= 0) {
			var f = function (d2) {
				return _Utils_eq(d2, d) ? totalPoints : 0;
			};
			return {
				iq: A2(
					$elm$core$List$map,
					function (d2) {
						return _Utils_Tuple2(
							d2,
							f(d2));
					},
					allDays),
				ek: f
			};
		} else {
			if (s >= 100) {
				var f = function (d2) {
					return totalPoints / (model.b_ - model.cm);
				};
				return {
					iq: A2(
						$elm$core$List$map,
						function (d2) {
							return _Utils_Tuple2(
								d2,
								f(d2));
						},
						allDays),
					ek: f
				};
			} else {
				var logS = (-A2($elm$core$Basics$logBase, $elm$core$Basics$e, s / 100)) / 5;
				var f_0 = function (d_) {
					return A2(
						$elm$core$Basics$pow,
						$elm$core$Basics$e,
						-A2($elm$core$Basics$pow, (d - d_) * logS, 2));
				};
				return A3($author$project$AccuracyPlot$Function$calculateFunctionRecursively, f_0, model.cm, model.b_);
			}
		}
	});
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (c !== '0') && (c !== '.');
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (head === '9') {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 1) {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				'0',
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3($elm$core$String$padRight, e + 1, '0', total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					'0',
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3($elm$core$String$padRight, s, '0', after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 1) {
				return false;
			} else {
				if ('5' === _v0.a.a) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $author$project$Ui$Palette$Color$padLeft = F3(
	function (len, c, s) {
		var sLen = $elm$core$String$length(s);
		var rep = len - sLen;
		return (rep > 0) ? _Utils_ap(
			A2(
				$elm$core$String$repeat,
				rep,
				$elm$core$String$fromChar(c)),
			s) : s;
	});
var $elm$core$String$fromList = _String_fromList;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $author$project$Ui$Palette$Color$toString = function (color) {
	var _v0 = $author$project$Ui$Palette$Color$toTuple(color);
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return '#' + (A3(
		$author$project$Ui$Palette$Color$padLeft,
		2,
		'0',
		$rtfeldman$elm_hex$Hex$toString(r)) + (A3(
		$author$project$Ui$Palette$Color$padLeft,
		2,
		'0',
		$rtfeldman$elm_hex$Hex$toString(g)) + A3(
		$author$project$Ui$Palette$Color$padLeft,
		2,
		'0',
		$rtfeldman$elm_hex$Hex$toString(b))));
};
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$AccuracyPlot$AccuracyPlot$clickFrame = F2(
	function (model, event) {
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x('0'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$svg$Svg$Attributes$width(
					A2($myrho$elm_round$Round$round, 2, model.az)),
					$elm$svg$Svg$Attributes$height(
					A2($myrho$elm_round$Round$round, 2, model.an)),
					$elm$svg$Svg$Events$onClick(event),
					$elm$svg$Svg$Attributes$fill(
					function (s) {
						return s + '00';
					}(
						$author$project$Ui$Palette$Color$toString(7)))
				]),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $author$project$AccuracyPlot$AccuracyPlot$dateToCord = F3(
	function (model, range, date) {
		return A3(
			$author$project$AccuracyPlot$AccuracyPlot$linearTransform,
			{d: (model.az - model.ab.bu) - model.ax.bu, e: (0 + model.ab.bk) + model.ax.bk},
			{d: range.d, e: range.e},
			date);
	});
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $author$project$AccuracyPlot$AccuracyPlot$inRange = F2(
	function (range, x) {
		return (_Utils_cmp(range.e, x) < 1) && (_Utils_cmp(x, range.d) < 1);
	});
var $author$project$AccuracyPlot$AccuracyPlot$pointsToCord = F3(
	function (model, range, points) {
		return A3(
			$author$project$AccuracyPlot$AccuracyPlot$linearTransform,
			{d: (model.an - model.ab.cB) - model.ax.cB, e: (0 + model.ab.bL) + model.ax.bL},
			{d: range.d, e: range.e},
			points);
	});
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $author$project$AccuracyPlot$AccuracyPlot$xCordToString = F2(
	function (model, xCord) {
		return A2($myrho$elm_round$Round$round, 2, xCord);
	});
var $author$project$AccuracyPlot$AccuracyPlot$yCordToString = F2(
	function (model, yCord) {
		return A2($myrho$elm_round$Round$round, 2, model.an - yCord);
	});
var $author$project$AccuracyPlot$AccuracyPlot$graphToSvg = F3(
	function (model, config, graph) {
		var pointsToString = A2(
			$elm$core$Basics$composeR,
			A2($author$project$AccuracyPlot$AccuracyPlot$pointsToCord, model, config.hb),
			$author$project$AccuracyPlot$AccuracyPlot$yCordToString(model));
		var dateToString = A2(
			$elm$core$Basics$composeR,
			A2($author$project$AccuracyPlot$AccuracyPlot$dateToCord, model, config.fd),
			$author$project$AccuracyPlot$AccuracyPlot$xCordToString(model));
		var makeDot = function (_v2) {
			var date = _v2.a;
			var points = _v2.b;
			return A2(
				$elm$svg$Svg$circle,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							dateToString(date)),
							$elm$svg$Svg$Attributes$cy(
							pointsToString(points)),
							$elm$svg$Svg$Attributes$r(
							$elm$core$String$fromInt(config.gy)),
							$elm$svg$Svg$Attributes$fill(
							$author$project$Ui$Palette$Color$toString(config.fv))
						]),
					function () {
						var _v1 = config.fg;
						if (!_v1.$) {
							var action = _v1.a;
							return _List_fromArray(
								[
									$elm$svg$Svg$Events$onClick(
									action(date))
								]);
						} else {
							return _List_Nil;
						}
					}()),
				_List_Nil);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			A2(
				$elm$core$List$map,
				makeDot,
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var x = _v0.a;
						var y = _v0.b;
						return A2($author$project$AccuracyPlot$AccuracyPlot$inRange, config.fd, x);
					},
					graph)));
	});
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $justinmimbs$date$Date$fromRataDie = function (rd) {
	return rd;
};
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$rotate = _VirtualDom_attribute('rotate');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$AccuracyPlot$AccuracyPlot$yAxisToCord = F2(
	function (model, pos) {
		return A3(
			$author$project$AccuracyPlot$AccuracyPlot$linearTransform,
			{d: model.an - model.ab.cB, e: model.ab.bL},
			{d: 1, e: 0.0},
			pos);
	});
var $author$project$AccuracyPlot$AccuracyPlot$dateTick = F3(
	function (model, range, date) {
		var yCord = A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0);
		var xCord = A3($author$project$AccuracyPlot$AccuracyPlot$dateToCord, model, range, date);
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord)),
						$elm$svg$Svg$Attributes$y1(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord - 5)),
						$elm$svg$Svg$Attributes$x2(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord)),
						$elm$svg$Svg$Attributes$y2(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord + 5)),
						$elm$svg$Svg$Attributes$stroke(
						$author$project$Ui$Palette$Color$toString(7)),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord)),
						$elm$svg$Svg$Attributes$y(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord - 20)),
						$elm$svg$Svg$Attributes$rotate('0'),
						$elm$svg$Svg$Attributes$fill(
						$author$project$Ui$Palette$Color$toString(7)),
						$elm$svg$Svg$Attributes$textAnchor('middle'),
						$elm$svg$Svg$Attributes$dominantBaseline('middle')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						A2(
							$justinmimbs$date$Date$format,
							'MMM ddd',
							$justinmimbs$date$Date$fromRataDie(date)))
					]))
			]);
	});
var $author$project$AccuracyPlot$AccuracyPlot$magnitudeRound = function (_float) {
	return ((_float >= 1000) ? $elm$core$String$fromFloat : ((_float > 100) ? $myrho$elm_round$Round$round(1) : ((_float > 10) ? $myrho$elm_round$Round$round(2) : ((_float > 1) ? $myrho$elm_round$Round$round(3) : ((_float > 0.00009) ? $myrho$elm_round$Round$round(4) : $elm$core$Basics$always('0'))))))(_float);
};
var $author$project$AccuracyPlot$AccuracyPlot$xAxisToCord = F2(
	function (model, pos) {
		return A3(
			$author$project$AccuracyPlot$AccuracyPlot$linearTransform,
			{d: model.az - model.ab.bu, e: model.ab.bk},
			{d: 1, e: 0.0},
			pos);
	});
var $author$project$AccuracyPlot$AccuracyPlot$pointsTick = F3(
	function (model, range, points) {
		var yCord = A3($author$project$AccuracyPlot$AccuracyPlot$pointsToCord, model, range, points);
		var xCord = A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0);
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord - 5)),
						$elm$svg$Svg$Attributes$y1(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
						$elm$svg$Svg$Attributes$x2(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord + 5)),
						$elm$svg$Svg$Attributes$y2(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
						$elm$svg$Svg$Attributes$stroke(
						$author$project$Ui$Palette$Color$toString(7)),
						$elm$svg$Svg$Attributes$strokeWidth('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$y(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
						$elm$svg$Svg$Attributes$x(
						A2($myrho$elm_round$Round$round, 2, xCord - 7)),
						$elm$svg$Svg$Attributes$fill(
						$author$project$Ui$Palette$Color$toString(7)),
						$elm$svg$Svg$Attributes$textAnchor('end'),
						$elm$svg$Svg$Attributes$dominantBaseline('middle')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						$author$project$AccuracyPlot$AccuracyPlot$magnitudeRound(points))
					]))
			]);
	});
var $author$project$AccuracyPlot$AccuracyPlot$highlights = F4(
	function (model, dateRange, pointsRange, mapping) {
		var _v0 = model.bf;
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			var date = _v0.a;
			var _v1 = (_Utils_cmp(dateRange.e, date) < 1) && (_Utils_cmp(date, dateRange.d) < 1);
			if (!_v1) {
				return _List_Nil;
			} else {
				var yCord = A3(
					$author$project$AccuracyPlot$AccuracyPlot$pointsToCord,
					model,
					pointsRange,
					mapping(date));
				var yBase = A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0);
				var xCord = A3($author$project$AccuracyPlot$AccuracyPlot$dateToCord, model, dateRange, date);
				var xBase = A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0);
				return $elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								A2(
								$elm$svg$Svg$rect,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$x(
										A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, (-50) + xBase)),
										$elm$svg$Svg$Attributes$y(
										A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, 10 + yCord)),
										$elm$svg$Svg$Attributes$width('45'),
										$elm$svg$Svg$Attributes$height('20'),
										function (s) {
										return $elm$svg$Svg$Attributes$fill(s + '99');
									}(
										$author$project$Ui$Palette$Color$toString(6))
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$line,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$x1(
										A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord)),
										$elm$svg$Svg$Attributes$y1(
										A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yBase)),
										$elm$svg$Svg$Attributes$x2(
										A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord)),
										$elm$svg$Svg$Attributes$y2(
										A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
										$elm$svg$Svg$Attributes$stroke(
										$author$project$Ui$Palette$Color$toString(8)),
										$elm$svg$Svg$Attributes$strokeWidth('1')
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$line,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$x1(
										A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xBase)),
										$elm$svg$Svg$Attributes$y1(
										A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
										$elm$svg$Svg$Attributes$x2(
										A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xCord)),
										$elm$svg$Svg$Attributes$y2(
										A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
										$elm$svg$Svg$Attributes$stroke(
										$author$project$Ui$Palette$Color$toString(8)),
										$elm$svg$Svg$Attributes$strokeWidth('1')
									]),
								_List_Nil)
							]),
							A3(
							$author$project$AccuracyPlot$AccuracyPlot$pointsTick,
							model,
							pointsRange,
							mapping(date)),
							A3($author$project$AccuracyPlot$AccuracyPlot$dateTick, model, dateRange, date)
						]));
			}
		}
	});
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$svg$Svg$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $author$project$AccuracyPlot$AccuracyPlot$magnitude = function (_float) {
	return (_float > 1001) ? _float : ((_float > 300) ? 1000 : ((_float > 200) ? 300 : ((_float > 100) ? 200 : ((_float > 50) ? 100 : ((_float > 10) ? 50 : ((_float > 2) ? 10 : 5))))));
};
var $elm$svg$Svg$marker = $elm$svg$Svg$trustedNode('marker');
var $elm$svg$Svg$Attributes$markerHeight = _VirtualDom_attribute('markerHeight');
var $elm$svg$Svg$Attributes$markerUnits = _VirtualDom_attribute('markerUnits');
var $elm$svg$Svg$Attributes$markerWidth = _VirtualDom_attribute('markerWidth');
var $elm$svg$Svg$Attributes$orient = _VirtualDom_attribute('orient');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$refX = _VirtualDom_attribute('refX');
var $elm$svg$Svg$Attributes$refY = _VirtualDom_attribute('refY');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $author$project$Ui$Palette$Color$NeonFuschia = 14;
var $elm$svg$Svg$foreignObject = $elm$svg$Svg$trustedNode('foreignObject');
var $mdgriffith$elm_ui$Internal$Model$NoStaticStyleSheet = 1;
var $mdgriffith$elm_ui$Internal$Model$RenderModeOption = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$noStaticStyleSheet = $mdgriffith$elm_ui$Internal$Model$RenderModeOption(1);
var $mdgriffith$elm_ui$Element$Input$thumb = $elm$core$Basics$identity;
var $author$project$AccuracyPlot$AccuracyPlot$touchBar = F2(
	function (model, onChange) {
		var yCord = A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0);
		var xRightCord = A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 1) - model.ax.bk;
		var xLeftCord = A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0) + model.ax.bu;
		var touchBarHeight = 30;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xLeftCord)),
						$elm$svg$Svg$Attributes$y1(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
						$elm$svg$Svg$Attributes$x2(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xRightCord)),
						$elm$svg$Svg$Attributes$y2(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord)),
						$elm$svg$Svg$Attributes$stroke(
						$author$project$Ui$Palette$Color$toString(14)),
						$elm$svg$Svg$Attributes$width('2'),
						$elm$svg$Svg$Attributes$strokeWidth('3')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$foreignObject,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xLeftCord)),
						$elm$svg$Svg$Attributes$y(
						A2($author$project$AccuracyPlot$AccuracyPlot$yCordToString, model, yCord + 15)),
						$elm$svg$Svg$Attributes$width(
						A2($myrho$elm_round$Round$round, 2, xRightCord - xLeftCord)),
						$elm$svg$Svg$Attributes$height(
						A2($myrho$elm_round$Round$round, 2, touchBarHeight))
					]),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Element$layoutWith,
						{
							jn: _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$noStaticStyleSheet,
									$mdgriffith$elm_ui$Element$focusStyle(
									{hz: $elm$core$Maybe$Nothing, hG: $elm$core$Maybe$Nothing, jQ: $elm$core$Maybe$Nothing})
								])
						},
						_List_Nil,
						A2(
							$mdgriffith$elm_ui$Element$Input$slider,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$padding(0)
								]),
							{
								iX: $mdgriffith$elm_ui$Element$Input$labelHidden('My Slider Value'),
								d: 1000,
								e: 0,
								jd: onChange,
								jZ: $elm$core$Maybe$Nothing,
								kj: $mdgriffith$elm_ui$Element$Input$thumb(
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$width(
											$mdgriffith$elm_ui$Element$px(0))
										])),
								kA: model.dr
							}))
					]))
			]);
	});
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$markerEnd = _VirtualDom_attribute('marker-end');
var $author$project$AccuracyPlot$AccuracyPlot$xAxis = F2(
	function (model, color) {
		return A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$xCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$y1(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$x2(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$xCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 1))),
					$elm$svg$Svg$Attributes$y2(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$stroke(
					$author$project$Ui$Palette$Color$toString(color)),
					$elm$svg$Svg$Attributes$markerEnd('url(#triangle)')
				]),
			_List_Nil);
	});
var $author$project$AccuracyPlot$AccuracyPlot$yAxis = F2(
	function (model, color) {
		return A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$xCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$y1(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$x2(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$xCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$y2(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 1))),
					$elm$svg$Svg$Attributes$stroke(
					$author$project$Ui$Palette$Color$toString(color)),
					$elm$svg$Svg$Attributes$markerEnd('url(#triangle)')
				]),
			_List_Nil);
	});
var $author$project$AccuracyPlot$AccuracyPlot$yAxisLabel = F2(
	function (model, color) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$xCordToString,
						model,
						A2($author$project$AccuracyPlot$AccuracyPlot$xAxisToCord, model, 0))),
					$elm$svg$Svg$Attributes$y(
					A2(
						$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
						model,
						20 + A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 1))),
					$elm$svg$Svg$Attributes$fill(
					$author$project$Ui$Palette$Color$toString(7)),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$dominantBaseline('middle')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text('points')
				]));
	});
var $author$project$AccuracyPlot$AccuracyPlot$yearTicks = F2(
	function (model, range) {
		var startYear = $justinmimbs$date$Date$year(
			$justinmimbs$date$Date$fromRataDie(range.e - 1));
		var endYear = $justinmimbs$date$Date$year(
			$justinmimbs$date$Date$fromRataDie(range.d + 1));
		return A2(
			$elm$core$List$map,
			function (xc) {
				return A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xc)),
							$elm$svg$Svg$Attributes$y1(
							A2(
								$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
								model,
								A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0))),
							$elm$svg$Svg$Attributes$x2(
							A2($author$project$AccuracyPlot$AccuracyPlot$xCordToString, model, xc)),
							$elm$svg$Svg$Attributes$y2(
							A2(
								$author$project$AccuracyPlot$AccuracyPlot$yCordToString,
								model,
								function (yc) {
									return yc - 4;
								}(
									A2($author$project$AccuracyPlot$AccuracyPlot$yAxisToCord, model, 0)))),
							$elm$svg$Svg$Attributes$stroke(
							$author$project$Ui$Palette$Color$toString(7)),
							$elm$svg$Svg$Attributes$strokeWidth('2')
						]),
					_List_Nil);
			},
			A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					$justinmimbs$date$Date$toRataDie,
					A2($author$project$AccuracyPlot$AccuracyPlot$dateToCord, model, range)),
				A2(
					$elm$core$List$filter,
					A2(
						$justinmimbs$date$Date$isBetween,
						$justinmimbs$date$Date$fromRataDie(range.e - 1),
						$justinmimbs$date$Date$fromRataDie(range.d + 1)),
					A2(
						$elm$core$List$map,
						function (y) {
							return A2($justinmimbs$date$Date$fromOrdinalDate, y, 1);
						},
						A2($elm$core$List$range, startYear, endYear)))));
	});
var $author$project$AccuracyPlot$AccuracyPlot$drawGraph = function (config) {
	var model = config.gd;
	var _function = A3(
		$author$project$AccuracyPlot$Function$calculateFunction,
		config.gQ,
		config.dK,
		{b_: model.b_, cm: model.cm});
	var dateRange = {
		d: $justinmimbs$date$Date$toRataDie(config.dL.d),
		e: $justinmimbs$date$Date$toRataDie(config.dL.e)
	};
	var betDate = $justinmimbs$date$Date$toRataDie(config.dK);
	var maxPoints = A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$maximum(
			A2(
				$elm$core$List$map,
				_function.ek,
				function () {
					var _v1 = (_Utils_cmp(dateRange.e, betDate) < 0) && (_Utils_cmp(betDate, dateRange.d) < 0);
					if (_v1) {
						return _List_fromArray(
							[dateRange.e, betDate, dateRange.d]);
					} else {
						return _List_fromArray(
							[dateRange.e, dateRange.d]);
					}
				}())));
	var pointsRange = {
		d: $author$project$AccuracyPlot$AccuracyPlot$magnitude(maxPoints),
		e: 0
	};
	var minPoints = A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$map,
				_function.ek,
				function () {
					var _v0 = (_Utils_cmp(dateRange.e, betDate) < 0) && (_Utils_cmp(betDate, dateRange.d) < 0);
					if (_v0) {
						return _List_fromArray(
							[dateRange.e, betDate, dateRange.d]);
					} else {
						return _List_fromArray(
							[dateRange.e, dateRange.d]);
					}
				}())));
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				A2($myrho$elm_round$Round$round, 2, model.az)),
				$elm$svg$Svg$Attributes$height(
				A2($myrho$elm_round$Round$round, 2, model.an)),
				$elm$svg$Svg$Attributes$viewBox(
				A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$map,
						$myrho$elm_round$Round$round(2),
						_List_fromArray(
							[0, 0, model.az, model.an]))))
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$defs,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$marker,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('triangle'),
									$elm$svg$Svg$Attributes$viewBox('0 0 10 10'),
									$elm$svg$Svg$Attributes$refX('1'),
									$elm$svg$Svg$Attributes$refY('5'),
									$elm$svg$Svg$Attributes$markerUnits('strokeWidth'),
									$elm$svg$Svg$Attributes$markerWidth('10'),
									$elm$svg$Svg$Attributes$markerHeight('10'),
									$elm$svg$Svg$Attributes$orient('auto'),
									$elm$svg$Svg$Attributes$fill(
									$author$project$Ui$Palette$Color$toString(7))
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$path,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$d('M 0 0 L 10 5 L 0 10 z')
										]),
									_List_Nil)
								]))
						])),
					A2($author$project$AccuracyPlot$AccuracyPlot$yAxisLabel, model, 7),
					A2($author$project$AccuracyPlot$AccuracyPlot$xAxis, model, 7),
					A2($author$project$AccuracyPlot$AccuracyPlot$yAxis, model, 7),
					A4(
					$elm$svg$Svg$Lazy$lazy3,
					$author$project$AccuracyPlot$AccuracyPlot$graphToSvg,
					model,
					{fg: $elm$core$Maybe$Nothing, fv: 7, gy: 2, fd: dateRange, hb: pointsRange},
					_function.iq)
				]),
			_Utils_ap(
				A3($author$project$AccuracyPlot$AccuracyPlot$pointsTick, model, pointsRange, maxPoints),
				_Utils_ap(
					A3($author$project$AccuracyPlot$AccuracyPlot$pointsTick, model, pointsRange, minPoints),
					_Utils_ap(
						A2($author$project$AccuracyPlot$AccuracyPlot$yearTicks, model, dateRange),
						_Utils_ap(
							A4($author$project$AccuracyPlot$AccuracyPlot$highlights, model, dateRange, pointsRange, _function.ek),
							_Utils_ap(
								_List_fromArray(
									[
										A2(
										$author$project$AccuracyPlot$AccuracyPlot$clickFrame,
										model,
										config.ep($author$project$AccuracyPlot$AccuracyPlot$RemoveHighlight))
									]),
								A2(
									$author$project$AccuracyPlot$AccuracyPlot$touchBar,
									model,
									A2(
										$elm$core$Basics$composeR,
										$author$project$AccuracyPlot$AccuracyPlot$TouchOnXAxis(dateRange),
										config.ep)))))))));
};
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Element$html = $mdgriffith$elm_ui$Internal$Model$unstyled;
var $author$project$AccuracyPlot$AccuracyPlot$plotView = function (config) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
		$mdgriffith$elm_ui$Element$html(
			$author$project$AccuracyPlot$AccuracyPlot$drawGraph(config)));
};
var $author$project$Page$Bet$viewPlot = function (model) {
	var _v0 = _Utils_Tuple2(
		$author$project$Valid$AutoCheck$object(model.cQ),
		$author$project$Valid$AutoCheck$object(model.dK));
	if ((!_v0.a.$) && (!_v0.b.$)) {
		var confidence = _v0.a.a;
		var date = _v0.b.a;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
				]),
			$author$project$AccuracyPlot$AccuracyPlot$plotView(
				{
					dK: date,
					dL: $author$project$Logic$Logic$dateRange(model),
					gd: model.bo,
					ep: $author$project$Logic$Logic$PlotMsg,
					gQ: $author$project$Field$Confidence$toInt(confidence)
				}));
	} else {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$centerY,
					$mdgriffith$elm_ui$Element$Font$justify,
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(0)),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(1)),
					$mdgriffith$elm_ui$Element$Border$width(1)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$centerY,
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(220)),
							$mdgriffith$elm_ui$Element$Font$justify
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('You will see your points distribution here after you have selected date and spread ')
						])),
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY, $mdgriffith$elm_ui$Element$Font$center]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('[Hint: you can click the x-Axis]')
						]))
				]));
	}
};
var $author$project$Page$Bet$plotWrapper = function (model) {
	var showPlot = function () {
		var _v1 = _Utils_Tuple2(
			$author$project$Valid$AutoCheck$object(model.cQ),
			$author$project$Valid$AutoCheck$object(model.dK));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var confidence = _v1.a.a;
			var date = _v1.b.a;
			return true;
		} else {
			return false;
		}
	}();
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$height(
				A2($mdgriffith$elm_ui$Element$minimum, 200, $mdgriffith$elm_ui$Element$fill)),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('accuracyPlot')),
						$mdgriffith$elm_ui$Element$clip
					]),
				$author$project$Page$Bet$viewPlot(model)),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$alignLeft]),
					function () {
						var _v0 = _Utils_Tuple2(
							$author$project$Valid$AutoCheck$object(model.cQ),
							$author$project$Valid$AutoCheck$object(model.dK));
						if ((!_v0.a.$) && (!_v0.b.$)) {
							var confidence = _v0.a.a;
							var date = _v0.b.a;
							return _List_Nil;
						} else {
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$inFront(
									A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
												$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
												$mdgriffith$elm_ui$Element$Background$color(
												$author$project$Ui$Palette$Color$translate(6))
											]),
										$mdgriffith$elm_ui$Element$none))
								]);
						}
					}()),
				A2(
					$mdgriffith$elm_ui$Element$Input$radioRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$padding(
							$author$project$Ui$Palette$Distance$translate(0)),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(6)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					{
						iX: $mdgriffith$elm_ui$Element$Input$labelHidden('Show:'),
						jd: $author$project$Logic$Logic$PlotYears,
						jn: _List_fromArray(
							[
								A2($author$project$Ui$CustomElements$textOption, 0, '1 month'),
								A2($author$project$Ui$CustomElements$textOption, 1, '1 semester'),
								A2($author$project$Ui$CustomElements$textOption, 2, 'all years')
							]),
						gJ: $elm$core$Maybe$Just(model.dm)
					}))
			]));
};
var $author$project$Page$Bet$view = function (model) {
	return $author$project$Ui$CustomElements$betLayout(
		A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(2))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					A2(
						$mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$spacing(
								$author$project$Ui$Palette$Distance$translate(2))
							]),
						_List_fromArray(
							[
								$author$project$Page$Bet$chooseDate(model),
								$author$project$Page$Bet$chooseConfidence(model)
							]))),
					$author$project$Page$Bet$plotWrapper(model)
				])));
};
var $author$project$Ui$Palette$Color$NeonPurple = 9;
var $author$project$Ui$CustomElements$colorWhatIsNoMaskDay = 9;
var $author$project$Logic$Logic$Input = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Field$Field$Invite = {$: 2};
var $mdgriffith$elm_ui$Internal$Model$Below = 1;
var $mdgriffith$elm_ui$Element$below = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 1, element);
};
var $mdgriffith$elm_ui$Internal$Model$Focus = 0;
var $mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2($mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, $elm$core$Basics$never, style);
};
var $mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _v0) {
		var styles = _v0.a;
		var trans = _v0.b;
		var _v1 = $mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_v1.$) {
			case 4:
				var style = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, style, styles),
					trans);
			case 10:
				var flag = _v1.a;
				var component = _v1.b;
				return _Utils_Tuple2(
					styles,
					A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _v0 = A3(
		$elm$core$List$foldl,
		$mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, $mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _v0.a;
	var transform = _v0.b;
	return A2(
		$elm$core$List$cons,
		$mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var $mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			0,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $author$project$Ui$Palette$Color$NeonYellow = 11;
var $author$project$Ui$CustomElements$focusedBox = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Border$color(
		$author$project$Ui$Palette$Color$translate(11)),
		$mdgriffith$elm_ui$Element$Font$color(
		$author$project$Ui$Palette$Color$translate(7))
	]);
var $mdgriffith$elm_ui$Element$rgba255 = F4(
	function (red, green, blue, a) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, a);
	});
var $author$project$Ui$Palette$Color$translateAlpha = F2(
	function (a, color) {
		var _v0 = $author$project$Ui$Palette$Color$toTuple(color);
		var r = _v0.a;
		var g = _v0.b;
		var b = _v0.c;
		return A4($mdgriffith$elm_ui$Element$rgba255, r, g, b, a);
	});
var $author$project$Ui$CustomElements$formStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$width(
		$mdgriffith$elm_ui$Element$px(150)),
		$mdgriffith$elm_ui$Element$Background$color(
		A2($author$project$Ui$Palette$Color$translateAlpha, 1, 6)),
		$mdgriffith$elm_ui$Element$Border$color(
		$author$project$Ui$Palette$Color$translate(6)),
		$mdgriffith$elm_ui$Element$Border$width(
		$author$project$Ui$Palette$Distance$translate(8)),
		$mdgriffith$elm_ui$Element$padding(
		$author$project$Ui$Palette$Distance$translate(1)),
		$mdgriffith$elm_ui$Element$centerY,
		$mdgriffith$elm_ui$Element$behindContent(
		A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(1))
				]),
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$Border$color(
						$author$project$Ui$Palette$Color$translate(8)),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						_Utils_update(
							$author$project$Ui$CustomElements$noBorder,
							{bL: 1}))
					]),
				$mdgriffith$elm_ui$Element$none)))
	]);
var $author$project$User$Guest$getFullInvite = function (_v0) {
	var details = _v0;
	return details.iQ;
};
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.cB;
	var right = _v0.bu;
	var bottom = _v0.bL;
	var left = _v0.bk;
	if (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) {
		var topFloat = top;
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(top),
				topFloat,
				topFloat,
				topFloat,
				topFloat));
	} else {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
				top,
				right,
				bottom,
				left));
	}
};
var $author$project$Ui$CustomElements$zeroEach = {bL: 0, bk: 0, bu: 0, cB: 0};
var $author$project$Page$CheckInvitation$hintMessage = function (invite) {
	var zeroEach = $author$project$Ui$CustomElements$zeroEach;
	return A2(
		$mdgriffith$elm_ui$Element$textColumn,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$px(150)),
				$mdgriffith$elm_ui$Element$Font$color(
				$author$project$Ui$Palette$Color$translate(7)),
				$mdgriffith$elm_ui$Element$spacing(
				$author$project$Ui$Palette$Distance$translate(0)),
				$mdgriffith$elm_ui$Element$paddingEach(
				_Utils_update(
					zeroEach,
					{
						cB: $author$project$Ui$Palette$Distance$translate(6)
					}))
			]),
		function () {
			switch (invite.$) {
				case 0:
					return _List_Nil;
				case 1:
					return _List_Nil;
				default:
					var issue = invite.b;
					return _List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text(issue)
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Maybe you have a typo?')
								]))
						]);
			}
		}());
};
var $mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$placeholder = $mdgriffith$elm_ui$Element$Input$Placeholder;
var $mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$Input$TextArea = {$: 1};
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding = function (attrs) {
	var gatherSpacing = F2(
		function (attr, found) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v2 = attr.b;
				var x = _v2.b;
				var y = _v2.c;
				if (found.$ === 1) {
					return $elm$core$Maybe$Just(y);
				} else {
					return found;
				}
			} else {
				return found;
			}
		});
	var _v0 = A3($elm$core$List$foldr, gatherSpacing, $elm$core$Maybe$Nothing, attrs);
	if (_v0.$ === 1) {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		var vSpace = _v0.a;
		return $mdgriffith$elm_ui$Element$moveUp(
			$elm$core$Basics$floor(vSpace / 2));
	}
};
var $mdgriffith$elm_ui$Element$Input$darkGrey = A3($mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		if (_Utils_eq(x, y)) {
			var f = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + $elm$core$String$fromInt(x),
					f,
					f,
					f,
					f));
		} else {
			var yFloat = y;
			var xFloat = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
					yFloat,
					xFloat,
					yFloat,
					xFloat));
		}
	});
var $mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2($mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var $mdgriffith$elm_ui$Element$Input$white = A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var $mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		$mdgriffith$elm_ui$Element$Border$rounded(3),
		$mdgriffith$elm_ui$Element$Border$color($mdgriffith$elm_ui$Element$Input$darkGrey),
		$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$spacing(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
	]);
var $mdgriffith$elm_ui$Element$Input$getHeight = function (attr) {
	if (attr.$ === 8) {
		var h = attr.a;
		return $elm$core$Maybe$Just(h);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 4) && (attr.b.$ === 11)) && (!attr.b.a)) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$isConstrained = function (len) {
	isConstrained:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return true;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isConstrained;
			default:
				var l = len.b;
				return true;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isStacked = function (label) {
	if (!label.$) {
		var loc = label.a;
		switch (loc) {
			case 0:
				return false;
			case 1:
				return false;
			case 2:
				return true;
			default:
				return true;
		}
	} else {
		return true;
	}
};
var $mdgriffith$elm_ui$Element$Input$negateBox = function (box) {
	return {bL: -box.bL, bk: -box.bk, bu: -box.bu, cB: -box.cB};
};
var $mdgriffith$elm_ui$Element$Input$isFill = function (len) {
	isFill:
	while (true) {
		switch (len.$) {
			case 2:
				return true;
			case 1:
				return false;
			case 0:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isPixel = function (len) {
	isPixel:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
		}
	}
};
var $mdgriffith$elm_ui$Internal$Model$paddingNameFloat = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(top) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(right) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(bottom) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(left)))))));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $mdgriffith$elm_ui$Element$Input$redistributeOver = F4(
	function (isMultiline, stacked, attr, els) {
		switch (attr.$) {
			case 9:
				return _Utils_update(
					els,
					{
						c: A2($elm$core$List$cons, attr, els.c)
					});
			case 7:
				var width = attr.a;
				return $mdgriffith$elm_ui$Element$Input$isFill(width) ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l),
						ed: A2($elm$core$List$cons, attr, els.ed),
						c: A2($elm$core$List$cons, attr, els.c)
					}) : (stacked ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l)
					}) : _Utils_update(
					els,
					{
						c: A2($elm$core$List$cons, attr, els.c)
					}));
			case 8:
				var height = attr.a;
				return (!stacked) ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l),
						c: A2($elm$core$List$cons, attr, els.c)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(height) ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l),
						c: A2($elm$core$List$cons, attr, els.c)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(height) ? _Utils_update(
					els,
					{
						c: A2($elm$core$List$cons, attr, els.c)
					}) : _Utils_update(
					els,
					{
						c: A2($elm$core$List$cons, attr, els.c)
					})));
			case 6:
				return _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l)
					});
			case 5:
				return _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l)
					});
			case 4:
				switch (attr.b.$) {
					case 5:
						var _v1 = attr.b;
						return _Utils_update(
							els,
							{
								l: A2($elm$core$List$cons, attr, els.l),
								ed: A2($elm$core$List$cons, attr, els.ed),
								c: A2($elm$core$List$cons, attr, els.c),
								bE: A2($elm$core$List$cons, attr, els.bE)
							});
					case 7:
						var cls = attr.a;
						var _v2 = attr.b;
						var pad = _v2.a;
						var t = _v2.b;
						var r = _v2.c;
						var b = _v2.d;
						var l = _v2.e;
						if (isMultiline) {
							return _Utils_update(
								els,
								{
									I: A2($elm$core$List$cons, attr, els.I),
									c: A2($elm$core$List$cons, attr, els.c)
								});
						} else {
							var newTop = t - A2($elm$core$Basics$min, t, b);
							var newLineHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'line-height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newBottom = b - A2($elm$core$Basics$min, t, b);
							var reducedVerticalPadding = A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$padding,
								A5(
									$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
									A4($mdgriffith$elm_ui$Internal$Model$paddingNameFloat, newTop, r, newBottom, l),
									newTop,
									r,
									newBottom,
									l));
							return _Utils_update(
								els,
								{
									I: A2($elm$core$List$cons, attr, els.I),
									ed: A2(
										$elm$core$List$cons,
										newHeight,
										A2($elm$core$List$cons, newLineHeight, els.ed)),
									c: A2($elm$core$List$cons, reducedVerticalPadding, els.c)
								});
						}
					case 6:
						var _v3 = attr.b;
						return _Utils_update(
							els,
							{
								I: A2($elm$core$List$cons, attr, els.I),
								c: A2($elm$core$List$cons, attr, els.c)
							});
					case 10:
						return _Utils_update(
							els,
							{
								I: A2($elm$core$List$cons, attr, els.I),
								c: A2($elm$core$List$cons, attr, els.c)
							});
					case 2:
						return _Utils_update(
							els,
							{
								l: A2($elm$core$List$cons, attr, els.l)
							});
					case 1:
						var _v4 = attr.b;
						return _Utils_update(
							els,
							{
								l: A2($elm$core$List$cons, attr, els.l)
							});
					default:
						var flag = attr.a;
						var cls = attr.b;
						return _Utils_update(
							els,
							{
								c: A2($elm$core$List$cons, attr, els.c)
							});
				}
			case 0:
				return els;
			case 1:
				var a = attr.a;
				return _Utils_update(
					els,
					{
						ed: A2($elm$core$List$cons, attr, els.ed)
					});
			case 2:
				return _Utils_update(
					els,
					{
						ed: A2($elm$core$List$cons, attr, els.ed)
					});
			case 3:
				return _Utils_update(
					els,
					{
						c: A2($elm$core$List$cons, attr, els.c)
					});
			default:
				return _Utils_update(
					els,
					{
						ed: A2($elm$core$List$cons, attr, els.ed)
					});
		}
	});
var $mdgriffith$elm_ui$Element$Input$redistribute = F3(
	function (isMultiline, stacked, attrs) {
		return function (redist) {
			return {
				I: $elm$core$List$reverse(redist.I),
				l: $elm$core$List$reverse(redist.l),
				ed: $elm$core$List$reverse(redist.ed),
				c: $elm$core$List$reverse(redist.c),
				bE: $elm$core$List$reverse(redist.bE)
			};
		}(
			A3(
				$elm$core$List$foldl,
				A2($mdgriffith$elm_ui$Element$Input$redistributeOver, isMultiline, stacked),
				{I: _List_Nil, l: _List_Nil, ed: _List_Nil, c: _List_Nil, bE: _List_Nil},
				attrs));
	});
var $mdgriffith$elm_ui$Element$Input$renderBox = function (_v0) {
	var top = _v0.cB;
	var right = _v0.bu;
	var bottom = _v0.bL;
	var left = _v0.bk;
	return $elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px'))))));
};
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$rgba = $mdgriffith$elm_ui$Internal$Model$Rgba;
var $mdgriffith$elm_ui$Element$Input$renderPlaceholder = F3(
	function (_v0, forPlaceholder, on) {
		var placeholderAttrs = _v0.a;
		var placeholderEl = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				forPlaceholder,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.gj + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.jq)),
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alpha(
							on ? 1 : 0)
						]),
					placeholderAttrs)),
			placeholderEl);
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.jN);
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var withDefaults = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var redistributed = A3(
			$mdgriffith$elm_ui$Element$Input$redistribute,
			_Utils_eq(textInput.E, $mdgriffith$elm_ui$Element$Input$TextArea),
			$mdgriffith$elm_ui$Element$Input$isStacked(textOptions.iX),
			withDefaults);
		var onlySpacing = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v9 = attr.b;
				return true;
			} else {
				return false;
			}
		};
		var heightConstrained = function () {
			var _v7 = textInput.E;
			if (!_v7.$) {
				var inputType = _v7.a;
				return false;
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$mdgriffith$elm_ui$Element$Input$isConstrained,
						$elm$core$List$head(
							$elm$core$List$reverse(
								A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Element$Input$getHeight, withDefaults)))));
			}
		}();
		var getPadding = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 7)) {
				var cls = attr.a;
				var _v6 = attr.b;
				var pad = _v6.a;
				var t = _v6.b;
				var r = _v6.c;
				var b = _v6.d;
				var l = _v6.e;
				return $elm$core$Maybe$Just(
					{
						bL: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(b - 3)),
						bk: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(l - 3)),
						bu: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(r - 3)),
						cB: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(t - 3))
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var parentPadding = A2(
			$elm$core$Maybe$withDefault,
			{bL: 0, bk: 0, bu: 0, cB: 0},
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2($elm$core$List$filterMap, getPadding, withDefaults))));
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			function () {
				var _v3 = textInput.E;
				if (!_v3.$) {
					var inputType = _v3.a;
					return $mdgriffith$elm_ui$Internal$Model$NodeName('input');
				} else {
					return $mdgriffith$elm_ui$Internal$Model$NodeName('textarea');
				}
			}(),
			_Utils_ap(
				function () {
					var _v4 = textInput.E;
					if (!_v4.$) {
						var inputType = _v4.a;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iL)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iH),
								$mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding(withDefaults),
								$mdgriffith$elm_ui$Element$paddingEach(parentPadding),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2(
									$elm$html$Html$Attributes$style,
									'margin',
									$mdgriffith$elm_ui$Element$Input$renderBox(
										$mdgriffith$elm_ui$Element$Input$negateBox(parentPadding)))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$style, 'box-sizing', 'content-box'))
							]);
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Input$value(textOptions.gZ),
							$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Events$onInput(textOptions.jd)),
							$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.iX),
							$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.ae),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Internal$Model$NoAttribute,
							A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.U))
						]),
					redistributed.ed)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil));
		var wrappedInput = function () {
			var _v0 = textInput.E;
			if (_v0.$ === 1) {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_Utils_ap(
						(heightConstrained ? $elm$core$List$cons($mdgriffith$elm_ui$Element$scrollbarY) : $elm$core$Basics$identity)(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fQ),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iK)
								])),
						redistributed.c),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asParagraph,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Element$inFront(inputElement),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iJ),
												redistributed.bE)))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(
									function () {
										if (textOptions.gZ === '') {
											var _v1 = textOptions.jt;
											if (_v1.$ === 1) {
												return _List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('\u00A0')
													]);
											} else {
												var place = _v1.a;
												return _List_fromArray(
													[
														A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, _List_Nil, textOptions.gZ === '')
													]);
											}
										} else {
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Internal$Model$unstyled(
													A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.iI)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(textOptions.gZ + '\u00A0')
															])))
												]);
										}
									}()))
							])));
			} else {
				var inputType = _v0.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2(
							$elm$core$List$cons,
							A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fQ),
							$elm$core$List$concat(
								_List_fromArray(
									[
										redistributed.c,
										function () {
										var _v2 = textOptions.jt;
										if (_v2.$ === 1) {
											return _List_Nil;
										} else {
											var place = _v2.a;
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Element$behindContent(
													A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, redistributed.I, textOptions.gZ === ''))
												]);
										}
									}()
									])))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[inputElement])));
			}
		}();
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.h1),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.iX) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, redistributed.l))),
			textOptions.iX,
			wrappedInput);
	});
var $mdgriffith$elm_ui$Element$Input$text = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		U: $elm$core$Maybe$Nothing,
		ae: false,
		E: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var $author$project$Page$CheckInvitation$inviteForm = F2(
	function (guest, model) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$text,
			_Utils_ap(
				$author$project$Ui$CustomElements$formStyle,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$below(
						$author$project$Page$CheckInvitation$hintMessage(
							$author$project$User$Guest$getFullInvite(guest))),
						$mdgriffith$elm_ui$Element$focused($author$project$Ui$CustomElements$focusedBox),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('invite-form'))
					])),
			{
				iX: $mdgriffith$elm_ui$Element$Input$labelHidden('Invite'),
				jd: $author$project$Logic$Logic$Input($author$project$Field$Field$Invite),
				jt: $elm$core$Maybe$Just(
					A2(
						$mdgriffith$elm_ui$Element$Input$placeholder,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text('your invitation code'))),
				gZ: A2(
					$elm$core$Maybe$withDefault,
					'',
					$author$project$User$Guest$getInvite(guest))
			});
	});
var $author$project$Page$CheckInvitation$view = function (model) {
	var _v0 = model.p;
	if (!_v0.$) {
		var guest = _v0.a;
		return A2(
			$author$project$Ui$CustomElements$explanationPage,
			$author$project$Ui$CustomElements$colorWhatIsNoMaskDay,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$bold]),
					$mdgriffith$elm_ui$Element$text('Can I see your invite?')),
					A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('To make sure, that you are friend or family I need your personal invitation code')
								]))
						])),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					A2($author$project$Page$CheckInvitation$inviteForm, guest, model))
				]));
	} else {
		var member = _v0.a;
		return $mdgriffith$elm_ui$Element$text('This is not a place for members like you!');
	}
};
var $author$project$Ui$Palette$FontSize$B = 1;
var $author$project$Logic$Logic$GoHome = {$: 5};
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 8};
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.dg;
		var label = _v0.iX;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cT + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.at + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.jO + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gj)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 1) {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onKeyLookup(
															function (code) {
																return _Utils_eq(code, $mdgriffith$elm_ui$Element$Input$enter) ? $elm$core$Maybe$Just(msg) : (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$space) ? $elm$core$Maybe$Just(msg) : $elm$core$Maybe$Nothing);
															}),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Internal$Model$boxShadowClass = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.f$ ? 'box-inset' : 'box-',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.jb.a) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.jb.b) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.hE) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.aX) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.fv)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {hE: almostShade.hE, fv: almostShade.fv, f$: false, jb: almostShade.jb, aX: almostShade.aX};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowClass(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $mdgriffith$elm_ui$Element$Border$glow = F2(
	function (clr, size) {
		return $mdgriffith$elm_ui$Element$Border$shadow(
			{
				hE: size * 2,
				fv: clr,
				jb: _Utils_Tuple2(0, 0),
				aX: size
			});
	});
var $author$project$Ui$CustomElements$myFocused = $mdgriffith$elm_ui$Element$focused(
	_List_fromArray(
		[
			function (x) {
			return A2($mdgriffith$elm_ui$Element$Border$glow, x, 1);
		}(
			$author$project$Ui$Palette$Color$translate(11))
		]));
var $author$project$Ui$CustomElements$basicButton = F4(
	function (msg, paddingDist, color, buttonText) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(paddingDist)),
					$mdgriffith$elm_ui$Element$Border$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Border$width(
					$author$project$Ui$Palette$Distance$translate(9)),
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$author$project$Ui$CustomElements$myFocused
				]),
			{
				iX: A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
					$mdgriffith$elm_ui$Element$text(buttonText)),
				dg: $elm$core$Maybe$Just(msg)
			});
	});
var $author$project$User$Member$getName = function (_v0) {
	var passcode = _v0.jr;
	var name = _v0.i6;
	var bet = _v0.dC;
	return name;
};
var $author$project$User$Member$getPasscode = function (details) {
	return details.jr;
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $mdgriffith$elm_ui$Element$link = F2(
	function (attrs, _v0) {
		var url = _v0.cG;
		var label = _v0.iX;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Attr(
					$elm$html$Html$Attributes$href(url)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$Attr(
						$elm$html$Html$Attributes$rel('noopener noreferrer')),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cT + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.at + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gb)))),
								attrs))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $author$project$User$Passcode$toLink = function (_v0) {
	var passcode = _v0;
	return 'https://no-mask-day.com/?p=' + passcode;
};
var $author$project$Page$ConfirmationSubmitGuest$view = function (model) {
	var _v0 = model.p;
	if (_v0.$ === 1) {
		var member = _v0.a;
		return A2(
			$author$project$Ui$CustomElements$explanationPage,
			12,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$bold,
							$mdgriffith$elm_ui$Element$Font$size(
							$author$project$Ui$Palette$FontSize$translate(1))
						]),
					$mdgriffith$elm_ui$Element$text('Great! Your bet has been submitted!')),
					A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(0))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Welcome to the party '),
									$mdgriffith$elm_ui$Element$text(
									$author$project$User$Member$getName(member)),
									$mdgriffith$elm_ui$Element$text('! Your bet has been sent sucessfully.')
								])),
							A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$spacing(
									$author$project$Ui$Palette$Distance$translate(8))
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('You can change your bet anytime under this link:')
										])),
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$center,
											$mdgriffith$elm_ui$Element$padding(
											$author$project$Ui$Palette$Distance$translate(1))
										]),
									_List_fromArray(
										[
											function () {
											var memberLink = $author$project$User$Passcode$toLink(
												$author$project$User$Member$getPasscode(member));
											return A2(
												$mdgriffith$elm_ui$Element$link,
												_List_Nil,
												{
													iX: A2(
														$mdgriffith$elm_ui$Element$el,
														_List_fromArray(
															[
																$mdgriffith$elm_ui$Element$Font$color(
																$author$project$Ui$Palette$Color$translate(12)),
																$mdgriffith$elm_ui$Element$Font$underline
															]),
														$mdgriffith$elm_ui$Element$text(memberLink)),
													cG: memberLink
												});
										}()
										]))
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('I also just sent you the link via e-mail.')
								]))
						])),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]),
					A4($author$project$Ui$CustomElements$basicButton, $author$project$Logic$Logic$GoHome, 0, 12, 'kk.'))
				]));
	} else {
		var guest = _v0.a;
		return A2(
			$author$project$Ui$CustomElements$explanationPage,
			13,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$bold]),
					$mdgriffith$elm_ui$Element$text('What?! How did you get here?')),
					A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Strange, I don\'t know you but still you are here. Can you perhaps tell me how you managed to do that?')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('That would be great :)')
								]))
						]))
				]));
	}
};
var $author$project$Ui$Palette$FontSize$XB = 2;
var $author$project$Ui$CustomElements$contactBox = A2(
	$author$project$Ui$CustomElements$colorBox,
	14,
	_List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$size(
					$author$project$Ui$Palette$FontSize$translate(2)),
					$mdgriffith$elm_ui$Element$Font$underline
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text('con'),
					$mdgriffith$elm_ui$Element$text('tact')
				]))
		]));
var $author$project$Ui$CustomElements$contactLayout = function (content) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_Utils_ap(
			$author$project$Ui$CustomElements$basicPageLayout,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(1))
				])),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignLeft]),
						$author$project$Ui$CustomElements$contactBox),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$Border$widthEach(
								_Utils_update(
									$author$project$Ui$CustomElements$noBorder,
									{bL: 2})),
								$mdgriffith$elm_ui$Element$Border$color(
								$author$project$Ui$Palette$Color$translate(14))
							]),
						A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$padding(
									$author$project$Ui$Palette$Distance$translate(6))
								]),
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('choose a name for public display and enter an e-mail for me to contact you privately')
								])))
					])),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$padding(
						$author$project$Ui$Palette$Distance$translate(1)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				content)
			]));
};
var $author$project$Logic$Logic$BlurOnBox = function (a) {
	return {$: 12, a: a};
};
var $author$project$Logic$Logic$EnterOnEmailBox = {$: 11};
var $mdgriffith$elm_ui$Element$Input$email = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		U: $elm$core$Maybe$Just('email'),
		ae: false,
		E: $mdgriffith$elm_ui$Element$Input$TextInputNode('email')
	});
var $author$project$Ui$Palette$Color$NeonGreen = 15;
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{u: nodeList, n: nodeListSize, q: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$Page$ContactInfo$enterCountToColor = function (cnt) {
	var nextColor = A2($elm$core$Basics$modBy, 4, cnt);
	var colorWheel = $elm$core$Array$fromList(
		_List_fromArray(
			[7, 13, 12, 15, 14, 10]));
	return A2(
		$elm$core$Maybe$withDefault,
		13,
		A2($elm$core$Array$get, nextColor, colorWheel));
};
var $author$project$Page$ContactInfo$hintMessage = F3(
	function (field, guest, model) {
		var zeroEach = $author$project$Ui$CustomElements$noBorder;
		var f = function () {
			if (!field) {
				return {
					dE: $author$project$User$Guest$getNameCertificate(guest),
					dG: model.b3.bb,
					ee: 'please change your name:',
					cH: model.b3.cH
				};
			} else {
				return {
					dE: $author$project$User$Guest$getEmailCertificate(guest),
					dG: model.b2.bb,
					ee: 'please change your email:',
					cH: model.b2.cH
				};
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$textColumn,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(150)),
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(7)),
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(0)),
					$mdgriffith$elm_ui$Element$paddingEach(
					_Utils_update(
						zeroEach,
						{
							cB: $author$project$Ui$Palette$Distance$translate(6)
						}))
				]),
			function () {
				var _v0 = _Utils_Tuple2(f.dE, f.cH);
				_v0$5:
				while (true) {
					switch (_v0.a.$) {
						case 0:
							if (_v0.b) {
								var _v1 = _v0.a;
								return _List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('i\'m checking...')
											]))
									]);
							} else {
								break _v0$5;
							}
						case 1:
							if (_v0.b) {
								var _v2 = _v0.a;
								return _List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('i\'m checking...')
											]))
									]);
							} else {
								break _v0$5;
							}
						case 2:
							if (_v0.b) {
								var _v3 = _v0.a;
								return _List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('ok, please confirm again')
											]))
									]);
							} else {
								break _v0$5;
							}
						case 3:
							var issues = _v0.a.a;
							return A2(
								$elm$core$List$map,
								function (t) {
									return A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$color(
												$author$project$Ui$Palette$Color$translate(
													$author$project$Page$ContactInfo$enterCountToColor(f.dG)))
											]),
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text(t)
											]));
								},
								A2(
									$elm$core$List$cons,
									f.ee,
									A2(
										$elm$core$List$map,
										$elm$core$Basics$append('• '),
										issues)));
						default:
							var errors = _v0.a.a;
							return A2(
								$elm$core$List$map,
								function (t) {
									return A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text(t)
											]));
								},
								A2(
									$elm$core$List$cons,
									'ups... there is an error:',
									A2(
										$elm$core$List$map,
										$elm$core$Basics$append('• '),
										errors)));
					}
				}
				return _List_Nil;
			}());
	});
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Ui$CustomElements$onBlur = function (msg) {
	return $mdgriffith$elm_ui$Element$htmlAttribute(
		$elm$html$Html$Events$onBlur(msg));
};
var $author$project$Ui$CustomElements$onEnterHtml = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'keyup',
		A2(
			$elm$json$Json$Decode$andThen,
			function (key) {
				return (key === 'Enter') ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Not the enter key');
			},
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
};
var $author$project$Ui$CustomElements$onEnter = A2($elm$core$Basics$composeR, $author$project$Ui$CustomElements$onEnterHtml, $mdgriffith$elm_ui$Element$htmlAttribute);
var $author$project$Page$ContactInfo$emailForm = F2(
	function (guest, model) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$email,
			_Utils_ap(
				$author$project$Ui$CustomElements$formStyle,
				_Utils_ap(
					function () {
						var _v0 = $author$project$Logic$Logic$validateEmail(model);
						if (!_v0.$) {
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color(
									$author$project$Ui$Palette$Color$translate(14))
								]);
						} else {
							return _List_Nil;
						}
					}(),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$htmlAttribute(
							$elm$html$Html$Attributes$id('email-box')),
							$mdgriffith$elm_ui$Element$below(
							A3($author$project$Page$ContactInfo$hintMessage, 1, guest, model)),
							$author$project$Ui$CustomElements$onEnter($author$project$Logic$Logic$EnterOnEmailBox),
							$author$project$Ui$CustomElements$onBlur(
							$author$project$Logic$Logic$BlurOnBox(
								$author$project$Field$Field$Guest(1))),
							$mdgriffith$elm_ui$Element$focused($author$project$Ui$CustomElements$focusedBox)
						]))),
			{
				iX: $mdgriffith$elm_ui$Element$Input$labelHidden('Email'),
				jd: $author$project$Logic$Logic$Input(
					$author$project$Field$Field$Guest(1)),
				jt: $elm$core$Maybe$Just(
					A2(
						$mdgriffith$elm_ui$Element$Input$placeholder,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text('your e-mail'))),
				gZ: $author$project$User$Guest$getEmail(guest)
			});
	});
var $author$project$Logic$Logic$EnterOnNameBox = {$: 10};
var $author$project$Page$ContactInfo$nameForm = F2(
	function (guest, model) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$text,
			_Utils_ap(
				$author$project$Ui$CustomElements$formStyle,
				_Utils_ap(
					function () {
						var _v0 = $author$project$Logic$Logic$validateName(model);
						if (!_v0.$) {
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color(
									$author$project$Ui$Palette$Color$translate(14))
								]);
						} else {
							return _List_Nil;
						}
					}(),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$htmlAttribute(
							$elm$html$Html$Attributes$id('name-box')),
							$mdgriffith$elm_ui$Element$below(
							A3($author$project$Page$ContactInfo$hintMessage, 0, guest, model)),
							$author$project$Ui$CustomElements$onEnter($author$project$Logic$Logic$EnterOnNameBox),
							$author$project$Ui$CustomElements$onBlur(
							$author$project$Logic$Logic$BlurOnBox(
								$author$project$Field$Field$Guest(0))),
							$mdgriffith$elm_ui$Element$focused($author$project$Ui$CustomElements$focusedBox)
						]))),
			{
				iX: $mdgriffith$elm_ui$Element$Input$labelHidden('Name'),
				jd: $author$project$Logic$Logic$Input(
					$author$project$Field$Field$Guest(0)),
				jt: $elm$core$Maybe$Just(
					A2(
						$mdgriffith$elm_ui$Element$Input$placeholder,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text('your name'))),
				gZ: $author$project$User$Guest$getName(guest)
			});
	});
var $author$project$Page$ContactInfo$view = function (model) {
	return $author$project$Ui$CustomElements$contactLayout(
		function () {
			var _v0 = model.p;
			if (!_v0.$) {
				var guest = _v0.a;
				return A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$alignTop,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							$mdgriffith$elm_ui$Element$none),
							A2($author$project$Page$ContactInfo$nameForm, guest, model),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							$mdgriffith$elm_ui$Element$none),
							A2($author$project$Page$ContactInfo$emailForm, guest, model),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							$mdgriffith$elm_ui$Element$none)
						]));
			} else {
				var member = _v0.a;
				return $mdgriffith$elm_ui$Element$text('You shouldn\'t be here O.o');
			}
		}());
};
var $author$project$Page$Home$contactInfo = F2(
	function (model, guest) {
		var colorOk = $author$project$Ui$Palette$Color$translate(14);
		var colorNok = $author$project$Ui$Palette$Color$translate(8);
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(0)),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(6)),
					$mdgriffith$elm_ui$Element$centerY
				]),
			_List_fromArray(
				[
					function () {
					var _v0 = $author$project$Valid$Valid$fromCertified(
						$author$project$User$Guest$getCertifiedName(guest));
					if (!_v0.$) {
						var validName = _v0.a;
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color(colorOk)
								]),
							$mdgriffith$elm_ui$Element$text(
								$author$project$Valid$Valid$object(validName)));
					} else {
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$underline,
									$mdgriffith$elm_ui$Element$Font$color(colorNok)
								]),
							$mdgriffith$elm_ui$Element$text('your name'));
					}
				}(),
					function () {
					var _v1 = $author$project$Valid$Valid$fromCertified(
						$author$project$User$Guest$getCertifiedEmail(guest));
					if (!_v1.$) {
						var validEmail = _v1.a;
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color(colorOk)
								]),
							$mdgriffith$elm_ui$Element$text(
								$author$project$Valid$Valid$object(validEmail)));
					} else {
						return A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$underline,
									$mdgriffith$elm_ui$Element$Font$color(colorNok)
								]),
							$mdgriffith$elm_ui$Element$text('your e-mail'));
					}
				}()
				]));
	});
var $author$project$Ui$CustomElements$homePageLayout = F2(
	function (overlay, content) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$inFront(overlay),
				$author$project$Ui$CustomElements$basicPageLayout),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Font$size(
							$author$project$Ui$Palette$FontSize$translate(3)),
							$mdgriffith$elm_ui$Element$Font$bold,
							$mdgriffith$elm_ui$Element$Font$color(
							$author$project$Ui$Palette$Color$translate(7)),
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Ui$Palette$Color$translate(6)),
							$mdgriffith$elm_ui$Element$padding(
							$author$project$Ui$Palette$Distance$translate(2)),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{bL: 1, bk: 0, bu: 0, cB: 0}),
							$mdgriffith$elm_ui$Element$Border$color(
							$author$project$Ui$Palette$Color$translate(7))
						]),
					$mdgriffith$elm_ui$Element$text('No-Mask-Day bet!')),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$padding(
							$author$project$Ui$Palette$Distance$translate(2))
						]),
					content)
				]));
	});
var $mdgriffith$elm_ui$Element$Font$italic = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iV);
var $author$project$Ui$CustomElements$colorHowToBet = 10;
var $author$project$Logic$Page$toLink = function (page) {
	return '/' + $author$project$Logic$Page$toPath(page);
};
var $author$project$Ui$CustomElements$link = F3(
	function (color, page, labelText) {
		return A2(
			$mdgriffith$elm_ui$Element$link,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Font$underline,
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							function (x) {
							return A2($mdgriffith$elm_ui$Element$Border$glow, x, 1);
						}(
							$author$project$Ui$Palette$Color$translate(11))
						]))
				]),
			{
				iX: $mdgriffith$elm_ui$Element$text(labelText),
				cG: $author$project$Logic$Page$toLink(page)
			});
	});
var $author$project$Page$Home$linkLetsBet = function (linkText) {
	return A3($author$project$Ui$CustomElements$link, $author$project$Ui$CustomElements$colorHowToBet, 4, linkText);
};
var $author$project$Page$Home$linkNoMaskDay = function (linkText) {
	return A3($author$project$Ui$CustomElements$link, $author$project$Ui$CustomElements$colorWhatIsNoMaskDay, 3, linkText);
};
var $mdgriffith$elm_ui$Element$Font$alignRight = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kf);
var $author$project$Page$Home$betColor = $author$project$Ui$Palette$Color$translate(13);
var $author$project$Ui$CustomElements$formOverview = F2(
	function (selectStyle, rows) {
		var makeParagraph = function (_v1) {
			var whichStyle = _v1.a;
			var content = _v1.b;
			if (whichStyle) {
				return A2(
					$mdgriffith$elm_ui$Element$paragraph,
					selectStyle(true),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text(content)
						]));
			} else {
				return A2(
					$mdgriffith$elm_ui$Element$paragraph,
					selectStyle(false),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text(content)
						]));
			}
		};
		return A2(
			$mdgriffith$elm_ui$Element$textColumn,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(0)),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(6)),
					$mdgriffith$elm_ui$Element$centerY,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			A2($elm$core$List$map, makeParagraph, rows));
	});
var $author$project$Ui$CustomElements$middleSplit = F2(
	function (leftContent, rightContent) {
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$clip
						]),
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$alignRight
							]),
						leftContent)),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$clip
						]),
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$alignLeft
							]),
						rightContent))
				]));
	});
var $author$project$Page$Home$notSetColor = $author$project$Ui$Palette$Color$translate(8);
var $author$project$Ui$CustomElements$pureLink = F2(
	function (page, content) {
		return A2(
			$mdgriffith$elm_ui$Element$link,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							function (x) {
							return A2($mdgriffith$elm_ui$Element$Border$glow, x, 1);
						}(
							$author$project$Ui$Palette$Color$translate(11))
						]))
				]),
			{
				iX: content,
				cG: $author$project$Logic$Page$toLink(page)
			});
	});
var $author$project$Page$Home$linkToBet = function (model) {
	return A2(
		$author$project$Ui$CustomElements$pureLink,
		8,
		A2(
			$author$project$Ui$CustomElements$middleSplit,
			A2(
				$author$project$Ui$CustomElements$formOverview,
				function (b) {
					if (b) {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$alignRight,
								$mdgriffith$elm_ui$Element$Font$color($author$project$Page$Home$betColor)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$alignRight,
								$mdgriffith$elm_ui$Element$Font$underline,
								$mdgriffith$elm_ui$Element$Font$color($author$project$Page$Home$notSetColor)
							]);
					}
				},
				_List_fromArray(
					[
						function () {
						var _v1 = $author$project$Valid$AutoCheck$publicObject(model.dK);
						if (!_v1.$) {
							var date = _v1.a;
							return _Utils_Tuple2(
								true,
								$author$project$Field$Date$toPrettyString(date));
						} else {
							return _Utils_Tuple2(false, 'date');
						}
					}(),
						function () {
						var _v2 = $author$project$Valid$AutoCheck$publicObject(model.cQ);
						if (!_v2.$) {
							var confidence = _v2.a;
							return _Utils_Tuple2(
								true,
								$author$project$Field$Confidence$toString(confidence) + '% spread');
						} else {
							return _Utils_Tuple2(false, 'spread');
						}
					}()
					])),
			$author$project$Ui$CustomElements$betBox));
};
var $author$project$Ui$Palette$Distance$XXXXB = 5;
var $mdgriffith$elm_ui$Element$Background$image = function (src) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		A2($elm$virtual_dom$VirtualDom$style, 'background', 'url(\"' + (src + '\") center / cover no-repeat')));
};
var $author$project$Ui$CustomElements$messageOverlay = function (messages) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			$author$project$Ui$CustomElements$basicPageLayout,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$image('../images/static_noise.png')
				])),
		A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$Background$color(
					A2($author$project$Ui$Palette$Color$translateAlpha, 0.85, 6))
				]),
			A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$centerY,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(5))
					]),
				messages)));
};
var $author$project$Logic$Logic$AcceptSubmitError = {$: 18};
var $author$project$Ui$Palette$Distance$XXXB = 4;
var $author$project$Ui$CustomElements$overlayMessage = F2(
	function (message, button) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$Background$color(
					$author$project$Ui$Palette$Color$translate(6)),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(4)),
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(2)),
					$mdgriffith$elm_ui$Element$Border$widthEach(
					_Utils_update(
						$author$project$Ui$CustomElements$noBorder,
						{bL: 1, cB: 1}))
				]),
			_List_fromArray(
				[
					message,
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]),
					button)
				]));
	});
var $author$project$Page$Home$problemMessage = function (model) {
	var _v0 = model.eB;
	if (!_v0.$) {
		var problem = _v0.a;
		return _List_fromArray(
			[
				A2(
				$author$project$Ui$CustomElements$overlayMessage,
				A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_Nil,
					_List_fromArray(
						[
							function () {
							switch (problem.$) {
								case 0:
									var error = problem.a;
									return A2(
										$mdgriffith$elm_ui$Element$column,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$spacing(
												$author$project$Ui$Palette$Distance$translate(0))
											]),
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('Sorry, the server had some issues with your bet. He responded with:'),
												A2(
												$mdgriffith$elm_ui$Element$column,
												_List_Nil,
												A2($elm$core$List$map, $mdgriffith$elm_ui$Element$text, error)),
												$mdgriffith$elm_ui$Element$text('maybe you should contact me')
											]));
								case 2:
									var issues = problem.a;
									return A2(
										$mdgriffith$elm_ui$Element$column,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$spacing(
												$author$project$Ui$Palette$Distance$translate(0))
											]),
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('Sorry, servers says your bet is not legit. He\'s complaining about the following:'),
												A2(
												$mdgriffith$elm_ui$Element$column,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$Font$color(
														$author$project$Ui$Palette$Color$translate(13))
													]),
												A2($elm$core$List$map, $mdgriffith$elm_ui$Element$text, issues)),
												$mdgriffith$elm_ui$Element$text('Maybe this helps you. If it\'s just gibberish for you, reach out to me, I\'m usually smarter than the server.')
											]));
								case 1:
									var description = problem.a;
									return A2(
										$mdgriffith$elm_ui$Element$column,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$spacing(
												$author$project$Ui$Palette$Distance$translate(0))
											]),
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('Sorry, I encountered an error while trying to log you in:'),
												A2(
												$mdgriffith$elm_ui$Element$column,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$Font$color(
														$author$project$Ui$Palette$Color$translate(13))
													]),
												A2($elm$core$List$map, $mdgriffith$elm_ui$Element$text, description)),
												$mdgriffith$elm_ui$Element$text('So I couldn\'t log you in. Try it again or contact me :)')
											]));
								default:
									var httpError = problem.a;
									if (httpError.$ === 2) {
										return A2(
											$mdgriffith$elm_ui$Element$column,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$spacing(
													$author$project$Ui$Palette$Distance$translate(0))
												]),
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$text('It seems like your internet connection is gone. Wait till you have internet and submit again.')
												]));
									} else {
										return A2(
											$mdgriffith$elm_ui$Element$column,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$spacing(
													$author$project$Ui$Palette$Distance$translate(0))
												]),
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$text('Sorry, I got an Error back from the server. The error reads as:'),
													$mdgriffith$elm_ui$Element$text(
													$author$project$Api$Api$errorToString(httpError)),
													$mdgriffith$elm_ui$Element$text('you can try to submit your bet again but you can also contact me :)')
												]));
									}
							}
						}()
						])),
				A4($author$project$Ui$CustomElements$basicButton, $author$project$Logic$Logic$AcceptSubmitError, 0, 9, 'Ok'))
			]);
	} else {
		return _List_Nil;
	}
};
var $author$project$Page$Home$overlay = function (model) {
	var allMessages = $author$project$Page$Home$problemMessage(model);
	if (!allMessages.b) {
		return $mdgriffith$elm_ui$Element$none;
	} else {
		var someMessages = allMessages;
		return $author$project$Ui$CustomElements$messageOverlay(someMessages);
	}
};
var $author$project$Page$Home$remarksAndDetailedExplanations = A2(
	$author$project$Ui$CustomElements$pureLink,
	5,
	A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				$mdgriffith$elm_ui$Element$Font$color(
				$author$project$Ui$Palette$Color$translate(12)),
				$mdgriffith$elm_ui$Element$padding(
				$author$project$Ui$Palette$Distance$translate(0)),
				$mdgriffith$elm_ui$Element$Border$width(1)
			]),
		$mdgriffith$elm_ui$Element$text('R&D')));
var $author$project$Ui$Palette$FontSize$S = 6;
var $author$project$Logic$Logic$SetSubmitButtonHints = function (a) {
	return {$: 13, a: a};
};
var $author$project$Logic$Logic$SubmitBetForGuest = {$: 14};
var $author$project$Ui$CustomElements$centeredText = F2(
	function (attributes, string) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
				attributes),
			$mdgriffith$elm_ui$Element$text(string));
	});
var $author$project$Ui$CustomElements$submitButton = F3(
	function (msg, color, label) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(2 * $author$project$Ui$CustomElements$coloredBoxSize)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px($author$project$Ui$CustomElements$coloredBoxSize)),
					$mdgriffith$elm_ui$Element$Border$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Border$width(
					$author$project$Ui$Palette$Distance$translate(9)),
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Font$size(
					$author$project$Ui$Palette$FontSize$translate(1)),
					$author$project$Ui$CustomElements$myFocused
				]),
			{
				iX: label,
				dg: $elm$core$Maybe$Just(msg)
			});
	});
var $author$project$Ui$CustomElements$submitButtonFake = F2(
	function (color, content) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(2 * $author$project$Ui$CustomElements$coloredBoxSize)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px($author$project$Ui$CustomElements$coloredBoxSize)),
					$mdgriffith$elm_ui$Element$Border$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Border$width(
					$author$project$Ui$Palette$Distance$translate(9)),
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Font$size(
					$author$project$Ui$Palette$FontSize$translate(1))
				]),
			content);
	});
var $author$project$Page$Home$submitButtonGuest = function (model) {
	var _v0 = _Utils_Tuple3(
		model.ak,
		$author$project$Logic$Logic$validateGuestBet(model),
		model.cl);
	_v0$0:
	while (true) {
		_v0$1:
		while (true) {
			if (!_v0.c) {
				if (_v0.a === 1) {
					break _v0$0;
				} else {
					if (!_v0.b.$) {
						break _v0$1;
					} else {
						return A3(
							$author$project$Ui$CustomElements$submitButton,
							$author$project$Logic$Logic$SetSubmitButtonHints(true),
							8,
							A2($author$project$Ui$CustomElements$centeredText, _List_Nil, 'bid'));
					}
				}
			} else {
				if (_v0.a === 1) {
					break _v0$0;
				} else {
					if (!_v0.b.$) {
						break _v0$1;
					} else {
						return A2(
							$author$project$Ui$CustomElements$submitButtonFake,
							11,
							A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$padding(
										$author$project$Ui$Palette$Distance$translate(6)),
										$mdgriffith$elm_ui$Element$centerX,
										$mdgriffith$elm_ui$Element$centerY,
										$mdgriffith$elm_ui$Element$Font$size(
										$author$project$Ui$Palette$FontSize$translate(6)),
										$mdgriffith$elm_ui$Element$Font$justify
									]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('You first have to fill out all fields to submit your bet, alright?'),
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$alignRight, $mdgriffith$elm_ui$Element$Font$alignRight]),
										_List_fromArray(
											[
												A4(
												$author$project$Ui$CustomElements$basicButton,
												$author$project$Logic$Logic$SetSubmitButtonHints(false),
												7,
												15,
												'alright!')
											]))
									])));
					}
				}
			}
		}
		var submitData = _v0.b.a;
		return A3(
			$author$project$Ui$CustomElements$submitButton,
			$author$project$Logic$Logic$SubmitBetForGuest,
			15,
			A2($author$project$Ui$CustomElements$centeredText, _List_Nil, 'bid!'));
	}
	var _v1 = _v0.a;
	return A2(
		$author$project$Ui$CustomElements$submitButtonFake,
		11,
		A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
			$mdgriffith$elm_ui$Element$text('submitting...')));
};
var $author$project$Page$Home$pageGuest = F2(
	function (model, guest) {
		return A2(
			$author$project$Ui$CustomElements$homePageLayout,
			$author$project$Page$Home$overlay(model),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(1))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$textColumn,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('Corona is still going strong! When can we celebrate the '),
											$author$project$Page$Home$linkNoMaskDay('No-Mask-Day'),
											$mdgriffith$elm_ui$Element$text(' in Germany?')
										]))
								])),
							A2(
							$mdgriffith$elm_ui$Element$textColumn,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('Nobody knows! So, '),
											$author$project$Page$Home$linkLetsBet('let\'s make a bet')
										]))
								])),
							A2(
							$mdgriffith$elm_ui$Element$textColumn,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('You can submit and change your bet until '),
											A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[$mdgriffith$elm_ui$Element$Font$italic]),
											$mdgriffith$elm_ui$Element$text(
												$author$project$Field$Date$toPrettyString(
													A3($justinmimbs$date$Date$add, 3, -1, $author$project$Logic$Logic$startOfBet))))
										]))
								]))
						])),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$spacing(
								$author$project$Ui$Palette$Distance$translate(2)),
								$mdgriffith$elm_ui$Element$centerY
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$column,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Ui$CustomElements$pureLink,
										7,
										A2(
											$author$project$Ui$CustomElements$middleSplit,
											$author$project$Ui$CustomElements$contactBox,
											A2($author$project$Page$Home$contactInfo, model, guest))),
										$author$project$Page$Home$linkToBet(model)
									])),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerX]),
								$author$project$Page$Home$submitButtonGuest(model))
							]))),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$alignBottom, $mdgriffith$elm_ui$Element$alignRight]),
					$author$project$Page$Home$remarksAndDetailedExplanations)
				]));
	});
var $author$project$Ui$Palette$FontSize$XXXB = 4;
var $justinmimbs$date$Date$toMonths = function (rd) {
	var date = $justinmimbs$date$Date$toCalendarDate(rd);
	var wholeMonths = (12 * (date.hc - 1)) + ($justinmimbs$date$Date$monthToNumber(date.ge) - 1);
	return wholeMonths + (date.fA / 100);
};
var $elm$core$Basics$truncate = _Basics_truncate;
var $justinmimbs$date$Date$diff = F3(
	function (unit, _v0, _v1) {
		var rd1 = _v0;
		var rd2 = _v1;
		switch (unit) {
			case 0:
				return ((($justinmimbs$date$Date$toMonths(rd2) - $justinmimbs$date$Date$toMonths(rd1)) | 0) / 12) | 0;
			case 1:
				return ($justinmimbs$date$Date$toMonths(rd2) - $justinmimbs$date$Date$toMonths(rd1)) | 0;
			case 2:
				return ((rd2 - rd1) / 7) | 0;
			default:
				return rd2 - rd1;
		}
	});
var $author$project$Logic$Logic$SubmitBetForMember = function (a) {
	return {$: 15, a: a};
};
var $author$project$Logic$Logic$convertToMemberBet = function (model) {
	var _v0 = _Utils_Tuple2(
		$author$project$Valid$AutoCheck$publicObject(model.cQ),
		$author$project$Valid$AutoCheck$publicObject(model.dK));
	if ((!_v0.a.$) && (!_v0.b.$)) {
		var confidence = _v0.a.a;
		var date = _v0.b.a;
		return $elm$core$Maybe$Just(
			{cQ: confidence, dK: date});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$User$Member$getBet = function (_v0) {
	var passcode = _v0.jr;
	var name = _v0.i6;
	var bet = _v0.dC;
	return bet;
};
var $author$project$Logic$Logic$validateMemberBet = function (model) {
	var _v0 = _Utils_Tuple2(model.ak, model.p);
	if ((!_v0.a) && (_v0.b.$ === 1)) {
		var _v1 = _v0.a;
		var member = _v0.b.a;
		var _v2 = !_Utils_eq(
			$elm$core$Maybe$Just(
				$author$project$User$Member$getBet(member)),
			$author$project$Logic$Logic$convertToMemberBet(model));
		if (_v2) {
			var _v3 = _Utils_Tuple2(
				$author$project$Logic$Logic$validateConfidence(model),
				$author$project$Logic$Logic$validateDate(model));
			if ((!_v3.a.$) && (!_v3.b.$)) {
				var confidence = _v3.a.a;
				var date = _v3.b.a;
				return $elm$core$Maybe$Just(
					{
						cQ: confidence,
						dK: date,
						jr: $author$project$User$Member$getPasscode(member)
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Page$Home$submitButtonMember = function (model) {
	var _v0 = _Utils_Tuple3(
		model.ak,
		$author$project$Logic$Logic$validateMemberBet(model),
		model.cl);
	_v0$0:
	while (true) {
		_v0$1:
		while (true) {
			if (!_v0.c) {
				if (_v0.a === 1) {
					break _v0$0;
				} else {
					if (!_v0.b.$) {
						break _v0$1;
					} else {
						return A3(
							$author$project$Ui$CustomElements$submitButton,
							$author$project$Logic$Logic$SetSubmitButtonHints(true),
							8,
							A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$size(
										$author$project$Ui$Palette$FontSize$translate(3)),
										$mdgriffith$elm_ui$Element$Font$alignRight,
										$mdgriffith$elm_ui$Element$alignRight
									]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('is up to date')
									])));
					}
				}
			} else {
				if (_v0.a === 1) {
					break _v0$0;
				} else {
					if (!_v0.b.$) {
						break _v0$1;
					} else {
						return A2(
							$author$project$Ui$CustomElements$submitButtonFake,
							11,
							A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$padding(
										$author$project$Ui$Palette$Distance$translate(6)),
										$mdgriffith$elm_ui$Element$centerX,
										$mdgriffith$elm_ui$Element$centerY,
										$mdgriffith$elm_ui$Element$Font$size(
										$author$project$Ui$Palette$FontSize$translate(6)),
										$mdgriffith$elm_ui$Element$Font$justify
									]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('What you see is what you bet. Change date or spread to update it.'),
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$alignRight, $mdgriffith$elm_ui$Element$Font$alignRight]),
										_List_fromArray(
											[
												A4(
												$author$project$Ui$CustomElements$basicButton,
												$author$project$Logic$Logic$SetSubmitButtonHints(false),
												7,
												15,
												'ok!')
											]))
									])));
					}
				}
			}
		}
		var submitData = _v0.b.a;
		return A3(
			$author$project$Ui$CustomElements$submitButton,
			$author$project$Logic$Logic$SubmitBetForMember(submitData),
			15,
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
				$mdgriffith$elm_ui$Element$text('update!')));
	}
	var _v1 = _v0.a;
	return A2(
		$author$project$Ui$CustomElements$submitButtonFake,
		11,
		A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
			$mdgriffith$elm_ui$Element$text('submitting...')));
};
var $author$project$Page$Home$pageMember = F2(
	function (model, member) {
		return A2(
			$author$project$Ui$CustomElements$homePageLayout,
			$author$project$Page$Home$overlay(model),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(1))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$textColumn,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('Hey, '),
											A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[$mdgriffith$elm_ui$Element$Font$italic]),
											$mdgriffith$elm_ui$Element$text(member.i6)),
											$mdgriffith$elm_ui$Element$text(' nice to see you again! Here are two reminders of '),
											$author$project$Page$Home$linkNoMaskDay('No-Mask-Day'),
											$mdgriffith$elm_ui$Element$text(' and '),
											$author$project$Page$Home$linkLetsBet('How-To-Bet'),
											$mdgriffith$elm_ui$Element$text('.')
										]))
								])),
							function () {
							var _v0 = member.iU;
							if (!_v0) {
								return A2(
									$mdgriffith$elm_ui$Element$textColumn,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
										]),
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Element$paragraph,
											_List_Nil,
											_Utils_ap(
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('You still have to '),
														A2(
														$mdgriffith$elm_ui$Element$el,
														_List_Nil,
														$mdgriffith$elm_ui$Element$text('pay')),
														$mdgriffith$elm_ui$Element$text(' your wager of '),
														A2(
														$mdgriffith$elm_ui$Element$el,
														_List_fromArray(
															[$mdgriffith$elm_ui$Element$Font$bold]),
														$mdgriffith$elm_ui$Element$text('20€')),
														$mdgriffith$elm_ui$Element$text(' for your bet to be fully completed. You have time till '),
														$mdgriffith$elm_ui$Element$text(
														$author$project$Field$Date$toPrettyString(
															A3($justinmimbs$date$Date$add, 3, -1, $author$project$Logic$Logic$startOfBet)))
													]),
												function () {
													var _v1 = model.bB;
													if (_v1.$ === 1) {
														return _List_fromArray(
															[
																$mdgriffith$elm_ui$Element$text('.')
															]);
													} else {
														var today = _v1.a;
														return _List_fromArray(
															[
																$mdgriffith$elm_ui$Element$text(' - that is, '),
																function (x) {
																return A2(
																	$mdgriffith$elm_ui$Element$el,
																	_List_Nil,
																	$mdgriffith$elm_ui$Element$text(x + ' days'));
															}(
																$elm$core$String$fromInt(
																	function (d) {
																		return A3($justinmimbs$date$Date$diff, 3, d, $author$project$Logic$Logic$startOfBet);
																	}(today))),
																$mdgriffith$elm_ui$Element$text('.')
															]);
													}
												}()))
										]));
							} else {
								return $mdgriffith$elm_ui$Element$none;
							}
						}(),
							A2(
							$mdgriffith$elm_ui$Element$textColumn,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('You can change your bet as much as you like until '),
											$mdgriffith$elm_ui$Element$text(
											$author$project$Field$Date$toPrettyString(
												A3($justinmimbs$date$Date$add, 3, -1, $author$project$Logic$Logic$startOfBet))),
											$mdgriffith$elm_ui$Element$text('. After that you can only watch and wait.')
										]))
								]))
						])),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$spacing(
								$author$project$Ui$Palette$Distance$translate(2)),
								$mdgriffith$elm_ui$Element$centerY
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$column,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Ui$CustomElements$middleSplit,
										$mdgriffith$elm_ui$Element$none,
										A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$Font$size(
													$author$project$Ui$Palette$FontSize$translate(4)),
													$mdgriffith$elm_ui$Element$width(
													$mdgriffith$elm_ui$Element$px($author$project$Ui$CustomElements$coloredBoxSize)),
													$mdgriffith$elm_ui$Element$Font$alignRight,
													$mdgriffith$elm_ui$Element$Font$color(
													$author$project$Ui$Palette$Color$translate(13))
												]),
											$mdgriffith$elm_ui$Element$text('your'))),
										$author$project$Page$Home$linkToBet(model)
									])),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerX]),
								$author$project$Page$Home$submitButtonMember(model))
							]))),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$alignBottom, $mdgriffith$elm_ui$Element$alignRight]),
					$author$project$Page$Home$remarksAndDetailedExplanations)
				]));
	});
var $author$project$Page$Home$view = function (model) {
	var _v0 = model.p;
	if (!_v0.$) {
		var guest = _v0.a;
		return A2($author$project$Page$Home$pageGuest, model, guest);
	} else {
		var member = _v0.a;
		return A2($author$project$Page$Home$pageMember, model, member);
	}
};
var $mdgriffith$elm_ui$Element$Font$family = function (families) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontFamily,
		A2(
			$mdgriffith$elm_ui$Internal$Model$FontFamily,
			A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'ff-', families),
			families));
};
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $mdgriffith$elm_ui$Element$image = F2(
	function (attrs, _v0) {
		var src = _v0.bx;
		var description = _v0.a8;
		var imageAttributes = A2(
			$elm$core$List$filter,
			function (a) {
				switch (a.$) {
					case 7:
						return true;
					case 8:
						return true;
					default:
						return false;
				}
			},
			attrs);
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iC),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName('img'),
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$src(src)),
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$alt(description))
								]),
							imageAttributes),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil))
					])));
	});
var $mdgriffith$elm_ui$Internal$Model$Serif = {$: 0};
var $mdgriffith$elm_ui$Element$Font$serif = $mdgriffith$elm_ui$Internal$Model$Serif;
var $author$project$Page$HowToBet$celebrate = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(
				$author$project$Ui$Palette$Distance$translate(2))
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$image,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								A2($mdgriffith$elm_ui$Element$maximum, 200, $mdgriffith$elm_ui$Element$fill))
							]),
						{a8: 'a crazy party', bx: '../images/celebrate.svg'}),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alignRight,
								$mdgriffith$elm_ui$Element$Font$size(
								$author$project$Ui$Palette$FontSize$translate(4)),
								$mdgriffith$elm_ui$Element$width(
								A2($mdgriffith$elm_ui$Element$maximum, 200, $mdgriffith$elm_ui$Element$fill)),
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$alignTop,
										$mdgriffith$elm_ui$Element$Font$center,
										$mdgriffith$elm_ui$Element$Font$family(
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$Font$serif]))
									]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('V')
									])),
								A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerY, $mdgriffith$elm_ui$Element$Font$center]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('celebrate!')
									]))
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$image,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				{a8: 'I hate copyright so much!', bx: '../images/party.webp'})
			]));
};
var $author$project$Ui$CustomElements$howToBetStep = F2(
	function (frameColor, step) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$color(
					$author$project$Ui$Palette$Color$translate(frameColor)),
					$mdgriffith$elm_ui$Element$Border$widthEach(
					_Utils_update(
						$author$project$Ui$CustomElements$zeroEach,
						{
							bL: $author$project$Ui$Palette$Distance$translate(6),
							cB: $author$project$Ui$Palette$Distance$translate(6)
						})),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$padding(
					$author$project$Ui$Palette$Distance$translate(2))
				]),
			step);
	});
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $author$project$Ui$CustomElements$lineBetweenSteps = function (param) {
	return A2(
		$mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$height(param.iv),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				$mdgriffith$elm_ui$Element$none),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color(
						$author$project$Ui$Palette$Color$translate(param.fv)),
						$mdgriffith$elm_ui$Element$width(param.eZ),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				$mdgriffith$elm_ui$Element$none),
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
					]),
				$mdgriffith$elm_ui$Element$none)
			]));
};
var $author$project$Ui$CustomElements$howToBetPage = F2(
	function (title, steps) {
		var color = $author$project$Ui$CustomElements$colorHowToBet;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			$author$project$Ui$CustomElements$basicPageLayout,
			A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$Font$size(
								$author$project$Ui$Palette$FontSize$translate(2)),
								$mdgriffith$elm_ui$Element$Font$bold,
								$mdgriffith$elm_ui$Element$Font$color(
								$author$project$Ui$Palette$Color$translate(7)),
								$mdgriffith$elm_ui$Element$Background$color(
								$author$project$Ui$Palette$Color$translate(6)),
								$mdgriffith$elm_ui$Element$padding(
								$author$project$Ui$Palette$Distance$translate(2)),
								$mdgriffith$elm_ui$Element$Border$widthEach(
								_Utils_update(
									$author$project$Ui$CustomElements$zeroEach,
									{
										bL: $author$project$Ui$Palette$Distance$translate(6)
									})),
								$mdgriffith$elm_ui$Element$Border$color(
								$author$project$Ui$Palette$Color$translate(10))
							]),
						title),
						$author$project$Ui$CustomElements$lineBetweenSteps(
						{
							fv: 10,
							fx: $mdgriffith$elm_ui$Element$none,
							iv: $mdgriffith$elm_ui$Element$px(1000),
							eZ: $mdgriffith$elm_ui$Element$px(
								$author$project$Ui$Palette$Distance$translate(6))
						}),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						A2(
							$elm$core$List$intersperse,
							$author$project$Ui$CustomElements$lineBetweenSteps(
								{
									fv: color,
									fx: $mdgriffith$elm_ui$Element$text('bla'),
									iv: $mdgriffith$elm_ui$Element$px(1000),
									eZ: $mdgriffith$elm_ui$Element$px(
										$author$project$Ui$Palette$Distance$translate(6))
								}),
							A2(
								$elm$core$List$map,
								$author$project$Ui$CustomElements$howToBetStep(color),
								steps)))
					])));
	});
var $author$project$Ui$CustomElements$boldFont = function (content) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[$mdgriffith$elm_ui$Element$Font$bold]),
		$mdgriffith$elm_ui$Element$text(content));
};
var $author$project$Ui$CustomElements$howToBetStepTitle = F3(
	function (imageParam, step, title) {
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(6))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$fillPortion(1))
						]),
					A2(
						$mdgriffith$elm_ui$Element$image,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								A2($mdgriffith$elm_ui$Element$maximum, 200, $mdgriffith$elm_ui$Element$fill)),
								$mdgriffith$elm_ui$Element$centerX
							]),
						{a8: imageParam.a8, bx: imageParam.bx})),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$fillPortion(1)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
						]),
					A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alignRight,
								$mdgriffith$elm_ui$Element$Font$size(
								$author$project$Ui$Palette$FontSize$translate(4)),
								$mdgriffith$elm_ui$Element$width(
								A2($mdgriffith$elm_ui$Element$maximum, 200, $mdgriffith$elm_ui$Element$fill)),
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$spacing(
								$author$project$Ui$Palette$Distance$translate(2))
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$alignTop, $mdgriffith$elm_ui$Element$Font$center]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text(step)
									])),
								A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$centerY,
										$mdgriffith$elm_ui$Element$Font$center,
										$mdgriffith$elm_ui$Element$Font$size(
										$author$project$Ui$Palette$FontSize$translate(3))
									]),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text(title)
									]))
							])))
				]));
	});
var $author$project$Page$HowToBet$payYourWager = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(
				$author$project$Ui$Palette$Distance$translate(2))
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Ui$CustomElements$howToBetStepTitle,
				{a8: 'money taking a trip around the world', bx: '../images/payYourWager2.svg'},
				'II',
				'pay your wager'),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(0)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('The wager for this bet is')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$center,
								$mdgriffith$elm_ui$Element$Font$size(
								$author$project$Ui$Palette$FontSize$translate(1))
							]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('20€')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$justify]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('and you have to pay it')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$center,
								$mdgriffith$elm_ui$Element$Font$size(
								$author$project$Ui$Palette$FontSize$translate(1))
							]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text(
								function (s) {
									return 'until ' + (s + '.');
								}(
									$author$project$Field$Date$toPrettyString(
										$justinmimbs$date$Date$fromRataDie(
											$justinmimbs$date$Date$toRataDie($author$project$Logic$Logic$startOfBet) - 1))))
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(6))
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$justify]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('I collect all the wagers '),
								$author$project$Ui$CustomElements$boldFont('personally¹'),
								$mdgriffith$elm_ui$Element$text(' and put them in a metaphorical pot. Your winnings will be a share from this pot.')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$size(
								$author$project$Ui$Palette$FontSize$translate(6))
							]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('1: I do this for security reasons. So do not trust any email from @no-mask-day.com about payment issues.')
							]))
					]))
			]));
};
var $lemol$ant_design_icons_elm_ui$Ant$Icon$Fill = function (a) {
	return {$: 4, a: a};
};
var $lemol$ant_design_icons_elm_ui$Ant$Icon$fill = $lemol$ant_design_icons_elm_ui$Ant$Icon$Fill;
var $lemol$ant_design_icons_elm$Ant$Icons$Svg$FundOutlined$viewWithAttributes = function (attributes) {
	return A2(
		$elm$svg$Svg$svg,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('64 64 896 896')
				]),
			attributes),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M926 164H94c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V196c0-17.7-14.3-32-32-32zm-40 632H134V236h752v560zm-658.9-82.3c3.1 3.1 8.2 3.1 11.3 0l172.5-172.5 114.4 114.5c3.1 3.1 8.2 3.1 11.3 0l297-297.2c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8a8.03 8.03 0 00-11.3 0L531 565 416.6 450.5a8.03 8.03 0 00-11.3 0l-214.9 215a8.03 8.03 0 000 11.3l36.7 36.9z')
					]),
				_List_Nil)
			]));
};
var $lemol$ant_design_icons_elm$Ant$Icons$Svg$fundOutlined = $lemol$ant_design_icons_elm$Ant$Icons$Svg$FundOutlined$viewWithAttributes;
var $lemol$ant_design_icons_elm_ui$Ant$Icon$defaultProps = {c0: $elm$core$Maybe$Nothing, iv: $elm$core$Maybe$Nothing, $7: $elm$core$Maybe$Nothing, ds: false, eV: _List_Nil, e0: $elm$core$Maybe$Nothing, kD: $elm$core$Maybe$Nothing};
var $lemol$ant_design_icons_elm_ui$Ant$Icon$fromAttributes = function () {
	var f = F2(
		function (act, acc) {
			switch (act.$) {
				case 0:
					return _Utils_update(
						acc,
						{ds: true});
				case 1:
					var x = act.a;
					return _Utils_update(
						acc,
						{
							$7: $elm$core$Maybe$Just(x)
						});
				case 2:
					var x = act.a;
					return _Utils_update(
						acc,
						{
							kD: $elm$core$Maybe$Just(x)
						});
				case 3:
					var x = act.a;
					return _Utils_update(
						acc,
						{
							iv: $elm$core$Maybe$Just(x)
						});
				case 4:
					var x = act.a;
					return _Utils_update(
						acc,
						{
							c0: $elm$core$Maybe$Just(x)
						});
				case 5:
					var x = act.a;
					return _Utils_update(
						acc,
						{eV: x});
				default:
					var x = act.a;
					return _Utils_update(
						acc,
						{
							e0: $elm$core$Maybe$Just(x)
						});
			}
		});
	return A2($elm$core$List$foldl, f, $lemol$ant_design_icons_elm_ui$Ant$Icon$defaultProps);
}();
var $mdgriffith$elm_ui$Internal$Model$Rotate = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$rotate = $mdgriffith$elm_ui$Internal$Flag$flag(24);
var $mdgriffith$elm_ui$Element$rotate = function (angle) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$rotate,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Rotate,
			_Utils_Tuple3(0, 0, 1),
			angle));
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $lemol$ant_design_icons_elm_ui$Ant$Icon$iconBase = F3(
	function (theme, attrs, svgIcon) {
		var props = $lemol$ant_design_icons_elm_ui$Ant$Icon$fromAttributes(attrs);
		var rotate_ = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$rotate, props.$7)));
		var spin_ = props.ds ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'animation', 'loadingCircle 1s infinite linear')
			]) : _List_Nil;
		var svgAttributes = _Utils_ap(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width('1em'),
					$elm$svg$Svg$Attributes$height('1em'),
					$elm$svg$Svg$Attributes$fill('currentColor')
				]),
			spin_);
		var width_ = A2($elm$core$Maybe$withDefault, 1 * 14, props.kD);
		var height_ = A2($elm$core$Maybe$withDefault, 1 * 14, props.kD);
		var fill_ = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Font$color, props.c0)));
		var elAttributes = _Utils_ap(
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$size(
					A2($elm$core$Basics$max, width_, height_))
				]),
			_Utils_ap(rotate_, fill_));
		return A2(
			$mdgriffith$elm_ui$Element$el,
			elAttributes,
			$mdgriffith$elm_ui$Element$html(
				svgIcon(svgAttributes)));
	});
var $lemol$ant_design_icons_elm_ui$Ant$Icon$icon = $lemol$ant_design_icons_elm_ui$Ant$Icon$iconBase(
	{});
var $lemol$ant_design_icons_elm_ui$Ant$Icons$fundOutlined = function (attrs) {
	return A2($lemol$ant_design_icons_elm_ui$Ant$Icon$icon, attrs, $lemol$ant_design_icons_elm$Ant$Icons$Svg$fundOutlined);
};
var $lemol$ant_design_icons_elm$Ant$Icons$Svg$IdcardOutlined$viewWithAttributes = function (attributes) {
	return A2(
		$elm$svg$Svg$svg,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('64 64 896 896')
				]),
			attributes),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560zM610.3 476h123.4c1.3 0 2.3-3.6 2.3-8v-48c0-4.4-1-8-2.3-8H610.3c-1.3 0-2.3 3.6-2.3 8v48c0 4.4 1 8 2.3 8zm4.8 144h185.7c3.9 0 7.1-3.6 7.1-8v-48c0-4.4-3.2-8-7.1-8H615.1c-3.9 0-7.1 3.6-7.1 8v48c0 4.4 3.2 8 7.1 8zM224 673h43.9c4.2 0 7.6-3.3 7.9-7.5 3.8-50.5 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H522a8 8 0 008-8.4c-2.8-53.3-32-99.7-74.6-126.1a111.8 111.8 0 0029.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 00-74.6 126.1c-.4 4.6 3.2 8.4 7.8 8.4zm149-262c28.5 0 51.7 23.3 51.7 52s-23.2 52-51.7 52-51.7-23.3-51.7-52 23.2-52 51.7-52z')
					]),
				_List_Nil)
			]));
};
var $lemol$ant_design_icons_elm$Ant$Icons$Svg$idcardOutlined = $lemol$ant_design_icons_elm$Ant$Icons$Svg$IdcardOutlined$viewWithAttributes;
var $lemol$ant_design_icons_elm_ui$Ant$Icons$idcardOutlined = function (attrs) {
	return A2($lemol$ant_design_icons_elm_ui$Ant$Icon$icon, attrs, $lemol$ant_design_icons_elm$Ant$Icons$Svg$idcardOutlined);
};
var $lemol$ant_design_icons_elm$Ant$Icons$Svg$MailOutlined$viewWithAttributes = function (attributes) {
	return A2(
		$elm$svg$Svg$svg,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('64 64 896 896')
				]),
			attributes),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z')
					]),
				_List_Nil)
			]));
};
var $lemol$ant_design_icons_elm$Ant$Icons$Svg$mailOutlined = $lemol$ant_design_icons_elm$Ant$Icons$Svg$MailOutlined$viewWithAttributes;
var $lemol$ant_design_icons_elm_ui$Ant$Icons$mailOutlined = function (attrs) {
	return A2($lemol$ant_design_icons_elm_ui$Ant$Icon$icon, attrs, $lemol$ant_design_icons_elm$Ant$Icons$Svg$mailOutlined);
};
var $lemol$ant_design_icons_elm_ui$Ant$Icon$Width = function (a) {
	return {$: 2, a: a};
};
var $lemol$ant_design_icons_elm_ui$Ant$Icon$width = $lemol$ant_design_icons_elm_ui$Ant$Icon$Width;
var $author$project$Page$HowToBet$placeYourBet = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(
				$author$project$Ui$Palette$Distance$translate(2))
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Ui$CustomElements$howToBetStepTitle,
				{a8: 'caleder with highlighted days', bx: '../images/placeYourBet.svg'},
				'I',
				'place your bet'),
				A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(0))
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('I need the following from you:')
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$spacing(
								$author$project$Ui$Palette$Distance$translate(1)),
								$mdgriffith$elm_ui$Element$Font$justify
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$alignLeft]),
										$lemol$ant_design_icons_elm_ui$Ant$Icons$idcardOutlined(
											_List_fromArray(
												[
													$lemol$ant_design_icons_elm_ui$Ant$Icon$width(50),
													$lemol$ant_design_icons_elm_ui$Ant$Icon$fill(
													$author$project$Ui$Palette$Color$translate(10))
												]))),
										$mdgriffith$elm_ui$Element$text('a '),
										$author$project$Ui$CustomElements$boldFont('name'),
										$mdgriffith$elm_ui$Element$text(' by which you want to be known during the bet. It doesn\'t have to be your real name, be funny or mysterious.')
									])),
								A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$alignLeft]),
										$lemol$ant_design_icons_elm_ui$Ant$Icons$mailOutlined(
											_List_fromArray(
												[
													$lemol$ant_design_icons_elm_ui$Ant$Icon$width(50),
													$lemol$ant_design_icons_elm_ui$Ant$Icon$fill(
													$author$project$Ui$Palette$Color$translate(10))
												]))),
										$mdgriffith$elm_ui$Element$text('your '),
										$author$project$Ui$CustomElements$boldFont('email'),
										$mdgriffith$elm_ui$Element$text(' over which I can reach out to you to keep you up to date. Don\'t worry, I won\'t spam you nor will your e-mail be made public.')
									])),
								A2(
								$mdgriffith$elm_ui$Element$textColumn,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
									]),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$mdgriffith$elm_ui$Element$el,
												_List_fromArray(
													[$mdgriffith$elm_ui$Element$alignLeft]),
												$lemol$ant_design_icons_elm_ui$Ant$Icons$fundOutlined(
													_List_fromArray(
														[
															$lemol$ant_design_icons_elm_ui$Ant$Icon$width(50),
															$lemol$ant_design_icons_elm_ui$Ant$Icon$fill(
															$author$project$Ui$Palette$Color$translate(10))
														]))),
												$mdgriffith$elm_ui$Element$text('your '),
												$author$project$Ui$CustomElements$boldFont('point distribution'),
												$mdgriffith$elm_ui$Element$text(', the actual part of betting. So pay attention, '),
												A2(
												$mdgriffith$elm_ui$Element$el,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$Font$color(
														$author$project$Ui$Palette$Color$translate(11))
													]),
												$mdgriffith$elm_ui$Element$text('this is the most important part!'))
											])),
										A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text('The idea is that you have 1000 points which you split up among the days in 2022-2024. The more points you bet correctly on the actual date of No-Mask-Day, the more money you win. You can place all your points on one day or spread them out over a couple of days, weeks, months or even distribute them evenly among the '),
												$mdgriffith$elm_ui$Element$text(
												$elm$core$String$fromInt(
													($justinmimbs$date$Date$toRataDie($author$project$Logic$Logic$endOfBet) - $justinmimbs$date$Date$toRataDie($author$project$Logic$Logic$startOfBet)) + 1)),
												$mdgriffith$elm_ui$Element$text(' eligible days. The last case would mean about 0.91 points per day. So yeah, your points have a floating point.')
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Logic$Logic$AnswerLittleQuiz = function (a) {
	return {$: 22, a: a};
};
var $author$project$Logic$Logic$Correct = 0;
var $author$project$Logic$Logic$False1 = 1;
var $author$project$Logic$Logic$False2 = 2;
var $author$project$Logic$Logic$False3 = 3;
var $author$project$Ui$CustomElements$mathInline = function (txt) {
	return $mdgriffith$elm_ui$Element$text(
		$yotamDvir$elm_katex$Katex$print(
			$yotamDvir$elm_katex$Katex$inline(txt)));
};
var $mdgriffith$elm_ui$Element$Input$defaultRadioOption = F2(
	function (optionLabel, status) {
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(10),
					$mdgriffith$elm_ui$Element$alignLeft,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(14)),
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(14)),
							$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
							$mdgriffith$elm_ui$Element$Border$rounded(7),
							function () {
							if (status === 2) {
								return $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
							} else {
								return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
							}
						}(),
							$mdgriffith$elm_ui$Element$Border$width(
							function () {
								switch (status) {
									case 0:
										return 1;
									case 1:
										return 1;
									default:
										return 5;
								}
							}()),
							$mdgriffith$elm_ui$Element$Border$color(
							function () {
								switch (status) {
									case 0:
										return A3($mdgriffith$elm_ui$Element$rgb, 208 / 255, 208 / 255, 208 / 255);
									case 1:
										return A3($mdgriffith$elm_ui$Element$rgb, 208 / 255, 208 / 255, 208 / 255);
									default:
										return A3($mdgriffith$elm_ui$Element$rgb, 59 / 255, 153 / 255, 252 / 255);
								}
							}())
						]),
					$mdgriffith$elm_ui$Element$none),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Internal$Model$htmlClass('unfocusable')
						]),
					optionLabel)
				]));
	});
var $mdgriffith$elm_ui$Element$Input$option = F2(
	function (val, txt) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$Option,
			val,
			$mdgriffith$elm_ui$Element$Input$defaultRadioOption(txt));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Page$HowToBet$avgPoints = function (points) {
	return $elm$core$List$sum(points) / $elm$core$List$length(points);
};
var $author$project$Page$HowToBet$justPoints = function (points) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var x = _v0.a;
			var y = _v0.b;
			return y;
		},
		points);
};
var $author$project$Page$HowToBet$yourPoints = function (points) {
	var _v0 = $elm$core$List$head(points);
	if (!_v0.$) {
		var point = _v0.a;
		return point;
	} else {
		return 0;
	}
};
var $author$project$Page$HowToBet$yourScore = function (points) {
	return $author$project$Page$HowToBet$yourPoints(points) / $author$project$Page$HowToBet$avgPoints(points);
};
var $author$project$Page$HowToBet$yourShare = function (points) {
	return 20 * $author$project$Page$HowToBet$yourScore(points);
};
var $author$project$Page$HowToBet$quizAnswer = F2(
	function (answer, example) {
		var fun = function () {
			switch (answer) {
				case 1:
					return A2(
						$elm$core$Basics$composeR,
						$author$project$Page$HowToBet$avgPoints,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$mul(20),
							$myrho$elm_round$Round$round(0)));
				case 2:
					return A2(
						$elm$core$Basics$composeR,
						$author$project$Page$HowToBet$yourPoints,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$mul(20),
							$myrho$elm_round$Round$round(0)));
				case 3:
					return A2(
						$elm$core$Basics$composeR,
						$author$project$Page$HowToBet$yourScore,
						$myrho$elm_round$Round$round(2));
				default:
					return A2(
						$elm$core$Basics$composeR,
						$author$project$Page$HowToBet$yourShare,
						$myrho$elm_round$Round$round(0));
			}
		}();
		return fun(
			$author$project$Page$HowToBet$justPoints(example));
	});
var $mdgriffith$elm_ui$Element$moveDown = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(y));
};
var $author$project$Page$HowToBet$shareExample = _List_fromArray(
	[
		_Utils_Tuple2('you', 0.6),
		_Utils_Tuple2('Gandalf', 0.8),
		_Utils_Tuple2('Fblthp', 0.1)
	]);
var $author$project$Page$HowToBet$quizHint = function (model) {
	var yourShareText = A2(
		$myrho$elm_round$Round$round,
		0,
		$author$project$Page$HowToBet$yourShare(
			$author$project$Page$HowToBet$justPoints($author$project$Page$HowToBet$shareExample)));
	var yourPointsText = A2(
		$myrho$elm_round$Round$round,
		2,
		$author$project$Page$HowToBet$yourPoints(
			$author$project$Page$HowToBet$justPoints($author$project$Page$HowToBet$shareExample)));
	var redFont = $mdgriffith$elm_ui$Element$Font$color(
		$author$project$Ui$Palette$Color$translate(13));
	var greenFont = $mdgriffith$elm_ui$Element$Font$color(
		$author$project$Ui$Palette$Color$translate(15));
	var avgPointsText = A2(
		$myrho$elm_round$Round$round,
		2,
		$author$project$Page$HowToBet$avgPoints(
			$author$project$Page$HowToBet$justPoints($author$project$Page$HowToBet$shareExample)));
	var _v0 = model.aO;
	if (!_v0.$) {
		var answer = _v0.a;
		var teaser = function (ele) {
			return _List_fromArray(
				[
					A2($mdgriffith$elm_ui$Element$paragraph, _List_Nil, ele)
				]);
		}(
			function () {
				var _v7 = _Utils_Tuple2(answer, model.ca);
				if (_v7.b.$ === 1) {
					if (!_v7.a) {
						var _v8 = _v7.a;
						var _v9 = _v7.b;
						return _List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[greenFont]),
								$mdgriffith$elm_ui$Element$text('Right!'))
							]);
					} else {
						var _v10 = _v7.b;
						return _List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[redFont]),
								$mdgriffith$elm_ui$Element$text('False!'))
							]);
					}
				} else {
					if (!_v7.a) {
						switch (_v7.b.a) {
							case 0:
								var _v11 = _v7.a;
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('Yeah, '),
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[greenFont]),
										$mdgriffith$elm_ui$Element$text('right!'))
									]);
							case 2:
								var _v13 = _v7.a;
								return _List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[greenFont]),
										$mdgriffith$elm_ui$Element$text('Right')),
										$mdgriffith$elm_ui$Element$text(', exactly! And you see why now?')
									]);
							case 3:
								var _v14 = _v7.a;
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('Yes, it\'s '),
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[greenFont]),
										$mdgriffith$elm_ui$Element$text('right')),
										$mdgriffith$elm_ui$Element$text('! You get a star for not giving up ;)')
									]);
							case 4:
								var _v15 = _v7.a;
								return _List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[greenFont]),
										$mdgriffith$elm_ui$Element$text('Yes!')),
										$mdgriffith$elm_ui$Element$text(' It\'s not the othe 3 wrong answers!')
									]);
							case 1:
								var _v12 = _v7.a;
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('Now you got it, '),
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[greenFont]),
										$mdgriffith$elm_ui$Element$text('right')),
										$mdgriffith$elm_ui$Element$text(' !')
									]);
							default:
								var _v16 = _v7.a;
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('Finally, '),
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[greenFont]),
										$mdgriffith$elm_ui$Element$text('yes!')),
										$mdgriffith$elm_ui$Element$text(' I already lost all hope.')
									]);
						}
					} else {
						if (_v7.b.a === 1) {
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('That\'s '),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[redFont]),
									$mdgriffith$elm_ui$Element$text('false')),
									$mdgriffith$elm_ui$Element$text('. But no biggie. Maybe I can give you a hint:')
								]);
						} else {
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('That\'s still '),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[redFont]),
									$mdgriffith$elm_ui$Element$text('not correct')),
									$mdgriffith$elm_ui$Element$text(', sorry.')
								]);
						}
					}
				}
			}());
		var hint = function () {
			var _v1 = _Utils_Tuple2(answer, model.ca);
			_v1$0:
			while (true) {
				switch (_v1.a) {
					case 0:
						if (_v1.b.$ === 1) {
							break _v1$0;
						} else {
							var _v3 = _v1.a;
							return _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('Just to reiterate: The average is '),
											$mdgriffith$elm_ui$Element$text(
											A2(
												$myrho$elm_round$Round$round,
												2,
												$author$project$Page$HowToBet$avgPoints(
													$author$project$Page$HowToBet$justPoints($author$project$Page$HowToBet$shareExample)))),
											$mdgriffith$elm_ui$Element$text(' which gives you a share of '),
											$mdgriffith$elm_ui$Element$text(
											$yotamDvir$elm_katex$Katex$print(
												$yotamDvir$elm_katex$Katex$inline('20€ \\cdot \\frac{' + (yourPointsText + ('}{' + (avgPointsText + ('} = ' + (yourShareText + '€'))))))))
										]))
								]);
						}
					case 1:
						if (_v1.b.$ === 1) {
							break _v1$0;
						} else {
							var _v4 = _v1.a;
							return _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('Calculating the average is the first part for determining your share. Then have to divide '),
											$mdgriffith$elm_ui$Element$text('20€ · ' + yourPointsText),
											$mdgriffith$elm_ui$Element$text(' by it.')
										]))
								]);
						}
					case 2:
						if (_v1.b.$ === 1) {
							break _v1$0;
						} else {
							var _v5 = _v1.a;
							return _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('It\'s not just the points that define your share, but it\'s relation to the average. Also the average points is '),
											$mdgriffith$elm_ui$Element$text(
											function (x) {
												return '(' + (x + ') / 3');
											}(
												A2(
													$elm$core$String$join,
													' + ',
													A2(
														$elm$core$List$map,
														$myrho$elm_round$Round$round(1),
														$author$project$Page$HowToBet$justPoints($author$project$Page$HowToBet$shareExample)))))
										]))
								]);
						}
					default:
						if (_v1.b.$ === 1) {
							break _v1$0;
						} else {
							var _v6 = _v1.a;
							return _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text('That share is a bit small. Did you maybe forget to multiply by 20?')
										]))
								]);
						}
				}
			}
			var _v2 = _v1.b;
			return _List_Nil;
		}();
		return _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$below(
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Ui$Palette$Color$translate(6)),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(7)),
							$mdgriffith$elm_ui$Element$moveDown(
							$author$project$Ui$Palette$Distance$translate(0)),
							$mdgriffith$elm_ui$Element$padding(
							$author$project$Ui$Palette$Distance$translate(6)),
							$mdgriffith$elm_ui$Element$Border$width(1)
						]),
					_Utils_ap(teaser, hint)))
			]);
	} else {
		return _List_Nil;
	}
};
var $author$project$Page$HowToBet$receiveYourShare = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(
				$author$project$Ui$Palette$Distance$translate(2))
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Ui$CustomElements$howToBetStepTitle,
				{a8: 'a piece of cake', bx: '../images/receiveYourShare.svg'},
				'IIII',
				'receive your share'),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(0)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$justify]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('When the bet concluded, i.e., No-Mask-Day happened. I will personally contact you again, for giving you your winnings, as a share from the pot. Your share depends on how good you bet in comparison to the other participants. You remember the important part about the points of the first step? We need those now to determine the size of your share. Your share is the wager multiplied by the quotient of your points to the average points. To be more precise, let\'s say'),
								$author$project$Ui$CustomElements$mathInline('p_1,p_2,\\dots p_n'),
								$mdgriffith$elm_ui$Element$text(' are the points of all members ('),
								$author$project$Ui$CustomElements$mathInline('n'),
								$mdgriffith$elm_ui$Element$text(' is how many members are in this bet) and your points are '),
								$author$project$Ui$CustomElements$mathInline('p_1'),
								$mdgriffith$elm_ui$Element$text(', then you share is')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$center]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$display('20€ \\cdot \\frac{p_1}{\\bar{p}}')))
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$justify]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('where '),
								$mdgriffith$elm_ui$Element$text(
								$yotamDvir$elm_katex$Katex$print(
									$yotamDvir$elm_katex$Katex$inline('\\bar{p} = \\frac{p_1 + \\dots p_n}{n}'))),
								$mdgriffith$elm_ui$Element$text('  is the arithmetic mean of the points.')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(0)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$bold,
								$mdgriffith$elm_ui$Element$Font$color(
								$author$project$Ui$Palette$Color$translate(11))
							]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('Let\'s see if you got it:')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('Imagine a sad world in which only three people participated in the bet. And in this sad world No-Mask-Day happens on '),
								$mdgriffith$elm_ui$Element$text(
								$author$project$Field$Date$toPrettyString(
									A3($author$project$Field$Date$fromCalendarDate, 2024, 5, 15))),
								$mdgriffith$elm_ui$Element$text('. You three have bet the following amount of points on this date (all were surprised how late the No-Mask-Day happened):')
							])),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX]),
						A2(
							$mdgriffith$elm_ui$Element$table,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$centerX,
									$mdgriffith$elm_ui$Element$spacing(
									$author$project$Ui$Palette$Distance$translate(6))
								]),
							{
								hV: _List_fromArray(
									[
										{
										iu: A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[$mdgriffith$elm_ui$Element$Font$bold]),
											$mdgriffith$elm_ui$Element$text('Participant')),
										kB: function (_v0) {
											var name = _v0.a;
											return $mdgriffith$elm_ui$Element$text(name);
										},
										kD: $mdgriffith$elm_ui$Element$px(100)
									},
										{
										iu: A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[$mdgriffith$elm_ui$Element$Font$bold]),
											$mdgriffith$elm_ui$Element$text('Points')),
										kB: function (_v1) {
											var points = _v1.b;
											return $mdgriffith$elm_ui$Element$text(
												$elm$core$String$fromFloat(points));
										},
										kD: $mdgriffith$elm_ui$Element$px(100)
									}
									]),
								h3: $author$project$Page$HowToBet$shareExample
							})),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$color(
								$author$project$Ui$Palette$Color$translate(11)),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
								$mdgriffith$elm_ui$Element$centerX
							]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('How big is your share in this case?')
							])),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX]),
						A2(
							$mdgriffith$elm_ui$Element$Input$radioRow,
							_Utils_ap(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$spacing(20),
										$mdgriffith$elm_ui$Element$centerX
									]),
								$author$project$Page$HowToBet$quizHint(model)),
							{
								iX: $mdgriffith$elm_ui$Element$Input$labelHidden('Which is the correct share?'),
								jd: $author$project$Logic$Logic$AnswerLittleQuiz,
								jn: _List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$Input$option,
										1,
										$mdgriffith$elm_ui$Element$text(
											function (x) {
												return x + '€';
											}(
												A2($author$project$Page$HowToBet$quizAnswer, 1, $author$project$Page$HowToBet$shareExample)))),
										A2(
										$mdgriffith$elm_ui$Element$Input$option,
										2,
										$mdgriffith$elm_ui$Element$text(
											function (x) {
												return x + '€';
											}(
												A2($author$project$Page$HowToBet$quizAnswer, 2, $author$project$Page$HowToBet$shareExample)))),
										A2(
										$mdgriffith$elm_ui$Element$Input$option,
										3,
										$mdgriffith$elm_ui$Element$text(
											function (x) {
												return x + '€';
											}(
												A2($author$project$Page$HowToBet$quizAnswer, 3, $author$project$Page$HowToBet$shareExample)))),
										A2(
										$mdgriffith$elm_ui$Element$Input$option,
										0,
										$mdgriffith$elm_ui$Element$text(
											function (x) {
												return x + '€';
											}(
												A2($author$project$Page$HowToBet$quizAnswer, 0, $author$project$Page$HowToBet$shareExample))))
									]),
								gJ: model.aO
							}))
					]))
			]));
};
var $author$project$Page$HowToBet$zeroEach = $author$project$Ui$CustomElements$noBorder;
var $author$project$Page$HowToBet$waitTillNmd = function (model) {
	var item = function (itemText) {
		return A2(
			$mdgriffith$elm_ui$Element$paragraph,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Border$widthEach(
					_Utils_update(
						$author$project$Page$HowToBet$zeroEach,
						{
							bk: $author$project$Ui$Palette$Distance$translate(8)
						})),
					$mdgriffith$elm_ui$Element$Border$color(
					$author$project$Ui$Palette$Color$translate(10)),
					$mdgriffith$elm_ui$Element$paddingEach(
					_Utils_update(
						$author$project$Page$HowToBet$zeroEach,
						{
							bk: $author$project$Ui$Palette$Distance$translate(0)
						}))
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text(itemText)
				]));
	};
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(
				$author$project$Ui$Palette$Distance$translate(2))
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Ui$CustomElements$howToBetStepTitle,
				{a8: 'days counted on a wall', bx: '../images/waitTillNmd.svg'},
				'III',
				'wait till No-Mask-Day'),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(
						$author$project$Ui$Palette$Distance$translate(0)),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$justify]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('There is not much to do for you after you payed your wager. In the next year, I will publish all bets on this website, so you can see what others think when the No-Mask-Day might happen.')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$justify]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('If you get bored while waiting for No-Mask-Day I have a short list of fun activities for you:')
							])),
						A2(
						$mdgriffith$elm_ui$Element$textColumn,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$paddingEach(
								_Utils_update(
									$author$project$Page$HowToBet$zeroEach,
									{
										bk: $author$project$Ui$Palette$Distance$translate(1)
									})),
								$mdgriffith$elm_ui$Element$spacing(
								$author$project$Ui$Palette$Distance$translate(6))
							]),
						_List_fromArray(
							[
								item('check the current corona incidence'),
								item('what are the latest corona measures'),
								item('cancel your holiday plans'),
								item('look at the vaccination rate'),
								item('compare Germany to other EU-countries'),
								item('compare Germany to the US'),
								item('check how much you would win/lose if No-Mask-Day where in a month')
							]))
					]))
			]));
};
var $author$project$Page$HowToBet$view = function (model) {
	return A2(
		$author$project$Ui$CustomElements$howToBetPage,
		A2(
			$mdgriffith$elm_ui$Element$column,
			_List_Nil,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text('let\'s make a bet!'),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$Font$size(
							$author$project$Ui$Palette$FontSize$translate(0))
						]),
					$mdgriffith$elm_ui$Element$text('(in 5 simple steps)'))
				])),
		_List_fromArray(
			[
				$author$project$Page$HowToBet$placeYourBet(model),
				$author$project$Page$HowToBet$payYourWager(model),
				$author$project$Page$HowToBet$waitTillNmd(model),
				$author$project$Page$HowToBet$receiveYourShare(model),
				$author$project$Page$HowToBet$celebrate(model)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$bgGradient = $mdgriffith$elm_ui$Internal$Flag$flag(10);
var $mdgriffith$elm_ui$Element$Background$gradient = function (_v0) {
	var angle = _v0.ht;
	var steps = _v0.j_;
	if (!steps.b) {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		if (!steps.b.b) {
			var clr = steps.a;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$bgColor,
				A3(
					$mdgriffith$elm_ui$Internal$Model$Colored,
					'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
					'background-color',
					clr));
		} else {
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$bgGradient,
				A3(
					$mdgriffith$elm_ui$Internal$Model$Single,
					'bg-grad-' + A2(
						$elm$core$String$join,
						'-',
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$floatClass(angle),
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$formatColorClass, steps))),
					'background-image',
					'linear-gradient(' + (A2(
						$elm$core$String$join,
						', ',
						A2(
							$elm$core$List$cons,
							$elm$core$String$fromFloat(angle) + 'rad',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$formatColor, steps))) + ')')));
		}
	}
};
var $elm$core$Basics$pi = _Basics_pi;
var $author$project$Page$Loading$view = function (model) {
	var loadingWheel = function (x) {
		return ((2 * $elm$core$Basics$pi) * x) / 10000;
	}(
		A2(
			$elm$core$Basics$modBy,
			10000,
			$elm$time$Time$posixToMillis(model.ey)));
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$Background$color(
				$author$project$Ui$Palette$Color$translate(6))
			]),
		A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$centerY,
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(100)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(100)),
					$mdgriffith$elm_ui$Element$Border$rounded(100),
					$mdgriffith$elm_ui$Element$rotate(-(loadingWheel * 10)),
					$mdgriffith$elm_ui$Element$Background$gradient(
					{
						ht: $elm$core$Basics$pi / 3,
						j_: A2(
							$elm$core$List$map,
							$author$project$Ui$Palette$Color$translateAlpha(0.9),
							_List_fromArray(
								[9, 10, 11, 12, 13, 14, 15]))
					})
				]),
			$mdgriffith$elm_ui$Element$none));
};
var $author$project$Page$NotFound$view = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$color(
				$author$project$Ui$Palette$Color$translate(7))
			]),
		$mdgriffith$elm_ui$Element$text('notfound'));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Ui$CustomElements$externalLink = F3(
	function (color, url, labelText) {
		return A2(
			$mdgriffith$elm_ui$Element$link,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$mdgriffith$elm_ui$Element$Font$underline,
					$mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							function (x) {
							return A2($mdgriffith$elm_ui$Element$Border$glow, x, 1);
						}(
							$author$project$Ui$Palette$Color$translate(11))
						])),
					$mdgriffith$elm_ui$Element$htmlAttribute(
					$elm$html$Html$Attributes$target('_blank'))
				]),
			{
				iX: $mdgriffith$elm_ui$Element$text(labelText),
				cG: url
			});
	});
var $author$project$Ui$CustomElements$mathDisplay = function (txt) {
	return $mdgriffith$elm_ui$Element$text(
		$yotamDvir$elm_katex$Katex$print(
			$yotamDvir$elm_katex$Katex$display(txt)));
};
var $author$project$Ui$CustomElements$rndColor = 12;
var $author$project$Logic$Logic$SetVisibilityRnDSection = F2(
	function (a, b) {
		return {$: 28, a: a, b: b};
	});
var $author$project$Logic$Logic$isVisibleRnDSection = F2(
	function (sectionId, model) {
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2($elm$core$Dict$get, sectionId, model.ck));
	});
var $author$project$Ui$CustomElements$plusMinusButton = F4(
	function (msg, isPlus, size, color) {
		var plusMinus = function () {
			if (isPlus) {
				return '+';
			} else {
				return '-';
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(size)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(size)),
					$mdgriffith$elm_ui$Element$Border$width(
					$elm$core$Basics$ceiling(size / 20)),
					$mdgriffith$elm_ui$Element$Font$color(
					$author$project$Ui$Palette$Color$translate(color)),
					$author$project$Ui$CustomElements$myFocused
				]),
			{
				iX: A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$centerY,
							$mdgriffith$elm_ui$Element$Font$size(size - 2)
						]),
					$mdgriffith$elm_ui$Element$text(plusMinus)),
				dg: $elm$core$Maybe$Just(msg)
			});
	});
var $author$project$Page$RemarksAndDetailedExplanations$title = F3(
	function (txt, msg, plusMinus) {
		var color = function () {
			if (plusMinus) {
				return $author$project$Ui$CustomElements$rndColor;
			} else {
				return 8;
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(
							$author$project$Ui$Palette$FontSize$translate(1)),
							$mdgriffith$elm_ui$Element$Font$bold
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text(txt)
						])),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(30)),
							$mdgriffith$elm_ui$Element$centerY
						]),
					A4($author$project$Ui$CustomElements$plusMinusButton, msg, plusMinus, 20, color))
				]));
	});
var $author$project$Page$RemarksAndDetailedExplanations$section = F3(
	function (model, titleTxt, content) {
		var isVisible = A2($author$project$Logic$Logic$isVisibleRnDSection, titleTxt, model);
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(
					$author$project$Ui$Palette$Distance$translate(1))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A3(
						$author$project$Page$RemarksAndDetailedExplanations$title,
						titleTxt,
						A2($author$project$Logic$Logic$SetVisibilityRnDSection, titleTxt, !isVisible),
						!isVisible)
					]),
				function () {
					if (isVisible) {
						return _List_fromArray(
							[content]);
					} else {
						return _List_Nil;
					}
				}()));
	});
var $author$project$Page$RemarksAndDetailedExplanations$zeroEach = $author$project$Ui$CustomElements$zeroEach;
var $author$project$Page$RemarksAndDetailedExplanations$view = function (model) {
	return A2(
		$author$project$Ui$CustomElements$explanationPage,
		$author$project$Ui$CustomElements$rndColor,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$bold,
						$mdgriffith$elm_ui$Element$Font$color(
						$author$project$Ui$Palette$Color$translate($author$project$Ui$CustomElements$rndColor))
					]),
				$mdgriffith$elm_ui$Element$text('remarks and detailed explanations')),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'where did the idea come from?',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(6))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('The initial idea for betting on No-Mask-Day came to me on a lazy Sunday morning, as some kind of joyful anticipation of some normality again. Some days later I also had the great stupid idea to expand this bet to all my friends, family, and people I want to get in contact with again. And that I need some kind of automated betting system for that - I was also partly motivated by the need for a programming project for '),
									A3($author$project$Ui$CustomElements$externalLink, 9, 'https://elm-lang.org/', 'ELM'),
									$mdgriffith$elm_ui$Element$text(', a programming language I feel worth of further exploring and learning. ')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text(' I started coding (slowely) in spring 2021 and now many months later I am finally finsihed (kind of). I had to put in much more time and effort than I had anticipated. But isn\'t that normal for projects??')
								]))
						]))),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'this is a private fun project!',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(6))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('So don\'t take it too seriously. \"Fun\" means that I don\'t want you to feel presured by no means to participate in this bet. If you feel uncomfortable, don\'t worry it\'s fine to stay out it. Or, if you are unsure, you can also ask me directly wether this is some shady scam I am trying to pull of. ')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('\"Fun\" also means that this is not really about money. I hope you can easily spent 20€ and it doesn\'t really hurt you in case you loose all of it (not that you will. You will win big!).')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('I put \"private\" for legal reasons. Only people who received a personalized invitation code can participate. I know everybody who is participating in this bet and I don\'t have any financial benefit from it (except if I win of course). So if I understood the German law correctly I don\'t have to provide an \"Impressum\" or follow any regulations of the \"Glücksspielgesetz\" (please don\'t sue me ^^)')
								]))
						]))),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'what happens to the bet if No-Mask-Day does not happen within the next 3 years?',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Uff, please not! Well, shit, in that case the bet is over, no celebration, no happiness. You get your wager back and that\'s it. What about interest rates or whatever? ...pfff... I don\'t know, it\'s just 20€...')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Let\'s just pretend that this can not happen :)')
								]))
						]))),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'what happens with the collected money (the pot) until No-Mask-Day?',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('It might happen that I collect quite an amount of money. Let\'s say 50 poeple actually participate (that would be so awesome btw), then I have 1000€ sitting on my bank account. If it comes to that, I might want do find a small project for the money. Like an ethical ETF or something. The surplus of that could go to some charity, and I would cover any potential deficites. But I don\'t promise anything at the moment except than that you will receive your share at the end of the bet.')
								]))
						]))),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'how is the points distribution computed?',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(6))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Good question! But actuall you don\'t need to understand the exact formula. You can just look at the graph that shows up while you place your bet. What you see is what you get! ')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('I think the basic idea is quite simple: it\'s a bell-shaped curve around your chosen date which gets wider and smaller the greater you set the spread-parameter. But if you really want to know the details, here they come:')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('The points distribution, '),
									$author$project$Ui$CustomElements$mathInline('p(d)'),
									$mdgriffith$elm_ui$Element$text(', is a normalized discretisation of a truncated normal distribution on the days '),
									$author$project$Ui$CustomElements$mathInline('d'),
									$mdgriffith$elm_ui$Element$text(' from the years 2022-2024 of the form:')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$paddingEach(
									_Utils_update(
										$author$project$Page$RemarksAndDetailedExplanations$zeroEach,
										{
											bL: $author$project$Ui$Palette$Distance$translate(1),
											cB: $author$project$Ui$Palette$Distance$translate(1)
										}))
								]),
							_List_fromArray(
								[
									$author$project$Ui$CustomElements$mathDisplay('p(d \\;|\\; D, s) = m \\cdot e^{-\\big(|D - d| \\log(s)\\big)^2}')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('with the parameters '),
									$author$project$Ui$CustomElements$mathInline('D'),
									$mdgriffith$elm_ui$Element$text(' (the date on which you bet) '),
									$mdgriffith$elm_ui$Element$text(' and '),
									$author$project$Ui$CustomElements$mathInline('s'),
									$mdgriffith$elm_ui$Element$text(' (a spread-parameter), and a normalising factor '),
									$author$project$Ui$CustomElements$mathInline('m'),
									$mdgriffith$elm_ui$Element$text(' such that the sum of '),
									$author$project$Ui$CustomElements$mathInline('p(d)'),
									$mdgriffith$elm_ui$Element$text(' is 1000 over all days between 2022-2024. Also '),
									$author$project$Ui$CustomElements$mathInline('|D-d|'),
									$mdgriffith$elm_ui$Element$text(' denotes the number of days one has to count from one date to the other on a calender (or you just take the differenc of the respective '),
									A3($author$project$Ui$CustomElements$externalLink, 9, 'https://en.wikipedia.org/wiki/Julian_day', 'Julian days'),
									$mdgriffith$elm_ui$Element$text(' :D ).')
								])),
							function () {
							var daysInBet = $elm$core$String$fromInt(
								A3($justinmimbs$date$Date$diff, 3, $author$project$Logic$Logic$startOfBet, $author$project$Logic$Logic$endOfBet));
							return A2(
								$mdgriffith$elm_ui$Element$paragraph,
								_List_Nil,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$text('The point distribution is natrually extended to the extrem cases of '),
										$author$project$Ui$CustomElements$mathInline('s'),
										$mdgriffith$elm_ui$Element$text(' as:'),
										$author$project$Ui$CustomElements$mathDisplay('p(d\\;|\\;D,0) =  \\begin{cases}   1000 &\\text{if } d = D \\\\   0 &\\text{else} \\end{cases}'),
										$mdgriffith$elm_ui$Element$text('and '),
										$author$project$Ui$CustomElements$mathDisplay('p(d\\;|\\;D,1) =  \\frac{1000}{' + (daysInBet + '}'))
									]));
						}(),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('To be fair, the exact form of the points distribution was choosen quite randomly. I just wanted some bell-shaped thingy that converges to the unifrom and one-point distributions in the extremes.')
								]))
						]))),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'remarks about the bet.',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(
							$author$project$Ui$Palette$Distance$translate(0))
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('There are some general insights I want to share with you. So you can bet more informed :)')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											$author$project$Ui$Palette$Color$translate($author$project$Ui$CustomElements$rndColor))
										]),
									$mdgriffith$elm_ui$Element$text('First')),
									$mdgriffith$elm_ui$Element$text(', let\'s think a bit more about the final amount of money you get out of this bet. Obviously, if you wager 20€ and later your share is 16€ you have lost 4€ in this bet. To figure out what happens in general we look at the process of the bet a bit more closely. Let\'s pretend it\'s already No-Mask-Day and '),
									$author$project$Ui$CustomElements$mathInline('p_1, p_2, \\dots , p_n'),
									$mdgriffith$elm_ui$Element$text(' are the points all members of the bet have set on this date and furtherome '),
									$author$project$Ui$CustomElements$mathInline('p_1'),
									$mdgriffith$elm_ui$Element$text(' are your points.'),
									$mdgriffith$elm_ui$Element$text(' Then the overal money you win from this bet is'),
									$author$project$Ui$CustomElements$mathDisplay('20€ \\cdot \\left(\\frac{p_1}{\\bar{p}} - 1\\right)'),
									$mdgriffith$elm_ui$Element$text('where '),
									$author$project$Ui$CustomElements$mathInline('\\bar{p} = \\frac{p_1 + \\dots p_n}{n}'),
									$mdgriffith$elm_ui$Element$text(' is the average of the points. That\'s because the quotient '),
									$author$project$Ui$CustomElements$mathInline('p_1 / \\bar{p}'),
									$mdgriffith$elm_ui$Element$text(' corresponds to the share you get back and the '),
									$author$project$Ui$CustomElements$mathInline('-1'),
									$mdgriffith$elm_ui$Element$text(' to the intial wager you have to pay to take part in the bet. So, you gain money if the term in the bracket is positive and you loose money if its negative, i.e., you win money if your bet was better than the average and you lose money if it was worse.')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											$author$project$Ui$Palette$Color$translate($author$project$Ui$CustomElements$rndColor))
										]),
									$mdgriffith$elm_ui$Element$text('Second')),
									$mdgriffith$elm_ui$Element$text(', let me note that this bet is a zero-sum-bet. That means that the total amount of money over all participants lost/won is 0€. Every Euro you lose goes to another member of this bet and all money you win comes from another member of this bet. So, you could also call this the No-Mask-Day lottery if you wanted to.')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											$author$project$Ui$Palette$Color$translate($author$project$Ui$CustomElements$rndColor))
										]),
									$mdgriffith$elm_ui$Element$text('Third')),
									$mdgriffith$elm_ui$Element$text(', assuming no further information about No-Mask-Day, i.e., if we assume that No-Mask-Day is equally probable for all days in 2022-2024, then all bets have the same average winnig, namely 0€. I also see this as some kind of fairness-criterion.')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											$author$project$Ui$Palette$Color$translate($author$project$Ui$CustomElements$rndColor))
										]),
									$mdgriffith$elm_ui$Element$text('Fourth.')),
									$mdgriffith$elm_ui$Element$text(' I have to implement all this stuff on a computer, so we get rounding erros. Maybe some bets sum up to a little more over 1000 or under 1000. However, believe me, these little inaccuracies do not matter. Hmmm... why am I mentioning this then? ')
								]))
						]))),
				A3(
				$author$project$Page$RemarksAndDetailedExplanations$section,
				model,
				'what happens to your data?',
				A2(
					$mdgriffith$elm_ui$Element$textColumn,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('I don\'t collect any unnecessary data from you. Just some account-name and your e-mail. On my server, however, I have a table that links your bet to your real name via the invitation code. I need this so I can know who has payed the wager and who gets how much money back. But this information stays on the server and is not broadcastet publicaly anywhere.')
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('Your account-name and the details of your bet will be made public on this website eventually. I just think that it is interesting for you to see what others think when the \"end of corona\" will be. Also, and actually more importantly, a public list over all bets ensures a verifyability of the outcome of this bet. Otherwise I could for example just say that I myself miracolously had bet 1000 points exacty on No-Mask-Day, and you couldn\'t complain because you haven\'t seen my bet beforehand.')
								]))
						])))
			]));
};
var $author$project$Page$WhatIsNoMaskDay$view = function (model) {
	return A2(
		$author$project$Ui$CustomElements$explanationPage,
		$author$project$Ui$CustomElements$colorWhatIsNoMaskDay,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$bold]),
				$mdgriffith$elm_ui$Element$text('What is No-Mask-Day')),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('No-Mask-Day is the idea of the celebratory day when we don\'t have to wear masks anymore in our everyday lives. To bet on No-Mask-Day we need a formal definition:')
							])),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$paddingEach(
								{
									bL: $author$project$Ui$Palette$Distance$translate(0),
									bk: $author$project$Ui$Palette$Distance$translate(1),
									bu: 0,
									cB: $author$project$Ui$Palette$Distance$translate(0)
								})
							]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('No-Mask-Day is the fist day¹ on which everybody² can travel the Frankfurt-Berlin route by train³ without being legally required to wear a mask at any time.')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$alignBottom
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignBottom]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('¹: One day without a mask counts as the No-Mask-Day. Even if we have to go into full lockdown on the very next day.')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$alignBottom
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignBottom]),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('²: No matter if vaccinated or unvaccinated')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$alignBottom
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text('³: the regular ICE connection that passes through Berlin, Brandenburg, Saxony-Anhalt, Thuringia and Hesse.')
							]))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	var title = 'No-Mask-Day bet';
	var currentView = function () {
		var _v0 = model.dj;
		switch (_v0) {
			case 0:
				return $author$project$Page$NotFound$view(model);
			case 1:
				return $author$project$Page$Loading$view(model);
			case 2:
				return $author$project$Page$Home$view(model);
			case 3:
				return $author$project$Page$WhatIsNoMaskDay$view(model);
			case 4:
				return $author$project$Page$HowToBet$view(model);
			case 6:
				return $author$project$Page$AccuracyFunction$view(model);
			case 7:
				return $author$project$Page$ContactInfo$view(model);
			case 8:
				return $author$project$Page$Bet$view(model);
			case 9:
				return $author$project$Page$ConfirmationSubmitGuest$view(model);
			case 10:
				return $author$project$Page$Home$view(model);
			case 11:
				return $author$project$Page$CheckInvitation$view(model);
			default:
				return $author$project$Page$RemarksAndDetailedExplanations$view(model);
		}
	}();
	return {
		bJ: _List_fromArray(
			[
				A3(
				$mdgriffith$elm_ui$Element$layoutWith,
				{
					jn: _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$focusStyle(
							{hz: $elm$core$Maybe$Nothing, hG: $elm$core$Maybe$Nothing, jQ: $elm$core$Maybe$Nothing})
						])
				},
				_List_Nil,
				currentView)
			]),
		kn: title
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{iG: $author$project$Logic$Logic$init, jh: $author$project$Logic$Logic$onUrlChange, ji: $author$project$Logic$Logic$onUrlRequest, j1: $author$project$Logic$Logic$subscriptions, kz: $author$project$Logic$Logic$update, kB: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));

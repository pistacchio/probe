/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(root) {
	'use strict';

	var slice = Array.prototype.slice,
		isNode = (typeof module !== 'undefined' && module.exports);

	/**
	 * Loop over each collection and extend the prototypes.
	 *
	 * @param {Object} vendor
	 * @param {Array} probes
	 */
	function mapPrototype(vendor, probes) {
		var a, b, c, probe, proto, func;

		for (a = 0; (probe = probes[a]); a++) {

			// Loop over each prototype
			for (b = 0; (proto = probe[0][b]); b++) {

				// Loop over each function
				for (c = 0; (func = probe[1][c]); c++) {

					// Skip if the function already exists on the prototype
					// We don't wont to cause collisions with built-ins or user defined
					if (!vendor[func] || proto[func] || proto.prototype[func]) {
						continue;
					}

					// Objects can only use static methods
					// Applying to the prototype disrupts object literals
					if (proto === Object) {
						proto[func] = vendor[func];
					} else {
						extendPrototype.call(this, vendor, proto, func);
					}
				}
			}
		}
	}

	/**
	 * Extend the prototype with the vendor function.
	 * Prepend the "this" value to the beginning of the arguments.
	 *
	 * @param {Object} vendor
	 * @param {Object} proto
	 * @param {Function} func
	 */
	function extendPrototype(vendor, proto, func) {
		proto.prototype[func] = function() {
			var args = slice.call(arguments) || [];
				args.unshift(this);

			return vendor[func].apply(this, args);
		};
	}

	/**
	 * Check if a node module exists.
	 *
	 * @param {Object} name
	 * @returns {bool}
	 */
	function moduleExists(name) {
		try {
			return require.resolve(name);
		} catch(e) {
			return false;
		}
	}

	/**
	 *----------------------------------------
	 *		Lo-Dash / Underscore
	 *----------------------------------------
	 */

	if (isNode) {
		if (moduleExists('lodash')) {
			exports._ = root._ = require('lodash');

		} else if (moduleExists('underscore')) {
			exports._ = root._ = require('underscore');
		}
	}

	var stringFunctions = [
		'escape', 'unescape', 'template', 'uniqueId', 'camelCase', 'slugify', 'capitalize',
		// underscore.string
		'isBlank', 'stripTags', 'capitalize', 'chop', 'clean', 'count', 'chars', 'swapCase', 'escapeHTML', 'unescapeHTML', 'escapeRegExp',
		'splice', 'insert', 'include', 'join', 'lines', 'reverse', 'startsWith', 'endsWith', 'succ', 'titleize', 'camelize', 'underscored',
		'dasherize', 'classify', 'humanize', 'trim', 'ltrim', 'rtrim', 'truncate', 'prune', 'words', 'pad', 'lpad', 'rpad', 'lrpad',
		'sprintf', 'vsprintf', 'toNumber', 'strRight', 'strRightBack', 'strLeft', 'strLeftBack', 'slugify', 'surround', 'quote', 'unquote',
		'repeat', 'naturalCmp', 'levenshtein', 'toBoolean'
	];

	if (typeof root._ !== 'undefined') {
		mapPrototype(root._, [
			// Array
			[
				[Array],
				[
					'compact', 'difference', 'drop', 'findIndex', 'findLastIndex', 'first', 'flatten', 'head', 'indexOf', 'initial', 'intersection', 'last', 'lastIndexOf', 'pull',
					'range', 'remove', 'rest', 'sortedIndex', 'tail', 'take', 'union', 'uniq', 'unique', 'unzip', 'without', 'xor', 'zip', 'zipObject'
				]
			// Collections
			], [
				[Array, Object, String],
				[
					'all', 'any', 'at', 'collect', 'contains', 'countBy', 'detect', 'empty', 'each', 'eachRight', 'every', 'filter', 'find', 'findLast', 'findWhere', 'foldl', 'foldr', 'forEach', 'forEachRight',
					'groupBy', 'include', 'indexBy', 'inject', 'invoke', 'map', 'max', 'min', 'pluck', 'reduce', 'reduceRight', 'reject', 'sample', 'select', 'shuffle', 'size', 'some', 'sortBy', 'toArray', 'where',
					'constant'
				]
			// Functions
			// Unsupported: after, bindAll, bindKey, wrap
			], [
				[Function],
				[
					'bind', 'compose', 'curry', 'debounce', 'defer', 'delay', 'memoize', 'once', 'partial', 'partialRight', 'throttle',
					'createCallback'
				]
			// Objects
			// Unsupported: create
			], [
				[Object],
				[
					'assign', 'clone', 'cloneDeep', 'defaults', 'extend', 'findKey', 'findLastKey', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'functions', 'has',
					'invert', 'keys', 'mapValues', 'merge', 'methods', 'mixin', 'omit', 'pairs', 'pick', 'property', 'result', 'transform', 'values'
				]
			// Strings
			], [
				[String],
				stringFunctions
			// Numbers
			], [
				[Number],
				['times', 'limit', 'round', 'toFloat', 'toInt', 'parseInt']
			// All
			], [
				[Array, Object, String, Number],
				['isEmpty', 'isEqual', 'isUndefined', 'isNull', 'toString', 'valueOf']
			]
		]);
	}

	/**
	 *----------------------------------------
	 *		Underscore.String
	 *----------------------------------------
	 */

	if (isNode && moduleExists('underscore.string')) {
		exports._s = root._s = require('underscore.string');
	}

	if (typeof root._s !== 'undefined') {
		mapPrototype(root._s, [
			// String
			// Unsupported: toSentence, toSentenceSerial
			[
				[String],
				stringFunctions
			// Number
			], [
				[Number],
				['numberFormat']
			]
		]);
	}
})(this);
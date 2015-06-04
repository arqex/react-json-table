/*
react-json-table v0.0.1
https://github.com/arqex/react-json-table
MIT: https://github.com/arqex/react-json-table/raw/master/LICENSE
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["JsonTable"] = factory(require(undefined));
	else
		root["JsonTable"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);

	var $ = React.DOM;
	var JsonTable = React.createClass({
		defaultSettings: {
			header: true,
			noRowsMessage: 'No items'
		},

		getSetting: function( name ){
			var settings = this.props.settings;

			if( !settings || typeof settings[ name ] == 'undefined' )
				return this.defaultSettings[ name ];

			return settings[ name ];
		},

		render: function(){
			var cols = this.normalizeColumns(),
				contents = [this.renderRows( cols )]
			;

			if( this.getSetting('header') )
				contents.unshift( this.renderHeader( cols ) );

			return $.table({ className: "jsonTable" }, contents );
		},

		renderHeader: function( cols ){
			var me = this,
				cells = cols.map( function(col){
					return $.th(
						{ className: 'jsonColumn', key: col.key, onClick: me.onClickHeader, "data-key": col.key },
						col.label
					);
				})
			;

			return $.thead({ key: 'th'},
				$.tr({ className: 'jsonHeader', key: 'h', "data-key": 'header' }, cells )
			);
		},

		renderRows: function( cols ){
			var me = this,
				items = this.props.rows,
				i = 1
			;

			if( !items || !items.length )
				return $.tbody({}, [$.tr({}, $.td({}, this.getSetting('noRowsMessage') ))]);

			var rows = items.map( function( item ){
				return React.createElement(Row, {
					key: me.getKey( item ),
					item: item,
					columns: cols,
					i: i++,
					onClickRow: me.onClickRow,
					onClickCell: me.onClickCell
				});
			});

			return $.tbody({}, rows);
		},

		getItemField: function( item, field ){
			return item[ field ];
		},

		normalizeColumns: function(){
			var getItemField = this.getItemField,
				cols = this.props.columns,
				items = this.props.rows
			;

			if( !cols ){
				if( !items || !items.length )
					return [];

				return Object.keys( items[0] ).map( function( key ){
					return { key: key, label: key, cell: getItemField };
				});
			}

			return cols.map( function( col ){
				var key;
				if( typeof col == 'string' ){
					return {
						key: col,
						label: col,
						cell: getItemField
					};
				}

				if( typeof col == 'object' ){
					key = col.key || col.label;

					// This is about get default column definition
					// we use label as key if not defined
					// we use key as label if not defined
					// we use getItemField as cell function if not defined
					return {
						key: key,
						label: col.label || key,
						cell: col.cell || getItemField
					};
				}

				return {
					key: 'unknown',
					name:'unknown',
					cell: 'Unknown'
				};
			});
		},

		getKey: function( item ){
			var field = this.props.settings && this.props.settings.keyField;
			if( field && item[ field ] )
				return item[ field ];

			if( item.id )
				return item.id;

			if( item._id )
				return item._id;
		},

		shouldComponentUpdate: function(){
			return true;
		},

		onClickRow: function( e, item ){
			if( this.props.onClickRow ){
				this.props.onClickRow( e, item );
			}
		},

		onClickHeader: function( e ){
			if( this.props.onClickHeader ){
				this.props.onClickHeader( e, e.target.dataset.key );
			}
		},

		onClickCell: function( e, key, item ){
			if( this.props.onClickCell ){
				this.props.onClickCell( e, key, item );
			}
		}
	});

	var Row = React.createClass({
		render: function() {
			var me = this,
				cells = this.props.columns.map( function( col ){
					var content = col.cell,
						key = col.key
					;

					if( typeof content == 'function' )
						content = content( me.props.item, key );

					return $.td( {
						className: 'jsonCell',
						key: key,
						"data-key": key,
						onClick: me.onClickCell
					}, content );
				})
			;

			var className = 'jsonRow json';
			if( this.props.i % 2 )
				className += 'Odd';
			else
				className += 'Even';

			return $.tr({
				className: className,
				onClick: me.onClickRow
			}, cells );
		},

		onClickCell: function( e ){
			this.props.onClickCell( e, e.target.dataset.key, this.props.item );
		},

		onClickRow: function( e ){
			this.props.onClickRow( e, this.props.item );
		}
	});

	module.exports = JsonTable;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;
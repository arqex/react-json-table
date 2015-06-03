var React = require('react');

var $ = React.DOM;
var List = React.createClass({
	getDefaultProps: function(){
		return {
			header: true
		};
	},

	render: function(){
		var header = this.renderHeader(),
			items = this.renderItems()
		;

		return $.table({ className: "jsonTable"}, [ header, items ]);
	},

	renderHeader: function(){
		var me = this,
			cells = this.props.fields.map( function(field){
				var name;
				if( typeof field == 'string' ){
					name = field;
				}
				else {
					name = field.name;
				}

				return $.th(
					{ className: 'jsonColumn', key: name, onClick: me.onClickHeader, "data-name": name},
					name
				);
			})
		;

		return $.thead({ key: 'th'},
			$.tr({ className: 'jsonHeader', key: 'h', "data-name": 'header' }, cells )
		);
	},

	renderItems: function(){
		var me = this,
			items = this.props.items,
			fields = this.normalizeFields(),
			i = 1
		;

		if( !items || !items.length )
			return $.tbody({}, [$.tr({}, $.td({}, 'No items'))]);

		var rows = items.map( function( item ){
			return React.createElement(Item, {
				key: me.getKey( item ),
				item: item,
				fields: fields,
				i: i,
				onClickItem: me.onClickItem,
				onClickCell: me.onClickCell
			});
		});

		return $.tbody({}, rows);
	},

	normalizeFields: function(){
		var getItemField = function( item, field ){
			return item[ field ];
		};

		return this.props.fields.map( function( field ){
			var name, content;
			if( typeof field == 'string' ){
				return {
					name: field,
					content: getItemField
				};
			}

			if( typeof field == 'object' ){
				return field;
			}

			return {
				name:'unknown',
				content: 'Unknown'
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

	componentDidUpdate: function(){
		console.log('updated');
	},

	onClickItem: function( e, item ){
		if( this.props.onClickItem ){
			this.props.onClickItem( e, item );
		}
	},

	onClickHeader: function( e ){
		if( this.props.onClickHeader ){
			this.props.onClickHeader( e, e.target.dataset.name );
		}
	},

	onClickCell: function( e, field, item ){
		if( this.props.onClickCell ){
			this.props.onClickCell( e, field, item );
		}
	}
});

var Item = React.createClass({
	render: function() {
		var me = this,
			cells = this.props.fields.map( function( field ){
				var content = field.content,
					name = field.name
				;

				if( typeof content == 'function' )
					content = content( me.props.item, name );

				return $.td( {
					className: 'jsonCell',
					key: name,
					"data-name": name,
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
			onClick: me.onClickItem
		}, cells );
	},

	onClickCell: function( e ){
		this.props.onClickCell( e, e.target.dataset.name, this.props.item );
	},

	onClickItem: function( e ){
		this.props.onClickItem( e, this.props.item );
	}
});

module.exports = List;

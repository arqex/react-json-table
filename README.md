# react-json-table
A simple but flexible table react component to display JSON data.

As simple as feeding it with an array of objects.
```js
var items = [
  { name: 'Louise', age: 27, color: 'red' },
  { name: 'Margaret', age: 15, color: 'blue'},
  { name: 'Lisa', age:34, color: 'yellow'}
];

React.render(<JsonTable rows={ items } />, document.body);
```
[See the example working](http://codepen.io/arqex/pen/JdWwoe?editors=011)

Features:
* No dependencies and in a UMD format.
* Customizable cell contents to show your data the way you need.
* Callbacks for clicks on headers, rows or cells.
* Allows to add custom columns.
* Enough `className` attributes to let you style it your own way.
* Pure rendering, no internal state, everything comes from the props.

## Motivation
Creating tables in react is a repetitive work:
* Create the table wrapper
* Create a wrapper also for every item
* For every row print all the cells
* Add some classes to let styling
* I also want to listen to clicks in the header of every column in order to sorting.
* Hey, I forgot to add `<tbody>` tags so it is not working! Add them!
* ...

I don't want to do it ever again, JsonTable component will do that ugly stuff so on.

## Installation
Using node package manager:
```
npm install react-json-table --save
```
You can also use the built UMD files [react-json-table.js](https://github.com/arqex/react-json-table/blob/master/build/react-json-table.js)(6KB) and [react-json-table.min.js](https://github.com/arqex/react-json-table/blob/master/build/react-json-table.min.js)(3KB) if you want `JsonTable` globally or as an AMD package.

Half of the built version size is the code to create the UMD module. NPM version is really lightweight.

## Usage
You can see the simplest example of use at the top of this page, but probably you would like to customize a bit the behaviour of the table to adapt it to your needs. Have a look at the accepted component props.

### props
Prop name | Values | Description
---|---|---
rows | Array[Object] | The data you want to display in the table.
columns | Array[String\|Object] | The columns and their order for the table. If it is a `string` the value attribute of the current row that matches it will be shown as cell content. But also it is possible to use an `object` to customize the column, see [column definition](#column-definition).
className | *string* | Class to use for the `<table>` element.
settings | Object | Further customization of the table, see [table settings](#table-settings).
onClickCell | Function | Callback triggered when a cell is clicked: `fn( event, columnName, rowData )`.
onClickRow | Function | Callback triggered when a row is clicked: `fn( event, rowData )`
onClickHeader | Function | Callback triggered when a column header is clicked: `fn( event, columnName )`
cellRenderer | *function(item,field)* | If provided, this function will be used to render all the cells' content, so it is a way of programatically customize every cell. If no provided, the cell contents will just be `item[field]`, the value of the item for that field.

### Column definition
Using column definitions you can change the behaviour of the column easily. To do so you need to pass an array of the column definitions as the `columns` prop to the JsonTable:
```js
var items = [
  { name: 'Louise', age: 27, color: 'red' },
  { name: 'Margaret', age: 15, color: 'blue'},
  { name: 'Lisa', age:34, color: 'yellow'}
];

var columns = [
    'name',
    {key: 'age', label: 'Age'},
    {key: 'color', label: 'Colourful', cell: function( item, columnKey ){
        return <span style={{color: item.color}}>{ item.color }</span>;
    }}
];

React.render(<JsonTable rows={ items } columns={ columns } />, document.body);
```
http://codepen.io/arqex/pen/waJREq?editors=011

As you can see in the example, a column definition can be just a string with the name of the field to display or an object. But if an object is passed the customization can be much more. A column definition can be an object with the following properties:
* `key`: It is the internal name use for the column by JsonTable. It is added to the className of the cells and headers to apply styles to the column. It is also passed as an argument for the click callbacks. If the column definition has no `cell` property, it also represent the property of the current row to be shown as cell content.
* `label`: It is the content of the column header. You can use a `string` or a `ReactComponent` to show inside the header cell.
* `cell`: What is going to be displayed inside the column cells. It can be a `string` or `ReactComponent` to show static contents, but tipically it is a `function( rowData, columnKey )` that return the contents for the cell. This way different contents are shown in the column for different rows.

### Table settings
Using the prop `settings` we can customize some details that are not related to columns. It is an object with the following properties:

Setting name | Values | Description
---|---|---
`cellClass` | *function* | It is possible to add custom classes to the cells if you pass a function `fn( currentClass, columnKey, rowData )` in this setting.
`classPrefix` | *string* | JsonTable uses `class` attributes for its markup like `jsonRow` or `jsonCell`. The default prefix is `json` but you can use this setting to change it in the case it is conflicting with other classes in your app.
`header` | *boolean* | If `false`, no header will be shown for the table. Default `true`.
`headerClass` | *function* | It is possible to add custom classes to the column headers if you pass a function `fn( currentClass, columnKey )` in this setting.
`keyField` | *string* | React components that have a list of children need to give to every children a different `key` prop in order to make the diff algorithm check if something has change. You can define here what field of your rows will be used as a row key. JsonTable uses the `id`  or `_id` property of your rows automatically if you don't give this setting, but **you must be sure that there is a keyField for your rows** if you don't want strange behaviours on update. [More info](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children).
`noRowsMessage` | *string*, *ReactComponent* | Message shown when the table has no rows. Default *"No items"*.
`rowClass` | *function* | It is possible to add custom classes to the rows if you pass a function `fn( currentClass, rowData )` in this setting.

[You can play with the table settings here](http://codepen.io/arqex/pen/YXZBKG?editors=011).

### Reacting to clicks
It is always useful binding some callbacks when the user clicks on the table.
Click callbacks can be added using the props `onClickCell`, `onClickHeader` and `onClickRow`. In the next example we create a component using JsonTable where rows and cells are selected on click, and columns are sorted when the column header is clicked:
```js
var SelectTable = React.createClass({
  getInitialState: function(){
    // We will store the selected cell and row, also the sorted column
    return {row: false, cell: false, sort: false};
  },  

  render: function(){
    var me = this,
        // clone the rows
        items = this.props.rows.slice()
    ;
    // Sort the table
    if( this.state.sort ){
      items.sort( function( a, b ){
         return a[ me.state.sort ] > b[ me.state.sort ] ? 1 : -1;
      });
    }

    return <JsonTable
      rows={items}
      settings={ this.getSettings() }
      onClickCell={ this.onClickCell }
      onClickHeader={ this.onClickHeader }
      onClickRow={ this.onClickRow } />;
  },

  getSettings: function(){
      var me = this;
      // We will add some classes to the selected rows and cells
      return {
        keyField: 'name',
        cellClass: function( current, key, item){
          if( me.state.cell == key && me.state.row == item.name )
            return current + ' cellSelected';
          return current;
        },
        headerClass: function( current, key ){
            if( me.state.sort == key )
              return current + ' headerSelected';
            return current;
        },
        rowClass: function( current, item ){
          if( me.state.row == item.name )
            return current + ' rowSelected';
          return current;
        }
      };
  },

  onClickCell: function( e, column, item ){
    this.setState( {cell: column} );
  },

  onClickHeader: function( e, column ){
    this.setState( {sort: column} );
  },

  onClickRow: function( e, item ){
    this.setState( {row: item.name} );
  }  
});
```
http://codepen.io/arqex/pen/pJPzox?editors=011

## What's next?
Tests, tests, tests... I need to add tests for the different settings in order to continue the developing of new features.

Of course, issues reports, feature and pull requests are welcome. If JsonTable can make you not to code a react table again I will be happy to help.

## [MIT Licensed](LICENSE)

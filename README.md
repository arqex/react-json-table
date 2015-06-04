# react-json-table
A simple but reactive table react component to display JSON data.

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

## Motivation
Creating tables in react is a repetitive work:
* Create the table wrapper
* Create a wrapper also for every item
* For every row print all the cells
* Add some classes to let styling
* I also want to listen to clicks in the header of every column in order to sorting.
* Hey, I forgot to add `<tbody>` tags so it is not working! Add them!
* ...

I don't want to do it ever again, so here it is a simple but flexible table component that will do that ugly stuff so on.

## Installation
Using node package manager:
```
npm install react-json-table -save
```
You can also use the built UMD files [react-json-table.js](https://github.com/arqex/react-json-table/blob/master/build/react-json-table.js)(6KB) and [react-json-table.min.js](https://github.com/arqex/react-json-table/blob/master/build/react-json-table.min.js)(3KB) if you want it globally or as an AMD package.

Half of the built version size is the code to create the UMD module. NPM version is really lightweight.

## Usage
You can see the simplest example of use at the top of this page, but probably you would like to customize a bit the behaviour of the table to adapt it to your needs. Have a look at the accepted props.

### props
Prop name | Values | Description
---|---|---
rows | Array[Object] | The data you want to display in the table.
columns | Array[String\|Object] | The columns and their order for the table. You can use a `string` to use a field of the items passed in the `rows` props as cell content. But also it is possible to use an `object` to customize the column. See [column definitions](#column_definition).
settings | Object | Further customization of the table, see [table settings](#table_settings).
onClickCell | Function | Callback triggered when a cell is clicked: `fn( event, columnName, rowData )`.
onClickRow | Function | Callback triggered when a row is clicked: `fn( event, rowData )`
onClickHeader | Function | Callback triggered when a column header is clicked: `fn( event, columnName )`

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



'use strict';

var React = require('react'),
  ReactDOM = require('react-dom/server'),
	createReactClass = require('create-react-class'),
	PropTypes = require('prop-types'),
	T = PropTypes;

var defaultColors = [
	'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
	'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
	'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
	'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
	'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
	'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
	'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
	'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
	'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
	'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
	'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
	'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
].map(function(color){ return { value: color } });

var defaultItems = [

	{ label:'Formatos', type:'group', items: [
		{ label:'Fuente', type:'font', items: [
			{ label:'Sans Serif',  value:'sans-serif' },
			{ label:'Serif',       value:'serif' },
			{ label:'Monospace',   value:'monospace' }
		]},
		{ type:'separator' },
		{ label:'Tamaño', type:'size', items: [
			{ label:'Pequeña',  value:'10px' },
			{ label:'Normal', value:'13px' },
			{ label:'Grande',  value:'18px' },
			{ label:'Gigante',    value:'32px' }
		]},
		{ type:'separator' },
		{ label:'Justificación', type:'align', items: [
			{ label:'', value:'center' },
			{ label:'', value:'left' },
			{ label:'', value:'right' },
			{ label:'', value:'justify' }
		]}
	]},

	{ label:'Texto', type:'group', items: [
		{ type:'bold', label:'Bold' },
		{ type:'italic', label:'Italic' },
		{ type:'strike', label:'Strike' },
		{ type:'underline', label:'Underline' },
		{ type:'separator' },
		{ type:'color', label:'Color de texto', items:defaultColors },
		{ type:'background', label:'Color de fondo', items:defaultColors },
		{ type:'separator' },
	]},

	{ label:'Blocks', type:'group', items: [
		{ type:'bullet', label:'Viñeta' },
		{ type:'separator' },
		{ type:'list', label:'Numeración' }
	]}

];

var QuillToolbar = createReactClass({

	displayName: 'Quill Toolbar',

	propTypes: {
		id:        T.string,
		className: T.string,
		items:     T.array
	},

	getDefaultProps: function(){
		return {
			items: defaultItems
		};
	},

	renderSeparator: function(key) {
		return React.createElement('span', {
			key: key,
			className:'ql-format-separator'
		});
	},

	renderGroup: function(item, key) {
		return React.createElement('span', {
			key: item.label || key,
			className:'ql-format-group' },
			item.items.map(this.renderItem)
		);
	},

	renderChoiceItem: function(item, key) {
		return React.createElement('option', {
			key: item.label || item.value || key,
			value:item.value },
			item.label
		);
	},

	renderChoices: function(item, key) {
		return React.createElement('select', {
			key: item.label || key,
			title: item.label,
			className: 'ql-'+item.type },
			item.items.map(this.renderChoiceItem)
		);
	},

	renderAction: function(item, key) {
		return React.createElement('span', {
			key: item.label || item.value || key,
			className: 'ql-format-button ql-'+item.type,
			title: item.label },
			item.children
		);
	},

	renderItem: function(item, key) {
		switch (item.type) {
			case 'separator':
				return this.renderSeparator(key);
			case 'group':
				return this.renderGroup(item, key);
			case 'font':
			case 'align':
			case 'size':
			case 'color':
			case 'background':
				return this.renderChoices(item, key);
			default:
				return this.renderAction(item, key);
		}
	},

	getClassName: function() {
		return 'quill-toolbar ' + (this.props.className||'');
	},

	render: function() {
		var children = this.props.items.map(this.renderItem);
		var html = children.map(ReactDOM.renderToStaticMarkup).join('');
		return React.createElement('div', {
			className: this.getClassName(),
			dangerouslySetInnerHTML: { __html:html }
		});
	}

});

module.exports = QuillToolbar;
QuillToolbar.defaultItems = defaultItems;
QuillToolbar.defaultColors = defaultColors;

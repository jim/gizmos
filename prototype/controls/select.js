if(typeof Gizmos == 'undefined') var Gizmos = {};
Gizmos.Controls = Gizmos.Controls || {};

//  Options:
//    required: can return a blank value
//    anchor: DOM element to display above
//    preload: load options at page init
//    klass: css class to add to menu

Gizmos.Controls.Menu = Class.create({
  initialize: function(callback, options){
    options = options || {};
    this.callback = callback;
    this.options = Object.extend({
      required: false,
      anchor: document,
      klass: 'default',
      menuOptions: $A()
    }, options);

    this.initMenu();

    this.optionsLoaded = false;
    if(this.options.preload) this.loadOptions();
  
    this.setMenuPosition();
    this.bindEvents();
  },
  initMenu: function() {
    $$('body').first().insert({bottom: this.buildMenu({klass: this.options.klass})});
    this.menu = $$('.gizmos_menu.'+this.options.klass).last();
    this.optionsDiv = this.menu;
  },
  showMenu: function(){
    if(!this.optionsLoaded) this.loadOptions();
    this.menu.show();
  },
  hideMenu: function(event){
    this.menu.hide();
  },
  open: function() {
    this.showMenu();
  },
  setOptions: function(newOptions) {
    this.options.menuOptions = newOptions;
  },
  loadOptions: function($super) {
    this.options.menuOptions.each(function(option) {
      this.optionsDiv.insert({top: this.objectToOption(option)});
    }.bind(this));
     if(!this.options.required) {
       this.optionsDiv.insert({bottom: this.buildEmptyOption({name: 'NONE', value: ''})})
     }
     this.optionsLoaded = true;
  },
  setMenuPosition: function() {
    this.menu.setStyle({
      left: this.options.anchor.cumulativeOffset().left + 'px',
      top: this.options.anchor.cumulativeOffset().top + 'px'
    });
  },
  makeSelection: function(event) {
    var selectedOption = event.findElement('a');
    if (selectedOption) {
      this.callback(this.optionToObject(selectedOption));
      this.hideMenu();
      event.stop();
    }
  },
  bindEvents: function() {
    document.observe('click', this.hideMenu.bindAsEventListener(this));
    this.menu.observe('click', this.makeSelection.bindAsEventListener(this));
  },

  buildOption: function(values) {
    return new Template('<a class="gizmos_option" rel="#{value}">#{name}</a>').evaluate(values);
  },
  buildEmptyOption: function(values) {
    return new Template('<a class="gizmos_option none" rel="#{value}">#{name}</a>').evaluate(values);
  },
  buildMenu: function(values) {
    return new Template('<div class="gizmos_menu #{klass}" style="display: none"></div>').evaluate(values);    
  },
  optionToObject: function(option) {
   return {name: option.innerHTML, value: option.readAttribute('rel'), element: option}; 
  },
  objectToOption: function(object) {
    return this.buildOption(object);
  }
});

Gizmos.Controls.AjaxMenu = Class.create(Gizmos.Controls.Menu, {
  initialize: function($super, callback, options) {
    options = options || {};
    options = Object.extend({
      klass: 'ajax',
    }, options);
    $super(callback, options);
    this.page = 1;
  },
  initMenu: function() {
    $$('body').first().insert({bottom: this.buildMenu({klass: this.options.klass})});
    this.menu = $$('.gizmos_menu.'+this.options.klass).last();
    this.optionsDiv = this.menu.down('.container');
  },
  loadOptions: function($super) {
    this.startRequest();
  },
  startRequest: function(page) {
    page = page || 1
    url = page > 1 ? this.options.url + '?page=' + page : this.options.url;
    new Ajax.Request(url, { method: 'get',
                            onSuccess: this.completeRequest.bind(this)});
  },
  completeRequest: function(response, json) {
    this.optionsDiv.innerHTML = "";
    response.responseJSON.each(function(option) {
      this.optionsDiv.insert({top: this.buildOption({name: option.title, value: option.id})})
    }.bind(this));
    if(!this.options.required) {
      this.optionsDiv.insert({bottom: this.buildEmptyOption({name: 'NONE', value: ''})})
    }
    this.optionsLoaded = true;
  },
  loadPreviousPage: function(event) {
    if(this.page > 1) {
      this.page--;
      this.startRequest(this.page);
    }
    event.stop();
  },
  loadNextPage: function(event) {
    // if(this.page > 2) {
      this.page++;
      this.startRequest(this.page);
    // }
    event.stop();
  },
  bindEvents: function($super) {
    this.menu.down('a.prev').observe('click', this.loadPreviousPage.bindAsEventListener(this));
    this.menu.down('a.next').observe('click', this.loadNextPage.bindAsEventListener(this));
    $super();
  },
  buildMenu: function($super, values) {
    return new Template('<div class="gizmos_menu #{klass}" style="display: none"><a class="prev">prev</a><a class="next">next</a><div class="container"></div></div>').evaluate(values);    
  }
});

Gizmos.Controls.Select = Class.create({
  initialize: function(element, options){
    options = options || {};
    this.options = Object.extend({
      required: false,
      menuClass: Gizmos.Controls.Menu,
      klass: 'default'
    }, options);
    this.element = $(element);
    this.fieldName = this.element.readAttribute('name');
    this.element.writeAttribute('name', null);
    this.element.insert({after: this.buildHiddenField({name:this.fieldName})});
    this.hiddenField = this.element.next('.gizmos_hidden_field');
    this.element.insert({after: this.buildSelect({content: this.getSelection(), klass: this.options.klass})});
    this.select = this.element.next('.gizmos_select');
    
    // this.select.innerHTML = this.getSelection();
    
    this.initMenu();
    this.element.hide();
    this.bindEvents();
  },
  initMenu: function() {
    this.menu = new this.options.menuClass(this.setSelection.bind(this), {anchor: this.element, klass: this.options.klass});
    var options = $A();
    this.element.select('option').each(function(option) {
      options.push({name: option.innerHTML, value: option.readAttribute('value')});
    }.bind(this));
     if(!this.options.required) {
       options.push({name: 'NONE', value: ''});
     }
    this.menu.setOptions(options);
  },
  setFieldValue: function(value) {
    this.hiddenField.writeAttribute('value', value);
  },
  setSelection: function(selection) {
    var value = selection.value;
    this.setFieldValue(value);
    this.select.innerHTML = '';
    if(value==''){
      this.select.innerHTML = this.buildDefaultValue();
    } else {
      this.select.insert({top: selection.element.cloneNode(true)});      
    }
  },
  newSelection: function(event) {
    if(event.findElement('a')) {
      this.menu.open();
      event.stop();
    }
  },
  getSelection: function() {
    var selectedOption = this.element.down('option[selected=selected]');
    if(!selectedOption && this.options.required) {
      selectedOption = this.element.down('option');     
    }
    if(selectedOption){
      return this.buildOption({value: selectedOption.readAttribute('value'), name: selectedOption.innerHTML});  
    } else {
      return this.buildDefaultValue();
    }
  },
  bindEvents: function() {
    this.select.observe('click', this.newSelection.bindAsEventListener(this));
  },  
  buildOption: function(values) {
    return new Template('<a class="gizmos_option" rel="#{value}">#{name}</a>').evaluate(values);
  },
  buildSelect: function(values) {
    return new Template('<span class="gizmos_select #{klass}">#{content}</span>').evaluate(values);
  },
  buildHiddenField: function(values) {
    return new Template('<input type="hidden" class="gizmos_hidden_field" name="#{name}" />').evaluate(values);
  },
  buildDefaultValue: function() {
    return '<a>click to select</a>';
  }
});
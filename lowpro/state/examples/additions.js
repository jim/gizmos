// Grab bag of useful additions to Prototype

if(typeof(Gizmos) == 'undefined') var Gizmos = {};
Gizmos.Prototype = Gizmos.Prototype || {};

Gizmos.Prototype.Additions = {
  // this makes it easier to work with elements simply_helpful style
  // returns the db ID, or null if there is none
  db: function(element) {
      var regex = /([\w_]+)_/;
      return element.id.sub(regex, '');
  },

  // returns this element's position under parent
  ordinal: function(element) {
      return element.previousSiblings().length + 1;
  },
  
  // Prevent the annoying flash when replacing large DOM nodes
  //
  // element.preserveHeight(function() {
  //   makeDOMChanges();
  // }, this);
  preserveHeight: function(element, method, context) {
    element = $(element);
    method = method.bind(context);
    element.setStyle({height:element.getHeight() + 'px'});
    method();
    element.setStyle({height:'auto'});
  }
}

Element.addMethods(Gizmos.Prototype.Additions);
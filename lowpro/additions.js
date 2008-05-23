// This is to allow us to do event delegation while ensuring that
// callbacks are fired in the order they are defined.
//
// Usage example:
//
// var CrazyBehavior = Behavior.create({
//   onclick: Event.distribute(function(callback) {
//     callback.define('.class_name', 'functionName');
//     callback.define('.other_class', function(e){ 
//       this.doSomethingTotallyAwesome(e, 'another argument');
//     });
//   }
// });

if(typeof(Gizmos) == 'undefined') var Gizmos = {};
Gizmos.LowPro = Gizmos.LowPro || {};
Gizmos.LowPro.Event = Gizmos.LowPro.Event || {};

Gizmos.LowPro.DistributionDefinitionSet = Class.create({
 initialize: function() {
   this.definitions = $A();
 },
 define: function(selector, method) {
   this.definitions.push([selector, method]);
 }
});

Gizmos.LowPro.Event.distribute = function(definition_method) {
 var set = new Gizmos.LowPro.DistributionDefinitionSet();
 definition_method(set);
 return function(e) {
   for(var i=0,len = set.definitions.length; i < len; ++i) {
     var selector = set.definitions[i][0], method = set.definitions[i][1];
     var methodToCall = typeof(method) == 'function' ? method : this[method];
     if($(e.element()).match(selector)) {
       return methodToCall.apply(this, arguments);
     } else {
       var intendedElement = e.findElement(selector);
       if (intendedElement) {
         arguments[0].element = function() {
           return $(intendedElement);
         }
         return methodToCall.apply(this, arguments);
       }
     }
   }
 }
}

Event.distribute = Gizmos.LowPro.Event.distribute;
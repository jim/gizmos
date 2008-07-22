var Cycle = function(){
    var cycles = {};
    
    var that = {};
    
    var thru = function(){
        var values, i, cycle, options, name, nextValue;
        
        values = Array.prototype.slice.call(arguments);
        options = typeof(values.slice(-1)) === 'object' ? values.pop() : {};
        
        name = options['name'] || 'default';
        
        if(cycles[name]) {
            cycle = cycles[name];
            nextValue = cycle.values[cycle.index];
            cycle.index = (cycle.index === cycle.values.length -1) ? 0 : (cycle.index +1);
            return nextValue;
        } else {
            cycles[name] = {
              values: values,
              index: 0
            };
            return thru.apply(that, values);
        }
    };
    that.thru = thru;
    
    var reset = function(name) {
        if(cycles[name]) {
            cycles[name].index = 0;
        }
    };
    that.reset = reset;
    
    return that;
    
}();
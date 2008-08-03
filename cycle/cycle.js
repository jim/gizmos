var Cycle = function(){
    var cycles, that, thru, reset;
    
    cycles = {};
    that = {};

    thru = function(){
        var values, i, cycle, options, name, nextValue;

        values = Array.prototype.slice.call(arguments);
        options = typeof(values.slice(-1)[0]) === 'object' ? values.pop() : {};

        name = options['name'] || 'default';

        if(!cycles[name]) {
            cycles[name] = {
              values: values,
              index: 0
            }; 
        };
        cycle = cycles[name];
        nextValue = cycle.values[cycle.index];
        cycle.index = (cycle.index === cycle.values.length -1) ? 0 : (cycle.index +1);
        return nextValue;
    };
    that.thru = thru;

    reset = function(name) {
        if(cycles[name]) {
            cycles[name].index = 0;
        }
    };
    that.reset = reset;
    
    return that;

}();
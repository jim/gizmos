var Cycle = {
  cycles: [],
  thru: function() {
    var values = Array.prototype.slice.call(arguments);
    for(var i=0,len=this.cycles.length;i<len;i++) {
      var cycle = this.cycles[i];
      if(cycle.ref == this.toRef(values)) {
        var next_value = cycle.values[cycle.index];
        cycle.index = (cycle.index == cycle.values.length -1) ? 0 : (cycle.index +1)
        return next_value;
      }
    }
    this.add(values);
    return this.thru.apply(this, values);
  },
  add: function(values) {
    this.cycles.push({
      ref: this.toRef(values),
      values: values,
      index: 0
    });
  },
  reset: function() {
    var values = Array.prototype.slice.call(arguments);
    for(var i=0,len=this.cycles.length;i<len;i++) {
      if(this.cycles[i].ref == this.toRef(values)) this.cycles[i].index = 0;      
    }
  },
  toRef: function(array) {
    return array.join('-'); 
  }
};

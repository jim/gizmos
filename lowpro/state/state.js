// A simple state machine behavior for LowPro

var State = {};

State.behavior = Behavior.create({
    initialize: function() {
        if (this.events) {
            for (var name in this.events) {
                if (this.events.hasOwnProperty(name)) {
                    this.element.observe(name, function(event){
                        for (var selector in this.events[name]) {
                            if (this.events[name].hasOwnProperty(selector)) {
                                if (event.element().match(selector)) {
                                    event.stop();
                                    this.handleEvent(this.events[name][selector], event);
                                }
                            }
                        }
                    }.bind(this));
                }
            }
        }
        this.state = 'start';
        this.handleEvent('init');
    },
    handleEvent: function(eventName) {
        var args, event, newState;
        args = Array.prototype.slice.call(arguments, 1);
        if (this.definition[this.state] && this.definition[this.state][eventName]) {
            event = this.definition[this.state][eventName];
            if (typeof(event) !== 'undefined') {
                if (typeof(event) === 'string') {
                    this.changeState(event);
                } else if (typeof(event) == 'function') {
                    newState = event.apply(this, args);
                    if(typeof(newState) == 'string') this.changeState(newState);          
                }
            }            
        }

    },

    changeState: function(newStateName) {
        if (typeof(this.definition[this.state]) == 'undefined') throw "UndefinedState";
        this.handleEvent('exit');
        console.log("setting state to " + newStateName);
        this.state = newStateName;
        this.handleEvent('enter');
    }
});

State.which = function(mapping) {
    return function(event) {
        if (mapping[this.state]) {
            event.stop();
            this.handleEvent(mapping[this.state]);
        }
    };
};
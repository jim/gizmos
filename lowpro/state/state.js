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
                                    this.handleEvent(this.events[name][selector]);
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
        var event = this.definition[this.state][eventName];
        if (typeof(event) == 'object') {
            if (typeof(event.action) === 'string') {
                this[event.action]();
            }
            if(typeof(event.state) == 'string') this.changeState(event.state);          
        }
    },

    changeState: function(newStateName) {
        if (typeof(this.definition[this.state]) == 'undefined') throw "UndefinedState";
        this.handleEvent('exit');
        // console.log("setting state to " + newStateName);
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
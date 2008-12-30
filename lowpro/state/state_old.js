// A simple state machine behavior for LowPro

var State = {};

State.behavior = Behavior.create({
    initialize: function() {
        var name, func;
        if (this.events) {
            for (name in this.events) {
                if (this.events.hasOwnProperty(name)) {
                    func = function() {
                        var big = name;
                        return function(event){
                            for (var selector in this.events[big]) {
                                if (this.events[big].hasOwnProperty(selector)) {
                                    if (event.element().match(selector)) {
                                        // event.stop();
                                        this.handleEvent(this.events[big][selector], event);
                                    }
                                }
                            }
                        }
                    }();
                    this.element.observe(name, func.bind(this));
                }
            }
        }
        this.state = 'start';
        this.handleEvent('init');
    },
    handleEvent: function(eventName) {
        var args, event, newState;
        args = Array.prototype.slice.call(arguments, 1);
        // console.debug(eventName);
        if (this.definition[this.state] && this.definition[this.state][eventName]) {
            event = this.definition[this.state][eventName];
            if (typeof(event) !== 'undefined') {
                if (typeof(event) === 'string') {
                    args.unshift(event)
                    this.changeState.apply(this, args);
                } else if (typeof(event) == 'function') {
                    newState = event.apply(this, args);
                    if(typeof(newState) == 'string') {
                        args.unshift(newState)
                        this.changeState.apply(this, args);
                    }
                }
            }            
        }

    },

    changeState: function(newStateName, event) {
        if (typeof(this.definition[this.state]) == 'undefined') throw "UndefinedState";
        this.handleEvent('exit', event);
        console.log("setting state to " + newStateName);
        this.state = newStateName;
        this.handleEvent('enter', event);
    }
});

State.which = function(mapping) {
    return function(event) {
        if (mapping[this.state]) {
            event.stop();
            this.handleEvent(mapping[this.state], event);
        }
    };
};
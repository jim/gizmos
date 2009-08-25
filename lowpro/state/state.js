// A simple state machine behavior for LowPro

var State = {};

State.behavior = Behavior.create({
    initialize: function() {
        var name, func;
        this.boundEvents = [];
        this.delegateEvent = this.delegateEvent.bind(this);
        this.state = 'start';
        this.handleEvent('init');
    },
    bindStateEvents: function() {
        var combo, key, selector, type, matches;
        combo = /([a-z_\- ]+):([a-z]+)/;
        if (this.events[this.state]){
            for (key in this.events[this.state]) {
                 if (this.events[this.state].hasOwnProperty(key)) {
                     matches = combo.exec(key);
                     if (matches) {
                         type = matches[2];
                     } else {
                         type = key;
                     }
                     if (!this.boundEvents.include(type)) {
                         this.element.observe(type, this.delegateEvent);
                         this.boundEvents.push(type)   
                     }
                 }
            }
        }
    },
    delegateEvent: function(event) {
        var combo, matches, method, eventName;
        combo = /([a-z_\-\. ]+):([a-z]+)/;
        if (this.events[this.state]){
            for (key in this.events[this.state]) {
                 if (this.events[this.state].hasOwnProperty(key)) {
                     matches = combo.exec(key);
                     if (matches) {
                         selector = matches[1];
                         type = matches[2];
                         if (event.type === type && event.element().match(selector)) {
                             method = this.events[this.state][key];
                         }
                     } else {
                         if (event.type === key) {
                             method = this.events[this.state][key];
                         }
                     }
                     if (typeof(method) === 'function') {
                         eventName = method.call(this, event);
                     } else if (typeof(method) === 'string') {
                         eventName = method;
                     }
                     if (typeof(eventName) === 'string') {
                         this.handleEvent(eventName, event);
                         /*
                         Added this break because the event would be handled,
                         but then all events listed after the correctly fired
                         event would be fired as well. So we could either
                         break here, stopping the loop after the correct event
                         was triggered, or mess with what scope the variables
                         are in... I went with the easy/unobtrusive.
                         */
                         break;
                     }
                     
                 }
            }
        }
    },
    unbindStateEvents: function() {
        var i;
        for (i=0; i<this.boundEvents.length; i++) {
            this.element.stopObserving(this.boundEvents[i], this.delegateEvent);
        }
        this.boundEvents = [];
    },
    handleEvent: function(eventName) {
        var args, event, newState;
        args = Array.prototype.slice.call(arguments, 1);
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
        this.unbindStateEvents();
        this.handleEvent('exit', event);
        this.state = newStateName;
        this.bindStateEvents();
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
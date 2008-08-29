var Radio = {};

Radio.definition = {
    start: {
        init: {
            state: 'Stopped'   
        }
    },

    Stopped: {
        enter: {
            action: 'resetCounter'
        },
        play: {
            state: 'Playing'
        }
    },
    
    Paused: {
        play: {
            state: 'Playing'
        },
        stop: {
            state: 'Stopped'
        }
    },
    
    Playing: {
        enter: {
            action: 'startPlaying'
        },
        pause: {
            state: 'Paused'
        },
        stop: {
            state: 'Stopped'
        },
        exit: {
            action: 'stopPlaying'
        }
    }
};

Radio.events = {
    click: {
        'button.stop': 'stop',
        'button.play': 'play',
        'button.pause': 'pause'
    }
};

Radio.machine = Behavior.create(State.behavior, {
    definition: Radio.definition,
    events: Radio.events,
    resetCounter: function() {
        this.counter = 0;
        this.updateCounter();
    },
    startPlaying: function() {
        this.interval = setInterval(function() { this.incrementCounter(); }.bind(this), 200);
    },
    stopPlaying: function() {
        clearInterval(this.interval);
    },
    incrementCounter: function() {
        this.counter += 1;
        this.updateCounter();
    },
    updateCounter: function() {
        this.element.down('.counter').innerHTML = this.counter;
    }
});
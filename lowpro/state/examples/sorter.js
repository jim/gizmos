Element.addMethods({
   withinTopThird: function(element, y) {
       var top, threshold;
       top = element.cumulativeOffset().top;
       threshold = Math.round(element.getHeight() /3);
       return top <= y && (top + threshold) >= y;
   },
   withinBottomThird: function(element, y) {
       var bottom, threshold;
       bottom = element.cumulativeOffset().top + element.getHeight();
       threshold = Math.round(element.getHeight() /3);
       return (bottom - threshold) <= y && bottom >= y;
   }
});

var Sorter = {};

Sorter.markup = {
    saving: $div('saving...'),
    indicator: $div({id: 'indicator'})
};

Sorter.definition = {
    start: {
        init: 'Ready'
    },

    Ready: {
        enter: function() {
            this.draggedElement = null;
        },
        select: function(event) {
            this.draggedElement = event.element();
            this.draggedElement.addClassName('selected');
            this.dragOffset = event.pointerX() - this.draggedElement.cumulativeOffset().left;
            return 'Selected';
        }
    },

    Selected: {
        drag: function(event) {
            this.shadowElement = this.draggedElement.cloneNode(true);
            this.draggedElement.setStyle({opacity: .5});
            this.element.insert({bottom: this.shadowElement});
            this.shadowElement.setStyle({position: 'absolute', opacity: '.5'});
            this.shadowElement.addClassName('shadow');
            this.updateShadowElementPosition(event);
            return 'Dragging';
        },
        release: function() {
            this.draggedElement.removeClassName('selected');
            return 'Ready';
        }
    },
    
    Saving: {
        enter: function(event) {
            this.element.setStyle({opacity: 0.5});
            this.interval = setInterval(function() { this.handleEvent('complete'); }.bind(this), 1000);
            this.element.insert({after: this.markup.saving});
            this.savingMessage = this.element.next();
            this.save(this.draggedElement);
        },
        exit: function() {
            this.element.setStyle({opacity: 1});
            clearInterval(this.interval);
            this.savingMessage.remove();
        },
        complete: 'Ready'
    },
    
    Pending: {
        enter: function(event) {
            var y, child, offset;
            this.element.insert({after: this.markup.indicator});
            this.indicator = this.element.next();
            
            offset = this.element.cumulativeOffset().top;
            child = this.overDropZone(event);
            if (child.ordinal() < this.draggedElement.ordinal()) {
                y = child.cumulativeOffset().top;
            } else {
                y = child.cumulativeOffset().top + child.getHeight();
            }

            this.childToReplace = child;
            
            this.indicator.setStyle({ top: y + 'px', 
                                      width: this.draggedElement.getWidth() + 'px',
                                      left: this.draggedElement.cumulativeOffset().left + 'px',
                                      display: 'block'});
        },
        exit: function() {
            this.indicator.remove();
            this.childToReplace = null;
        },
        drag: function(event) {
            this.updateShadowElementPosition(event);
        },
        release: function() {
            if (this.childToReplace.ordinal() < this.draggedElement.ordinal()) {
                this.childToReplace.insert({before: this.draggedElement});
            } else {
                this.childToReplace.insert({after: this.draggedElement});
            }
            
            this.draggedElement.setStyle({opacity: 1});
            this.shadowElement.remove();
            this.draggedElement.removeClassName('selected');
            return 'Saving';
        },
        leave: 'Dragging'
    },

    Dragging: {
        drag: function(event) {
            this.updateShadowElementPosition(event);
        },
        hover: 'Pending',
        release: function() {
            this.draggedElement.setStyle({opacity: 1});
            this.shadowElement.remove();
            this.draggedElement.removeClassName('selected');
            return 'Ready';
        }
    }
};

Sorter.events = {
    Ready: {
        'li:mousedown': function(event) {
            event.stop();
            return 'select';
        }
    },
    Selected: {
        'li:mousemove': 'drag',
        'li:mouseup':   'release'
    },
    Dragging: {
        'mousemove': function(event) {
            if (this.overDropZone(event)) {
                return 'hover';
            } else {
                return 'drag';
            }
        },
        'mouseup':   'release'
    },
    Pending: {
        'mousemove': function(event) {
            if (!this.overDropZone(event)) {
                return 'leave';
            } else {
                return 'drag';
            }
        },
        'mouseup':   'release'
    }
};

Sorter.machine = Behavior.create(State.behavior, {
    initialize: function($super) {
        $super();
        if (Prototype.Browser.IE) {
            // disable the text selection in IE
            this.element.onselectstart = function() {return false};
            // this.element.style.MozUserSelect = "none";   
        }
    },
    definition: Sorter.definition,
    events: Sorter.events,
    markup: Sorter.markup,
    updateShadowElementPosition: function(event) {
        var x = event.pointerX() - this.dragOffset;
        var y = event.pointerY() - Math.round(this.shadowElement.getHeight() / 2);
        this.shadowElement.setStyle({
            top: y + 'px',
            left: x + 'px'
        });
    },
   overDropZone: function(event) {
       var x,y,i,child,children,target;
       x = event.pointerX();
       y = event.pointerY();
       children = this.element.select('li');
       for (i=0; i < children.length; i+=1) {
           child = children[i];
           if (child === this.draggedElement || child === this.shadowElement) {
               continue;
           }
           if (child.withinTopThird(y)) {
               if (child.ordinal() < this.draggedElement.ordinal()) {
                   target = child;
               } else {
                   target = child.previous();
               }
           } else if (child.withinBottomThird(y)) {
               if (child.ordinal() < this.draggedElement.ordinal()) {
                   target = child.next();
               } else {
                   target = child;
               }
           }
           if (target && target != this.draggedElement && target != this.shadowElement) {
               return target;
           }
       }
       return false;
   },
   save: function(element) {
       // normally here we'd use XHR to save the changes
       console.log(element, 'with a db id of', element.db(), 'is now in position', element.ordinal());
   } 
});
var PromptingField = Behavior.create({

    initialize: function() {
        this.changed = false;
        this.onblur();
        this.element.writeAttribute('autocomplete', 'off');
        this.element.up('form').observe('click', this.handleFormSubmission.bindAsEventListener(this));
    },

    setPrompt: function() {
        this.element.value = this.element.title;
        this.changed = false;
        this.element.addClassName('prompting');
    },

    clearPrompt: function() {
        this.element.value = '';
        this.element.removeClassName('prompting');
    },

    onblur: function(event) {
        if (this.element.value == '') {
            this.setPrompt();
        }
    },

    onfocus: function(event) {
        if (this.element.value == this.element.title) {
            this.clearPrompt();
        }
    },

    handleFormSubmission: function(event) {
        var element = event.element();
        if (element.match('input[type=submit]') || element.match('button[type=submit]') || element.match('input[type=image]'))
            if (!this.changed && this.element.value == this.element.title) {
                this.element.value = '';
            }
        }
    },

    onkeyup: function(event) { this.changed = true; },
    onchange: function(event) { this.changed = true; }

});

var PromptingFieldWithReset = Behavior.create({
    initialize: function($super) {
        $super();
        this.resetButton = this.element.up(2).down('a.reset');
        if(this.resetButton) {
            this.resetButton.observe('click', this.handleResetClick.bindAsEventListener(this));
        }
    },
    setPrompt: function($super) {
        this.resetButton.hide();
        $super();
    },
    onkeyup: function($super) {
        this.resetButton.show();
        $super();
    },
    
    handleResetClick: function(event) {
      this.resetButton.hide();
      this.element.value = '';
      this.onblur();
      event.stop()
    }
});
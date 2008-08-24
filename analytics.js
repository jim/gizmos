if(typeof(Gizmos) == 'undefined') var Gizmos = {};

//  Prevent Google Analytics from slowing your page loads. Version 2.
//
//  This requires Prototype for DOM ready acknowledgment. Example usage:
// 
//  Gizmos.GoogleTracker.init('urchinID');

Gizmos.GoogleTracker = function() {
    var init, track, appendMarkup;
    var urchinID;

    var that = {};

    appendMarkup = function() {
        var host, scriptTag, callbackTimer;
        
        host = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('id', 'googleanalytics');
        scriptTag.setAttribute('src', host + 'google-analytics.com/ga.js');
        scriptTag.setAttribute('type', 'text/javascript');

        if(Prototype.Browser.IE) {
        	scriptTag.onreadystatechange = function() {
        		if (this.readyState == "loaded") {
          		    track();
        		}
        	}
        } else if (Prototype.Browser.Gecko) {
        	Event.observe(scriptTag, 'load', function(event) {
        		track();
        	});
        } else {
        	// Safari and weirdos!
        	callbackTimer = setInterval(function() {
        	    try {
        			// try to call tracker, if it fails, catch and wait
        			track();
        			clearInterval(callbackTimer);
        		} catch (e) {}
        	}, 100);
        }

        document.getElementsByTagName('head').item(0).appendChild(scriptTag);
    };

    init = function(id) {
        urchinID = id;
        if (document.body) {
            appendMarkup();
        } else {
            document.observe('dom:loaded', function() {
               appendMarkup(); 
            });
        }
    };
    that.init = init;

    track = function() {
        var tracker;

        tracker = _gat._getTracker(urchinID); 
        tracker._initData();
        tracker._trackPageview();
    };
    that.track = track;

    return that;

}();
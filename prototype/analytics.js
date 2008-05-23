//  Prevent Google Analytics from slowing your page loads
//
//  This requires Prototype. Example usage:
//
//  document.observe('dom:loaded', function(){
//    // Only track in production
//  	if(document.location.hostname.match(/domain\.com/) {
//  		Gizmos.Prototype.Analytics.startTracking('your_urchin_id');
//  	}
//  });


if(typeof(Gizmos) == 'undefined') var Gizmos = {};
Gizmos.Prototype = Gizmos.Prototype || {};

Gizmos.Prototype.Analytics = {

  urchinID: '',

	callTracker: function() {
			var pageTracker = _gat._getTracker(Gizmos.Analytics.urchinID); 
	    pageTracker._initData();
	    pageTracker._trackPageview();
	},

	startTracking: function(urchinID) {
	    Gizmos.Analytics.urchinID = urchinID;
			var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	    var includeTag = document.createElement('script');
	    includeTag.setAttribute('id', 'googleanalytics');
	    includeTag.setAttribute('src', gaJsHost + 'google-analytics.com/ga.js');
	    includeTag.setAttribute('type', 'text/javascript');

			if(Prototype.Browser.IE) {
				includeTag.onreadystatechange = function() {
					if (this.readyState == "loaded") {
			  		Gizmos.Prototype.Analytics.callTracker();
					}
				}
			} else if (Prototype.Browser.Gecko) {
				Event.observe(includeTag, 'load', function(event) {
					Gizmos.Prototype.Analytics.callTracker();
				});
			} else {
				// Safari and weirdos!
				var callbackTimer = setInterval(function() {
		    try {
					// try to call tracker, if it fails, catch and wait
					Gizmos.Prototype.Analytics.callTracker();
					clearInterval(callbackTimer);
				} catch (e) {}
		  	}, 100);
			}

		  document.getElementsByTagName('head').item(0).appendChild(includeTag);

	}
}
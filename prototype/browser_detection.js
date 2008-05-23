// Extend the built-in Prototype browser detection to handle multiple versions of Safari and IE.

if(typeof(Gizmos) == 'undefined') var Gizmos = {};
Gizmos.Prototype = Gizmos.Prototype || {};

Gizmos.Prototype.Browser = {
	IE:     !!(window.attachEvent && !window.opera), 
	IE7:    (/MSIE\s7/).test(navigator.appVersion), 
	IE6:    (/MSIE\s6/).test(navigator.appVersion), 
	Opera:  !!window.opera, 
	Safari: (/AppleWebKit/).test(navigator.appVersion),
	Safari2: false,
	Safari3: false,
	KHTML:  (/Konqueror|Safari|KHTML/).test(navigator.userAgent), 
	Gecko:  (/Gecko/).test(navigator.userAgent) && !(/KHTML/).test(navigator.userAgent),
	MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
}

Gizmos.Prototype.detectSafariVersions = function(browser) {
	var kitName = "applewebkit/";
	var tempStr = navigator.userAgent.toLowerCase();
	var pos = tempStr.indexOf(kitName);
	var isAppleWebkit = (pos != -1);

	if (isAppleWebkit) {
		browser.Safari = true;
		var kitVersion = tempStr.substring(pos + kitName.length,tempStr.length);
		kitVersion = kitVersion.substring(0,kitVersion.indexOf(" "));
    browser.Safari2 = parseFloat(kitVersion) < 522;
    browser.Safari3 = parseFloat(kitVersion) > 522;
	}
}

Gizmos.Prototype.detectSafariVersions(Gizmos.Prototype.Browser);
Prototype.Browser = Gizmos.Prototype.Browser;
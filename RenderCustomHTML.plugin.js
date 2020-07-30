/**
* @name RenderCustomHTML
* @ invite inviteCode...
* @ authorId 51512151151651...
* @ authorLink https://twitter.com/...
* @ donate https://paypal.me/...
* @ patreon https://patreon.com/...
* @website http://matthieu.imagevo.fr
* @source https://raw.githubusercontent.com/MajorBarnulf/RenderCustomHTML/master/RenderCustomHTML.plugin.js
*/

module.exports = class RenderCustomHTML {
	getName() {
		return "Render Custom HTML";
	} // Name of your plugin to show on the plugins page
	getDescription() {
		return "Will render the HTML contained in messages using \"/RCH\" ";
	} // Description to show on the plugins page
	getVersion() {
		return "0.1.2";
	} // Current version. I recommend following semantic versioning <http://semver.org/> (e.g. 0.0.1)
	getAuthor() {
		return "MajorBarnulf";
	} // Your name
	
	load() {
	} // Called when the plugin is loaded in to memory
	
	start() {
		console.log("%c[MB][Render Custom HTML] %cstarting", 'color:red', 'color: inherit');
		// a list of the tags that allow execution of scripts
		window.dangerousTagList = ["Event", "abort", "afterprint", "animationend", "animationiteration", "animationstart", "beforeprint", "beforeunload", "canplay", "canplaythrough", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "ended", "error", "focusin", "focusout", "fullscreenchange", "fullscreenerror", "hashchange", "input", "invalid", "keydown", "keypress", "keyup", "load", "loadeddata", "loadedmetadata", "loadstart", "message", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "mousewheel", "offline", "online", "open", "pagehide", "pageshow", "paste", "pause", "play", "playing", "popstate", "progress", "ratechange", "resize", "reset", "search", "seeked", "seeking", "select", "show", "stalled", "storage", "submit", "suspend", "timeupdate", "toggle", "touchcancel", "touchend", "touchmove", "touchstart", "transitionend", "unload", "volumechange", "waiting", "wheel"]
		//TODO: treat "blur", "click", "focus", "scroll"
		window.lastChange = false;
		window.stringUnsanitizer = (str) => {
			return str = str.split("&amp;").join("&").split("&lt;").join("<").split("&gt;").join(">").split("&quot;").join('"').split("&#039;").join("'");
		}
		window.stringToHtml = (str) => {
			var parser = new DOMParser();
			str = window.stringUnsanitizer(str);
			console.log(str)
			var doc = parser.parseFromString(str, 'text/html');
			return doc.body;
		}
		window.securizeDOMElement = (inputElement) => {
			var allElements = inputElement.getElementsByTagName("*");
			var unsafeElements = inputElement.querySelectorAll("script, style, link");
			
			for (var i = 0; i < allElements.length; i++) {
				let element = allElements[i];
				for (let j = 0; j < window.dangerousTagList.length; j++) {
					var property = window.dangerousTagList[j];
					if (element[property] && element[property] != null) {
						console.log("found unsafe tag: "+ property)
						unsafeElements.push(element);
					}
				}
			}
			
			for (let i = 0; i < unsafeElements.length; i++) {
				var element = unsafeElements[i];
				element.parentNode.removeChild(element);
			}
			var outputElement = inputElement;
			return outputElement;
		}
	} // Called when the plugin is activated (including after reloads)
	stop() {
	} // Called when the plugin is deactivated
	
	observer(changes) {
		
		if (changes.type === "childList"){
			let messageCollection = document.getElementsByClassName("da-messageContent")

			for (let i = 0; i < messageCollection.length; i++) {
				var element = messageCollection[i];
				if (element.classList.contains("mb-checked") === false) {
					element.classList.add("mb-checked");
					if (element.innerHTML.includes("/RCH")){
						var htmlData = element.innerHTML.replace("/RCH", "");
						var newDocument = window.stringToHtml(htmlData);
						element.innerHTML = "";
						element.appendChild(window.securizeDOMElement(newDocument));
					}
				}
			}
		}
	} // Observer for the `document`. Better documentation than I can provide is found here: <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>
};

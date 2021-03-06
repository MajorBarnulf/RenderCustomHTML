/**
* @name RenderCustomHTML
* @ invite inviteCode...
* @ authorId 358338548174159873
* @ authorLink https://twitter.com/...
* @ donate https://paypal.me/...
* @ patreon https://patreon.com/...
* @website http://matthieu.imagevo.fr
* @source https://raw.githubusercontent.com/MajorBarnulf/RenderCustomHTML/master/RenderCustomHTML.plugin.js
*/

//META{"name":"RenderCustomHTML"}*//

module.exports = class RenderCustomHTML {
	getName() {
		return "RenderCustomHTML";
	} // Name of your plugin to show on the plugins page
	getDescription() {
		return "Will render the HTML contained in messages using \"/RCH\" ";
	} // Description to show on the plugins page
	getVersion() {
		return "0.2.1";
	} // Current version. I recommend following semantic versioning <http://semver.org/> (e.g. 0.0.1)
	getAuthor() {
		return "MajorBarnulf";
	} // Your name
	
	load() {
	} // Called when the plugin is loaded in to memory
	
	start() {
        if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/MajorBarnulf/RenderCustomHTML/master/RenderCustomHTML.plugin.js");
		console.log("%c[MB][Render Custom HTML] %cstarting", 'color:red', 'color: inherit');

		window.MB = {};
		// a list of the tags that allow execution of scripts
		window.MB.dangerousTagList = ["Event", "abort", "afterprint", "animationend", "animationiteration", "animationstart", "beforeprint", "beforeunload", "canplay", "canplaythrough", "contextmenu", "copy", "cut", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "ended", "error", "focusin", "focusout", "fullscreenchange", "fullscreenerror", "hashchange", "input", "invalid", "keydown", "keypress", "keyup", "load", "loadeddata", "loadedmetadata", "loadstart", "message", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "mousewheel", "offline", "online", "open", "pagehide", "pageshow", "paste", "pause", "play", "playing", "popstate", "progress", "ratechange", "resize", "reset", "search", "seeked", "seeking", "select", "show", "stalled", "storage", "submit", "suspend", "timeupdate", "toggle", "touchcancel", "touchend", "touchmove", "touchstart", "transitionend", "unload", "volumechange", "waiting", "wheel"]
		//TODO: treat "blur", "click", "focus", "scroll"

		window.MB.stringUnsanitizer = (str) => {
			return str = str.split("&amp;").join("&").split("&lt;").join("<").split("&gt;").join(">").split("&quot;").join('"').split("&#039;").join("'");
		}

		window.MB.stringToHtml = (str) => {
			var parser = new DOMParser();
			str = window.MB.stringUnsanitizer(str);
			//console.log(str);
			var doc = parser.parseFromString(str, 'text/html');
			return doc.body;
		}

		window.MB.securizeDOMElement = (inputElement) => {
			var allElements = inputElement.getElementsByTagName("*");
			var unsafeElements = inputElement.querySelectorAll("script, link");
			
			for (var i = 0; i < allElements.length; i++) {
				let element = allElements[i];
				for (let j = 0; j < window.MB.dangerousTagList.length; j++) {
					var property = window.MB.dangerousTagList[j];
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

		window.MB.messageFormatter = (message) => {
			message += "\n test"
			return message;
		}

		window.MB.customMessageSender = (message) => {
			message = window.MB.messageFormatter(message);
			ZLibrary.DiscordAPI.currentChannel.sendMessage(message);
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
						var newDocument = window.MB.stringToHtml(htmlData);
						element.innerHTML = "";
						element.appendChild(window.MB.securizeDOMElement(newDocument));
					}
				}
			}
		}
	} // Observer for the `document`. Better documentation than I can provide is found here: <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>
};

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
		return "Will render the HTML contained in codeblocks after \"/RCH\" in messages";
	} // Description to show on the plugins page
	getVersion() {
		return "0.0.1";
	} // Current version. I recommend following semantic versioning <http://semver.org/> (e.g. 0.0.1)
	getAuthor() {
		return "MajorBarnulf";
	} // Your name
	
	load() {
		console.log("%c[MB][Render Custom HTML] %cloading", 'color:red', 'color: inherit');
	} // Called when the plugin is loaded in to memory
	
	start() {
		console.log("%c[MB][Render Custom HTML] %cstarting", 'color:red', 'color: inherit');
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
		window.securizeDOMElement = (element) => {
			var unsafeElements = element.querySelectorAll("script, style, link");
			for (let i = 0; i < unsafeElements.length; i++) {
				var element = unsafeElements[i];
				element.parentNode.removeChild(element);
			}
		}
	} // Called when the plugin is activated (including after reloads)
	stop() {
		console.log("%c[MB][Render Custom HTML] %cstopping", 'color:red', 'color: inherit');
	} // Called when the plugin is deactivated
	
	observer(changes) {
		console.log("%c[MB][Render Custom HTML] %cchanged: ", 'color:red', 'color: inherit');
		//console.log(changes)
		
		if (changes.type === "childList"){
			let messageCollection = document.getElementsByClassName("da-messageContent")

			for (let i = 0; i < messageCollection.length; i++) {
				var element = messageCollection[i];
				if (element.classList.contains("mb-checked") === false) {
					element.classList.add("mb-checked");
					if (element.innerHTML.includes("/RCH")){
						var htmlData = element.innerHTML.replace("/RCH", "");
						var newDocument = window.stringToHtml(htmlData);
						//window.focusNewDocument = newDocument;
						console.log(htmlData, newDocument);
						element.innerHTML = "";
						element.appendChild(newDocument);
					}
				}
			}
		}
	} // Observer for the `document`. Better documentation than I can provide is found here: <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>
};

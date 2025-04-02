export default function Button(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Button constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTMLElement");
    }

    this.element = element;
}

Button.prototype.addEventListener = function(type, callback) {
    Button.validateEventListenerArguments(type, callback);
    this.element.addEventListener(type, callback);
}

Button.prototype.removeEventListener = function(type, callback) {
    Button.validateEventListenerArguments(type, callback);
    this.element.removeEventListener(type, callback);
}

Button.validateEventListenerArguments = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }
}

Button.prototype.click = function() {
    this.element.click();
}
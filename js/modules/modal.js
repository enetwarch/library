export default function Modal(modal, openButton) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Modal constructor.`);
    }

    this.modal = modal;
    if (!(this.modal instanceof HTMLElement)) {
        throw TypeError("modal argument needs to be an HTML Element.");
    }

    if (openButton) {
        this.openButton = openButton;
    }

    this.container = this.modal.querySelector(".modal-container");
    if (!this.container) {
        throw Error("Modal has no container.");
    }

    this.closeButton = this.modal.querySelector(".modal-close");
    if (!this.closeButton) {
        throw Error("Modal has no close button.");
    }

    if (this.openButton) {
        this.openButton.addEventListener("click", () => {
            this.showModal();
        });
    }

    this.closeButton.addEventListener("click", () => {
        this.closeModal();
    });

    this.modal.addEventListener("click", event => {
        if (event.target === this.modal) {
            this.closeModal();
        }
    });

    this.callback = {
        "open": undefined,
        "close": undefined
    };
}

Modal.prototype.showModal = function() {
    this.executeCallback("open");
    this.modal.showModal();
}

Modal.prototype.closeModal = function() {
    this.executeCallback("close");
    this.modal.close();
}

Modal.prototype.addCallback = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument needs to be a string.");
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument needs to be a function.");
    }

    if (type !== "open" && type !== "close") {
        throw TypeError(`type argument needs to be either "open" or "close".`);
    }

    this.callback[type] = callback;
}

Modal.prototype.removeCallback = function(type) {
    if (typeof type !== "string") {
        throw TypeError("type argument needs to be a string.");
    }

    if (type !== "open" && type !== "close") {
        throw TypeError(`type argument needs to be either "open" or "close".`);
    }

    this.callback[type] = null;
}

Modal.prototype.executeCallback = function(type) {
    if (this.callback[type]) {
        this.callback[type]();
    }
}
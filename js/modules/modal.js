export default function Modal(modal, open) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Modal constructor.`);
    }

    if (!(modal instanceof HTMLElement)) {
        throw TypeError("modal argument needs to be an HTML Element.");
    } else if (!(open instanceof HTMLElement)) {
        throw TypeError("open argument needs to be an HTML Element.");
    }

    this.modal = modal;
    this.open = open;

    this.container = this.modal.querySelector(".modal-container");
    if (!this.container) {
        throw Error("Modal has no container.");
    }

    this.close = this.modal.querySelector(".modal-close");
    if (!close) {
        throw Error("Modal has no close button.");
    }

    this.addListeners();
}

Modal.prototype.addListeners = function() {
    this.open.addEventListener("click", () => {
        this.showModal();
    });

    this.close.addEventListener("click", () => {
        this.closeModal();
    });

    this.modal.addEventListener("click", event => {
        if (event.target === this.modal) {
            this.closeModal();
        }
    });
}

Modal.prototype.showModal = function() {
    this.modal.showModal();
}

Modal.prototype.closeModal = function() {
    this.modal.close();
}
export default function Modal(modal, open) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Modal constructor.`);
    }

    if (!modal) {
        throw Error("Modal does not exist.");
    }
    this.modal = modal;

    if (!open) {
        throw Error("Modal has no open button.");
    }
    this.open = open;

    const container = this.modal.querySelector(".modal-container");
    if (!container) {
        throw Error("Modal has no container.");
    }
    this.container = container;

    const close = this.modal.querySelector(".modal-close");
    if (!close) {
        throw Error("Modal has no close button.");
    }
    this.close = close;

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
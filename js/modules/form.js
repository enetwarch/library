export default function Form(form) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    }

    if (!(form instanceof HTMLElement)) {
        throw TypeError("form argument needs to be an HTML Element.");
    }

    this.form = form;
}

Form.prototype.resetForm = function() {
    this.form.reset();
}

Form.prototype.changeSubmitListener = function(submit) {
    if (typeof submit !== "function") {
        throw TypeError("submit argument needs to be a function.");
    }

    if (this.submit) {
        this.removeSubmitListener();
    }

    this.submit = event => {
        event.preventDefault();

        const formData = new FormData(this.form);
        submit(formData);

        this.resetForm();
    }

    this.form.addEventListener("submit", this.submit);
}

Form.prototype.removeSubmitListener = function() {
    if (!this.submit) {
        return;
    }

    this.form.removeEventListener("submit", this.submit);
    this.submit = null;
}
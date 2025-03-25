export default function Form(form, submit) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    }

    if (!(form instanceof HTMLElement)) {
        throw TypeError("form argument needs to be an HTML Element.");
    } else if (typeof submit !== "function") {
        throw TypeError("submit argument needs to be an HTML Element.");
    }

    this.form = form;
    this.submit = submit;

    this.addInputListeners();
    this.addSubmitListener();
}

Form.prototype.addInputListeners = function() {
    const description = document.getElementById("description");
    if (description) {
        description.addEventListener("input", () => {
            description.style.height = "auto";
            description.style.height = `${description.scrollHeight}px`;
        });
    }
}

Form.prototype.addSubmitListener = function() {
    this.form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(this.form);
        this.submit(formData);

        this.form.reset();
    });
}
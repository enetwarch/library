export default function Form(form, submit) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    }

    if (!form || typeof form !== "object") {
        throw Error("Form is not a valid DOM element.");
    }
    this.form = form;

    if (!submit || typeof submit !== "function") {
        throw Error("Form submit action is not a valid function.");
    }
    this.submit = submit;

    this.addInputListeners();
    this.addSubmitListener();
}

Form.prototype.addSubmitListener = function() {
    this.form.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(this.form);
        this.submit(formData);
        this.form.reset();
    });
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
export default function Form(form) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    }

    if (!(form instanceof HTMLElement)) {
        throw TypeError("form argument needs to be an HTML Element.");
    }

    this.form = form;
    this.fields = form.querySelectorAll("input[name]");
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

Form.prototype.insertValues = function(values) {
    if (typeof values !== "object") {
        throw TypeError("entry argument needs to be an object");
    } else if (values === null) {
        throw TypeError("entry argument cannot be a null object.");
    }

    for (const [key, value] of Object.entries(values)) {
        const fields = [...this.fields].filter(field => {
            return field.name === key;
        });

        if (fields.length === 0) {
            continue;
        }

        if (fields[0].type === "radio") {
            const radio = fields.find(radio => {
                return radio.value === value;
            });

            if (!radio) {
                throw Error(`No matching radio field for "${key}" key.`);
            }

            radio.checked = true;
            continue;
        }

        if (fields.length > 1) {
            throw Error(`More matching fields for "${key}" key than expected.`);
        }

        const field = fields[0];
        field.value = value;
    }
}
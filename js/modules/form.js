export default function Form(element, fieldQueries = "[name]", submitButtonQuery = `button[type="submit"]`) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument needs to be an HTML Element.");
    } else if (typeof fieldQueries !== "string") {
        throw TypeError("fieldQuery argument must be a string.");
    } else if (typeof submitButtonQuery !== "string") {
        throw TypeError("submitButtonQuery argument must be a string.");
    }

    this.element = element;

    this.fields = Array.from(this.element.querySelectorAll(fieldQueries));
    if (this.fields.length === 0) {
        throw Error(`element argument does not have fields with "${fieldQueries}" queries.`);
    }

    this.submitButton = this.element.querySelector(submitButtonQuery);
    if (!this.submitButton) {
        throw Error(`element argument does not have a submit button with "${submitButtonQuery}" query.`);
    }

    this.submitEvent = null;
}

Form.prototype.submit = function() {
    this.submitButton.click();
}

Form.prototype.reset = function() {
    this.element.reset();
}

Form.prototype.onSubmit = function(submit) {
    if (typeof submit !== "function") {
        throw TypeError("submit argument must be a function.");
    }

    if (this.submitEvent) {
        this.element.removeEventListener("submit", this.submitEvent);
    }

    this.submitEvent = event => {
        event.preventDefault();

        const formData = new FormData(this.element);
        submit(formData);

        this.reset();
    }

    this.element.addEventListener("submit", this.submitEvent);
}

Form.prototype.insertValues = function(values) {
    if (typeof values !== "object") {
        throw TypeError("entry argument must be an object");
    } else if (values === null) {
        throw TypeError("entry argument must not be null.");
    }

    for (const [key, value] of Object.entries(values)) {
        for (const field of this.fields) {
            if (field.name !== key) continue;

            if (field.type === "radio") {
                field.checked = field.value === value;
                continue;
            }

            field.value = value;
        }
    }
}
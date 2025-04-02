import elements from "../data/elements.json" with { "type": "json" };
import Library from "../modules/library.js";
import Entry from "../modules/entry.js";
import Button from "../modules/button.js";
import Modal from "../modules/modal.js";
import Form from "../modules/form.js";

export default function UI(entries) {
    if (!new.target) {
        throw TypeError(`Use the "new" keyword on the UI constructor.`);
    }

    const libraryElement = UI.getElementById("library");
    const libraryEntries = UI.createLibraryEntries(entries);
    this.library = new Library(libraryElement, libraryEntries);

    this.initializeElements(elements);
    this.initializeListeners();
}

UI.prototype.initializeElements = function(elements) {
    if (!Array.isArray(elements)) {
        throw TypeError("elements argument must be an array.");
    } else if (!elements.every(element => typeof element === "object")) {
        throw TypeError("elements argument must contain objects.");
    } else if (!elements.every(element => "id" in element)) {
        throw TypeError(`elements argument must contain objects that have an "id" key.`);
    } else if (!elements.every(element => "type" in element)) {
        throw TypeError(`elements argument must contain objects that have a "type" key.`);
    } else if (!elements.every(element => typeof element.id === "string")) {
        throw TypeError(`elements argument must contain objects with "id" as a string.`);
    } else if (!elements.every(element => typeof element.type === "string")) {
        throw TypeError(`elements argument must contain objects with "type" as a string.`);
    }

    for (const element of elements) {
        const { id, type } = element;

        const htmlElement = UI.getElementById(id);
        this[id] = UI.elementFactory(type, htmlElement);
    }
}

UI.getElementById = function(id) {
    if (typeof id !== "string") {
        throw TypeError("id argument must be a string.");
    }

    const element = document.getElementById(id);
    if (!element) {
        throw Error(`"${id}" element id does not exist.`);
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element variable must be returned as an HTML element.");
    }

    return element;
}

UI.elementFactory = function(type, element) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    }

    switch (type) {
        case "button": return new Button(element);
        case "modal": return new Modal(element);
        case "form": return new Form(element);

        default: throw TypeError(`Unknown type: "${type}".`);
    }
}

UI.createLibraryEntries = function(entries) {
    if (typeof entries !== "object") {
        throw TypeError("entries argument must be an object.");
    }

    return entries.map((data, id) => {
        return new Entry(data, id);
    });
}

UI.prototype.initializeListeners = function() {
    this.createButton.addEventListener("click", this.onCreateButtonClick.bind(this));
    this.entryModal.addEventListener("close", this.onEntryModalClose.bind(this));

    this.library.onEntryClick(this.onEntryClick.bind(this));
    this.viewModal.addEventListener("close", this.onViewModalClose.bind(this));
    this.deleteButton.addEventListener("click", this.onDeleteButtonClick.bind(this));
    this.editButton.addEventListener("click", this.onEditButtonClick.bind(this));

    window.addEventListener("beforeunload", this.onWindowBeforeunload.bind(this));
}

UI.prototype.onCreateButtonClick = function() {
    this.entryModal.show();

    this.entryForm.onSubmit(formData => {
        if (!(formData instanceof FormData)) {
            throw TypeError("formData argument must be a FormData object.");
        }

        const id = this.library.getNextId();
        const entry = new Entry(formData, id);
        this.library.addEntry(entry);

        this.entryModal.close();
    });
}

UI.prototype.onEntryModalClose = function() {
    this.entryForm.reset();
}

UI.prototype.onEntryClick = function(entry) {
    if (!(entry instanceof Entry)) {
        throw TypeError("entry argument must be an Entry object.");
    }

    const entryTitle = UI.getElementById("entryTitle");
    entryTitle.innerText = entry.getTitle();

    const entryImage = UI.getElementById("entryImage");
    entryImage.src = entry.getImage();

    this.viewModal.show();
}

UI.prototype.onViewModalClose = function() {
    this.library.setClickedEntryId(-1);

    const entryTitle = UI.getElementById("entryTitle");
    entryTitle.innerText = "";

    const entryImage = UI.getElementById("entryImage");
    entryImage.src = "";
}

UI.prototype.onDeleteButtonClick = function() {
    const id = this.library.getClickedEntryId();
    this.library.deleteEntry(id);

    this.viewModal.close();
}

UI.prototype.onEditButtonClick = function() {
    const id = this.library.getClickedEntryId();
    const entry = this.library.findEntry(id);
    this.entryForm.insertValues(entry);

    this.entryModal.show();

    this.entryForm.onSubmit(formData => {
        if (!(formData instanceof FormData)) {
            throw TypeError("formData argument must be a FormData object.");
        }

        this.library.updateEntry(formData, id);

        this.entryModal.close();
        this.viewModal.close();
    });
}

UI.prototype.onWindowBeforeunload = function() {
    const entries = JSON.stringify(this.library.getEntries());
    localStorage.setItem("entries", entries);
}
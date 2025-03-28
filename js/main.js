import entries from "./modules/entries.json" with { "type": "json" };
import Library from "./modules/library.js";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js";

window.addEventListener("load", () => {
    let library;
    const libraryElement = document.getElementById("library");

    if (!libraryElement) {
        throw Error("#library element id not found.");
    }

    const storedEntries = localStorage.getItem("entries");
    if (!storedEntries) {
        const sampleEntries = entries;
        library = new Library(libraryElement, sampleEntries);
    } else {
        const parsedEntries = JSON.parse(storedEntries);
        library = new Library(libraryElement, parsedEntries);
    }

    window.addEventListener("beforeunload", () => {
        const entries = JSON.strigify(library.entries);
        localStorage.setItem("entries", entries);
    });

    const main = new Main(library);
});

function Main(library) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Main constructor.`);
    }

    if (!(library instanceof Library)) {
        throw TypeError("library argument needs to be a Library object.");
    }

    this.library = library;
    this.currentEntryId = "-1";

    this.entryForm = this.initializeEntryForm();
    this.modalForm = this.initializeModalForm();
    this.modalEntry = this.initializeModalEntry();

    this.library.addListener("click", entry => {
        this.readEntry(entry);
    });

    this.entryForm.changeSubmitListener(formData => {
        this.createEntry(formData);
    });

    this.modalForm.addCallback("close", () => {
        this.entryForm.resetForm();
    });

    this.modalEntry.addCallback("open", () => {
        const deleteElement = this.getElementById("delete");
        const editElement = this.getElementById("edit");

        deleteElement.addEventListener("click", () => this.deleteEntry());
        editElement.addEventListener("click", () => this.updateEntry());

        this.modalEntry.addCallback("close", () => {
            deleteElement.removeEventListener("click", () => this.deleteEntry());
            editElement.removeEventListener("click", () => this.updateEntry());

            this.modalEntry.removeCallback("close");
        });
    });
}

Main.prototype.getElementById = function(id) {
    if (typeof id !== "string") {
        throw TypeError("id argument needs to be a string.");
    }

    const element = document.getElementById(id);
    if (!element) {
        throw Error(`#${id} element id not found.`);
    }

    return element;
}

Main.prototype.createEntry = function(formData) {
    if (!(formData instanceof FormData)) {
        throw TypeError("formData argument needs to be a FormData object.");
    }

    this.library.addEntry(formData);
    this.modalForm.closeModal();
}

Main.prototype.readEntry = async function(entry) {
    if (typeof entry !== "object") {
        throw TypeError("entry argument needs to be an object.");
    } 
    
    const requiredKeys = ["title", "image", "entry"];
    for (const key of requiredKeys) {
        if (!(key in entry)) {
            throw TypeError(`${key} key is required in entry argument.`);
        }
    }

    const entryTitleElement = this.getElementById("entryTitle");
    const entryImageElement = this.getElementById("entryImage");

    entryTitleElement.innerText = entry.title;
    entryImageElement.src = await entry.getImage();
    this.currentEntryId = entry.entry.dataset.id;

    this.modalEntry.showModal();
}

Main.prototype.updateEntry = function() {
    const entry = this.library.findEntry(this.currentEntryId);
    this.entryForm.insertValues(entry);

    this.entryForm.changeSubmitListener(formData => {
        library.updateEntry(formData, this.currentEntryId);

        this.modalForm.closeModal();
        this.modalEntry.closeModal();

        this.entryForm.changeSubmitListener(this.createEntry);
    });

    this.modalForm.showModal();
}

Main.prototype.deleteEntry = function() {
    this.library.deleteEntry(this.currentEntryId);
    this.modalEntry.closeModal();
}

Main.prototype.initializeEntryForm = function() {
    const entryFormElement = this.getElementById("entryForm");
    const entryForm = new Form(entryFormElement);

    return entryForm;
}

Main.prototype.initializeModalForm = function() {
    const modalFormElement = this.getElementById("modalForm");
    const newEntryElement = this.getElementById("newEntry");
    const modalForm = new Modal(modalFormElement, newEntryElement);

    return modalForm;
}

Main.prototype.initializeModalEntry = function() {
    const modalEntryElement = this.getElementById("modalEntry");
    const modalEntry = new Modal(modalEntryElement);

    return modalEntry;
}
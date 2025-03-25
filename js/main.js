import entries from "./modules/entries.json" with { "type": "json" };
import Library from "./modules/library.js";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js";

window.addEventListener("load", () => {
    let library;
    const storedLibrary = localStorage.getItem("library");

    if (!storedLibrary || !(storedLibrary instanceof Library)) {
        const container = document.getElementById("output");
        const sampleEntries = structuredClone(entries);
        library = new Library(container, sampleEntries);
    } else {
        library = JSON.parse(storedLibrary);
        library.loadEntries();
    }

    window.addEventListener("beforeunload", () => {
        localStorage.setItem("library", JSON.stringify(library));
    });

    const modalFormElement = document.getElementById("modalForm");
    const newEntryElement = document.getElementById("newEntry");
    const modalForm = new Modal(modalFormElement, newEntryElement);

    const entryFormElement = document.getElementById("entryForm");
    const entryForm = new Form(entryFormElement, formData => {
        const entry = new Entry(formData);
        entries.push(entry);
        modalForm.closeModal();
    });

    const modalEntryElement = document.getElementById("modalEntry");
    const modalEntry = new Modal(modalEntryElement);
    
    const entryImage = document.getElementById("entryImage");
    const entryTitle = document.getElementById("entryTitle");
    const entryDescription = document.getElementById("entryDescription");

    library.addListener("click", event => {
        modalEntry.showModal();
    });
});
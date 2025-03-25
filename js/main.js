import entries from "./modules/entries.json" with { "type": "json" };
import Modal from "./modules/modal.js";
import Library from "./modules/library.js";
import Form from "./modules/form.js";

window.addEventListener("load", () => {
    document.addEventListener("contextmenu", event => event.preventDefault());
    
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

    library.addListener("click", event => {

    });

    window.addEventListener("beforeunload", () => {
        localStorage.setItem("library", JSON.stringify(library));
    });

    const modalFormElement = document.getElementById("modalForm");
    const newEntryElement = document.getElementById("newEntry");
    const modalForm = new Modal(modalFormElement, newEntryElement);

    const entryForm = new Form(document.getElementById("entryForm"), formData => {
        const entry = new Entry(formData);
        entries.push(entry);
        modalForm.closeModal();
    });
});
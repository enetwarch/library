import entries from "./modules/entries.json" with { "type": "json" };
import Library from "./modules/library.js";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js";

window.addEventListener("load", () => {
    let library;
    const libraryElement = document.getElementById("library");
    const storedEntries = localStorage.getItem("entries");

    if (!storedEntries) {
        const sampleEntries = structuredClone(entries);
        library = new Library(libraryElement, sampleEntries);
    } else {
        const parsedEntries = JSON.parse(storedEntries);
        library = new Library(libraryElement, parsedEntries);
    }

    window.addEventListener("beforeunload", () => {
        localStorage.setItem("entries", JSON.stringify(library.entries));
    });

    const modalFormElement = document.getElementById("modalForm");
    const newEntryElement = document.getElementById("newEntry");
    const modalForm = new Modal(modalFormElement, newEntryElement);

    modalForm.addCallback("close", () => {
        entryForm.resetForm();
    });

    const entryFormElement = document.getElementById("entryForm");
    const entryForm = new Form(entryFormElement);
    
    const createEntry = formData => {
        library.addEntry(formData);
        modalForm.closeModal();
    }

    entryForm.changeSubmitListener(createEntry);

    const entryImageElement = document.getElementById("entryImage");
    const entryTitleElement = document.getElementById("entryTitle");
    let currentEntryId;

    library.addListener("click", entry => {
        if (typeof entry !== "object") {
            throw TypeError("entry argument needs to be an object.");
        }

        entryTitleElement.innerText = entry.title;
        entryImageElement.src = entry.image;
        currentEntryId = entry.entry.dataset.id;

        modalEntry.showModal();
    });

    const modalEntryElement = document.getElementById("modalEntry");
    const modalEntry = new Modal(modalEntryElement);

    const deleteElement = document.getElementById("delete");
    const editElement = document.getElementById("edit");

    modalEntry.addCallback("open", () => {
        let deleteFunction = () => {
            library.deleteEntry(currentEntryId);
            modalEntry.closeModal();
        }

        let editFunction = () => {
            const entry = library.findEntry(currentEntryId);
            entryForm.insertValues(entry);

            entryForm.changeSubmitListener(formData => {
                library.updateEntry(formData, currentEntryId);
                modalForm.closeModal();
                modalEntry.closeModal();
                entryForm.changeSubmitListener(createEntry);
            });

            modalForm.showModal();
        }

        deleteElement.addEventListener("click", deleteFunction);
        editElement.addEventListener("click", editFunction);

        modalEntry.addCallback("close", () => {
            deleteElement.removeEventListener("click", deleteFunction);
            editElement.removeEventListener("click", editFunction);

            modalEntry.removeCallback("close");
        });
    });
});
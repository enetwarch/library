import entries from "./modules/entries.json" with { "type": "json" };
import Library from "./modules/library.js";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js";

window.addEventListener("load", () => {
    let library;
    const storedLibrary = localStorage.getItem("library");

    if (!storedLibrary || !(storedLibrary instanceof Library)) {
        const libraryElement = document.getElementById("library");
        const sampleEntries = structuredClone(entries);
        library = new Library(libraryElement, sampleEntries);
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

    modalForm.addCallback("close", () => {
        entryForm.resetForm();
    });

    const entryFormElement = document.getElementById("entryForm");
    const entryForm = new Form(entryFormElement);
    
    entryForm.changeSubmitListener(formData => {
        library.addEntry(formData);
        modalForm.closeModal();
    });

    let currentEntryId;

    const entryImageElement = document.getElementById("entryImage");
    const entryTitleElement = document.getElementById("entryTitle");

    library.addListener("click", entry => {
        if (typeof entry !== "object") {
            throw TypeError("entry argument needs to be an object.");
        }

        entryTitleElement.innerText = entry.title;
        entryImageElement.src = entry.image;
        currentEntryId = entry.entry.dataset.id;

        setTimeout(() => {
            modalEntry.showModal();
        }, 100);
    });

    const modalEntryElement = document.getElementById("modalEntry");
    const modalEntry = new Modal(modalEntryElement);

    const deleteElement = document.getElementById("delete");
    const editElement = document.getElementById("edit");

    modalEntry.addCallback("open", () => {
        let deleteFunction = () => {
            const entryId = Number(currentEntryId);
            library.deleteEntry(entryId);
            modalEntry.closeModal();
        }

        let editFunction = () => {

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
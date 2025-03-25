import sample from "./modules/sample.json" with { "type": "json" };
import Modal from "./modules/modal.js";
import Entry from "./modules/entry.js";
import Form from "./modules/form.js";

window.addEventListener("load", () => {
    document.addEventListener("contextmenu", event => event.preventDefault());

    let entries;
    const storedEntries = localStorage.getItem("entries");
    if (!storedEntries) {
        entries = structuredClone(sample);
    } else {
        entries = JSON.parse(storedEntries);
    }
    entries.forEach(entry => new Entry(entry));
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("entries", JSON.stringify(entries));
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
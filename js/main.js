import sample from "./modules/sample.json" with { "type": "json" };
import Modal from "./modules/modal.js";
import Entry from "./modules/entry.js";

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

    const modalForm = document.getElementById("modalForm");
    const newEntry = document.getElementById("newEntry");
    new Modal(modalForm, newEntry);

    const description = document.getElementById("description");
    description.addEventListener("input", () => {
        description.style.height = "auto";
        description.style.height = `${description.scrollHeight}px`;
    });

    const entryForm = document.getElementById("entryForm");
    entryForm.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(entryForm);
        const entry = new Entry(formData);
        entries.push(entry);

        entryForm.reset();
        modalForm.close();
    });
});
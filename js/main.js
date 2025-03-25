import entries from "./modules/entries.json" with { "type": "json" };
import Entry from "./modules/entry.js";

window.addEventListener("load", () => {
    document.addEventListener("contextmenu", event => event.preventDefault());

    entries.forEach(entry => new Entry(entry));

    const modalForm = document.getElementById("modalForm");
    const newEntry = document.getElementById("newEntry");
    const modalClose = document.getElementById("modalClose");
    newEntry.addEventListener("click", () => modalForm.showModal());
    modalClose.addEventListener("click", () => modalForm.close());

    const description = document.getElementById("description");
    description.addEventListener("input", () => {
        description.style.height = "auto";
        description.style.height = `${description.scrollHeight}px`;
    });

    const entryForm = document.getElementById("entryForm");
    entryForm.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(entryForm);
        const libraryEntry = new Entry(formData);
        entryForm.reset();
        modalForm.close();
    });
});
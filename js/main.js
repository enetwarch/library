import sample from "./data/sample.json" with { "type": "json" };
import UI from "./controllers/ui.js";

window.addEventListener("load", () => {
    const entries = [];

    const storedEntries = localStorage.getItem("entries");
    if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        parsedEntries.forEach(entry => entries.push(entry));
    } else {
        const sampleEntries = structuredClone(sample);
        sampleEntries.forEach(entry => entries.push(entry));
    }

    const ui = new UI(entries);
});
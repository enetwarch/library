import Entry from "./entry.js";

export default function Library(element, entries) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entries constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    } else if (!Array.isArray(entries)) {
        throw TypeError("entries argument must be an array.");
    } else if (!entries.every(entry => entry instanceof Entry)) {
        throw TypeError("entries argument must contain entry objects as elements.");
    }

    this.element = element;
    this.entries = entries;
    this.clickedEntryId = -1;

    this.entries.forEach(entry => entry.display(this.element));
}

Library.prototype.getNextId = function() {
    return this.entries.length;
}

Library.prototype.getClickedEntryId = function() {
    return Number(this.clickedEntryId);
}

Library.prototype.getEntries = function() {
    return this.entries;
}

Library.prototype.setClickedEntryId = function(value) {
    if (typeof value !== "number") {
        throw TypeError("value argument must be a number.");
    }

    this.clickedEntryId = value;
}

Library.prototype.addEntry = function(entry) {
    if (!(entry instanceof Entry)) {
        throw TypeError("entry argument must be an Entry object.");
    }
  
    entry.display(this.element);
    this.entries.push(entry);
}

Library.prototype.updateEntry = function(data, id) {
    if (typeof data !== "object") {
        throw TypeError("data argument needs to be an object.");
    } else if (typeof id !== "number") {
        throw TypeError("id argument needs to be a number.");
    }

    const entry = this.findEntry(id);
    entry.update(data);
}

Library.prototype.deleteEntry = function(id) {
    if (typeof id !== "number") {
        throw TypeError("id argument needs to be a number.");
    }

    const entry = this.findEntry(id);
    if (!entry) return;

    const index = this.entries.indexOf(entry)
    if (index === -1) return;

    this.entries.splice(index, 1);
    entry.remove();

    this.reassignEntryIds();
}

Library.prototype.findEntry = function(id) {
    if (typeof id !== "number") {
        throw TypeError("id argument needs to be a number.");
    }

    const entry = this.entries.find(entry => entry.getId() === id);
    return entry || null;
}

Library.prototype.reassignEntryIds = function() {
    this.entries.forEach((entry, index) => entry.setId(index));
}

Library.prototype.onEntryClick = function(callback, entryQuery = ".entry") {
    if (typeof callback !== "function") {
        throw TypeError("callback argument needs to be a function.");
    } else if (typeof entryQuery !== "string") {
        throw TypeError("entryQuery argument must be a string.");
    }
    
    this.element.addEventListener("click", event => {
        const element = event.target.closest(entryQuery);
        if (!element) return;

        this.setClickedEntryId(Number(element.dataset.id));
        const entry = this.findEntry(this.getClickedEntryId());

        callback(entry);
    });
}
export default function Library(library, dataset) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entries constructor.`);
    }

    if (!(library instanceof HTMLElement)) {
        throw TypeError("library argument needs to be a DOM element.");
    } else if (typeof dataset !== "object") {
        throw TypeError("dataset argument needs to be an object.");
    }

    this.library = library;    
    this.entries = [];
    this.currentId = 0;

    dataset.forEach(data => this.addEntry(data));
}

Library.prototype.addEntry = async function(data) {
    if (typeof data !== "object") {
        throw TypeError("data argument needs to be an object.");
    }

    const entry = await new Entry(data, this.currentId);
    this.currentId++;
    
    entry.loadEntry(this.library);
    this.entries.push(entry);
}

Library.prototype.updateEntry = function(data, id) {
    if (typeof data !== "object") {
        throw TypeError("data argument needs to be an object.");
    } else if (typeof id !== "string") {
        throw TypeError("id argument needs to be a string.");
    }

    const entry = this.findEntry(id);

    if (data instanceof FormData) {
        entry.parseFormData(data);
    } else {
        entry.parseJSON(data);
    }

    entry.updateEntry();
}

Library.prototype.deleteEntry = function(id) {
    if (typeof id !== "string") {
        throw TypeError("id argument needs to be a string.");
    }

    const matchingEntry = this.findEntry(id);
    if (!matchingEntry) {
        return;
    }

    matchingEntry.entry.remove();

    this.entries = this.entries.filter(entry => {
        return entry !== matchingEntry;
    });
}

Library.prototype.findEntry = function(id) {
    if (typeof id !== "string") {
        throw TypeError("id argument needs to be a string.");
    }

    const matchingEntry = this.entries.find(entry => {
        const entryId = entry.entry.dataset.id;
        return entryId === id;
    });

    return matchingEntry;
}

Library.prototype.addListener = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument needs to be a string.");
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument needs to be a function.");
    }

    this.library.addEventListener(type, event => {
        const element = event.target.closest(".entry");
        if (!element) {
            return;
        }

        const id = element.dataset.id;
        const entry = this.entries[id];

        callback(entry);
    });
}

function Entry(data, id) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entry constructor.`);
    }

    if (data instanceof FormData) {
        this.parseFormData(data);
    } else if (typeof data === "object") {
        this.parseJSON(data);
    } else {
        throw TypeError("data argument needs to be an object.");
    }

    if (typeof id !== "number") {
        throw TypeError("id argument needs to be a number.");
    }

    this.entry = document.createElement("div");
    this.entry.classList.add("entry");
    this.entry.dataset.id = id;
}

Entry.prototype.parseFormData = function(formData) {
    if (!(formData instanceof FormData)) {
        throw TypeError("formData argument needs to be a FormData.");
    }

    this.title = formData.get("title");
    this.image = formData.get("image");
    this.status = formData.get("status");
}

Entry.prototype.parseJSON = function(jsonData) {
    if (typeof jsonData !== "object") {
        throw TypeError("jsonData argument needs to be an object.");
    }

    const requiredKeys = ["title", "image", "status"];
    for (const key of requiredKeys) {
        if (!(key in jsonData)) {
            throw TypeError(`${key} key is required in jsonData argument.`);
        }
    }

    this.title = jsonData.title;
    this.image = jsonData.image;
    this.status = jsonData.status;
}

Entry.prototype.loadEntry = async function(library) {
    if (!(library instanceof HTMLElement)) {
        throw TypeError("library argument needs to be a DOM element.");
    }

    const entryImage = document.createElement("img");
    entryImage.classList.add("entry-image");
    entryImage.alt = this.title;
    entryImage.src = await this.getImage();

    const entryStatus = document.createElement("i");
    entryStatus.classList.add(...this.getStatus());

    const entryTitle = document.createElement("p");
    entryTitle.classList.add("entry-title");
    entryTitle.innerText = this.title;

    this.entry.append(entryImage, entryStatus, entryTitle);
    library.prepend(this.entry);
}

Entry.prototype.updateEntry = async function() {
    const entryImage = this.entry.querySelector(".entry-image");
    if (!entryImage) {
        throw Error(`".entry-image" element not found.`);
    }

    entryImage.alt = this.title;
    entryImage.src = await this.getImage();

    const entryStatus = this.entry.querySelector(".entry-status");
    if (!entryStatus) {
        throw Error(`".entry-status" element not found.`);
    }

    entryStatus.classList.remove(...entryStatus.classList);
    entryStatus.classList.add(...this.getStatus());

    const entryTitle = this.entry.querySelector(".entry-title");
    if (!entryTitle) {
        throw Error(`".entry-title" element not found.`);
    }

    entryTitle.innerText = this.title;
}

Entry.prototype.getImage = async function() {
    try {
        const response = await fetch(this.image);
        if (!response.ok) {
            throw Error(`Failed to fetch image: ${response.status} status.`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error(error);
        return "img/404.svg";
    }
}

Entry.prototype.getStatus = function() {
    let classList = ["entry-status", "fa-solid"];    
    
    switch (this.status) {
        case "completed": {
            classList.push("fa-square-check");
            break;
        }

        case "reading": {
            classList.push("fa-square-minus");
            break;
        }

        case "dropped": {
            classList.push("fa-square-xmark");
            break;
        }

        default: {
            throw Error(`Invalid entry status: ${this.status}`);
        }
    }

    return classList;
}
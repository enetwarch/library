export default function Library(container, dataset) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entries constructor.`);
    }

    if (!(container instanceof HTMLElement)) {
        throw TypeError("container argument needs to be a DOM element.");
    } else if (typeof dataset !== "object") {
        throw TypeError("dataset argument needs to be an object.");
    }

    this.container = container;    
    this.entries = [];

    dataset.forEach(data => this.addEntry(data));
}

Library.prototype.addEntry = function(data) {
    if (typeof data !== "object") {
        throw TypeError("data argument needs to be an object.");
    }

    const entry = new Entry(data);
    entry.loadEntry(this.container);
    this.entries.push(entry);
}

Library.prototype.loadEntries = function() {
    this.entries.forEach(entry => {
        entry.loadEntry(this.container);
    });
}

Library.prototype.addListener = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument needs to be a string.");
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument needs to be a function.");
    }

    this.container.addEventListener(type, event => {
        if (!(event.target.closest(".entry"))) {
            return;
        }

        callback(event);
    });
}

function Entry(data) {
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

    this.entry = document.createElement("div");
    this.entry.classList.add("entry");
}

Entry.prototype.parseFormData = function(formData) {
    if (!(formData instanceof FormData)) {
        throw TypeError("formData argument needs to be a FormData.");
    }

    this.title = formData.get("title");
    this.image = formData.get("image");
    this.status = formData.get("status");
    this.description = formData.get("description");
}

Entry.prototype.parseJSON = function(jsonData) {
    if (typeof jsonData !== "object") {
        throw TypeError("jsonData argument needs to be an object.");
    }

    const requiredKeys = ["title", "image", "status", "description"];
    for (const key of requiredKeys) {
        if (!(key in jsonData)) {
            throw TypeError(`${key} key is required in jsonData argument.`);
        }
    }

    this.title = jsonData.title;
    this.image = jsonData.image;
    this.status = jsonData.status;
    this.description = jsonData.description;
}

Entry.prototype.loadEntry = function(container) {
    if (!(container instanceof HTMLElement)) {
        throw TypeError("container argument needs to be a DOM element.");
    }

    const entryImage = document.createElement("img");
    entryImage.classList.add("entry-image");
    entryImage.alt = this.title;
    fetch(this.image).then(response => {
        if (!response.ok) {
            throw Error(`Failed to fetch image: ${response.status} status.`);
        }
        return response.blob();
    }).then(blob => {
        const url = URL.createObjectURL(blob);
        entryImage.src = url;
    }).catch(error => {
        console.error(error);
        entryImage.src = "img/404.svg";
    });

    const entryStatus = document.createElement("i");
    entryStatus.classList.add("entry-status", "fa-solid");
    switch (this.status) {
        case "completed": {
            entryStatus.classList.add("fa-square-check");
            break;
        }
        case "reading": {
            entryStatus.classList.add("fa-square-minus");
            break;
        }
        case "dropped": {
            entryStatus.classList.add("fa-square-xmark");
            break;
        }
        default: {
            throw Error(`Invalid entry status: ${this.status}`);
        }
    }

    const entryTitle = document.createElement("p");
    entryTitle.classList.add("entry-title");
    entryTitle.innerText = this.title;

    this.entry.append(entryImage, entryStatus, entryTitle);
    container.prepend(this.entry);
}
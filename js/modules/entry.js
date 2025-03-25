export default function Entry(data) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entry constructor.`);
    }

    if (data instanceof FormData) {
        this.parseFormData(data);
    } else if (typeof data === "object") {
        this.parseJSON(data);
    } else {
        throw Error("Invalid data type for Entry constructor.");
    }

    this.createEntry();
}

Entry.prototype.parseFormData = function(formData) {
    if (!(formData instanceof FormData)) {
        throw Error("Argument is not a Form Data.");
    }

    this.title = formData.get("title");
    this.image = formData.get("image");
    this.status = formData.get("status");
    this.description = formData.get("description");
}

Entry.prototype.parseJSON = function(jsonData) {
    if (typeof jsonData !== "object" || !jsonData) {
        throw Error("Argument is not an object.");
    }

    if (!("title" in jsonData)) {
        throw Error("No title key in JSON.");
    } else if (!("image" in jsonData)) {
        throw Error("No image key in JSON.");
    } else if (!("status" in jsonData)) {
        throw Error("No status key in JSON.");
    } else if (!("description" in jsonData)) {
        throw Error("No description key in JSON.");
    }

    this.title = jsonData.title;
    this.image = jsonData.image;
    this.status = jsonData.status;
    this.description = jsonData.description;
}

Entry.prototype.createEntry = function() {
    const container = document.getElementById("output");
    if (!container) {
        throw Error("Entry container does not exist.");
    }

    const entry = document.createElement("div");
    entry.classList.add("entry");

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
            throw Error("Invalid entry status.");
        }
    }

    const entryTitle = document.createElement("p");
    entryTitle.classList.add("entry-title");
    entryTitle.innerText = this.title;

    entry.append(entryImage, entryStatus, entryTitle);
    container.prepend(entry);
}
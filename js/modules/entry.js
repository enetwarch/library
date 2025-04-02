export default function Entry(data, id, entryClass = "entry") {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entry constructor.`);
    }

    if (typeof id !== "number") {
        throw TypeError("id argument must be a number.");
    } else if (typeof entryClass !== "string") {
        throw TypeError("entryClass argument must be a string.");
    }

    this.parseData(data);

    this.element = document.createElement("div");
    this.element.classList.add(entryClass);

    this.element.dataset.id = id;
}

Entry.prototype.getId = function() {
    return this.element.dataset.id;
}

Entry.prototype.setId = function(id) {
    if (typeof id !== "number") {
        throw TypeError("id argument must be a number.");
    }

    this.element.dataset.id = id;
}

Entry.prototype.getTitle = function() {
    return this.title;
}

Entry.prototype.getImage = function() {
    return this.image;
}

Entry.prototype.getStatus = function() {
    return this.status;
}

Entry.prototype.parseData = function(data) {
    if (data instanceof FormData) {
        this.parseFormData(data);
    } else if (typeof data === "object") {
        this.parseJSONData(data);
    } else {
        throw TypeError("data argument must be a FormData or an object.");
    }
}

Entry.prototype.parseFormData = function(formData) {
    if (!(formData instanceof FormData)) {
        throw TypeError("formData argument needs to be a FormData.");
    }

    this.title = formData.get("title");
    this.image = formData.get("image");
    this.status = formData.get("status");
}

Entry.prototype.parseJSONData = function(jsonData, requiredKeys = ["title", "image", "status"]) {
    if (typeof jsonData !== "object") {
        throw TypeError("jsonData argument must be an object.");
    } else if (!Array.isArray(requiredKeys)) {
        throw TypeError("requiredKeys argument must be an array.");
    } else if (!requiredKeys.every(key => typeof key === "string")) {
        throw TypeError("requiredKeys argument must have string elements.");
    }

    for (const key of requiredKeys) {
        if (!(key in jsonData)) {
            throw TypeError(`"${key}" key is required in jsonData argument.`);
        }
    }

    this.title = jsonData.title;
    this.image = jsonData.image;
    this.status = jsonData.status;
}

Entry.prototype.display = async function(container, imageClass = "entry-image", statusContainerClass = "entry-status-container", titleClass = "entry-title") {
    if (!(container instanceof HTMLElement)) {
        throw TypeError("container argument must be an HTML element.");
    } else if (typeof imageClass !== "string") {
        throw TypeError("imageClass argument must be a string.");
    } else if (typeof statusContainerClass !== "string") {
        throw TypeError("statusContainerClass argument must be a string.");
    } else if (typeof titleClass !== "string") {
        throw TypeError("titleClass argument must be a string.");
    }

    const image = document.createElement("img");
    image.classList.add(imageClass);
    image.alt = this.getTitle();
    image.src = await Entry.getImageSource(this.getImage());

    const statusContainer = document.createElement("div");
    statusContainer.classList.add(statusContainerClass);

    const statusIcon = document.createElement("i");
    statusIcon.classList.add(...Entry.getStatusIconClassList(this.getStatus()));

    statusContainer.appendChild(statusIcon);

    const title = document.createElement("p");
    title.classList.add(titleClass);
    title.innerText = this.getTitle();

    this.element.append(image, statusContainer, title);
    container.prepend(this.element);
}

Entry.prototype.update = async function(data, imageQuery = ".entry-image", statusIconQuery = ".entry-status-icon", titleQuery = ".entry-title") {
    if (typeof imageQuery !== "string") {
        throw TypeError("imageQuery argument must be a string.");
    } else if (typeof statusIconQuery !== "string") {
        throw TypeError("statusQuery argument must be a string.");
    } else if (typeof titleQuery !== "string") {
        throw TypeError("titleQuery argument must be a string.");
    }

    this.parseData(data);

    const image = this.element.querySelector(imageQuery);
    if (!image) {
        throw Error(`image query "${imageQuery}" element not found.`);
    }

    image.alt = this.getTitle();
    image.src = await Entry.getImageSource(this.getImage());

    const statusIcon = this.element.querySelector(statusIconQuery);
    if (!statusIcon) {
        throw Error(`status query "${statusIconQuery}" element not found.`);
    }

    statusIcon.classList.remove(...statusIcon.classList);
    statusIcon.classList.add(...Entry.getStatusIconClassList(this.getStatus()));

    const title = this.element.querySelector(titleQuery);
    if (!title) {
        throw Error(`title query "${titleQuery}" element not found.`);
    }

    title.innerText = this.getTitle();
}

Entry.prototype.remove = function() {
    this.element.remove();
}

Entry.getImageSource = async function(image, fallback = "img/404.svg") {
    if (typeof image !== "string") {
        throw TypeError("image argument must be a string.");
    } else if (typeof fallback !== "string") {
        throw TypeError("fallback argument must be a string.");
    }

    try {
        const response = await fetch(image);
        if (!response.ok) {
            throw Error(`Failed to fetch image ${response.status} status: ${image}.`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error(error);
        return fallback;
    }
}

Entry.getStatusIconClassList = function(status) {
    if (typeof status !== "string") {
        throw TypeError("status argument must be a string.");
    }

    switch (status) {
        case "completed": return ["entry-status-icon", "fa-solid", "fa-check"];
        case "reading":  return ["entry-status-icon", "fa-solid", "fa-minus"];
        case "dropped":  return ["entry-status-icon", "fa-solid", "fa-xmark"];

        default: throw Error(`Invalid entry status: "${status}".`);
    }
}
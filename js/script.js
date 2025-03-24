document.addEventListener("contextmenu", event => {
    event.preventDefault();
});

window.addEventListener("load", () => {
    const entries = [
        ["The World After the Fall", "Dropped", "https://meo.comick.pictures/vo82y.jpg", ""],
        ["Omniscient Reader's Viewpoint", "Reading", "https://meo.comick.pictures/qv5oqL.jpg", ""],
        ["Solo Leveling", "Completed", "https://meo.comick.pictures/zevXM.jpg", ""],
    ];

    const container = document.getElementById("output");
    entries.forEach(entry => {
        const entryObject = new Entry(entry);
        entryObject.displayEntry(container);
    });
});

document.getElementById("newEntry").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    if (!modal) {
        throw Error("No modal detected.");
    }

    modal.showModal();
});

document.getElementById("modalClose").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    if (!modal) {
        throw Error("No modal detected.");
    }

    modal.close();
});

document.getElementById("description").addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
});

function Entry(entry) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entry constructor.`);
    }

    this.title = entry[0];
    this.status = entry[1];
    this.image = entry[2];
    this.description = entry[3];
}

Entry.prototype.displayEntry = function(container) {
    const entry = document.createElement("div");
    entry.classList.add("entry");

    const entryImage = document.createElement("img");
    entryImage.classList.add("entry-image");
    entryImage.src = this.image;
    entryImage.alt = this.title;

    const entryStatus = document.createElement("i");
    entryStatus.classList.add("entry-status", "fa-solid");
    switch (this.status) {
        case "Completed": {
            entryStatus.classList.add("fa-square-check");
            break;
        }
        case "Reading": {
            entryStatus.classList.add("fa-square-minus");
            break;
        }
        case "Dropped": {
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
window.addEventListener("load", () => {
    document.addEventListener("contextmenu", event => event.preventDefault());

    const entries = [
        ["The World After the Fall", "https://meo.comick.pictures/vo82y.jpg", "dropped", ""],
        ["Omniscient Reader's Viewpoint", "https://meo.comick.pictures/qv5oqL.jpg", "reading", ""],
        ["Solo Leveling", "https://meo.comick.pictures/zevXM.jpg", "completed", ""],
    ];

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

        let entry = [];
        const formData = new FormData(entryForm);
        for (const data of formData.entries()) {
            entry.push(data[1]);
        }

        const libraryEntry = new Entry(entry);
        entryForm.reset();
        modalForm.close();
    });
});

function Entry(data) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Entry constructor.`);
    }

    if (data instanceof FormData) {
        this.title = formData.get("title");
        this.image = formData.get("image");
        this.status = formData.get("status");
        this.description = formData.get("description");    
    } else if (typeof data === "object") {
        this.title = data[0];
        this.image = data[1];
        this.status = data[2];
        this.description = data[3];
    }

    this.displayEntry();
}

Entry.prototype.displayEntry = function() {
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
        if (response.ok) return response.blob();
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
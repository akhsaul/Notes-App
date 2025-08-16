class NoteModal extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <dialog id="note_modal" class="modal">
        <div class="modal-box w-11/12 max-w-3xl">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div id="modal-content"></div>
        </div>
      </dialog>
    `;
    this.modal = this.querySelector("#note_modal");
    this.modalContent = this.querySelector("#modal-content");
  }

  show(note) {
    const formattedDate = new Date(note.createdAt).toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "medium",
    });

    this.modalContent.innerHTML = `
      <h3 class="font-bold text-3xl mb-2">${note.title}</h3>
      <p class="text-sm text-base-content text-opacity-60 mb-6">${formattedDate}</p>
      <div class="prose max-w-none">
        <p>${note.body.replace(/\n/g, "<br>")}</p>
      </div>
      <div class="modal-action mt-6">
        <button class="btn btn-soft btn-error" id="delete-btn" data-id="${
          note.id
        }">Delete</button>
        <button class="btn btn-soft btn-primary" id="archive-btn" data-id="${
          note.id
        }" data-archived="${note.archived}">
          ${note.archived ? "Move to Active" : "Archive"}
        </button>
        <form method="dialog">
          <button class="btn btn-soft btn-secondary">Close</button>
        </form>
      </div>
    `;

    this.modal.showModal();

    // Attach event listeners after content is created
    this.querySelector("#delete-btn").addEventListener("click", (e) => {
      this.dispatchEvent(
        new CustomEvent("delete-note", {
          detail: { id: e.target.dataset.id },
          bubbles: true,
        })
      );
      this.modal.close();
    });

    this.querySelector("#archive-btn").addEventListener("click", (e) => {
      const eventName =
        e.target.dataset.archived === "true"
          ? "unarchive-note"
          : "archive-note";
      this.dispatchEvent(
        new CustomEvent(eventName, {
          detail: { id: e.target.dataset.id },
          bubbles: true,
        })
      );
      this.modal.close();
    });
  }
}

customElements.define("note-modal", NoteModal);

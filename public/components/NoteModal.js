class NoteModal extends HTMLElement {
  static observedAttributes = [
    'note-id',
    'title',
    'body',
    'created-at',
    'archived',
  ];

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <dialog id="note_modal" class="modal">
      <div class="modal-box w-11/12 max-w-3xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div id="modal-content">
          <h3 id="note-title" class="font-bold text-3xl mb-2"></h3>
          <p id="note-created-at" class="text-sm text-base-content text-opacity-60 mb-6"></p>
          <div class="prose max-w-none">
            <textarea id="note-body" class="textarea-ghost w-full bg-base-100 p-0" disabled readonly></textarea>
          </div>
          <div class="modal-action mt-6">
            <button class="btn btn-soft btn-error" id="delete-btn">Delete</button>
            <button class="btn btn-soft btn-primary" id="archive-btn"></button>
            <form method="dialog">
              <button class="btn btn-soft btn-secondary">Close</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
    `;
    this.modal = this.querySelector('#note_modal');
    this.elementTitle = this.querySelector('#note-title');
    this.elementCreatedAt = this.querySelector('#note-created-at');
    this.elementBody = this.querySelector('#note-body');
    this.elementDeleteBtn = this.querySelector('#delete-btn');
    this.elementArchiveBtn = this.querySelector('#archive-btn');

    // Attach event listeners after content is created
    this.querySelector('#delete-btn').addEventListener('click', (e) => {
      this.dispatchEvent(
        new CustomEvent('delete-note', {
          detail: { id: e.target.dataset.id },
          bubbles: true,
        })
      );
      this.modal.close();
    });

    this.querySelector('#archive-btn').addEventListener('click', (e) => {
      const eventName =
        e.target.dataset.archived === 'true'
          ? 'unarchive-note'
          : 'archive-note';
      this.dispatchEvent(
        new CustomEvent(eventName, {
          detail: { id: e.target.dataset.id },
          bubbles: true,
        })
      );
      this.modal.close();
    });
  }

  attributeChangedCallback() {
    const noteId = this.getAttribute('note-id');
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const createdAt = this.getAttribute('created-at');
    const archivedOrNull = this.getAttribute('archived');

    if (!noteId || !title || !body || !createdAt || !archivedOrNull) {
      return;
    }

    const archived = this.getAttribute('archived') === 'true';
    const formattedDate = new Date(createdAt).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    this.elementTitle.textContent = title;
    this.elementCreatedAt.textContent = formattedDate;
    this.elementBody.textContent = body;
    this.elementDeleteBtn.dataset.id = noteId;
    this.elementArchiveBtn.dataset.id = noteId;
    this.elementArchiveBtn.dataset.archived = archived;
    this.elementArchiveBtn.textContent = archived
      ? 'Move to Active'
      : 'Archive';
  }

  show() {
    this.modal.showModal();
    this.autosizeTextarea();
  }

  autosizeTextarea() {
    // Temporarily reset height to calculate the true scroll height
    this.elementBody.style.height = 'auto';
    this.elementBody.style.height = `${this.elementBody.scrollHeight}px`;
  }
}

customElements.define('note-modal', NoteModal);

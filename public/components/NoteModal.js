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
          <div id="modal-content"></div>
        </div>
      </dialog>
    `;
    this.modal = this.querySelector('#note_modal');
    this.modalContent = this.querySelector('#modal-content');
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const noteId = this.getAttribute('note-id');
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const createdAt = this.getAttribute('created-at');
    const archivedOrNull = this.getAttribute('archived');

    if (!noteId || !title || !body || !createdAt || !archivedOrNull) {
      this.modalContent.innerHTML = '';
      return;
    }

    const archived = this.getAttribute('archived') === 'true';
    const formattedDate = new Date(createdAt).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    this.modalContent.innerHTML = `
      <h3 class="font-bold text-3xl mb-2">${title}</h3>
      <p class="text-sm text-base-content text-opacity-60 mb-6">${formattedDate}</p>
      <div class="prose max-w-none">
         <textarea id="note-body-textarea" class="textarea-ghost w-full bg-base-100 p-0" disabled readonly>${body}</textarea>
      </div>
      <div class="modal-action mt-6">
        <button class="btn btn-soft btn-error" id="delete-btn" data-id="${noteId}">Delete</button>
        <button class="btn btn-soft btn-primary" id="archive-btn" data-id="${noteId}" data-archived="${archived}">
          ${archived ? 'Move to Active' : 'Archive'}
        </button>
        <form method="dialog">
          <button class="btn btn-soft btn-secondary">Close</button>
        </form>
      </div>
    `;
  }

  show() {
    this.modal.showModal();
    this.autosizeTextarea();

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

  autosizeTextarea() {
    const textarea = this.querySelector('#note-body-textarea');
    // Temporarily reset height to calculate the true scroll height
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

customElements.define('note-modal', NoteModal);

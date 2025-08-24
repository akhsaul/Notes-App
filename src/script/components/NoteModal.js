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
    this.btnDeleteAnimation = undefined;
  }

  connectedCallback() {
    // make it easy to change the identifier
    const modalId = 'note_modal';
    const titleId = 'note-title';
    const createdAtId = 'note-created-at';
    const bodyId = 'note-body';
    const deleteBtnId = 'delete-btn';
    const archiveBtnId = 'archive-btn';
    const closeBtnId = 'close-btn';

    this.innerHTML = `
    <dialog id="${modalId}" class="modal"><div class="modal-box w-11/12 max-w-3xl">
    <button class="${closeBtnId} btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    <div id="modal-content"><h3 id="${titleId}" class="font-bold text-3xl mb-2"></h3>
    <p id="${createdAtId}" class="text-sm text-base-content text-opacity-60 mb-6"></p>
    <div class="prose max-w-none"><textarea id="${bodyId}" class="textarea-ghost w-full bg-base-100 p-0"
    disabled readonly></textarea></div><div class="modal-action mt-6"><button id="${deleteBtnId}" 
    class="btn btn-outline btn-error">Delete</button><button class="btn btn-soft btn-primary" id="${archiveBtnId}">
    </button><button class="${closeBtnId} btn btn-soft btn-secondary">Close</button></div></div></div></dialog>
    `;
    this.modal = this.querySelector(`#${modalId}`);
    this.elementTitle = this.querySelector(`#${titleId}`);
    this.elementCreatedAt = this.querySelector(`#${createdAtId}`);
    this.elementBody = this.querySelector(`#${bodyId}`);
    this.elementDeleteBtn = this.querySelector(`#${deleteBtnId}`);
    this.elementArchiveBtn = this.querySelector(`#${archiveBtnId}`);
    this.listElementCloseBtn = this.querySelectorAll(`.${closeBtnId}`);

    // Attach event listeners after content is created
    this.elementDeleteBtn.addEventListener('delete-confirmed', (e) => {
      this.modalAnimation.close(() => {
        this.dispatchEvent(
          new CustomEvent('delete-note', {
            detail: { id: e.target.dataset.id },
            bubbles: true,
          })
        );
      });
    });

    this.elementArchiveBtn.addEventListener('click', (e) => {
      this.modalAnimation.close(() => {
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
      });
    });

    this.listElementCloseBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.modalAnimation.close();
      });
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
    this.modalAnimation.open();
    this.autosizeTextarea();
  }

  autosizeTextarea() {
    // Temporarily reset height to calculate the true scroll height
    this.elementBody.style.height = 'auto';
    this.elementBody.style.height = `${this.elementBody.scrollHeight}px`;
  }

  setDeleteAnimation(animation) {
    this.btnDeleteAnimation = animation;
    // create a tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.dataset.tip = 'Hold 3s to Delete';

    // append the tooltip first
    this.elementDeleteBtn.before(tooltip);
    // append a new delete button
    tooltip.innerHTML = this.elementDeleteBtn.outerHTML;
    // remove old button
    this.elementDeleteBtn.remove();
    // renew reference
    this.elementDeleteBtn = tooltip.firstChild;

    this.btnDeleteAnimation
      .setButton(this.elementDeleteBtn)
      .setStartText('Delete')
      .setProcessingText('Deleting...')
      .setHoldDuration(3000)
      .apply();
  }
  setModalAnimation(animation) {
    animation.setModal(this.modal);
    this.modalAnimation = animation;
  }
}

customElements.define('note-modal', NoteModal);

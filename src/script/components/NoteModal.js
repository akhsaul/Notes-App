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
    this.modalAnimation = undefined;
  }

  connectedCallback() {
    this.innerHTML = `
      <div id="modal-overlay" class="modal-overlay">
        <div id="note_modal" class="modal-box w-11/12 max-w-3xl">
          <form method="dialog">
            <button id="close-btn-icon" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div id="modal-content">
            <h3 id="note-title" class="font-bold text-3xl mb-2"></h3>
            <p id="note-created-at" class="text-sm text-base-content text-opacity-60 mb-6"></p>
            <div class="prose max-w-none">
              <textarea id="note-body" class="textarea-ghost w-full bg-base-100 p-0" disabled readonly></textarea>
            </div>
            <div class="modal-action mt-6">
              <button class="btn btn-outline btn-error" id="delete-btn">Delete</button>
              <button class="btn btn-soft btn-primary" id="archive-btn"></button>
              <button id="close-btn-secondary" class="btn btn-soft btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.modalOverlay = this.querySelector('#modal-overlay');
    this.modal = this.querySelector('#note_modal');
    this.modalContent = this.querySelector('#modal-content');

    this.elementTitle = this.querySelector('#note-title');
    this.elementCreatedAt = this.querySelector('#note-created-at');
    this.elementBody = this.querySelector('#note-body');
    this.elementDeleteBtn = this.querySelector('#delete-btn');
    this.elementArchiveBtn = this.querySelector('#archive-btn');
    this.elementCloseBtnIcon = this.querySelector('#close-btn-icon');
    this.elementCloseBtnSecondary = this.querySelector('#close-btn-secondary');

    // Attach event listeners after content is created
    this.elementDeleteBtn.addEventListener('confirm', (e) => {
      this.dispatchEvent(
        new CustomEvent('delete-note', {
          detail: { id: this.elementDeleteBtn.dataset.id },
          bubbles: true,
        })
      );
      this.close();
    });

    this.elementArchiveBtn.addEventListener('click', (e) => {
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
      this.close();
    });

    [
      this.elementCloseBtnIcon,
      this.elementCloseBtnSecondary,
      this.modalOverlay,
    ].forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) {
          this.close();
        } else if (el !== this.modalOverlay) {
          this.close();
        }
      });
    });

    this.modal.addEventListener('click', (e) => {
      e.stopPropagation();
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

  close() {
    this.modalAnimation.close();
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
    animation.setOverlay(this.modalOverlay).setModal(this.modal);
    this.modalAnimation = animation;
  }
}

customElements.define('note-modal', NoteModal);

class NoteItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add(
      'card',
      'bg-base-100',
      'shadow-xl',
      'transition-transform',
      'transform',
      'hover:-translate-y-1',
      'cursor-pointer',
      'card-border'
    );
    this.render();
  }

  render() {
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const createdAt = this.getAttribute('created-at');
    const noteId = this.getAttribute('note-id');

    this.dataset.noteId = noteId;

    if (!title || !noteId) {
      this.innerHTML = '';
      return;
    }

    const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    this.innerHTML = `
      <div class="card-body p-6 flex flex-col">
        <h2 class="card-title note-title-truncate">${title}</h2>
        <p class="text-sm text-base-content text-opacity-60 grow-0">${formattedDate}</p>
        <p class="note-body-truncate">${body}</p>
      </div>
    `;
  }
}

customElements.define('note-item', NoteItem);

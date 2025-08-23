class NoteList extends HTMLElement {
  constructor() {
    super();
    this.notes = [];
    this.noteModalElement = undefined;
    this.animation = undefined;
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      const card = e.target.closest('[data-note-id]');
      if (card) {
        const note = this.notes.find((n) => n.id === card.dataset.noteId);
        if (this.noteModalElement && note) {
          this.noteModalElement.setAttribute('note-id', note.id);
          this.noteModalElement.setAttribute('title', note.title);
          this.noteModalElement.setAttribute('body', note.body);
          this.noteModalElement.setAttribute('created-at', note.createdAt);
          this.noteModalElement.setAttribute('archived', note.archived);
          this.noteModalElement.show();
        } else {
          console.warn('Note modal element is not set.');
        }
      }
    });
  }

  _renderNotes() {
    this.innerHTML = '';

    if (!this.notes.length) {
      this.removeAttribute('class');
      this.innerHTML = `<p class="text-center text-lg py-10">No notes found.</p>`;
      return;
    }

    this.classList.add(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-3',
      'gap-6'
    );

    const notesElements = [];

    this.notes.forEach((note) => {
      const formattedDate = new Date(note.createdAt).toLocaleDateString(
        undefined,
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );

      const card = document.createElement('div');
      card.className =
        'card bg-base-100 shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer card-border';
      card.dataset.noteId = note.id;
      card.style.opacity = 0;
      card.innerHTML = `
        <div class="card-body p-6 flex flex-col">
            <h2 class="card-title note-title-truncate">${note.title}</h2>
            <p class="text-sm text-base-content text-opacity-60 grow-0">${formattedDate}</p>
            <p class="note-body-truncate">${note.body}</p>
        </div>
    `;
      this.appendChild(card);
      notesElements.push(card);
    });

    if (this.animation) {
      this.animation.add(notesElements);
    } else {
      this.querySelectorAll('.card').forEach(
        (card) => (card.style.opacity = 1)
      );
    }
  }

  setNoteList(notes) {
    this.notes = notes;
    this._renderNotes();
  }

  setNoteModal(element) {
    this.noteModalElement = element;
  }

  setAnimation(animation) {
    this.animation = animation;
  }
}

customElements.define('note-list', NoteList);

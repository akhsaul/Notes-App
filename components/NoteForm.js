class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form id="note-form" class="flex flex-col gap-4">
            <div>
              <input 
                type="text" 
                id="note-title" 
                placeholder="Title" 
                class="input"
                required 
              />
              <span id="title-error" class="text-error text-sm mt-1 hidden">Title is required.</span>
            </div>
            <div>
              <textarea 
                id="note-body" 
                placeholder="Take a note..." 
                class="textarea textarea-bordered w-full" 
                rows="4" 
                required
              ></textarea>
              <span id="body-error" class="text-error text-sm mt-1 hidden">Note body is required.</span>
            </div>
            <div class="card-actions justify-end">
              <button type="submit" class="btn btn-primary">
                Add Note
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.titleInput = this.querySelector('#note-title');
    this.bodyInput = this.querySelector('#note-body');
    this.titleError = this.querySelector('#title-error');
    this.bodyError = this.querySelector('#body-error');
    this.form = this.querySelector('#note-form');
  }

  connectedCallback() {
    this.titleInput.addEventListener('input', () => this.validateTitle());
    this.bodyInput.addEventListener('input', () => this.validateBody());
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isTitleValid = this.validateTitle();
      const isBodyValid = this.validateBody();
      if (isTitleValid && isBodyValid) {
        const newNote = {
          id: `notes-${+new Date()}`,
          title: this.titleInput.value,
          body: this.bodyInput.value,
          createdAt: new Date().toISOString(),
          archived: false,
        };
        this.dispatchEvent(new CustomEvent('note-added', { detail: newNote, bubbles: true }));
        this.form.reset();
      }
    });
  }

  validateTitle() {
    if (this.titleInput.value.trim() === '') {
      this.titleError.classList.remove('hidden');
      this.titleInput.classList.add('input-error');
      return false;
    } else {
      this.titleError.classList.add('hidden');
      this.titleInput.classList.remove('input-error');
      return true;
    }
  }

  validateBody() {
    if (this.bodyInput.value.trim() === '') {
      this.bodyError.classList.remove('hidden');
      this.bodyInput.classList.add('textarea-error');
      return false;
    } else {
      this.bodyError.classList.add('hidden');
      this.bodyInput.classList.remove('textarea-error');
      return true;
    }
  }
}

customElements.define('note-form', NoteForm);

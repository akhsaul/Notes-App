class NoteForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <fieldset class="fieldset">
          <form id="note-form" class="flex flex-col gap-4" autocomplete="off" novalidate>
            <label class="label" for="note-title">
              <span class="label-text">Title</span>
            </label>
            <input
              type="text"
              id="note-title"
              placeholder="Title"
              class="input input-bordered w-full"
              required
              minlength="6"
              aria-describedby="title-error"
            />
            <span id="title-error" class="text-sm mt-1" aria-live="polite"></span>

            <label class="label" for="note-body">
              <span class="label-text">Note</span>
            </label>
            <textarea
              id="note-body"
              placeholder="Take a note..."
              class="textarea textarea-bordered w-full"
              rows="4"
              required
              minlength="6"
              aria-describedby="body-error"
            ></textarea>
            <span id="body-error" class="text-sm mt-1" aria-live="polite"></span>

            <div class="card-actions justify-end">
              <button type="submit" class="btn btn-primary">Add Note</button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
    `;

    this.titleInput = this.querySelector('#note-title');
    this.bodyInput = this.querySelector('#note-body');
    this.form = this.querySelector('#note-form');

    this.titleInput.addEventListener('input', (e) => {
      this.validationTitleHandler(e, this.titleInput);
      this.attachValidatorMessage(e);
    });

    this.bodyInput.addEventListener('input', (e) => {
      this.validationBodyHandler(e, this.bodyInput);
      this.attachValidatorMessage(e);
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isTitleValid = this.titleInput.checkValidity();
      const isBodyValid = this.bodyInput.checkValidity();

      if (isTitleValid && isBodyValid) {
        const newNote = {
          title: this.titleInput.value,
          body: this.bodyInput.value,
        };
        this.dispatchEvent(
          new CustomEvent('note-added', { detail: newNote, bubbles: true })
        );
        this.form.reset();
        this.titleInput.classList.remove('input-success');
        this.bodyInput.classList.remove('textarea-success');
      }
    });
  }

  attachValidatorMessage(event) {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = '';
    }
  }

  /**
   *
   * @param {Event} event
   * @returns
   */
  validationTitleHandler(event, inputElement) {
    event.target.setCustomValidity('');

    if (event.target.validity.valid) {
      inputElement.classList.remove('input-error');
      inputElement.classList.add('input-success');
    } else {
      inputElement.classList.remove('input-success');
      inputElement.classList.add('input-error');
    }

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Wajib diisi.');
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity('Minimal panjang adalah enam huruf.');
      return;
    }
  }

  /**
   *
   * @param {Event} event
   * @returns
   */
  validationBodyHandler(event, inputElement) {
    event.target.setCustomValidity('');

    if (event.target.validity.valid) {
      inputElement.classList.remove('textarea-error');
      inputElement.classList.add('textarea-success');
    } else {
      inputElement.classList.remove('textarea-success');
      inputElement.classList.add('textarea-error');
    }

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Wajib diisi.');
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity('Minimal panjang adalah enam huruf.');
      return;
    }
  }
}

customElements.define('note-form', NoteForm);

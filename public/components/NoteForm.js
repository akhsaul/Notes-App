class NoteForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <fieldset class="fieldset">
          <form id="note-form" class="flex flex-col gap-4">
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
            <span id="title-error" class="text-error text-sm mt-1" aria-live="polite"></span>

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
            <span id="body-error" class="text-error text-sm mt-1" aria-live="polite"></span>

            <div class="card-actions justify-end">
              <button type="submit" class="btn btn-primary">Add Note</button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
    `;

    this.titleInput = this.querySelector("#note-title");
    this.bodyInput = this.querySelector("#note-body");
    this.titleError = this.querySelector("#title-error");
    this.bodyError = this.querySelector("#body-error");
    this.form = this.querySelector("#note-form");

    this.titleInput.addEventListener("change", (e) => {
      this.validationTitleHandler(e);
    });
    this.titleInput.addEventListener("invalid", (e) => {
      this.validationTitleHandler(e);
    });
    this.titleInput.addEventListener("blur", this.attachValidatorMessage);
    this.titleInput.addEventListener("input", this.attachValidatorMessage);

    this.bodyInput.addEventListener("change", (e) => {
      this.validationBodyHandler;
    });
    this.bodyInput.addEventListener("invalid", (e) => {
      this.validationBodyHandler;
    });
    this.bodyInput.addEventListener("blur", this.attachValidatorMessage);
    this.bodyInput.addEventListener("input", this.attachValidatorMessage);

    this.form.addEventListener("submit", (e) => {
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
        this.dispatchEvent(
          new CustomEvent("note-added", { detail: newNote, bubbles: true })
        );
        this.form.reset();
      }
    });
  }

  attachValidatorMessage(event) {
    // Validate the field
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = "";
    }
  }

  /**
   *
   * @param {Event} event
   * @returns
   */
  validationTitleHandler(event) {
    event.target.setCustomValidity("");

    if (event.target.validity.valid) {
      this.titleInput.classList.remove("input-error");
      this.titleInput.classList.add("input-success");
    } else {
      this.titleInput.classList.remove("input-success");
      this.titleInput.classList.add("input-error");
    }

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Wajib diisi.");
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity("Minimal panjang adalah enam karakter.");
      return;
    }
  }

  /**
   *
   * @param {Event} event
   * @returns
   */
  validationBodyHandler(event) {
    event.target.setCustomValidity("");

    if (event.target.validity.valid) {
      this.bodyInput.classList.remove("textarea-error");
      this.titleInput.classList.add("textarea-success");
    } else {
      this.titleInput.classList.remove("textarea-success");
      this.bodyInput.classList.add("textarea-error");
    }

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Wajib diisi.");
      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity("Minimal panjang adalah enam karakter.");
      return;
    }
  }
}

customElements.define("note-form", NoteForm);

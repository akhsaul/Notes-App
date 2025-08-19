class ErrorModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <dialog id="error_modal" class="modal">
        <div class="modal-box text-center justify-items-center w-fit prose">
          <span class="loading error-icon text-error"></span>
          <h2 class="error-message text-error text-justify mt-1 mb-1"></h2>
          <p class="auto-close-message italic"></p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-soft btn-primary">OK</button>
            </form>
          </div>
        </div>
      </dialog>
    `;

    this.dialog = this.querySelector('#error_modal');
    this.errorMessage = this.querySelector('.error-message');
    this.autoCloseMessage = this.querySelector('.auto-close-message');
    this.dialog.addEventListener('close', () => {
      clearInterval(this.countdown);
    });
  }

  open(message) {
    this.errorMessage.textContent = message;
    let seconds = 5;
    this.autoCloseMessage.textContent = `Automatic close in ${seconds} seconds`;
    this.dialog.showModal();

    this.countdown = setInterval(() => {
      seconds--;
      this.autoCloseMessage.textContent = `Automatic close in ${seconds} seconds`;
      if (seconds <= 0) {
        this.dialog.close();
      }
    }, 1000);
  }
}

customElements.define('error-modal', ErrorModal);

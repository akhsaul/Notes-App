class SuccessModal extends HTMLElement {
  constructor() {
    super();
    this.countdown = undefined;
    this.onClose = undefined;
  }

  connectedCallback() {
    this.innerHTML = `
      <dialog id="success_modal" class="modal">
        <div class="modal-box text-center justify-items-center w-fit prose">
          <span class="loading success-icon text-success"></span>
          <h2 class="success-message text-success text-justify mt-1 mb-1"></h2>
          <p class="auto-close-message italic"></p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-soft btn-primary">OK</button>
            </form>
          </div>
        </div>
      </dialog>
    `;

    this.dialog = this.querySelector('#success_modal');
    this.successMessage = this.querySelector('.success-message');
    this.autoCloseMessage = this.querySelector('.auto-close-message');
    this.dialog.addEventListener('close', () => {
      clearInterval(this.countdown);
      this.countdown = undefined;
      if (this.onClose) {
        this.onClose();
      }
    });
  }

  open(message, onClose = undefined) {
    this.onClose = onClose;

    this.successMessage.textContent = message;
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

customElements.define('success-modal', SuccessModal);

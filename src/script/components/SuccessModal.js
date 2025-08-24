class SuccessModal extends HTMLElement {
  constructor() {
    super();
    this.countdown = undefined;
    this.onClose = undefined;
  }

  connectedCallback() {
    const modalId = 'success_modal';
    const messageId = 'success_message';
    const autoCloseMessageId = 'auto_close_message';

    this.innerHTML = `<dialog id="${modalId}" class="modal"><div class="modal-box text-center w-fit prose
    justify-items-center"><span class="loading success-icon text-success"></span><h2 class="${messageId} mb-1
    text-success text-justify mt-1"></h2><p class="${autoCloseMessageId} italic"></p><div class="modal-action">
    <form method="dialog"><button class="btn btn-soft btn-primary">OK</button></form></div></div></dialog>`;

    this.dialog = this.querySelector(`#${modalId}`);
    this.successMessage = this.querySelector(`.${messageId}`);
    this.autoCloseMessage = this.querySelector(`.${autoCloseMessageId}`);
    
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

class Toast extends HTMLElement {
  static observedAttributes = ['offset-top'];
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('toast', 'toast-top', 'toast-center');
  }

  attributeChangedCallback() {
    const offsetTop = this.getAttribute('offset-top');
    if (offsetTop) {
      this.style.setProperty('margin-top', offsetTop);
    }
  }

  _add(message, type) {
    const alertDiv = document.createElement('div');

    if (type === 'success') {
      alertDiv.className = 'alert alert-success';
    } else if (type === 'error') {
      alertDiv.className = 'alert alert-error';
    } else {
      throw new Error(`Invalid type: ${type}`);
    }

    alertDiv.innerHTML = `<span>${message}</span>`;
    this.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  showSuccess(message) {
    this._add(message, 'success');
  }

  showError(message) {
    this._add(message, 'error');
  }
}

customElements.define('my-toast', Toast);

class AppFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const author = 'Ikhsan Maulana';
    const githubUrl = 'https://github.com/akhsaul';
    const linkedinUrl = 'https://linkedin.com/in/ikhsanmaulana29';

    this.innerHTML = `<footer class="footer footer-horizontal footer-center p-10 bg-base-100 text-base-content
    rounded"><nav class="grid-flow-col grid gap-4"><p class="font-bold text-lg">${author}</p></nav><nav>
    <div class="grid grid-flow-col gap-4"><a target="_blank" href="${githubUrl}" class="link link-hover icon
    github-icon"></a><a class="link link-hover icon linkedin-icon" target="_blank" href="${linkedinUrl}"></a>
    </div></nav><aside><p>Copyright © 2025 - All right reserved</p></aside></footer>`;
  }
}

customElements.define('app-footer', AppFooter);

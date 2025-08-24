class AppBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const controllerId = 'theme-controller';
    const themeDark = 'coffee';
    const themeLight = 'caramellatte';

    this.innerHTML = `<div class="sticky top-0 z-50 bg-base-100 shadow-lg"><div class="navbar max-w-7xl px-4
    mx-auto md:px-8 sm:px-6 "><div class="navbar-start"><a class="text-2xl text-primary hover:opacity-80 
    font-bold transition-opacity" href="/">NotesApp</a></div><div class="navbar-end"><label class="flex gap-2
    cursor-pointer"><i class="icon light-icon"></i><input type="checkbox" class="toggle theme-controller"
    id="${controllerId}" value="${themeDark}"/><i class="icon dark-icon"></i></label></div></div>`;
    const themeController = this.querySelector(`#${controllerId}`);
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || themeLight;
    htmlElement.setAttribute('data-theme', savedTheme);
    themeController.checked = savedTheme === themeDark;

    themeController.addEventListener('change', (e) => {
      const theme = e.target.checked ? themeDark : themeLight;
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }
}

customElements.define('app-bar', AppBar);

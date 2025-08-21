class AppBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="sticky top-0 z-50 bg-base-100 shadow-lg">
        <div class="navbar max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div class="navbar-start">
            <a href="/" class="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">NotesApp</a>
          </div>
          <div class="navbar-end">
            <label class="flex cursor-pointer gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              <input type="checkbox" value="coffee" class="toggle theme-controller" name="theme-controller"/>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </label>
        </div>
      </div>
    `;
    const themeController = this.querySelector('.theme-controller');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'caramellatte';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeController.checked = savedTheme === 'coffee';

    themeController.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'coffee' : 'caramellatte';
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }
}

customElements.define('app-bar', AppBar);

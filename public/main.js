import "./components/AppBar.js";
import "./components/AppFooter.js";
import "./components/NoteForm.js";
import "./components/NoteItem.js";
import "./components/NoteModal.js";
import { loadNotes, saveNotes } from "./data/data-manager.js";

document.addEventListener("DOMContentLoaded", () => {
  function getItemsPerPage() {
    if (window.innerWidth >= 1024) {
      return 9; // lg
    } else if (window.innerWidth >= 768) {
      return 6; // md
    } else {
      return 3; // sm and smaller
    }
  }
  let itemsPerPage = getItemsPerPage()

  const appState = {
    notes: loadNotes(),
    activeTab: "active",
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "newest",
    currentPage: 1,
  };

  const notesListElement = document.getElementById("notes-list");
  const noteModalElement = document.querySelector("note-modal");
  const searchInput = document.getElementById("search-input");
  const dateFromInput = document.getElementById("date-from");
  const dateToInput = document.getElementById("date-to");
  const sortSelect = document.getElementById("sort-by");
  const tabs = document.querySelectorAll("[data-tab]");
  const noNotesMessage = document.getElementById("no-notes-message");
  const paginationContainer = document.getElementById("pagination-container");

  function renderApp() {
    let filteredNotes = appState.notes;
    const searchTerm = appState.searchTerm.trim().toLowerCase();
    if (searchTerm) {
      filteredNotes = filteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.body.toLowerCase().includes(searchTerm)
      );
    }
    if (appState.dateFrom) {
      filteredNotes = filteredNotes.filter(
        (note) => new Date(note.createdAt) >= new Date(appState.dateFrom)
      );
    }
    if (appState.dateTo) {
      const toDate = new Date(appState.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filteredNotes = filteredNotes.filter(
        (note) => new Date(note.createdAt) <= toDate
      );
    }

    updateTabCounts(filteredNotes);

    const isArchivedTab = appState.activeTab === "archived";
    let notesForDisplay = filteredNotes.filter(
      (note) => note.archived === isArchivedTab
    );

    notesForDisplay.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return appState.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    renderPagination(notesForDisplay.length);

    const startIndex = (appState.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedNotes = notesForDisplay.slice(startIndex, endIndex);

    renderNotes(paginatedNotes);
  }

  function updateTabCounts(filteredNotes) {
    const activeCount = filteredNotes.filter((n) => !n.archived).length;
    const archivedCount = filteredNotes.filter((n) => n.archived).length;
    const isFilterActive =
      appState.searchTerm.trim() || appState.dateFrom || appState.dateTo;
    tabs.forEach((tab) => {
      const badge = tab.querySelector(".badge");
      const tabType = tab.dataset.tab;
      const count = tabType === "active" ? activeCount : archivedCount;
      if (isFilterActive) {
        badge.textContent = count;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });
  }

  function renderNotes(notes) {
    notesListElement.innerHTML = "";
    if (notes.length === 0) {
      noNotesMessage.classList.remove("hidden");
    } else {
      noNotesMessage.classList.add("hidden");
      notes.forEach((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.setAttribute("note-id", note.id);
        noteItem.setAttribute("title", note.title);
        noteItem.setAttribute("body", note.body);
        noteItem.setAttribute("created-at", note.createdAt);
        notesListElement.appendChild(noteItem);
      });
    }
  }

  function renderPagination(totalNotes) {
    const totalPages = Math.ceil(totalNotes / itemsPerPage);
    paginationContainer.innerHTML = "";
    if (totalPages > 1) {
      const join = document.createElement("div");
      join.className = "join";
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("input");
        pageButton.type = "radio";
        pageButton.name = "options";
        pageButton.ariaLabel = i;
        pageButton.checked = i === appState.currentPage;
        pageButton.className = "join-item btn btn-square";
        pageButton.dataset.page = i;
        join.appendChild(pageButton);
      }
      paginationContainer.appendChild(join);
    }
  }

  function handleFilterChange() {
    appState.currentPage = 1;
    renderApp();
  }

  // --- Event Listeners ---
  searchInput.addEventListener("input", (e) => {
    appState.searchTerm = e.target.value;
    handleFilterChange();
  });
  dateFromInput.addEventListener("change", (e) => {
    appState.dateFrom = e.target.value;
    handleFilterChange();
  });
  dateToInput.addEventListener("change", (e) => {
    appState.dateTo = e.target.value;
    handleFilterChange();
  });
  sortSelect.addEventListener("change", (e) => {
    appState.sortBy = e.target.value;
    handleFilterChange();
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const clickedTab = e.currentTarget;
      tabs.forEach((t) => t.classList.remove("tab-active"));
      clickedTab.classList.add("tab-active");
      appState.activeTab = clickedTab.dataset.tab;
      handleFilterChange();
    });
  });

  paginationContainer.addEventListener("click", (e) => {
    if (e.target.matches("[data-page]")) {
      appState.currentPage = parseInt(e.target.dataset.page, 10);
      renderApp();
    }
  });

  document.addEventListener("note-added", (e) => {
    const newNote = { ...e.detail, createdAt: new Date().toISOString() };
    appState.notes.unshift(newNote);
    saveNotes(appState.notes);
    renderApp();
  });
  notesListElement.addEventListener("click", (e) => {
    const card = e.target.closest("[data-note-id]");
    if (card) {
      const note = appState.notes.find((n) => n.id === card.dataset.noteId);
      if (note) noteModalElement.show(note);
    }
  });
  document.addEventListener("delete-note", (e) => {
    appState.notes = appState.notes.filter((n) => n.id !== e.detail.id);
    saveNotes(appState.notes);
    handleFilterChange();
  });
  document.addEventListener("archive-note", (e) => {
    const note = appState.notes.find((n) => n.id === e.detail.id);
    if (note) note.archived = true;
    saveNotes(appState.notes);
    handleFilterChange();
  });
  document.addEventListener("unarchive-note", (e) => {
    const note = appState.notes.find((n) => n.id === e.detail.id);
    if (note) note.archived = false;
    saveNotes(appState.notes);
    handleFilterChange();
  });

  window.addEventListener("resize", () => {
    const newItemsPerPage = getItemsPerPage();
    if (newItemsPerPage !== itemsPerPage) {
      itemsPerPage = newItemsPerPage;
      handleFilterChange();
    }
  });

  renderApp();
});

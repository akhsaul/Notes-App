import './components/AppBar.js';
import './components/AppFooter.js';
import './components/NoteForm.js';
import './components/NoteItem.js';
import './components/NoteModal.js';
import './components/ErrorModal.js';
import './components/Toast.js';
import './components/SuccessModal.js';
import { NotesAPI } from './data/data-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  function getItemsPerPage() {
    if (window.innerWidth >= 1024) {
      return 9; // lg
    } else if (window.innerWidth >= 768) {
      return 6; // md
    } else {
      return 3; // sm and smaller
    }
  }

  const appState = {
    notes: [],
    activeTab: 'active',
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest',
    currentPage: 1,
    itemsPerPage: getItemsPerPage(),
  };

  const notesListElement = document.getElementById('notes-list');
  const searchInput = document.getElementById('search-input');
  const dateFromInput = document.getElementById('date-from');
  const dateToInput = document.getElementById('date-to');
  const sortSelect = document.getElementById('sort-by');
  const tabs = document.querySelectorAll('[data-tab]');
  const noNotesMessage = document.getElementById('no-notes-message');
  const paginationContainer = document.getElementById('pagination-container');

  const noteModalElement = document.querySelector('note-modal');
  const loadingModal = document.getElementById('loading_modal');
  const errorModal = document.querySelector('error-modal');
  const successModal = document.querySelector('success-modal');

  const appBar = document.querySelector('app-bar');
  const toast = document.querySelector('my-toast');

  function renderApp() {
    let filteredNotes = appState.notes;
    const searchTerm = appState.searchTerm.toLowerCase().trim();
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

    const isArchivedTab = appState.activeTab === 'archived';
    let notesForDisplay = filteredNotes.filter(
      (note) => note.archived === isArchivedTab
    );

    notesForDisplay.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return appState.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    renderPagination(notesForDisplay.length);

    const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
    const endIndex = startIndex + appState.itemsPerPage;
    const paginatedNotes = notesForDisplay.slice(startIndex, endIndex);

    renderNotes(paginatedNotes);
  }

  function updateTabCounts(filteredNotes) {
    const isFilterActive =
      appState.searchTerm.trim() || appState.dateFrom || appState.dateTo;

    tabs.forEach((tab) => {
      const badge = tab.querySelector('.badge');

      if (isFilterActive) {
        const archivedCount = filteredNotes.filter((n) => n.archived).length;
        const activeCount = filteredNotes.length - archivedCount;
        const tabType = tab.dataset.tab;
        const count = tabType === 'active' ? activeCount : archivedCount;
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
  }

  function renderNotes(notes) {
    notesListElement.innerHTML = '';
    if (notes.length === 0) {
      noNotesMessage.classList.remove('hidden');
    } else {
      noNotesMessage.classList.add('hidden');
      notes.forEach((note) => {
        const noteItem = document.createElement('note-item');
        noteItem.setAttribute('note-id', note.id);
        noteItem.setAttribute('title', note.title);
        noteItem.setAttribute('body', note.body);
        noteItem.setAttribute('created-at', note.createdAt);
        notesListElement.appendChild(noteItem);
      });
    }
  }

  function renderPagination(totalNotes) {
    const totalPages = Math.ceil(totalNotes / appState.itemsPerPage);
    paginationContainer.innerHTML = '';
    if (totalPages > 1) {
      const join = document.createElement('div');
      join.className = 'join';
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('input');
        pageButton.type = 'radio';
        pageButton.name = 'options';
        pageButton.ariaLabel = i;
        pageButton.checked = i === appState.currentPage;
        pageButton.className = 'join-item btn btn-square';
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

  // --- Event Listeners for filtering & sorting ---
  searchInput.addEventListener('input', (e) => {
    appState.searchTerm = e.target.value;
    handleFilterChange();
  });
  dateFromInput.addEventListener('change', (e) => {
    appState.dateFrom = e.target.value;
    handleFilterChange();
  });
  dateToInput.addEventListener('change', (e) => {
    appState.dateTo = e.target.value;
    handleFilterChange();
  });
  sortSelect.addEventListener('change', (e) => {
    appState.sortBy = e.target.value;
    handleFilterChange();
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const clickedTab = e.currentTarget;
      tabs.forEach((t) => t.classList.remove('tab-active'));
      clickedTab.classList.add('tab-active');
      appState.activeTab = clickedTab.dataset.tab;
      handleFilterChange();
    });
  });

  paginationContainer.addEventListener('click', (e) => {
    if (e.target.matches('[data-page]')) {
      appState.currentPage = parseInt(e.target.dataset.page, 10);
      renderApp();
    }
  });

  notesListElement.addEventListener('click', (e) => {
    const card = e.target.closest('[data-note-id]');
    if (card) {
      const note = appState.notes.find((n) => n.id === card.dataset.noteId);
      if (note) {
        noteModalElement.setAttribute('note-id', note.id);
        noteModalElement.setAttribute('title', note.title);
        noteModalElement.setAttribute('body', note.body);
        noteModalElement.setAttribute('created-at', note.createdAt);
        noteModalElement.setAttribute('archived', note.archived);
        noteModalElement.show();
      }
    }
  });

  window.addEventListener('resize', () => {
    const newItemsPerPage = getItemsPerPage();
    if (newItemsPerPage !== appState.itemsPerPage) {
      appState.itemsPerPage = newItemsPerPage;
      handleFilterChange();
    }
  });

  async function loadAndRenderAllNotes(archived = undefined) {
    const onSuccess = () => toast.showSuccess('Notes loaded successfully!');
    const onError = (error) =>
      toast.showError(`Error when load notes: ${error.message}`);

    let newNotes = [];
    if (archived === undefined) {
      newNotes = await NotesAPI.getInstance().loadAllNotes(onSuccess, onError);
    } else if (archived) {
      newNotes = await NotesAPI.getInstance().loadArchivedNotes(
        onSuccess,
        onError
      );
    } else {
      newNotes = await NotesAPI.getInstance().loadNotes(onSuccess, onError);
    }
    appState.notes = newNotes;

    renderApp();
  }

  // Custom event
  document.addEventListener('note-added', async (e) => {
    await NotesAPI.getInstance().saveNote(
      e.detail,
      () => {
        successModal.open('Note added successfully!', loadAndRenderAllNotes);
      },
      (error) => {
        errorModal.open(`Error when archiving note: ${error.message}`);
      }
    );
  });
  document.addEventListener('delete-note', async (e) => {
    await NotesAPI.getInstance().deleteNote(
      e.detail.id,
      () => {
        successModal.open('Note deleted successfully!', loadAndRenderAllNotes);
      },
      (error) => {
        errorModal.open(`Error when deleting note: ${error.message}`);
      }
    );
  });
  document.addEventListener('archive-note', async (e) => {
    await NotesAPI.getInstance().archiveNote(
      e.detail.id,
      true,
      () => {
        successModal.open('Note archived successfully!', loadAndRenderAllNotes);
      },
      (error) => {
        errorModal.open(`Error when archiving note: ${error.message}`);
      }
    );
  });
  document.addEventListener('unarchive-note', async (e) => {
    await NotesAPI.getInstance().archiveNote(
      e.detail.id,
      false,
      () => {
        successModal.open(
          'Note unarchived successfully!',
          loadAndRenderAllNotes
        );
      },
      (error) => {
        errorModal.open(`Error when archiving note: ${error.message}`);
      }
    );
  });

  NotesAPI.getInstance().addLoadingListener((isLoading) => {
    if (isLoading) {
      loadingModal.showModal();
    } else {
      loadingModal.close();
    }
  });

  toast.setAttribute('offset-top', `${appBar.offsetHeight}px`);
  loadAndRenderAllNotes();
});

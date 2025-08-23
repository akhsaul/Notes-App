import './styles/styles.css';
import './styles/button-animation.css';
import './styles/modal-animation.css';
import './script/animations/index.js';
import { NotesAPI } from './script/data/data-manager.js';
import {
  CardAnimation,
  ButtonAnimation,
  ModalAnimation,
} from './script/animations/index.js';

/**
 * Inspired by Kotlin Flow.debounce() (Basic concept).
 *
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds.
 *
 * @param {Function} func The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 * @returns {Function} The debounced function.
 */
function debounce(func, delay = 500) {
  let timeoutId;

  return function (...args) {
    // Preserve the 'this' context
    const context = this;
    // Clear the previous timeout if it exists.
    // This is the core of debouncing: if the function is called again
    // before the delay has passed, the previous timer is cancelled.
    clearTimeout(timeoutId);

    // Set a new timeout. The 'func' will only be called if this timeout
    // completes without being cleared by another call to the debounced function.
    timeoutId = setTimeout(() => {
      func.apply(context, args); // Execute the original function
    }, delay);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
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

  const searchInput = document.getElementById('search-input');
  const dateFromInput = document.getElementById('date-from');
  const dateToInput = document.getElementById('date-to');
  const sortSelect = document.getElementById('sort-by');
  const tabs = document.querySelectorAll('[data-tab]');
  const paginationContainer = document.getElementById('pagination-container');

  const noteModalElement = document.querySelector('note-modal');
  const loadingModal = document.getElementById('loading_modal');
  const errorModal = document.querySelector('error-modal');
  const successModal = document.querySelector('success-modal');

  const noteList = document.querySelector('note-list');
  const appBar = document.querySelector('app-bar');
  const toast = document.querySelector('my-toast');

  function renderApp() {
    const searchTerm = appState.searchTerm.toLowerCase().trim();
    const dateFrom = appState.dateFrom;
    const dateTo = appState.dateTo;
    const isFilterActive = searchTerm || dateFrom || dateTo;

    let filteredNotes = appState.notes;
    // Only call filter if there's something to filter by
    if (isFilterActive) {
      // begining of the day (00:00)
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (toDate) {
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
      }

      filteredNotes = filteredNotes.filter((note) => {
        const noteDate = new Date(note.createdAt);

        const matchesSearch = searchTerm
          ? note.title.toLowerCase().includes(searchTerm) ||
            note.body.toLowerCase().includes(searchTerm)
          : true;

        const matchesDateFrom = fromDate ? noteDate >= fromDate : true;

        const matchesDateTo = toDate ? noteDate <= toDate : true;

        return matchesSearch && matchesDateFrom && matchesDateTo;
      });
    }

    const isArchivedTab = appState.activeTab === 'archived';
    let notesForDisplay = filteredNotes.filter(
      (note) => note.archived === isArchivedTab
    );

    updateTabCounts(
      isFilterActive,
      notesForDisplay.length,
      filteredNotes.length - notesForDisplay.length
    );

    notesForDisplay.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return appState.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Cut some data to make pagination
    const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
    const endIndex = startIndex + appState.itemsPerPage;
    const paginatedNotes = notesForDisplay.slice(startIndex, endIndex);
    // render paging display
    renderPagination(notesForDisplay.length);

    noteList.scrollIntoView();
    // render paginated notes
    noteList.setNoteList(paginatedNotes);
  }

  function updateTabCounts(isFilterActive, archivedCount, activeCount) {
    tabs.forEach((tab) => {
      const badge = tab.querySelector('.badge');

      if (isFilterActive) {
        const tabType = tab.dataset.tab;
        const count = tabType === 'active' ? activeCount : archivedCount;
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
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
  const debouncedSearchInput = debounce((e) => {
    appState.searchTerm = e.target.value;
    handleFilterChange();
  }, 500);
  searchInput.addEventListener('input', debouncedSearchInput);

  const debouncedDateFromInput = debounce((e) => {
    appState.dateFrom = e.target.value;
    handleFilterChange();
  }, 500);
  dateFromInput.addEventListener('change', debouncedDateFromInput);

  const debouncedDateToInput = debounce((e) => {
    appState.dateTo = e.target.value;
    handleFilterChange();
  }, 500);
  dateToInput.addEventListener('change', debouncedDateToInput);

  const debouncedSortSelect = debounce((e) => {
    appState.sortBy = e.target.value;
    handleFilterChange();
  }, 500);
  sortSelect.addEventListener('change', debouncedSortSelect);

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

  // Prevent function running too frequently
  const debouncedChangeItemsPerPage = debounce(() => {
    const newItemsPerPage = getItemsPerPage();
    if (newItemsPerPage !== appState.itemsPerPage) {
      appState.itemsPerPage = newItemsPerPage;
      handleFilterChange();
    }
  }, 500);
  window.addEventListener('resize', debouncedChangeItemsPerPage);

  async function loadAndRenderAllNotes() {
    const onSuccess = () => toast.showSuccess('Notes loaded successfully!');
    const onError = (error) =>
      toast.showError(`Error loading notes: ${error.message}`);

    let newNotes = await NotesAPI.getInstance().loadAllNotes(
      onSuccess,
      onError
    );
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
        errorModal.open(`Error adding note: ${error.message}`);
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
        errorModal.open(`Error deleting note: ${error.message}`);
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
        errorModal.open(`Error archiving note: ${error.message}`);
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
        errorModal.open(`Error unarchiving note: ${error.message}`);
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

  noteModalElement.setModalAnimation(new ModalAnimation());
  noteModalElement.setDeleteAnimation(new ButtonAnimation());
  noteList.setAnimation(new CardAnimation());
  noteList.setNoteModal(noteModalElement);
  toast.setAttribute('offset-top', `${appBar.offsetHeight}px`);
  loadAndRenderAllNotes();
});

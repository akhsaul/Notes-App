import { notesData as initialNotes } from './notes.js';

const STORAGE_KEY = 'notesApp.notes';

export function loadNotes() {
  const storedNotes = localStorage.getItem(STORAGE_KEY);
  if (storedNotes) {
    return JSON.parse(storedNotes);
  } else {
    // If no data in storage, load initial data and save it.
    saveNotes(initialNotes); // Fire and forget
    return initialNotes;
  }
}

export function saveNotes(notes) {
  // Wrap in a promise for "fire and forget" style
  return new Promise((resolve) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    resolve();
  });
}

import { BaseFetcher } from './BaseFetcher.js';
import { notesData as initialNotes } from './notes.js';
/**
 * Creates a delay for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DELAY_FETCHER = 5000

export class LocalStorageFetcher extends BaseFetcher {
  /**
   * @type {LocalStorageFetcher}
   */
  static #instance;
  STORAGE_KEY = 'notesApp.notes';
  /**
   * @type {Array}
   */
  notesData = null;

  constructor() {
    super();
    if (LocalStorageFetcher.#instance) {
      throw new Error(
        'Singleton class. Use LocalStorageFetcher.getInstance() to get the instance.'
      );
    }
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new LocalStorageFetcher();
      this.#instance._initNotes();
    }
    return this.#instance;
  }

  _initNotes() {
    if (!this.notesData) {
      const storedNotes = localStorage.getItem(this.STORAGE_KEY);
      if (storedNotes) {
        this.notesData = JSON.parse(storedNotes);
      } else {
        this.notesData = initialNotes;
        this._saveAllNotes(initialNotes);
      }
    }
  }

  async _saveAllNotes(notes) {
    return new Promise((resolve) => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
      this.notesData = notes;
      resolve();
    });
  }

  async loadAllNotes(archived = false) {
    await delay(DELAY_FETCHER);

    const notes = this.notesData.filter((note) => note.archived === archived);
    return notes;
  }

  async getNote(id) {
    await delay(DELAY_FETCHER);

    const note = this.notesData.find((note) => note.id === id);
    if (note) {
      return note;
    } else {
      throw new Error(`Note not found for id: ${id}`);
    }
  }

  async archiveNote(noteId, archived) {
    await delay(DELAY_FETCHER);

    let noteModified = false;
    const newData = this.notesData.map((n) => {
      let data;
      if (n.id === noteId) {
        noteModified = true;
        data = { ...n };
        data.archived = archived;
      } else {
        data = { ...n };
      }
      return data;
    });
    if (!noteModified) {
      throw new Error(`Note not found for id: ${noteId}`);
    }

    this.notesData = newData;
    this._saveAllNotes(this.notesData);
  }

  async saveNote(note) {
    await delay(DELAY_FETCHER);

    const newNote = {
      ...note,
      id: `notes-${Date.now()}`,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    this.notesData.unshift(newNote);
    this._saveAllNotes(this.notesData);
  }

  async deleteNote(noteId) {
    await delay(DELAY_FETCHER);

    const newData = this.notesData.filter((n) => n.id !== noteId);
    if (newData.length === this.notesData.length) {
      throw new Error(`Note not found for id: ${noteId}`);
    }

    this.notesData = newData;
    this._saveAllNotes(this.notesData);
  }
}

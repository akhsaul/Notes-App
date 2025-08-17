import { DicodingNotesAPI } from './DicodingNotesAPI.js';
import { LocalStorageFetcher } from './LocalStorageFetcher.js';

export class NotesAPI {
  /**
   * @type {NotesAPI}
   */
  static #instance;
  API_MODE = 'remote';
  /**
   * @type {import('./BaseFetcher').BaseFetcher}
   */
  fetcher;

  constructor() {
    if (NotesAPI.#instance) {
      throw new Error(
        'Singleton class. Use NotesAPI.getInstance() to get the instance.'
      );
    }
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new NotesAPI();
    }
    return this.#instance;
  }

  _getFetcher() {
    if (this.API_MODE === 'local') {
      this.fetcher = LocalStorageFetcher.getInstance();
    } else if (this.API_MODE === 'remote') {
      this.fetcher = DicodingNotesAPI.getInstance();
    } else {
      throw new Error(`Mode only accept 'local' or 'remote', got: ${mode}`);
    }
    return this.fetcher;
  }

  setMode(mode) {
    if (mode === 'local' || mode === 'remote') {
      this.API_MODE = mode;
    } else {
      throw new Error(`Mode only accept 'local' or 'remote', got: ${mode}`);
    }
  }

  addLoadingListener(listener) {
    return this._getFetcher().addLoadingListener(listener);
  }

  addSuccessListener(listener) {
    return this._getFetcher().addSuccessListener(listener);
  }

  addErrorListener(listener) {
    return this._getFetcher().addErrorListener(listener);
  }

  async loadAllNotes(archived) {
    return this._getFetcher().loadAllNotes(archived);
  }

  async getNote(id) {
    return this._getFetcher().getNote(id);
  }

  async archiveNote(noteId, archived) {
    return this._getFetcher().archiveNote(noteId, archived);
  }

  async saveNote(note) {
    return this._getFetcher().saveNote(note);
  }

  async deleteNote(noteId) {
    return this._getFetcher().deleteNote(noteId);
  }
}

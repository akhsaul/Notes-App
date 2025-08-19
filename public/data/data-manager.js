import { LocalStorageFetcher } from './LocalStorageFetcher.js';

export class NotesAPI {
  /**
   * @type {NotesAPI}
   */
  static #instance;
  API_MODE = 'local';
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
      throw new Error('Not implemented yet');
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
    this._getFetcher().addLoadingListener(listener);
    return this;
  }

  addSuccessListener(listener) {
    this._getFetcher().addSuccessListener(listener);
    return this;
  }

  addErrorListener(listener) {
    this._getFetcher().addErrorListener(listener);
    return this;
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

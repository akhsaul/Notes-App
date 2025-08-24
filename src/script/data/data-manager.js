import { DicodingNotesAPI } from './DicodingNotesAPI.js';
import { LocalStorageFetcher } from './LocalStorageFetcher.js';

export class NotesAPI {
  /**
   * @type {NotesAPI}
   */
  static #instance;
  API_MODE = 'remote';
  /**
   * @type {import('./BaseFetcher.js').BaseFetcher}
   */
  fetcher;

  constructor() {
    if (NotesAPI.#instance) {
      throw new Error(
        'Singleton class. Use NotesAPI.getInstance() to get the instance.'
      );
    }
    this.loadingListener = (isLoading) => {
      if (isLoading) {
        console.log('Processing data...');
      } else {
        console.log('Data processed.');
      }
    };
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
      throw new Error(
        `Mode only accepts 'local' or 'remote', got: ${this.API_MODE}`
      );
    }
    return this.fetcher;
  }

  setMode(mode) {
    if (mode === 'local' || mode === 'remote') {
      this.API_MODE = mode;
    } else {
      throw new Error(`Mode only accepts 'local' or 'remote', got: ${mode}`);
    }
  }

  addLoadingListener(listener) {
    this.loadingListener = listener;
    return this;
  }

  async loadAllNotes(successListener, errorListener) {
    this.loadingListener(true);
    try {
      const [archivedNotes, activeNotes] = await Promise.all([
        this._getFetcher().loadAllNotes(true),
        this._getFetcher().loadAllNotes(false),
      ]);
      const allNotes = activeNotes.concat(archivedNotes);

      this.loadingListener(false);
      successListener(allNotes);
      return allNotes;
    } catch (error) {
      this.loadingListener(false);
      errorListener(error);
    }
  }

  async getNote(id) {
    return this._getFetcher().getNote(id);
  }

  async archiveNote(noteId, archived, successListener, errorListener) {
    this.loadingListener(true);
    try {
      const note = await this._getFetcher().archiveNote(noteId, archived);

      this.loadingListener(false);
      successListener(note);
    } catch (error) {
      this.loadingListener(false);
      errorListener(error);
    }
  }

  async saveNote(note, successListener, errorListener) {
    this.loadingListener(true);
    try {
      const savedNote = await this._getFetcher().saveNote(note);

      this.loadingListener(false);
      successListener(savedNote);
    } catch (error) {
      this.loadingListener(false);
      errorListener(error);
    }
  }

  async deleteNote(noteId, successListener, errorListener) {
    this.loadingListener(true);
    try {
      await this._getFetcher().deleteNote(noteId);

      this.loadingListener(false);
      successListener();
    } catch (error) {
      this.loadingListener(false);
      errorListener(error);
    }
  }
}

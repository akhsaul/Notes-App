import { BaseFetcher } from './BaseFetcher.js';

export class DicodingNotesAPI extends BaseFetcher {
  /**
   * @type {DicodingNotesAPI}
   */
  static #instance;
  API_URL = 'https://notes-api.dicoding.dev/v2';

  constructor() {
    super();
    if (DicodingNotesAPI.#instance) {
      throw new Error(
        'Singleton class. Use DicodingNotesAPI.getInstance() to get the instance.'
      );
    }
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DicodingNotesAPI();
    }
    return this.#instance;
  }

  async _fetch(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message);
    }
    return data.data;
  }

  async loadAllNotes(archived = false) {
    const url = archived
      ? `${this.API_URL}/notes/archived`
      : `${this.API_URL}/notes`;
    return this._fetch(url);
  }

  async getNote(id) {
    return this._fetch(`${this.API_URL}/notes/${id}`);
  }

  async archiveNote(noteId, archived) {
    const options = { method: 'POST' };
    if (archived) {
      return this._fetch(`${this.API_URL}/notes/${noteId}/archive`, options);
    }
    return this._fetch(`${this.API_URL}/notes/${noteId}/unarchive`, options);
  }

  async saveNote(note) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    };
    return this._fetch(`${this.API_URL}/notes`, options);
  }

  async deleteNote(noteId) {
    const options = { method: 'DELETE' };
    return this._fetch(`${this.API_URL}/notes/${noteId}`, options);
  }
}

export class BaseFetcher {
  errorListener = () => {};
  successListener = () => {};
  loadingListener = () => {};

  constructor() {}

  addLoadingListener(listener) {
    this.loadingListener = listener;
  }

  addSuccessListener(listener) {
    this.successListener = listener;
  }

  addErrorListener(listener) {
    this.errorListener = listener;
  }

  async loadAllNotes(archived) {
    throw new Error("Not implemented yet");
  }

  async getNote(id) {
    throw new Error("Not implemented yet");
  }

  async archiveNote(noteId, archived) {
    throw new Error("Not implemented yet");
  }

  async saveNote(note) {
    throw new Error("Not implemented yet");
  }
  async deleteNote(noteId) {
    throw new Error("Not implemented yet");
  }
}

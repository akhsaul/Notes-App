export class BaseFetcher {
  async loadAllNotes(archived) {
    throw new Error('Not implemented yet');
  }

  async getNote(id) {
    throw new Error('Not implemented yet');
  }

  async archiveNote(noteId, archived) {
    throw new Error('Not implemented yet');
  }

  async saveNote(note) {
    throw new Error('Not implemented yet');
  }
  async deleteNote(noteId) {
    throw new Error('Not implemented yet');
  }
}

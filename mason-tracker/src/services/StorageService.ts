class StorageService {
  private static readonly STORAGE_KEY = 'mason_tracker_userName';

  static setUserName(name: string) {
    console.log('Setting user name:', name);
    localStorage.setItem(this.STORAGE_KEY, name);
    console.log('Saved user name:', this.getUserName());
  }

  static getUserName(): string | null {
    console.log('Getting user name...');
    const name = localStorage.getItem(this.STORAGE_KEY);
    console.log('Retrieved user name:', name);
    return name;
  }
}

export default StorageService; 
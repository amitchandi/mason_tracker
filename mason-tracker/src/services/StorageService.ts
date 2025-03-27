const USER_NAME_KEY = 'userName';
const API_KEY_KEY = 'apiKey';

class StorageService {
  static setUserName(name: string): void {
    console.log('Setting user name:', name);
    localStorage.setItem(USER_NAME_KEY, name);
    console.log('Saved user name:', this.getUserName());
  }

  static getUserName(): string | null {
    console.log('Getting user name...');
    const name = localStorage.getItem(USER_NAME_KEY);
    console.log('Retrieved user name:', name);
    return name;
  }

  static setApiKey(key: string): void {
    localStorage.setItem(API_KEY_KEY, key);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(API_KEY_KEY);
  }
}

export default StorageService; 
type NameChangeListener = () => void;

class EventService {
  private static listeners: NameChangeListener[] = [];

  static addNameChangeListener(listener: NameChangeListener) {
    this.listeners.push(listener);
  }

  static removeNameChangeListener(listener: NameChangeListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  static notifyNameChanged() {
    this.listeners.forEach(listener => listener());
  }
}

export default EventService; 
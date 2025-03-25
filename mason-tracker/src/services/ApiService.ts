import axios from 'axios';

export interface DogWalkingRecord {
  date: string;
  walked: boolean;
  pooped: boolean;
  walkedBy: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiService {
  private static API_BASE_URL = 'http://localhost:5246';

  static async getTodayRecord(): Promise<DogWalkingRecord | null> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/records/today`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s record:', error);
      return null;
    }
  }

  static async createOrUpdateRecord(record: Partial<DogWalkingRecord>): Promise<DogWalkingRecord> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/records`, record);
      return response.data;
    } catch (error) {
      console.error('Error creating/updating record:', error);
      throw error;
    }
  }

  static async getWeeklyRecords(): Promise<DogWalkingRecord[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/records/week`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly records:', error);
      return [];
    }
  }
} 
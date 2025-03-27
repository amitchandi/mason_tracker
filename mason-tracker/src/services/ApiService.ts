import axios from 'axios';
import StorageService from './StorageService';

export interface DogWalkingRecord {
  date: string;
  walked: boolean;
  pooped: boolean;
  walkedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiService {
  private static API_BASE_URL = import.meta.env.VITE_API_URL;

  private static async ensureApiKey(): Promise<string> {
    let apiKey = StorageService.getApiKey();
    if (!apiKey) {
      const response = await axios.post(`${this.API_BASE_URL}/api/apikey/generate`);
      apiKey = response.data.key;
      if (apiKey) {
        StorageService.setApiKey(apiKey);
      }
    }
    return apiKey || '';
  }

  private static async getHeaders() {
    const apiKey = await this.ensureApiKey();
    return {
      'X-API-Key': apiKey
    };
  }

  static async getTodayRecord(): Promise<DogWalkingRecord | null> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/records/today`, {
        headers: await this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s record:', error);
      return null;
    }
  }

  static async createOrUpdateRecord(record: Partial<DogWalkingRecord>): Promise<DogWalkingRecord> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/records`, record, {
        headers: await this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating/updating record:', error);
      throw error;
    }
  }

  static async getWeeklyRecords(): Promise<DogWalkingRecord[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/records/week`, {
        headers: await this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly records:', error);
      return [];
    }
  }
} 

import Dexie, { Table } from 'dexie';
import { DailyLog, StrengthSet, UserProfile } from '../../shared/types';

export interface UserProfileEntity extends UserProfile {
  id: string;
}

export class FitStatDatabase extends Dexie {
  dailyLogs!: Table<DailyLog & { updated_at?: string }>;
  strengthLogs!: Table<StrengthSet & { updated_at?: string }>;
  userProfile!: Table<UserProfileEntity & { updated_at?: string }>;

  constructor() {
    super('FitStatDB');
    this.version(1).stores({
      dailyLogs: 'date',
      strengthLogs: 'id, date',
      userProfile: 'id'
    });
  }
}

export const db = new FitStatDatabase();

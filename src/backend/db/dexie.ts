
import Dexie, { Table } from 'dexie';
import { DailyLog, StrengthSet, UserProfile } from '../../shared/types';

export interface UserProfileEntity extends UserProfile {
  id: string;
}

export class FitStatDatabase extends Dexie {
  dailyLogs!: Table<DailyLog>;
  strengthLogs!: Table<StrengthSet>;
  userProfile!: Table<UserProfileEntity>;

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

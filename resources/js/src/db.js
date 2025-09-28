import Dexie from 'dexie';

export const db = new Dexie('offlineLaundryApp');
db.version(1).stores({
    users: '++id,name,email,isSynced',
    queue: '++id,url,method,payload'
});

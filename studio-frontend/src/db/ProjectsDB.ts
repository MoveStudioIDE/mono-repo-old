import {IDBPDatabase, openDB} from 'idb';

export class IndexedDb {
  private database: string;
  private db: any;

  constructor(database: string) {
    this.database = database;
  }

  public async createObjectStore(tableNames: string[], options?: {keyPath?: string, autoIncrement?: boolean}) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db) {
          tableNames.forEach((tableName) => {
            db.createObjectStore(tableName, options);
          });
        },
      });
    } catch (error) {
      return false;
    }
  }

  public async getValue(tableName: string, key: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.get(key);
    console.log('get result:', result);
    return result;
  }

  public async getAllKeys(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.getAllKeys();
    console.log('getAllKeys result:', result);
    return result;
  }

  public async getAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    console.log('get all result:', result);
    return result;
  }

  public async putValue(tableName: string, value: object) {
    console.log(`putValue, db`, this.db);
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.add(value);
    console.log('put result:', result);
    return result;
  }

  public async putBulkValue(tableName: string, values: object[]) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await Promise.all(values.map((value) => store.put(value)));
    console.log('put bulk result:', result);
    return this.getAllValue(tableName);
  }

  public async deleteValue(tableName: string, key: string) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.delete(key);
    console.log('delete result:', result);
    return result;
  }
}

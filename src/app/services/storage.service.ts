import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

import { SQLite, SQLiteObject } from '@ionic-enterprise/secure-storage/ngx';

export interface Person {
  id: string;
  phoneNo: string;
  note: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  database: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.initializeDatabase();
  }

  async getAllNumbers(): Promise<Person[]> {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql('SELECT * from numbers', [], (_, result) => {
          const data = [];
          for (let i = 0; i < result.rows.length; i++) {
            data.push(result.rows.item(i));
          }
          resolve(data);
        });
      });
    });
  }

  async setNewPersion(p: Person) {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO numbers ("phoneNo", note, "createdAt") VALUES (?,?,?)',
          [p.phoneNo, p.note, new Date()],
          (_, result) => {
            console.log('insertId: ' + result.insertId); // New Id number
            console.log('rowsAffected: ' + result.rowsAffected); // 1
            resolve(null);
          }
        );
      });
    });
  }

  async removePerson(phoneNo: string) {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM numbers WHERE "phoneNo" = ?',
          [phoneNo],
          (_, result) => {
            console.log('Rows affected: ' + result.rowsAffected); // 1
            resolve(null);
          }
        );
      });
    });
  }

  async deleteAll() {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql('DELETE FROM numbers', [], (_, result) => {
          console.log('Rows affected: ' + result.rowsAffected); // 1
          resolve(null);
        });
      });
    });
  }

  private async initializeDatabase() {
    // Create or open a table
    try {
      const db = await this.sqlite.create({
        name: 'phoneNumbers',
        location: 'default',
        // Key/Password used to encrypt the database
        // Strongly recommended to use Identity Vault to manage this
        key: '',
      });

      this.database = db;

      // Create our initial schema
      await db.executeSql(
        'CREATE TABLE IF NOT EXISTS numbers("phoneNo", note, "createdAt")',
        []
      );
    } catch (e) {
      console.error('Unable to initialize database', e);
    }
  }
}

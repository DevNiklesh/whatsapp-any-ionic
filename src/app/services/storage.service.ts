import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-enterprise/secure-storage/ngx';

export interface Person {
  id: number;
  phoneNo: string;
  name?: string;
  note: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  database: SQLiteObject;
  numbersTable = 'numbers';

  constructor(private sqlite: SQLite) {
    this.initializeDatabase();
  }

  async getAllNumbers(): Promise<Person[]> {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${this.numbersTable} ORDER BY "createdAt"`,
          [],
          (_, result) => {
            const data = [];
            for (let i = 0; i < result.rows.length; i++) {
              console.log(result.rows);
              data.push(result.rows.item(i));
            }
            resolve(data);
          }
        );
      });
    });
  }

  async setNewPerson(phoneNo: string, name: string, note: string) {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO ${this.numbersTable} ("phoneNo", name, note, "createdAt") VALUES (?,?,?,?)`,
          [phoneNo, name, note, new Date()],
          (_, result) => {
            resolve(null);
          }
        );
      });
    });
  }

  async updatePersonById(personId: number, phoneNo: string, name: string, note: string) {
    return this.database.executeSql(
      `UPDATE ${this.numbersTable} SET "phoneNo" = ?, name = ?, note = ? WHERE "id" = ?`,
      [phoneNo, name, note, personId]
    );
  }

  async deletePersonById(id: number) {
    return new Promise((resolve, reject) => {
      this.database.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM ${this.numbersTable} WHERE "id" = ?`,
          [id],
          (_, result) => {
            console.log('Rows affected: ' + result.rowsAffected); // 1
            resolve(null);
          }
        );
      });
    });
  }

  // async deleteAll() {
  //   return new Promise((resolve, reject) => {
  //     this.database.transaction((tx) => {
  //       tx.executeSql('DELETE FROM numbers', [], (_, result) => {
  //         console.log('Rows affected: ' + result.rowsAffected); // 1
  //         resolve(null);
  //       });
  //     });
  //   });
  // }

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
        `CREATE TABLE IF NOT EXISTS numbers(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          "phoneNo" TEXT,
          name TEXT,
          note TEXT,
          "createdAt" DATETIME
        )`
      );
    } catch (e) {
      console.error('Unable to initialize database', e);
    }
  }
}

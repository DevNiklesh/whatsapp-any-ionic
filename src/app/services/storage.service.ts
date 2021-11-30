import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

export interface Person {
  phoneNo: number;
  note: string;
}

export enum Keys {
  allNumbers = 'allNumbers',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  allNumbers: Person[] = [];

  constructor() {}

  async getAllNumbers(): Promise<Person[]> {
    const { value } = await Storage.get({ key: Keys.allNumbers });
    this.allNumbers = JSON.parse(value) || [];
    return this.allNumbers;
  }

  async setNewPersion(p: Person) {
    const index = this.allNumbers.findIndex((ele) => ele.phoneNo === p.phoneNo);

    if (index >= 0) {
      this.allNumbers[index] = p;
    } else {
      this.allNumbers.unshift(p);
    }
    await Storage.set({
      key: Keys.allNumbers,
      value: JSON.stringify(this.allNumbers),
    });
  }

  async removePerson(p: Person) {
    const index = this.allNumbers.findIndex((ele) => ele.phoneNo === p.phoneNo);

    if (index >= 0) {
      this.allNumbers.splice(index, 1);
    } else {
      return;
    }

    await Storage.set({
      key: Keys.allNumbers,
      value: JSON.stringify(this.allNumbers),
    });
  }
}

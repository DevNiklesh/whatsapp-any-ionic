import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Person, StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mobileNo: number;
  note: string;
  allPersons: Person[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storageService: StorageService
  ) {}

  ionViewWillEnter() {
    this.getAllPersion();
  }

  async getAllPersion() {
    this.allPersons = await this.storageService.getAllNumbers();
  }

  async openForm(p: Person = null) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-form-box',
      header: 'New Number',
      backdropDismiss: false,
      inputs: [
        {
          name: 'phoneNo',
          type: 'number',
          min: 10,
          max: 10,
          value: p?.phoneNo,
          placeholder: 'enter phone number',
        },
        {
          name: 'note',
          type: 'textarea',
          value: p?.note,
          placeholder: 'More details',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: async (person: Person) => {
            if (!person.phoneNo) {
              this.presentToastWithOptions(
                'Please enter whatsapp mobile number'
              );
              this.openForm(person);
              return;
            }
            if (person.phoneNo.toString().length !== 10) {
              this.presentToastWithOptions('Please enter 10 digit number');
              this.openForm(person);
              return;
            }
            await this.storageService.setNewPersion(person);
            this.getAllPersion();
            this.document.location.href = `https://wa.me/91${person.phoneNo}`;
            // this.document.location.href = `https://wa.me/91${
            //   person.phoneNo
            // }?text=${encodeURI(person.note)}`;
          },
        },
      ],
    });

    await alert.present();
  }

  async removePerson(p: Person) {
    await this.storageService.removePerson(p);
    await this.getAllPersion();
  }

  async presentToastWithOptions(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 4000,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }
}

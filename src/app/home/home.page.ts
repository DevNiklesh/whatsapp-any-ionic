import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  ToastController,
  ModalController,
} from '@ionic/angular';
import { Person, StorageService } from '../services/storage.service';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { InfoComponent } from './info/info.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  allPersons: Person[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.getAllPersion();
  }

  async getAllPersion() {
    this.allPersons = await this.storageService.getAllNumbers();
  }

  openWhatsapp(phoneNo) {
    this.document.location.href = `https://wa.me/91${phoneNo}`;
    // this.document.location.href = `https://wa.me/91${
    //   person.phoneNo
    // }?text=${encodeURI(person.note)}`;
  }

  async openForm() {
    const modal = await this.modalCtrl.create({
      component: ContactFormComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 0.8],
      keyboardClose: false,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    await this.getAllPersion();
    if (data?.shouldOpenChat) {
      this.openWhatsapp(data.phoneNo);
    }
  }

  async openInfo() {
    const modal = await this.modalCtrl.create({
      component: InfoComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.4, 0.6],
      keyboardClose: false,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    await this.getAllPersion();
    if (data?.shouldOpenChat) {
      this.openWhatsapp(data.phoneNo);
    }
  }

  async deletePerson(p: Person) {
    await this.storageService.deletePersonById(p.id);
    await this.getAllPersion();
  }

  // async deleteAll() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Are you sure!',
  //     message: 'Delete all numbers?',
  //     buttons: [
  //       { text: 'cancel', role: 'cancel' },
  //       {
  //         text: 'Yes, Delete',
  //         handler: async () => {
  //           await this.storageService.deleteAll();
  //           await this.getAllPersion();
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }

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

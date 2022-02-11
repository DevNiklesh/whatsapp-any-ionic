import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Person, StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  @Input() editPerson: Person;
  phoneNo: string;
  name: string;
  note: string;
  errorMsg: string;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    if (this.editPerson) {
      this.phoneNo = this.editPerson.phoneNo;
      this.name = this.editPerson.name;
      this.note = this.editPerson.note;
    }
  }

  async saveContact(shouldOpenChat = false) {
    if (!this.phoneNo) {
      this.errorMsg = 'Please enter whatsapp mobile number';
      return;
    }
    if (this.phoneNo.toString().length !== 10) {
      this.errorMsg = 'Please enter 10 digit number';
      return;
    }

    if (!this.editPerson) {
      try {
        await this.storageService.setNewPerson(
          this.phoneNo,
          this.name,
          this.note
        );
      } catch (err) {
        this.toastCtrl.create({
          message: 'Oops..! Contact not saved. Please try again!',
        });
      }
    } else {
      try {
        await this.storageService.updatePersonById(
          this.editPerson.id,
          this.phoneNo,
          this.name,
          this.note
        );
      } catch (err) {
        this.toastCtrl.create({
          message: 'Oops..! Contact not updated. Please try again!',
        });
      }
    }

    if (shouldOpenChat) {
      return this.modalCtrl.dismiss({ phoneNo: this.phoneNo, shouldOpenChat });
    }
    return await this.modalCtrl.dismiss();
  }
}

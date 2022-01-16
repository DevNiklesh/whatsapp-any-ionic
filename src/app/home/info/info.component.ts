import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  twitterURL = 'https://twitter.com/devniklesh';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {}

  openTwitter() {
    this.document.location.href = this.twitterURL;
  }

  shareWhatsappAny() {
    const text = `Hey, I use *WhatsApp Any* to send messages without saving the contact. Download Now and protect your privacy too!`;

    this.document.location.href = `https://wa.me/?text=${encodeURI(text)}`;
  }
}

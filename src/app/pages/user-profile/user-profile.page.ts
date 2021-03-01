import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  @Input("userName") userName;
  @Input("accountType") accountType;
  @Input("profilePic") profilePic;

  userAvatar = "";

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.userAvatar = this.profilePic;
  }

  async closeModal() {
    return await this.modalController.dismiss();
  }

}

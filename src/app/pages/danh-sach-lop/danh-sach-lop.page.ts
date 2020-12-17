import {Component, OnInit} from '@angular/core';
import {ClassRoom} from '../../models/ClassRoom';
import {ClassRoomService} from '../../services/class-room.service';
import {AlertController, LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-danh-sach-lop',
    templateUrl: './danh-sach-lop.page.html',
    styleUrls: ['./danh-sach-lop.page.scss'],
})
export class DanhSachLopPage implements OnInit {
    classRoomList = [];

    constructor(
        private classRoomService: ClassRoomService,
        private loadingController: LoadingController,
        private alertController: AlertController,
    ) {
    }

    ngOnInit() {
        this.getClassRoomList();
    }

    async getClassRoomList() {
        const loading = await this.loadingController.create();
        await loading.present();

        this.classRoomService.getClassList().subscribe(
            async (classRoomData) => {
                console.log(classRoomData);
                classRoomData = classRoomData.map(classRoom => (
                    {
                        id: classRoom.id,
                        className: classRoom.name,
                        roomID: classRoom.roomId,
                        areaName: classRoom.areaName
                    }));
                console.log(classRoomData);
                this.classRoomList = this.classRoomList.concat(classRoomData);
                console.log(this.classRoomList);
                this.classRoomList.sort(this.compareClassRoomName)
                await loading.dismiss();
            },
            async error => {
                await loading.dismiss();
                const alert = await this.alertController.create({
                    header: 'Lỗi Đăng Nhập',
                    message: error.message.toString(),
                    buttons: ['OK'],
                });
                await alert.present();
            });
    }

    compareClassRoomName(a, b) {
        if (a.className < b.className) {
            return -1;
        }
        if (a.className > b.className) {
            return 1;
        }
        return 0;
    }

}

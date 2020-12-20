import {Component, OnInit} from '@angular/core';
import {ClassRoom} from '../../models/ClassRoom';
import {ClassRoomService} from '../../services/class-room.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-danh-sach-lop',
    templateUrl: './danh-sach-lop.page.html',
    styleUrls: ['./danh-sach-lop.page.scss'],
})
export class DanhSachLopPage implements OnInit {
    classRoomList = [];

    constructor(
        private router: Router,
        private classRoomService: ClassRoomService,
        private loadingController: LoadingController,
        private alertController: AlertController,
    ) {
    }

    ngOnInit() {
        this.resetPageData();
        this.getClassRoomList();
    }

    async getClassRoomList() {
        const loading = await this.loadingController.create();
        await loading.present();

        this.classRoomService.getClassList().subscribe(
            async (classRoomData) => {
                classRoomData = classRoomData.map(classRoom => (
                    {
                        id: classRoom.id,
                        className: classRoom.name,
                        roomID: classRoom.roomId,
                        areaName: classRoom.areaName
                    }));
                this.classRoomList = this.classRoomList.concat(classRoomData);
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

    async onClassItemClicked(className: string) {
        const loading = await this.loadingController.create();
        await loading.present();

        this.classRoomService.chooseClass(className).subscribe(() => {
            this.classRoomService.chosenClassRoom.subscribe(chosenClass => {
                loading.dismiss();
                this.router.navigateByUrl('/thong-tin-lop/' + chosenClass, {replaceUrl: true});
            });
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

    resetPageData() {
        this.classRoomList = [];
    }

}

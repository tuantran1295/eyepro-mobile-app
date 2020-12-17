export class ClassRoom {
    id: number;
    className: string;
    roomID: string;
    areaName: string;

    constructor(id: number, className: string, roomID: string, areaName: string) {
        this.id = id;
        this.className = className;
        this.roomID = roomID;
        this.areaName = areaName;
    }
}

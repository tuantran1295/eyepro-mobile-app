import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DanhSachLopPage } from './danh-sach-lop.page';

describe('DanhSachLopPage', () => {
  let component: DanhSachLopPage;
  let fixture: ComponentFixture<DanhSachLopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanhSachLopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DanhSachLopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

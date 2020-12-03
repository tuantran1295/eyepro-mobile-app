import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabStudentProfilePage } from './tab-student-profile.page';

describe('TabStudentProfilePage', () => {
  let component: TabStudentProfilePage;
  let fixture: ComponentFixture<TabStudentProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabStudentProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabStudentProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

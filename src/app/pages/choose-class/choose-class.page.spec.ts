import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseClassPage } from './choose-class.page';

describe('ChooseClassPage', () => {
  let component: ChooseClassPage;
  let fixture: ComponentFixture<ChooseClassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseClassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

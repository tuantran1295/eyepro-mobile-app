import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabNguoiLaPage } from './tab-nguoi-la.page';

describe('TabNguoiLaPage', () => {
  let component: TabNguoiLaPage;
  let fixture: ComponentFixture<TabNguoiLaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabNguoiLaPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabNguoiLaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

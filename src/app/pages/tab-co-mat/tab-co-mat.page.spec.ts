import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabCoMatPage } from './tab-co-mat.page';

describe('TabCoMatPage', () => {
  let component: TabCoMatPage;
  let fixture: ComponentFixture<TabCoMatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabCoMatPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabCoMatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

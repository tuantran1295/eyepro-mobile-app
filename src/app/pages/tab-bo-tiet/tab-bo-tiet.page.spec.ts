import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabBoTietPage } from './tab-bo-tiet.page';

describe('TabBoTietPage', () => {
  let component: TabBoTietPage;
  let fixture: ComponentFixture<TabBoTietPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabBoTietPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabBoTietPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

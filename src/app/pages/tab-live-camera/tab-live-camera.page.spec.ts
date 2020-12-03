import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabLiveCameraPage } from './tab-live-camera.page';

describe('TabLiveCameraPage', () => {
  let component: TabLiveCameraPage;
  let fixture: ComponentFixture<TabLiveCameraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabLiveCameraPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabLiveCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

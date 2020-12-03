import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabVangMatPage } from './tab-vang-mat.page';

describe('TabVangMatPage', () => {
  let component: TabVangMatPage;
  let fixture: ComponentFixture<TabVangMatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabVangMatPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabVangMatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

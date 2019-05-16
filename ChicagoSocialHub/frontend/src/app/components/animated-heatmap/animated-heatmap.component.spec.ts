import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedHeatmapComponent } from './animated-heatmap.component';

describe('AnimatedHeatmapComponent', () => {
  let component: AnimatedHeatmapComponent;
  let fixture: ComponentFixture<AnimatedHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

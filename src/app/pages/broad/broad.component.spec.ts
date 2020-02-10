import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { BroadComponent } from './broad.component';

describe('BroadComponent', () => {
  let component: BroadComponent;
  let fixture: ComponentFixture<BroadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule, HttpClientTestingModule],
      declarations: [BroadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

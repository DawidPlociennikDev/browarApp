import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditMeetingPage } from './edit-meeting.page';

describe('EditMeetingPage', () => {
  let component: EditMeetingPage;
  let fixture: ComponentFixture<EditMeetingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMeetingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMeetingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

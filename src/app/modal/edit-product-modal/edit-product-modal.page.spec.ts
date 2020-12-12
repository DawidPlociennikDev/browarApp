import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditProductModalPage } from './edit-product-modal.page';

describe('EditProductModalPage', () => {
  let component: EditProductModalPage;
  let fixture: ComponentFixture<EditProductModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

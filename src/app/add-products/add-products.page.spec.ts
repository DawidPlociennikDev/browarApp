import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProductsPage } from './add-products.page';

describe('AddProductsPage', () => {
  let component: AddProductsPage;
  let fixture: ComponentFixture<AddProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

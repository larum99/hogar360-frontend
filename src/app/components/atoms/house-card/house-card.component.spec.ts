import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseCardComponent } from './house-card.component';
import { HouseList } from 'src/app/shared/models/house-list.model';

describe('HouseCardComponent', () => {
  let component: HouseCardComponent;
  let fixture: ComponentFixture<HouseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseCardComponent);
    component = fixture.componentInstance;

    component.house = {
      id: 1,
      name: 'Casa Test',
      description: 'Descripción de prueba',
      category: {
        id: 10,
        name: 'Categoría Test',
        description: 'Descripción categoría',
        status: 'ACTIVE',
      },
      bedrooms: 3,
      bathrooms: 2,
      price: 250000,
      location: {
        id: 5,
        sector: 'Sector Test',
        cityName: 'Ciudad Test',
        departmentName: 'Departamento Test',
      },

      publicationDate: '2024-01-01T00:00:00Z',
      activePublicationDate: '2024-01-15T00:00:00Z',
      status: 'ACTIVE',
      publisherId: 100,
    } as HouseList;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectHouse with house id when onClick is called', () => {
    const emitSpy = jest.spyOn(component.selectHouse, 'emit');

    component.onClick();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });
});

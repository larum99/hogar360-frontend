import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sortChanged when sortControl value changes', () => {
    const sortSpy = jest.spyOn(component.sortChanged, 'emit');

    component.sortControl.setValue('category');

    expect(sortSpy).toHaveBeenCalledWith({
      sortBy: 'category',
      sortDirection: 'asc',
    });
  });

  it('should not emit sortChanged when sortControl value is null', () => {
    const sortSpy = jest.spyOn(component.sortChanged, 'emit');

    component.sortControl.setValue(null);

    expect(sortSpy).not.toHaveBeenCalled();
  });

  it('should emit cityChanged when cityControl value changes', (done) => {
    const citySpy = jest.spyOn(component.cityChanged, 'emit');

    component.cityControl.setValue('Bogotá');

    setTimeout(() => {
      expect(citySpy).toHaveBeenCalledWith('Bogotá');
      done();
    }, 350);
  });

  it('should not emit cityChanged when cityControl value is null', (done) => {
    const citySpy = jest.spyOn(component.cityChanged, 'emit');

    component.cityControl.setValue(null);

    setTimeout(() => {
      expect(citySpy).not.toHaveBeenCalled();
      done();
    }, 350);
  });
});

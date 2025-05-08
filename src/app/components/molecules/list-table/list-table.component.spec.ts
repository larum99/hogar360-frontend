import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTableComponent } from './list-table.component';
import { TableColumn } from 'src/app/shared/models/table-column.model';
import { Category } from 'src/app/shared/models/category.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ListTableComponent', () => {
  let component: ListTableComponent<Category>;
  let fixture: ComponentFixture<ListTableComponent<Category>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTableComponent<Category>);
    component = fixture.componentInstance; // Corrected from fixture.instance
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept data input', () => {
    const mockData: Category[] = [
      { id: 1, name: 'Electronics', description: 'Electronic devices' },
      { id: 2, name: 'Books', description: 'Novels, sci-fi, etc.' },
    ];
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should accept columns input', () => {
    const mockColumns: TableColumn<Category>[] = [
      { header: 'ID', cell: (element: Category) => element.id },
      { header: 'Name', cell: (element: Category) => element.name },
      { header: 'Description', cell: (element: Category) => element.description },
    ];
    component.columns = mockColumns;
    fixture.detectChanges();
  });

   it('should accept noDataMessage input', () => {
    const customMessage = 'No items to display.';
    component.noDataMessage = customMessage;
    fixture.detectChanges();
  });

  it('should emit action event with correct payload when onAction is called', () => {
    const actionSpy = jest.spyOn(component.action, 'emit');
    const mockActionType = 'edit';
    const mockElement: Category = { id: 1, name: 'Test', description: 'Test Desc' };

    component.onAction(mockActionType, mockElement);

    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalledWith({ actionType: mockActionType, element: mockElement });
  });
});
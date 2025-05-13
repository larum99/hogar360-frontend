import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTableComponent } from './list-table.component';
import { TableColumn } from 'src/app/shared/models/table-column.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListTableComponent', () => {
  let component: ListTableComponent<any>;
  let fixture: ComponentFixture<ListTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit sortChange when sortable column is clicked', () => {
    const column: TableColumn<any> = {
      header: 'Name',
      sortField: 'name',
      sortable: true,
      cell: (row) => row.name,
    };

    component.sortBy = '';
    component.sortDirection = 'asc';

    jest.spyOn(component.sortChange, 'emit');

    component.onSort(column);

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      sortBy: 'name',
      sortDirection: 'asc',
    });
  });

  it('should toggle sort direction when same column is clicked twice', () => {
    const column: TableColumn<any> = {
      header: 'Name',
      sortField: 'name',
      sortable: true,
      cell: (row) => row.name,
    };

    component.sortBy = 'name';
    component.sortDirection = 'asc';

    jest.spyOn(component.sortChange, 'emit');

    component.onSort(column);

    expect(component.sortChange.emit).toHaveBeenCalledWith({
      sortBy: 'name',
      sortDirection: 'desc',
    });
  });

  it('should not emit sortChange if column is not sortable', () => {
    const column: TableColumn<any> = {
      header: 'Age',
      sortField: 'age',
      sortable: false,
      cell: (row) => row.age,
    };

    jest.spyOn(component.sortChange, 'emit');

    component.onSort(column);

    expect(component.sortChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit sortChange if column has no sortField', () => {
    const column: TableColumn<any> = {
      header: 'Age',
      sortable: true,
      cell: (row) => row.age,
    };

    jest.spyOn(component.sortChange, 'emit');

    component.onSort(column);

    expect(component.sortChange.emit).not.toHaveBeenCalled();
  });
});

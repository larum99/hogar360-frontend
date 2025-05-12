export interface TableColumn<T> {
    header: string;
    field?: string;
    sortable?: boolean;
    sortField?: string;
    cell: (element: T) => any;
    cellClass?: string;
}

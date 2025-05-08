export interface TableColumn<T> {
    header: string;
    cell: (element: T) => any;
    cellClass?: string;
}

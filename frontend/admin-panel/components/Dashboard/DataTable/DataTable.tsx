import React from 'react';
import styles from './DataTable.module.css';

export interface TableColumn<T> {
    header: string;
    accessor: keyof T;
}

interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    title?: string;
    getRowKey: (rowData: T, index: number) => string | number;
}

const DataTable = <T extends  Record<string, string | number>>({
                                                      data,
                                                      columns,
                                                      title,
                                                      getRowKey,
                                                  }: DataTableProps<T>): React.ReactElement => {
    return (
        <div className={styles.tableContainer}>
            {title && <div className={styles.header}>
                <h2 className={styles.tableTitle}>{title}</h2>
                <div className={styles.tableInfo}>
                    Showing {data.length} record{data.length !== 1 ? 's' : ''}
                </div>
            </div>}

            <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                    {/* Table Header */}
                    <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} className={styles.tableHeader}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                    {data.length > 0 ? (
                        data.map((rowData, rowIndex) => (
                            <tr
                                key={getRowKey(rowData, rowIndex)}
                                className={rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={styles.tableCell}>
                                        {rowData[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className={styles.noData}>
                                <div className={styles.noDataContent}>
                                    <div className={styles.noDataIcon}>📊</div>
                                    <h3>No data available</h3>
                                    <p>Add data to see it displayed here</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
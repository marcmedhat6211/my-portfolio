import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC } from "react";
import { Spinner, Table } from "react-bootstrap";
import styles from "./OverviewTable.module.scss";

type Props = {
  data: any[];
  columns: ColumnDef<any, any>[];
  loading: boolean;
};

const OverviewTable: FC<Props> = ({ data, columns, loading }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles["table-container"]}>
      <Table responsive hover>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {loading && (
        <div className={styles["table-loader"]}>
          <Spinner animation="border" variant="dark" />
        </div>
      )}
    </div>
  );
};

export default OverviewTable;

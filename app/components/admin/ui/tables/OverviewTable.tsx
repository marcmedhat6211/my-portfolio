import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import styles from "./OverviewTable.module.scss";

type Props = {
  data: any[];
  columns: ColumnDef<any, any>[];
  loading: boolean;
  onAddNewResource: () => void;
};

const OverviewTable: FC<Props> = ({
  data,
  columns,
  loading,
  onAddNewResource,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles["table-container"]}>
      <div className="d-flex justify-content-end mb-1">
        <Button variant="outline-success" size="sm" onClick={onAddNewResource}>
          <FaPlus />
        </Button>
      </div>
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
          {!loading &&
            table.getRowModel().rows.map((row) => (
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

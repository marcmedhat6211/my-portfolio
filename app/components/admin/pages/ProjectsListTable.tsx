import { Fragment } from "react";
import { Table } from "react-bootstrap";

const ProjectsListTable = () => {
  return (
    <Fragment>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </Table>
    </Fragment>
  );
};

export default ProjectsListTable;

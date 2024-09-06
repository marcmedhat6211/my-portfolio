"use client";
import OverviewTable from "@/app/components/admin/ui/tables/OverviewTable";
import { db } from "@/app/firebase/db";
import { ProjectInterface } from "@/app/interfaces/ProjectInterface";
import { createColumnHelper } from "@tanstack/react-table";
import { collection, getDocs } from "firebase/firestore";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const columnHelper = createColumnHelper<ProjectInterface>();

const ProjectsPage = () => {
  // states
  const [tableData, setTableData] = useState<ProjectInterface[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsRef = collection(db, "projects");
      const projectsSnap = await getDocs(projectsRef);

      setTableData(
        projectsSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ProjectInterface)
        )
      );
    };

    fetchProjects();
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <Fragment>Name</Fragment>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <Fragment>Actions</Fragment>,
        cell: () => (
          <Fragment>
            <Button variant="outline-primary" size="sm" className="me-2">
              <FaEdit />
            </Button>
            <Button variant="outline-danger" size="sm">
              <MdDelete />
            </Button>
          </Fragment>
        ),
      }),
    ],
    []
  );

  return <OverviewTable data={tableData} columns={columns} loading />;
};

export default ProjectsPage;

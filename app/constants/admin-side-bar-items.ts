type AdminSideBarItem = {
  name: string;
  path: string;
};

export const adminSideBarItems: AdminSideBarItem[] = [
  { name: "Dashboard", path: "/admin" },
  { name: "Projects", path: "/admin/projects" },
];

import React from "react";
import UserListTab from "./Tabs/UserListTab";
import CreateAdminTab from "./Tabs/CreateAdminTab";
import "../../css/Dashboard.css";

const Admin = ({ activeSection }) => {
  return (
    <>
      {activeSection === "seller-list" && <UserListTab list="seller" />}
      {activeSection === "buyer-list" && <UserListTab list="buyer" />}
      {activeSection === "admin-list" && <UserListTab list="admin" />}
      {activeSection === "add-new-admin" && <CreateAdminTab />}
    </>
  );
};

export default Admin;

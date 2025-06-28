import UserListTab from "./Tabs/UserListTab";
import RestrictedUserListTab from "./Tabs/restrictedUserListTab";
import CreateAdminTab from "./Tabs/CreateAdminTab";
import "../../css/Dashboard.css";

const Admin = ({ activeSection }) => {
  return (
    <>
      {activeSection === "seller-list" && <UserListTab list="seller" />}
      {activeSection === "buyer-list" && <UserListTab list="buyer" />}
      {activeSection === "admin-list" && <UserListTab list="admin" />}
      {activeSection === "restricted-sellers" && (
        <RestrictedUserListTab list="seller" />
      )}
      {activeSection === "restricted-buyers" && (
        <RestrictedUserListTab list="buyer" />
      )}

      {activeSection === "add-new-admin" && <CreateAdminTab />}
    </>
  );
};

export default Admin;

import React from "react";
import "../../css/Dashboard.css";
import CreateProduct from "./Tabs/CreatProduct";
import ProductList from "./Tabs/ProductList";
import PortfolioTab from "./Tabs/PortfolioTab";
import SkillsTest from "./Tabs/SkillsTest";

const Seller = ({ activeSection }) => {
  return (
    <>
      {activeSection === "create-product" && <CreateProduct />}
      {activeSection === "product-list" && <ProductList />}
      {activeSection === "portfolio" && <PortfolioTab />}
      {activeSection === "skills-test" && <SkillsTest />}
    </>
  );
};

export default Seller;

import React from "react";
import "../../css/Dashboard.css";
import CreateProduct from "./Tabs/CreatProduct";
import ProductList from "./Tabs/ProductList";
import PortfolioTab from "./Tabs/PortfolioTab";

const Seller = ({ activeSection }) => {
  return (
    <>
      {activeSection === "create-product" && <CreateProduct list="seller" />}
      {activeSection === "product-list" && <ProductList list="seller" />}
      {activeSection === "portfolio" && <PortfolioTab list="seller" />}
    </>
  );
};

export default Seller;

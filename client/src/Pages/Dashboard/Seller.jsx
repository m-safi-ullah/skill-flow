import React from "react";
import "../../css/Dashboard.css";
import CreateProduct from "./Tabs/CreatProduct";
import ProductList from "./Tabs/ProductList";

const Seller = ({ activeSection }) => {
  return (
    <>
      {activeSection === "create-product" && <CreateProduct list="seller" />}
      {activeSection === "product-list" && <ProductList list="seller" />}
    </>
  );
};

export default Seller;

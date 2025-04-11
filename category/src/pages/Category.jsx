import React, { useState } from 'react';
import CategoryComponent from "../components/category/ThreeView.jsx";
import {data} from "../data/data.js";

const Category = () => {
  return (
      <div>
        <CategoryComponent data={data} title={"Categories"}/>
      </div>
  )
};

export default Category;
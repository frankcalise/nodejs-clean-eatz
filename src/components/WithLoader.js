import React from "react";
import Loader from "./Loader";

const WithLoader = props => {
  return props.condition ? (
    props.children
  ) : (
    <section style={{ height: props.height, width: props.width }}>
      <h3>{props.message}</h3>
      <Loader />
    </section>
  );
};

export default WithLoader;

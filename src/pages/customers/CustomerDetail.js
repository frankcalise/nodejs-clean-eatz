import React from "react";

const CustomerDetail = ({ data }) => {
  const { name, email, phone } = data;

  return (
    <div className="customer-detail">
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
    </div>
  );
};

export default CustomerDetail;

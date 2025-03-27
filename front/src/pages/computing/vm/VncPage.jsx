import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobal from "../../../hooks/useGlobal";

const VncPage = () => {
  const navigate = useNavigate();
  const { 
    id: vmId, 
    section
  } = useParams();
  const { setValue, getValue } = useGlobal();
  
  useEffect(() => {

  }, [getValue])

  console.log("...")
  return (
    <div>Hello world!</div>
  );
}

export default VncPage;

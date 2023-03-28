import React from "react";
import { useParams } from "react-router-dom";

export default function Dynamic() {
  const params = useParams();

  return <h1>{params.dynamic}</h1>;
}

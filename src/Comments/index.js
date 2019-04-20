import React from "react";
import DisqusThread from "./DisqusThread";

export default class Comments extends React.Component {
  render() {
    return (
      <DisqusThread
        id="root"
        title="Tesla Model 3 Korea"
        path="/tesla-model-3-korea"
      />
    );
  }
}

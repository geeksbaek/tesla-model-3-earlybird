import React, { Component } from "react";
import { Header, Dropdown } from "semantic-ui-react";
import { Common } from "../Common";

export default class Subsidy extends Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
        <Header sub>전기차 보조금</Header>
        <Dropdown
          fluid
          deburr
          options={this.props.subsidy_list.map((v, i) => {
            return {
              key: i,
              value: i,
              text: `${v.name} (${Common.comma(v.subsidy)}원)`
            };
          })}
          placeholder="보조금 계산을 위해 거주지를 선택하세요"
          selection
          search
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

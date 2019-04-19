import React, { Component } from "react";
import { Header, Dropdown, Divider, Form } from "semantic-ui-react";
import { Common } from "../Common";

export default class Subsidy extends Component {
  render() {
    let govOpt = this.props.gov_subsidy.map((v, i) => {
      return {
        key: i,
        value: i,
        text: `${v.name} (${Common.comma(v.subsidy)}원)`
      };
    });
    let localOpt = this.props.local_subsidy.map((v, i) => {
      return {
        key: i,
        value: i,
        text: `${v.name} (${Common.comma(v.subsidy)}원)`
      };
    });
    return (
      <div style={{ width: "100%" }}>
        <Form.Group widths="equal">
          <Form.Field>
            <Header sub>정부 보조금</Header>
            <Divider hidden fitted />
            <Divider hidden fitted />
            <Dropdown
              defaultValue={govOpt[0] ? govOpt[0].value : 0}
              fluid
              deburr
              options={govOpt}
              selection
              search
              onChange={this.props.onGovSubsidyChange}
            />
          </Form.Field>
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Form.Field>
            <Header sub>지방자치단체 보조금</Header>
            <Divider hidden fitted />
            <Divider hidden fitted />
            <Dropdown
              defaultValue={localOpt[0] ? localOpt[0].value : 0}
              fluid
              deburr
              options={localOpt}
              placeholder="거주지를 선택하세요"
              selection
              search
              onChange={this.props.onLocalSubsidyChange}
            />
          </Form.Field>
        </Form.Group>
      </div>
    );
  }
}

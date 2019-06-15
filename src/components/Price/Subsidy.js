import React, { Component } from "react";
import { Header, Dropdown, Divider, Form } from "semantic-ui-react";
import { Common } from "./Common";

export default class Subsidy extends Component {
  onGovSubsidyChange = (v, { value }) => {
    console.log(value);
    this.props.onGovSubsidyChange(v, this.props.gov_subsidy[value]);
    this.props.calcTotalPrice();
  };

  onLocalSubsidyChange = (v, { value }) => {
    this.props.onLocalSubsidyChange(v,this.props.local_subsidy[value]);
    this.props.calcTotalPrice();
  };

  render() {
    let govOpt = this.props.gov_subsidy.map((v, i) => {
      return {
        key: i,
        value: i,
        text: `${v.name} (${Common.comma(v.subsidy)}원)`,
        data: v
      };
    });
    let localOpt = this.props.local_subsidy.map((v, i) => {
      return {
        key: i,
        value: i,
        text: `${v.name} (${Common.comma(v.subsidy)}원)`,
        data: v
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
              defaultValue={this.props.selected_gov_subsidy}
              fluid
              deburr
              options={govOpt}
              selection
              search
              onChange={this.onGovSubsidyChange}
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
              defaultValue={this.props.selected_local_subsidy}
              fluid
              deburr
              options={localOpt}
              placeholder="거주지를 선택하세요"
              selection
              search
              onChange={this.onLocalSubsidyChange}
            />
          </Form.Field>
        </Form.Group>
      </div>
    );
  }
}

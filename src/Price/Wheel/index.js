import React, { Component } from "react";
import { Table, Checkbox } from "semantic-ui-react";
import { Common } from "../Common";

export default class Wheel extends Component {
  onClick = (i, v) => {
    this.props.onChange(i, v);
  };

  render() {
    return (
      <Table compact="very" celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>휠</Table.HeaderCell>
            <Table.HeaderCell>사이즈</Table.HeaderCell>
            <Table.HeaderCell>가격</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.options["wheel"].map((v, i) => (
            <Table.Row
              key={i}
              active={this.props.wheel_selected === i}
              disabled={
                (!this.props.performance && v["_only"] === "Performance") ||
                (this.props.performance && v["_only"] === "!Performance")
              }
              hidden={
                (!this.props.performance && v["_only"] === "Performance") ||
                (this.props.performance && v["_only"] === "!Performance")
              }
            >
              <Table.Cell>{v["이름"]}</Table.Cell>
              <Table.Cell>{v["사이즈"]}</Table.Cell>
              <Table.Cell>
                {Common.comma(Common.usdTokrw(v["가격"])) + " 원"}
              </Table.Cell>
              <Table.Cell collapsing>
                <Checkbox
                  radio
                  checked={this.props.wheel_selected === i}
                  onClick={() => this.onClick(i, v)}
                  onChange={this.props.calcTotalPrice}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

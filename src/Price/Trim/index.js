import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { Common } from "../Common";
export default class Trim extends Component {
  onClick = (i, v) => {
    this.props.onChange(i, v);
    this.props.calcTotalPrice();
  };

  render() {
    return (
      <Table compact="very" singleLine size="small" celled selectable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>모델명</Table.HeaderCell>
            <Table.HeaderCell>가격</Table.HeaderCell>
            <Table.HeaderCell>주행거리(EPA)</Table.HeaderCell>
            <Table.HeaderCell>0-60mph</Table.HeaderCell>
            <Table.HeaderCell>구동방식</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.trims.map((v, i) => (
            <Table.Row
              key={i}
              active={this.props.base_selected === i}
              onClick={() => this.onClick(i, v)}
              style={{ cursor: "pointer" }}
            >
              <Table.Cell>{v["이름"]}</Table.Cell>
              <Table.Cell>
                {Common.comma(this.props.usdTokrw(v["가격"])) + " 원"}
              </Table.Cell>
              <Table.Cell>{v["주행거리(km)"] + " km"}</Table.Cell>
              <Table.Cell>{v["0-60"] + " 초"}</Table.Cell>
              <Table.Cell>{v["구동방식"]}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

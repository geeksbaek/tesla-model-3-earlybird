import React, { Component } from "react";
import { Table, Checkbox } from "semantic-ui-react";
import { Common } from "../Common";

export default class AutoPilot extends Component {
  onClick = (v, checked) => {
    this.props.onChange(v, checked);
  };

  render() {
    return (
      <Table compact="very" celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>오토파일럿</Table.HeaderCell>
            <Table.HeaderCell>가격</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.options["autopilot"].map((v, i) => (
            <Table.Row key={i} active={this.props.autopilot_selected === i}>
              <Table.Cell>{v["이름"]}</Table.Cell>
              <Table.Cell>
                {Common.comma(Common.usdTokrw(v["가격"])) + " 원"}
              </Table.Cell>
              <Table.Cell collapsing>
                <Checkbox
                  onClick={(_, value) => this.onClick(v, value.checked)}
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

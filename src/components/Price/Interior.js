import React, { Component } from "react";
import { Table, Popup, Icon } from "semantic-ui-react";
import { Common } from "./Common";

export default class Interior extends Component {
  onClick = (i, v) => {
    this.props.onChange(i, v);
    this.props.calcTotalPrice();
  };

  render() {
    return (
      <Table
        compact="very"
        singleLine
        size="small"
        celled
        selectable
        fixed
        unstackable
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>인테리어</Table.HeaderCell>
            <Table.HeaderCell>가격</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.options["interior"].map((v, i) => (
            <Table.Row
              key={i}
              active={this.props.interior_selected === i}
              onClick={() => this.onClick(i, v)}
              style={{ cursor: "pointer" }}
            >
              {v["설명"] ? (
                <Table.Cell>
                  {v["이름"]}{" "}
                  <Popup
                    trigger={<Icon name="question circle outline" />}
                    position="top center"
                  >
                    <Popup.Content>{v["설명"]}</Popup.Content>
                  </Popup>
                </Table.Cell>
              ) : (
                <Table.Cell>{v["이름"]}</Table.Cell>
              )}
              <Table.Cell>
                {Common.comma(this.props.usdTokrw(v["가격"])) + " 원"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

import React, { Component } from "react";
import { Table, Popup, Icon, List } from "semantic-ui-react";
import { Common } from "../Common";

export default class AutoPilot extends Component {
  onClick = (v, checked) => {
    this.props.onChange(v, checked);
    this.props.calcTotalPrice();
  };

  render() {
    return (
      <Table compact="very" singleLine size="small" celled selectable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>오토파일럿</Table.HeaderCell>
            <Table.HeaderCell>가격</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.options["autopilot"].map((v, i) => (
            <Table.Row
              key={i}
              active={this.props.autopilot_selected === i}
              onClick={() => this.onClick(i, v)}
              style={{ cursor: "pointer" }}
            >
              <Table.Cell>
                {v["이름"]}{" "}
                <Popup
                  trigger={<Icon name="question circle outline" />}
                  position="top center"
                >
                  <Popup.Content>
                    <List as="ul">
                      {v["설명"].split("\n").map((v, i) => {
                        return (
                          <List.Item as="li" key={i}>
                            {v}
                          </List.Item>
                        );
                      })}
                    </List>
                  </Popup.Content>
                </Popup>
              </Table.Cell>
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

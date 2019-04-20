import React, { Component } from "react";
import {
  Button,
  Divider,
  Card,
  List,
  Popup,
  Label,
  Icon
} from "semantic-ui-react";
import { Common } from "../Common";

export default class Cash extends Component {
  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header textAlign="center">예상 현금 가격</Card.Header>
        </Card.Content>
        <Card.Content>
          <List>
            <List.Item>
              <List.Content>
                <List.Description>
                  <List>
                    {this.props.selectedOptions().map((v, i) => (
                      <List.Item key={i}>
                        <Label
                          as="a"
                          horizontal
                          color={v["가격"] > 0 ? "red" : null}
                        >
                          {v["이름"]}
                          <Label.Detail>
                            {Common.comma(this.props.usdTokrw(v["가격"])) +
                              "원"}
                          </Label.Detail>
                        </Label>
                      </List.Item>
                    ))}
                  </List>
                </List.Description>
              </List.Content>
            </List.Item>
            <Divider />
            <List.Item>
              <List.Icon name="car" />
              <List.Content>
                <List.Header style={{ color: "grey" }}>
                  {Common.comma(this.props.total_price) + " 원"}
                </List.Header>
                <List.Description>차량 공장도 가격</List.Description>
              </List.Content>
            </List.Item>
            <Divider />
            <List.Item>
              <List.Icon name="plus" />
              <List.Content>
                <List.Header style={{ color: "orange" }}>
                  {Common.comma(this.props.calcFuncs["부가가치세"]()) + " 원"}
                </List.Header>
                <List.Description>부가가치세</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <Popup
                trigger={
                  <List.Content>
                    <List.Header
                      style={
                        this.props.calcFuncs["개별소비세"]() > 0
                          ? { color: "orange" }
                          : { color: "green" }
                      }
                    >
                      {Common.comma(this.props.calcFuncs["개별소비세"]()) +
                        " 원"}
                    </List.Header>
                    <List.Description>개별소비세</List.Description>{" "}
                  </List.Content>
                }
                content={
                  Common.comma(this.props.calcFuncs["개별소비세_과세"]()) +
                  "원 중 " +
                  Common.comma(this.props.calcFuncs["개별소비세_감면"]()) +
                  "원 감면됨"
                }
                size="small"
              />
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <Popup
                trigger={
                  <List.Content>
                    <List.Header
                      style={
                        this.props.calcFuncs["교육세"]() > 0
                          ? { color: "orange" }
                          : { color: "green" }
                      }
                    >
                      {Common.comma(this.props.calcFuncs["교육세"]()) + " 원"}
                    </List.Header>
                    <List.Description>교육세</List.Description>
                  </List.Content>
                }
                content={
                  Common.comma(this.props.calcFuncs["교육세_과세"]()) +
                  "원 중 " +
                  Common.comma(this.props.calcFuncs["교육세_감면"]()) +
                  "원 감면됨"
                }
                size="small"
              />
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <Popup
                trigger={
                  <List.Content>
                    <List.Header
                      style={
                        this.props.calcFuncs["취득세"]() > 0
                          ? { color: "orange" }
                          : { color: "green" }
                      }
                    >
                      {Common.comma(this.props.calcFuncs["취득세"]()) + " 원"}
                    </List.Header>
                    <List.Description>취득세</List.Description>
                  </List.Content>
                }
                content={
                  Common.comma(this.props.calcFuncs["취득세_과세"]()) +
                  "원 중 " +
                  Common.comma(this.props.calcFuncs["취득세_감면"]()) +
                  "원 감면됨"
                }
                size="small"
              />
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <Popup
                trigger={
                  <List.Content>
                    <List.Header style={{ color: "orange" }}>
                      {Common.comma(this.props.calcFuncs["자동차세"]()) + " 원"}
                    </List.Header>
                    <List.Description>자동차세</List.Description>
                  </List.Content>
                }
                content="비영업용 기준"
                size="small"
              />
            </List.Item>
            <Divider />
            <List.Item>
              <List.Icon name="minus" />
              <List.Content>
                <List.Header style={{ color: "green" }}>
                  {Common.comma(
                    this.props.gov_subsidy ? this.props.gov_subsidy.subsidy : 0
                  ) + " 원"}
                </List.Header>
                <List.Description>정부 보조금</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="minus" />
              <List.Content>
                <List.Header style={{ color: "green" }}>
                  {Common.comma(
                    this.props.local_subsidy
                      ? this.props.local_subsidy.subsidy
                      : 0
                  ) + " 원"}
                </List.Header>
                <List.Description>지방자치단체 보조금</List.Description>
              </List.Content>
            </List.Item>
            <Divider />
            <List.Item>
              <List.Icon name="calculator" />
              <Popup
                trigger={
                  <List.Content>
                    <List.Header>
                      {Common.comma(
                        this.props.calcFuncs["보조금_감면_후_차량가격"]() +
                          this.props.calcFuncs["취득세"]() +
                          this.props.calcFuncs["자동차세"]()
                      ) + " 원"}
                    </List.Header>
                    <List.Description>최종 가격</List.Description>
                  </List.Content>
                }
                content="취득세 포함"
                size="small"
              />
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content extra textAlign="right">
          <Button
            href="https://www.tesla.com/ko_KR/model3/reserve"
            target="_blank"
            compact
            fluid
          >
            Model 3 사전 예약
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

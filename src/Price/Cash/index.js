import React, { Component } from "react";
import { Button, Divider, Card, List, Popup, Label } from "semantic-ui-react";
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
                        <Label as="a" horizontal>
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
                  {Common.comma(this.props.calcFuncs()["부가가치세_과세"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>부가가치세</List.Description>}
                  content="취득 당시 가액의 10%"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <List.Content>
                <List.Header style={{ color: "orange" }}>
                  {Common.comma(this.props.calcFuncs()["개별소비세_과세"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>개별소비세</List.Description>}
                  content="공장도 가격의 5%"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="minus" />
              <List.Content>
                <List.Header style={{ color: "green" }}>
                  {Common.comma(this.props.calcFuncs()["개별소비세_감면"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>개별소비세 감면</List.Description>}
                  content="최대 300만원 감면"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <List.Content>
                <List.Header style={{ color: "orange" }}>
                  {Common.comma(this.props.calcFuncs()["교육세_과세"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>교육세</List.Description>}
                  content="개별소비세의 30%"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="minus" />
              <List.Content>
                <List.Header style={{ color: "green" }}>
                  {Common.comma(this.props.calcFuncs()["교육세_감면"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>교육세 감면</List.Description>}
                  content="최대 90만원 감면"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="plus" />
              <List.Content>
                <List.Header style={{ color: "orange" }}>
                  {Common.comma(this.props.calcFuncs()["취득세_과세"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>취득세</List.Description>}
                  content="(공장도 가격 + 개별소비세 + 교육세)의 7%"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="minus" />
              <List.Content>
                <List.Header style={{ color: "green" }}>
                  {Common.comma(this.props.calcFuncs()["취득세_감면"]()) +
                    " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>취득세 감면</List.Description>}
                  content="최대 140만원 감면"
                  size="small"
                />
              </List.Content>
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
              <List.Icon name="plus" />
              <List.Content>
                <List.Header style={{ color: "orange" }}>
                  {Common.comma(
                    this.props.calcFuncs()["취득세_과세"]() -
                      this.props.calcFuncs()["취득세_감면"]()
                  ) + " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>취득세</List.Description>}
                  content="감면 후 금액"
                  size="small"
                />
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="calculator" />
              <List.Content>
                <List.Header>
                  {Common.comma(this.props.calcFuncs()["최종가격"]()) + " 원"}
                </List.Header>
                <Popup
                  trigger={<List.Description>최종 가격</List.Description>}
                  content="취득세 별도"
                  size="small"
                />
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content extra textAlign="right">
          <Button
            color="red"
            href="https://www.tesla.com/ko_KR/model3/reserve"
            target="_blank"
          >
            사전 예약
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

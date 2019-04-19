import React, { Component } from "react";
import {
  Button,
  Divider,
  Card,
  List,
  Popup,
  Form,
  Input,
  Segment
} from "semantic-ui-react";
import { Common } from "../Common";

export default class Loan extends Component {
  state = { prepay: 0, annual_loan_interest_rate: 4, installment_months: 60 };

  render() {
    return (
      <div>
        <Segment>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                width={1}
                readOnly
                control={Input}
                label="선납금1 (보조금)"
                placeholder="선납금1"
                value={Common.comma(this.props.calcFuncs()["전기차_보조금"]())}
              />
              <Form.Field
                width={1}
                control={Input}
                label="선납금2 (그 외)"
                placeholder="선납금2"
                value={Common.comma(this.state.prepay || "")}
                onChange={(e, { value }) => {
                  if (value.match(/[^\d,]/g)) {
                    return;
                  }
                  this.setState({
                    prepay: Number(value.replace(/[,.]/g, ""))
                  });
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                width={1}
                type="number"
                control={Input}
                label="할부 연이율 (%)"
                error={this.state.annual_loan_interest_rate === 0}
                value={this.state.annual_loan_interest_rate || ""}
                onChange={(e, { value }) => {
                  this.setState({
                    annual_loan_interest_rate: Number(value)
                  });
                }}
              />
              <Form.Field
                width={1}
                type="number"
                control={Input}
                label="할부 개월 수"
                error={this.state.installment_months === 0}
                value={this.state.installment_months || ""}
                onChange={(e, { value }) => {
                  this.setState({
                    installment_months: Number(value)
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Segment>
        <Card fluid>
          <Card.Content>
            <Card.Header textAlign="center">예상 할부 결제액</Card.Header>
          </Card.Content>
          <Card.Content>
            <List>
              <List.Item>
                <List.Icon name="car" />
                <List.Content>
                  <List.Header style={{ color: "grey" }}>
                    {Common.comma(this.props.calcFuncs()["할부원금"]()) + " 원"}
                  </List.Header>
                  <Popup
                    trigger={<List.Description>할부원금</List.Description>}
                    content="공장도 가격 + 부가가치세 + 개별소비세 + 교육세"
                    size="small"
                  />
                </List.Content>
              </List.Item>
              <Divider />
              <List.Item>
                <List.Icon name="minus" />
                <List.Content>
                  <List.Header style={{ color: "green" }}>
                    {Common.comma(this.props.calcFuncs()["전기차_보조금"]()) +
                      " 원"}
                  </List.Header>
                  <Popup
                    trigger={<List.Description>선납금1</List.Description>}
                    content="정부 보조금 + 지방자치단체 보조금"
                    size="small"
                  />
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name="minus" />
                <List.Content>
                  <List.Header style={{ color: "green" }}>
                    {Common.comma(this.state.prepay) + " 원"}
                  </List.Header>
                  <List.Description>선납금2</List.Description>
                </List.Content>
              </List.Item>
              <Divider />
              <List.Item>
                <List.Icon name="won sign" />
                <List.Content>
                  <List.Header>
                    {Common.comma(
                      this.props.calcFuncs()["할부원금"]() -
                        this.props.calcFuncs()["전기차_보조금"]() -
                        this.state.prepay
                    ) + " 원"}
                  </List.Header>
                  <Popup
                    trigger={<List.Description>대출원금</List.Description>}
                    content="할부원금 - 선납금"
                    size="small"
                  />
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
                    {Common.comma(
                      this.props
                        .calcFuncs()
                        ["원리금균등상환_월납입금"](
                          this.props.calcFuncs()["할부원금"]() -
                            this.props.calcFuncs()["전기차_보조금"]() -
                            this.state.prepay,
                          this.state.annual_loan_interest_rate,
                          this.state.installment_months
                        )
                    ) + " 원"}
                  </List.Header>
                  <Popup
                    trigger={<List.Description>월상환금</List.Description>}
                    content="원리금 균등상환방식 (취득세 별도)"
                    size="small"
                  />
                </List.Content>
              </List.Item>
            </List>
          </Card.Content>
          <Card.Content extra textAlign="right">
            <Button
              primary
              as="a"
              href="https://www.tesla.com/ko_KR/model3/reserve"
              target="_blank"
            >
              사전 예약
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

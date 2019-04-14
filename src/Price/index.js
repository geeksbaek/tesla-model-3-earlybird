import React, { Component } from "react";
import {
  Segment,
  Input,
  Grid,
  Form,
  Checkbox,
  Divider,
  Message,
  Card,
  Header,
  List,
  Label,
  Table
} from "semantic-ui-react";
import axios from "axios";
import YAML from "yamljs";

import "./index.css";

export default class Price extends Component {
  state = {
    trims: [],
    options: { color: [], interior: [], wheal: [], autopilot: [] },
    saletex: {
      개별소비세: { 과세: 0, 감면: 0 },
      교육세: { 과세: 0, 감면: 0 },
      취득세: { 과세: 0, 감면: 0 }
    },

    performance_index: -1,

    base_selected: 0,
    base_price: 0,
    color_selected: 0,
    color_price: 0,
    wheal_selected: 0,
    wheal_price: 0,
    interior_selected: 0,
    interior_price: 0,
    autopilot_price: 0,
    total_price: 0,
    ev_sale_price: 1400,
    final_price: 0
  };

  usdTokrw = usd => (usd * 1134.72).toFixed(0);
  comma = x =>
    Number(x)
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  calcTotalPrice = () =>
    this.setState(prev => {
      return {
        total_price:
          (Number(prev.base_price) +
            Number(prev.color_price) +
            Number(prev.wheal_price) +
            Number(prev.interior_price) +
            Number(prev.autopilot_price)) *
          1.1
      };
    });
  개별소비세_과세 = () =>
    this.state.total_price * this.state.saletex.개별소비세.과세;
  개별소비세_감면 = () =>
    Math.min(this.개별소비세_과세(), this.state.saletex.개별소비세.감면);
  교육세_과세 = () => this.개별소비세_과세() * this.state.saletex.교육세.과세;
  교육세_감면 = () =>
    Math.min(this.교육세_과세(), this.state.saletex.교육세.감면);
  취득세_과세 = () =>
    (this.state.total_price + this.개별소비세_과세() + this.교육세_과세()) *
    this.state.saletex.취득세.과세;
  취득세_감면 = () =>
    Math.min(this.취득세_과세(), this.state.saletex.취득세.감면);
  전기차_보조금 = () => this.state.ev_sale_price * 10000;
  최종가격 = () =>
    Math.max(
      this.state.total_price +
        this.state.total_price * 0.1 +
        this.개별소비세_과세() -
        this.개별소비세_감면() +
        this.교육세_과세() -
        this.교육세_감면() +
        this.취득세_과세() -
        this.취득세_감면() -
        this.전기차_보조금(),
      0
    );

  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/model_3.yaml"
      )
      .then(res => {
        let data = YAML.parse(res.data);
        this.setState({
          trims: data.trims,
          options: data.options,
          base_price: this.usdTokrw(data.trims[0]["가격"]),
          base_selected: 0
        });
        data.trims.map((v, i) => {
          if (v["이름"] === "Performance") {
            this.setState({ performance_index: i });
          }
        });
        this.calcTotalPrice();
      });

    axios
      .get(
        "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/saletex.yaml"
      )
      .then(res => {
        let data = YAML.parse(res.data);
        console.log(data);
        this.setState({
          saletex: {
            개별소비세: {
              과세: data["개별소비세"]["과세"],
              감면: data["개별소비세"]["감면"]
            },
            교육세: {
              과세: data["교육세"]["과세"],
              감면: data["교육세"]["감면"]
            },
            취득세: {
              과세: data["취득세"]["과세"],
              감면: data["취득세"]["감면"]
            }
          }
        });
      });
  }

  render() {
    return (
      <Segment textAlign="left" className="SegmentGroup">
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <Form>
              <Form.Group>
                <Table compact celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>모델명</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell>주행거리</Table.HeaderCell>
                      <Table.HeaderCell>0-60 마일/h</Table.HeaderCell>
                      <Table.HeaderCell>구동방식</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.state.trims.map((v, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{v["이름"]}</Table.Cell>
                        <Table.Cell>
                          {this.comma(this.usdTokrw(v["가격"])) + " 원"}
                        </Table.Cell>
                        <Table.Cell>{v["주행거리(km)"] + " km"}</Table.Cell>
                        <Table.Cell>{v["0-60"] + " 초"}</Table.Cell>
                        <Table.Cell>{v["구동방식"]}</Table.Cell>
                        <Table.Cell collapsing>
                          <Checkbox
                            radio
                            checked={this.state.base_selected === i}
                            onClick={() => {
                              this.setState({
                                base_price: this.usdTokrw(v["가격"]),
                                base_selected: i
                              });
                              if (v["이름"] === "Performance") {
                                this.setState({
                                  wheal_price: 0,
                                  wheal_selected: 2
                                });
                              } else {
                                this.setState({
                                  wheal_price: 0,
                                  wheal_selected: 0
                                });
                              }
                            }}
                            onChange={this.calcTotalPrice}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Form.Group>

              <Form.Group>
                <Table compact celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>색상</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.state.options["color"].map((v, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{v["이름"]}</Table.Cell>
                        <Table.Cell>
                          {this.comma(this.usdTokrw(v["가격"])) + " 원"}
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Checkbox
                            radio
                            checked={this.state.color_selected === i}
                            onClick={() => {
                              this.setState({
                                color_price: this.usdTokrw(v["가격"]),
                                color_selected: i
                              });
                            }}
                            onChange={this.calcTotalPrice}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Form.Group>

              <Form.Group>
                <Table compact celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>휠</Table.HeaderCell>
                      <Table.HeaderCell>사이즈</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.state.options["wheal"].map((v, i) => (
                      <Table.Row
                        key={i}
                        disabled={
                          (this.state.base_selected !==
                            this.state.performance_index &&
                            v["_only"] === "Performance") ||
                          (this.state.base_selected ===
                            this.state.performance_index &&
                            v["_only"] === "!Performance")
                        }
                      >
                        <Table.Cell>{v["이름"]}</Table.Cell>
                        <Table.Cell>{v["사이즈"]}</Table.Cell>
                        <Table.Cell>
                          {this.comma(this.usdTokrw(v["가격"])) + " 원"}
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Checkbox
                            radio
                            checked={this.state.wheal_selected === i}
                            onClick={() => {
                              this.setState({
                                wheal_price: this.usdTokrw(v["가격"]),
                                wheal_selected: i
                              });
                            }}
                            onChange={this.calcTotalPrice}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Form.Group>

              <Form.Group>
                <Table compact celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>인테리어</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.state.options["interior"].map((v, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{v["이름"]}</Table.Cell>
                        <Table.Cell>
                          {this.comma(this.usdTokrw(v["가격"])) + " 원"}
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Checkbox
                            radio
                            checked={this.state.interior_selected === i}
                            onClick={() => {
                              this.setState({
                                interior_price: this.usdTokrw(v["가격"]),
                                interior_selected: i
                              });
                            }}
                            onChange={this.calcTotalPrice}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Form.Group>

              <Form.Group>
                <Table compact celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>오토파일럿</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.state.options["autopilot"].map((v, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{v["이름"]}</Table.Cell>
                        <Table.Cell>
                          {this.comma(this.usdTokrw(v["가격"])) + " 원"}
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Checkbox
                            onClick={(e, value) => {
                              if (value.checked) {
                                this.setState({
                                  autopilot_price: this.usdTokrw(v["가격"])
                                });
                              } else {
                                this.setState({
                                  autopilot_price: 0
                                });
                              }
                            }}
                            onChange={this.calcTotalPrice}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Form.Group>

              <Header size="tiny">전기차 보조금</Header>
              <Input
                type="number"
                labelPosition="right"
                placeholder="전기차 보조금"
                value={this.state.ev_sale_price}
                onChange={(e, { value }) =>
                  this.setState({ ev_sale_price: Number(value) })
                }
              >
                <input />
                <Label>만원</Label>
              </Input>
            </Form>
          </Grid.Column>

          <Grid.Column>
            <Message info>
              <Message.List>
                <Message.Header>먼저 읽어주세요</Message.Header>
                <Divider hidden fitted />
                <Divider hidden fitted />
                <Divider hidden fitted />
                <Divider hidden fitted />
                <Message.Item>
                  여기에서 표기되는 모든 가격은 USD를 현재 시간 기준의 환율을
                  적용하여 KRW으로 나타낸 것입니다.
                </Message.Item>
                <Message.Item>
                  구입에 필요한 최소한의 옵션이 미리 선택되어 있습니다.
                </Message.Item>
                <Message.Item>
                  보조금 항목은 정부 및 해당 지자체의 전기차 보조금을 합산하여
                  입력하셔야 합니다.
                </Message.Item>
                <Message.Item>
                  계산된 가격과 실제 가격은 차이가 발생할 수 있으며 이로 인해
                  발생하는 문제에 대한 책임은 사용자에게 있습니다.
                </Message.Item>
              </Message.List>
            </Message>

            <Card>
              <Card.Content>
                <Card.Header>Model 3 가격 계산 결과</Card.Header>
              </Card.Content>
              <Card.Content>
                <List>
                  <List.Item>
                    <List.Icon name="car" />
                    <List.Content>
                      <List.Header>
                        {this.comma(this.state.total_price)}
                      </List.Header>
                      <List.Description>
                        차량 가격 (부가세 10% 포함)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <Divider />
                  <List.Item>
                    <List.Icon name="plus" />
                    <List.Content>
                      <List.Header style={{ color: "orange" }}>
                        {this.comma(this.개별소비세_과세())}
                      </List.Header>
                      <List.Description>
                        개별소비세 (차량가액의 5% 과세)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="minus" />
                    <List.Content>
                      <List.Header style={{ color: "green" }}>
                        {this.comma(this.개별소비세_감면())}
                      </List.Header>
                      <List.Description>
                        개별소비세 감면 (최대 300만원 감면)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="plus" />
                    <List.Content>
                      <List.Header style={{ color: "orange" }}>
                        {this.comma(this.교육세_과세())}
                      </List.Header>
                      <List.Description>
                        교육세 (개별소비세의 30% 과세)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="minus" />
                    <List.Content>
                      <List.Header style={{ color: "green" }}>
                        {this.comma(this.교육세_감면())}
                      </List.Header>
                      <List.Description>
                        교육세 감면 (최대 90만원 감면)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="plus" />
                    <List.Content>
                      <List.Header style={{ color: "orange" }}>
                        {this.comma(this.취득세_과세())}
                      </List.Header>
                      <List.Description>
                        취득세 (차량 가격의 7% 과세)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="minus" />
                    <List.Content>
                      <List.Header style={{ color: "green" }}>
                        {this.comma(this.취득세_감면())}
                      </List.Header>
                      <List.Description>
                        취득세 감면 (최대 140만원 감면)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <Divider />
                  <List.Item>
                    <List.Icon name="minus" />
                    <List.Content>
                      <List.Header style={{ color: "green" }}>
                        {this.comma(this.전기차_보조금())}
                      </List.Header>
                      <List.Description>
                        전기차 보조금 (정부 보조금 900만원 + 지자체 보조금)
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <Divider />
                  <List.Item>
                    <List.Icon name="won sign" />
                    <List.Content>
                      <List.Header>{this.comma(this.최종가격())}</List.Header>
                      <List.Description>최종 가격</List.Description>
                    </List.Content>
                  </List.Item>
                </List>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>

        <Divider vertical />
      </Segment>
    );
  }
}

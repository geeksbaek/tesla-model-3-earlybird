import React, { Component } from "react";
import {
  Segment,
  Grid,
  Form,
  Responsive,
  Divider,
  Message,
  Accordion,
  Icon,
  Tab
} from "semantic-ui-react";
import axios from "axios";
import YAML from "yamljs";

import { Common } from "./Common";
import Trim from "./Trim";
import Color from "./Color";
import Wheels from "./Wheels";
import Interior from "./Interior";
import AutoPilot from "./AutoPilot";
import Subsidy from "./Subsidy";
import Cash from "./Cash";
import Loan from "./Loan";

import "./index.css";

export default class Price extends Component {
  state = {
    trims: [],
    options: { color: [], interior: [], wheels: [], autopilot: [] },
    saletex: {
      개별소비세: { 과세: 0, 감면: 0 },
      교육세: { 과세: 0, 감면: 0 },
      취득세: { 과세: 0, 감면: 0 }
    },
    subsidy_list: [],
    loadingA: true,
    loadingB: true,
    performance_index: -1,

    base_selected: 0,
    base_price: 0,
    color_selected: 0,
    color_price: 0,
    wheels_selected: 0,
    wheels_price: 0,
    interior_selected: 0,
    interior_price: 0,
    autopilot_selected: 0,
    autopilot_price: 0,
    total_price: 0,
    gov_subsidy: 0,
    local_subsidy: 0,
    final_price: 0,
    prepay: 0,
    annual_loan_interest_rate: 3.5,
    installment_months: 60,
    activeIndex: -1
  };

  onAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  onTrimChange = (i, v) => {
    this.setState({
      base_price: Common.usdTokrw(v["가격"]),
      base_selected: i,
      wheels_price: 0,
      wheels_selected:
        v["이름"] === "Performance"
          ? 2
          : this.state.wheels_selected === 2
          ? 0
          : this.state.wheels_selected
    });
  };

  onColorChange = (i, v) => {
    this.setState({
      color_price: Common.usdTokrw(v["가격"]),
      color_selected: i
    });
  };

  onWheelsChange = (i, v) => {
    this.setState({
      wheels_price: Common.usdTokrw(v["가격"]),
      wheels_selected: i
    });
  };

  onInteriorChange = (i, v) => {
    this.setState({
      interior_price: Common.usdTokrw(v["가격"]),
      interior_selected: i
    });
  };

  onAutoPilotChange = (i, v) => {
    this.setState({
      autopilot_price: Common.usdTokrw(v["가격"]),
      autopilot_selected: i
    });
  };

  selectedOptions = () => {
    if (this.state.trims.length === 0) return [];
    return [
      this.state.trims[this.state.base_selected],
      this.state.options["color"][this.state.color_selected],
      this.state.options["wheels"][this.state.wheels_selected],
      this.state.options["interior"][this.state.interior_selected],
      this.state.options["autopilot"][this.state.autopilot_selected]
    ];
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
          Number(prev.base_price) +
          Number(prev.color_price) +
          Number(prev.wheels_price) +
          Number(prev.interior_price) +
          Number(prev.autopilot_price)
      };
    });
  calcFuncs = () => {
    return {
      부가가치세_과세: () => this.state.total_price * 0.1,
      개별소비세_과세: () =>
        this.state.total_price * this.state.saletex.개별소비세.과세,
      개별소비세_감면: () =>
        Math.min(
          this.state.total_price * this.state.saletex.개별소비세.과세,
          this.state.saletex.개별소비세.감면
        ),
      교육세_과세: () =>
        this.state.total_price *
        this.state.saletex.개별소비세.과세 *
        this.state.saletex.교육세.과세,
      교육세_감면: () =>
        Math.min(
          this.state.total_price *
            this.state.saletex.개별소비세.과세 *
            this.state.saletex.교육세.과세,
          this.state.saletex.교육세.감면
        ),
      취득세_과세: () =>
        (this.state.total_price +
          (this.state.total_price * this.state.saletex.개별소비세.과세 -
            Math.min(
              this.state.total_price * this.state.saletex.개별소비세.과세,
              this.state.saletex.개별소비세.감면
            )) +
          (this.state.total_price *
            this.state.saletex.개별소비세.과세 *
            this.state.saletex.교육세.과세 -
            Math.min(
              this.state.total_price *
                this.state.saletex.개별소비세.과세 *
                this.state.saletex.교육세.과세,
              this.state.saletex.교육세.감면
            ))) *
        this.state.saletex.취득세.과세,
      취득세_감면: () =>
        Math.min(
          (this.state.total_price +
            (this.state.total_price * this.state.saletex.개별소비세.과세 -
              Math.min(
                this.state.total_price * this.state.saletex.개별소비세.과세,
                this.state.saletex.개별소비세.감면
              )) +
            (this.state.total_price *
              this.state.saletex.개별소비세.과세 *
              this.state.saletex.교육세.과세 -
              Math.min(
                this.state.total_price *
                  this.state.saletex.개별소비세.과세 *
                  this.state.saletex.교육세.과세,
                this.state.saletex.교육세.감면
              ))) *
            this.state.saletex.취득세.과세,
          this.state.saletex.취득세.감면
        ),
      전기차_보조금: () => this.state.gov_subsidy + this.state.local_subsidy,
      할부원금: () =>
        Math.max(
          this.state.total_price +
            this.state.total_price * 0.1 +
            this.state.total_price * this.state.saletex.개별소비세.과세 -
            Math.min(
              this.state.total_price * this.state.saletex.개별소비세.과세,
              this.state.saletex.개별소비세.감면
            ) +
            this.state.total_price *
              this.state.saletex.개별소비세.과세 *
              this.state.saletex.교육세.과세 -
            Math.min(
              this.state.total_price *
                this.state.saletex.개별소비세.과세 *
                this.state.saletex.교육세.과세,
              this.state.saletex.교육세.감면
            ),
          0
        ),
      최종가격: () =>
        Math.max(
          this.state.total_price +
            this.state.total_price * 0.1 +
            this.state.total_price * this.state.saletex.개별소비세.과세 -
            Math.min(
              this.state.total_price * this.state.saletex.개별소비세.과세,
              this.state.saletex.개별소비세.감면
            ) +
            this.state.total_price *
              this.state.saletex.개별소비세.과세 *
              this.state.saletex.교육세.과세 -
            Math.min(
              this.state.total_price *
                this.state.saletex.개별소비세.과세 *
                this.state.saletex.교육세.과세,
              this.state.saletex.교육세.감면
            ) -
            (this.state.gov_subsidy + this.state.local_subsidy),
          0
        ),
      원리금균등상환_월납입금: (대출원금, 연이자율, 할부개월) => {
        let 월이자율 = (연이자율 / 12) * 0.01;
        let x = Math.pow(1 + 월이자율, 할부개월);
        return (대출원금 * 월이자율 * x) / (x - 1);
      }
    };
  };
  // 부가가치세_과세 = () => this.state.total_price * 0.1;
  // 개별소비세_과세 = () =>
  //   this.state.total_price * this.state.saletex.개별소비세.과세;
  // 개별소비세_감면 = () =>
  //   Math.min(this.개별소비세_과세(), this.state.saletex.개별소비세.감면);
  // 교육세_과세 = () => this.개별소비세_과세() * this.state.saletex.교육세.과세;
  // 교육세_감면 = () =>
  //   Math.min(this.교육세_과세(), this.state.saletex.교육세.감면);
  // 취득세_과세 = () =>
  //   (this.state.total_price +
  //     (this.개별소비세_과세() - this.개별소비세_감면()) +
  //     (this.교육세_과세() - this.교육세_감면())) *
  //   this.state.saletex.취득세.과세;
  // 취득세_감면 = () =>
  //   Math.min(this.취득세_과세(), this.state.saletex.취득세.감면);
  // 전기차_보조금 = () => this.state.gov_subsidy + this.state.local_subsidy;
  // 할부원금 = () =>
  //   Math.max(
  //     this.state.total_price +
  //       this.부가가치세_과세() +
  //       this.개별소비세_과세() -
  //       this.개별소비세_감면() +
  //       this.교육세_과세() -
  //       this.교육세_감면(),
  //     0
  //   );
  // 최종가격 = () =>
  //   Math.max(
  //     this.state.total_price +
  //       this.부가가치세_과세() +
  //       this.개별소비세_과세() -
  //       this.개별소비세_감면() +
  //       this.교육세_과세() -
  //       this.교육세_감면() -
  //       this.전기차_보조금(),
  //     0
  //   );
  // 원리금균등상환_월납입금 = (대출원금, 연이자율, 할부개월) => {
  //   let 월이자율 = (연이자율 / 12) * 0.01;
  //   let x = Math.pow(1 + 월이자율, 할부개월);
  //   return (대출원금 * 월이자율 * x) / (x - 1);
  // };

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
          base_selected: 0,
          loadingA: false
        });
        data.trims.forEach((v, i) => {
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
          },
          loadingB: false
        });
      });

    axios
      .get(
        "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/subsidy.json"
      )
      .then(res => {
        this.setState({
          gov_subsidy: res.data.gov,
          subsidy_list: res.data.local
        });
      });
  }

  render() {
    return (
      <Segment
        textAlign="left"
        className="SegmentGroup"
        loading={this.state.loadingA && this.state.loadingB}
      >
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
              거주지를 선택하면 해당 지자체에서 지급하는 승용 전기차 보조금과
              정부에서 지급하는 전기차 보조금이 최종 가격에 반영됩니다.
            </Message.Item>
            <Message.Item>
              계산된 가격과 실제 가격은 차이가 발생할 수 있으며 이로 인해
              발생하는 문제에 대한 책임은 사용자에게 있습니다.
            </Message.Item>
          </Message.List>
        </Message>

        <Responsive
          as={Segment}
          basic
          minWidth={Responsive.onlyTablet.minWidth}
        >
          <Grid columns={2}>
            <Grid.Column>
              <Form>
                <Form.Group>
                  <Trim
                    base_selected={this.state.base_selected}
                    trims={this.state.trims}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onTrimChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Color
                    color_selected={this.state.color_selected}
                    options={this.state.options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onColorChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Wheels
                    performance={
                      this.state.base_selected === this.state.performance_index
                    }
                    wheels_selected={this.state.wheels_selected}
                    options={this.state.options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onWheelsChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Interior
                    interior_selected={this.state.interior_selected}
                    options={this.state.options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onInteriorChange}
                  />
                </Form.Group>
                <Form.Group>
                  <AutoPilot
                    autopilot_selected={this.state.autopilot_selected}
                    options={this.state.options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onAutoPilotChange}
                  />
                </Form.Group>

                <Divider hidden />
                <Form.Group>
                  <Subsidy
                    onChange={(e, { value }) => {
                      this.setState({
                        local_subsidy: this.state.subsidy_list[value].subsidy
                      });
                    }}
                    subsidy_list={this.state.subsidy_list}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Tab
                menu={{ secondary: true, pointing: true }}
                panes={[
                  {
                    menuItem: "현금",
                    render: () => (
                      <Cash
                        total_price={this.state.total_price}
                        gov_subsidy={this.state.gov_subsidy}
                        local_subsidy={this.state.local_subsidy}
                        calcFuncs={this.calcFuncs}
                        selectedOptions={this.selectedOptions}
                      />
                    )
                  },
                  {
                    menuItem: "할부",
                    render: () => (
                      <Loan
                        prepay={this.state.prepay}
                        annual_loan_interest_rate={
                          this.state.annual_loan_interest_rate
                        }
                        installment_months={this.state.installment_months}
                        onPrepayChange={(e, { value }) => {
                          if (value.match(/[^\d,]/g)) {
                            return;
                          }
                          this.setState({
                            prepay: Number(value.replace(/[,.]/g, ""))
                          });
                        }}
                        onLoanRateChange={(e, { value }) => {
                          this.setState({
                            annual_loan_interest_rate: Number(value)
                          });
                        }}
                        onMonthsChange={(e, { value }) => {
                          this.setState({
                            installment_months: Number(value)
                          });
                        }}
                        calcFuncs={this.calcFuncs}
                        selectedOptions={this.selectedOptions}
                      />
                    )
                  }
                ]}
              />
            </Grid.Column>
          </Grid>
        </Responsive>

        <Responsive {...Responsive.onlyMobile}>
          <Accordion>
            <Accordion.Title
              active={this.state.activeIndex === 0}
              index={0}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              트림
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 0}>
              <Trim
                base_selected={this.state.base_selected}
                trims={this.state.trims}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onTrimChange}
              />
            </Accordion.Content>

            <Accordion.Title
              active={this.state.activeIndex === 1}
              index={1}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              색상
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 1}>
              <Color
                color_selected={this.state.color_selected}
                options={this.state.options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onColorChange}
              />
            </Accordion.Content>

            <Accordion.Title
              active={this.state.activeIndex === 2}
              index={2}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />휠
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 2}>
              <Wheels
                performance={
                  this.state.base_selected === this.state.performance_index
                }
                wheels_selected={this.state.wheels_selected}
                options={this.state.options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onWheelsChange}
              />
            </Accordion.Content>

            <Accordion.Title
              active={this.state.activeIndex === 3}
              index={3}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              인테리어
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 3}>
              <Interior
                interior_selected={this.state.interior_selected}
                options={this.state.options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onInteriorChange}
              />
            </Accordion.Content>

            <Accordion.Title
              active={this.state.activeIndex === 4}
              index={4}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              오토파일럿
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 4}>
              <AutoPilot
                autopilot_selected={this.state.autopilot_selected}
                options={this.state.options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onAutoPilotChange}
              />
            </Accordion.Content>

            <Accordion.Title
              active={this.state.activeIndex === 5}
              index={5}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              전기차 보조금
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 5}>
              <Subsidy
                onChange={(e, { value }) => {
                  this.setState({
                    local_subsidy: this.state.subsidy_list[value].subsidy
                  });
                }}
                subsidy_list={this.state.subsidy_list}
              />
            </Accordion.Content>
          </Accordion>

          <Divider />

          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: "현금",
                render: () => (
                  <Cash
                    total_price={this.state.total_price}
                    gov_subsidy={this.state.gov_subsidy}
                    local_subsidy={this.state.local_subsidy}
                    calcFuncs={this.calcFuncs}
                    selectedOptions={this.selectedOptions}
                  />
                )
              },
              {
                menuItem: "할부",
                render: () => (
                  <Loan
                    prepay={this.state.prepay}
                    annual_loan_interest_rate={
                      this.state.annual_loan_interest_rate
                    }
                    installment_months={this.state.installment_months}
                    onPrepayChange={(e, { value }) => {
                      if (value.match(/[^\d,]/g)) {
                        return;
                      }
                      this.setState({
                        prepay: Number(value.replace(/[,.]/g, ""))
                      });
                    }}
                    onLoanRateChange={(e, { value }) => {
                      this.setState({
                        annual_loan_interest_rate: Number(value)
                      });
                    }}
                    onMonthsChange={(e, { value }) => {
                      this.setState({
                        installment_months: Number(value)
                      });
                    }}
                    calcFuncs={this.calcFuncs}
                    selectedOptions={this.selectedOptions}
                  />
                )
              }
            ]}
          />
        </Responsive>
      </Segment>
    );
  }
}

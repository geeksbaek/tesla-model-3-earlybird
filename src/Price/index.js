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

import Trim from "./Trim";
import Color from "./Color";
import Wheels from "./Wheels";
import Interior from "./Interior";
import AutoPilot from "./AutoPilot";
import Subsidy from "./Subsidy";
import Cash from "./Cash";
import Loan from "./Loan";

import black_18 from "../assets/img/black_18.png";
import black_19 from "../assets/img/black_19.png";
import black_20 from "../assets/img/black_20.png";
import midnight_18 from "../assets/img/midnight_18.png";
import midnight_19 from "../assets/img/midnight_19.png";
import midnight_20 from "../assets/img/midnight_20.png";
import blue_18 from "../assets/img/blue_18.png";
import blue_19 from "../assets/img/blue_19.png";
import blue_20 from "../assets/img/blue_20.png";
import white_18 from "../assets/img/white_18.png";
import white_19 from "../assets/img/white_19.png";
import white_20 from "../assets/img/white_20.png";
import red_18 from "../assets/img/red_18.png";
import red_19 from "../assets/img/red_19.png";
import red_20 from "../assets/img/red_20.png";

import "./index.css";

const EXCHANGE_URL =
  "https://api.exchangeratesapi.io/latest?base=USD&symbols=KRW";
const MODEL_3_OPTIONS_URL =
  "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/model_3.yaml";
const SALETEX_URL =
  "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/saletex.yaml";
const SUBSIDY_URL =
  "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/subsidy.json";

const MODEL_3_IMAGE = [
  [black_18, black_19, black_20],
  [midnight_18, midnight_19, midnight_20],
  [blue_18, blue_19, blue_20],
  [white_18, white_19, white_20],
  [red_18, red_19, red_20]
];

export default class Price extends Component {
  state = {
    loading_a: true,
    loading_b: true,
    loading_c: true,

    trims: [],
    options: { color: [], interior: [], wheels: [], autopilot: [] },
    saletex: {
      개별소비세: { 과세: 0, 감면: 0 },
      교육세: { 과세: 0, 감면: 0 },
      취득세: { 과세: 0, 감면: 0 },
      자동차세: { 과세: 0, 감면: 0 }
    },
    gov_subsidy: [],
    selected_gov_subsidy: 1,
    local_subsidy: [],
    selected_local_subsidy: 1,
    exchange: 1,
    exchange_date: null,
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
    prepay: 0,
    loan_rate: 3.5,
    installment_months: 60,
    active_index: -1
  };

  onAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { active_index } = this.state;
    const newIndex = active_index === index ? -1 : index;

    this.setState({ active_index: newIndex });
  };

  onTrimChange = (i, v) => {
    this.setState({
      base_price: this.usdTokrw(v["가격"]),
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
      color_price: this.usdTokrw(v["가격"]),
      color_selected: i
    });
  };

  onWheelsChange = (i, v) => {
    this.setState({
      wheels_price: this.usdTokrw(v["가격"]),
      wheels_selected: i
    });
  };

  onInteriorChange = (i, v) => {
    this.setState({
      interior_price: this.usdTokrw(v["가격"]),
      interior_selected: i
    });
  };

  onAutoPilotChange = (i, v) => {
    this.setState({
      autopilot_price: this.usdTokrw(v["가격"]),
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

  usdTokrw = usd => (usd * this.state.exchange).toFixed(0);
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

  부가가치세 = () => this.state.total_price * 0.1;
  자동차세 = () => this.state.saletex.자동차세.과세;

  개별소비세_과세 = () =>
    this.state.total_price * this.state.saletex.개별소비세.과세;
  개별소비세_감면 = () =>
    Math.min(this.개별소비세_과세(), this.state.saletex.개별소비세.감면);
  개별소비세 = () => this.개별소비세_과세() - this.개별소비세_감면();

  교육세_과세 = () => this.개별소비세_과세() * this.state.saletex.교육세.과세;
  교육세_감면 = () =>
    Math.min(this.교육세_과세(), this.state.saletex.교육세.감면);
  교육세 = () => this.교육세_과세() - this.교육세_감면();

  취득세_과세 = () =>
    (this.state.total_price + this.개별소비세() + this.교육세()) *
    this.state.saletex.취득세.과세;
  취득세_감면 = () =>
    Math.min(this.취득세_과세(), this.state.saletex.취득세.감면);
  취득세 = () => this.취득세_과세() - this.취득세_감면();

  보조금 = () =>
    (this.state.gov_subsidy[this.state.selected_gov_subsidy]
      ? this.state.gov_subsidy[this.state.selected_gov_subsidy].subsidy
      : 0) +
    (this.state.local_subsidy[this.state.selected_local_subsidy]
      ? this.state.local_subsidy[this.state.selected_local_subsidy].subsidy
      : 0);
  보조금_감면_전_차량가격 = () =>
    this.state.total_price +
    this.부가가치세() +
    this.개별소비세() +
    this.교육세();
  보조금_감면_후_차량가격 = () =>
    this.보조금_감면_전_차량가격() - this.보조금();

  원리금균등상환_월납입금 = (대출원금, 연이자율, 할부개월) => {
    let 월이자율 = (연이자율 / 12) * 0.01;
    let x = Math.pow(1 + 월이자율, 할부개월);
    return (대출원금 * 월이자율 * x) / (x - 1);
  };

  calcFuncs = {
    부가가치세: this.부가가치세,
    자동차세: this.자동차세,
    개별소비세_과세: this.개별소비세_과세,
    개별소비세_감면: this.개별소비세_감면,
    개별소비세: this.개별소비세,
    교육세_과세: this.교육세_과세,
    교육세_감면: this.교육세_감면,
    교육세: this.교육세,
    취득세_과세: this.취득세_과세,
    취득세_감면: this.취득세_감면,
    취득세: this.취득세,
    보조금: this.보조금,
    보조금_감면_전_차량가격: this.보조금_감면_전_차량가격,
    보조금_감면_후_차량가격: this.보조금_감면_후_차량가격,
    원리금균등상환_월납입금: this.원리금균등상환_월납입금
  };

  componentDidMount() {
    axios.get(EXCHANGE_URL).then(res => {
      this.setState({
        exchange: res.data.rates.KRW,
        exchange_date: res.data.date
      });

      axios.get(MODEL_3_OPTIONS_URL).then(res => {
        let data = YAML.parse(res.data);
        this.setState({
          trims: data.trims,
          options: data.options,
          base_price: this.usdTokrw(data.trims[0]["가격"]),
          base_selected: 0,
          loading_a: false
        });
        data.trims.forEach((v, i) => {
          if (v["이름"] === "Performance") {
            this.setState({ performance_index: i });
          }
        });
        this.calcTotalPrice();
      });

      axios.get(SALETEX_URL).then(res => {
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
            },
            자동차세: {
              과세: data["자동차세"]["과세"],
              감면: data["자동차세"]["감면"]
            }
          },
          loading_b: false
        });
      });

      axios.get(SUBSIDY_URL).then(res => {
        this.setState({
          gov_subsidy: res.data.gov,
          local_subsidy: res.data.local,
          loading_c: false
        });
      });
    });
  }

  render() {
    const {
      loading_a,
      loading_b,
      loading_c,
      trims,
      options,
      // saletex,
      gov_subsidy,
      selected_gov_subsidy,
      local_subsidy,
      selected_local_subsidy,
      exchange,
      exchange_date,
      performance_index,
      base_selected,
      // base_price,
      color_selected,
      // color_price,
      wheels_selected,
      // wheels_price,
      interior_selected,
      // interior_price,
      autopilot_selected,
      // autopilot_price,
      total_price,
      prepay,
      loan_rate,
      installment_months,
      active_index
    } = this.state;

    const message = (
      <Message info>
        <Message.List>
          <Message.Header>먼저 읽어주세요</Message.Header>
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Divider hidden fitted />
          <Message.Item>
            여기에서 표기되는 가격은 미국 달러에서{" "}
            <strong>{exchange_date}</strong> 기준 환율 (1 USD=
            <strong>{exchange ? exchange.toFixed(2) : 0}</strong> KRW)을
            적용하여 원화로 변환된 값입니다.
          </Message.Item>
          <Message.Item>
            탁송비, 공채비용, 부대비용 등은 계산에 포함되어 있지 않습니다.
          </Message.Item>
          <Message.Item>
            계산된 가격과 실제 가격은 차이가 발생할 수 있으며, 이로 인해
            발생하는 불이익에 대한 책임은 사용자에게 있습니다.
          </Message.Item>
          <Message.Item>
            이 페이지는{" "}
            <strong>
              <a
                href="https://github.com/geeksbaek/tesla-model-3-korea"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </strong>
            에서 오픈소스로 관리되며, 변경사항은{" "}
            <strong>
              <a
                href="https://github.com/geeksbaek/tesla-model-3-korea/blob/master/CHANGELOG.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                여기
              </a>
            </strong>
            에서 확인할 수 있습니다.
          </Message.Item>
        </Message.List>
      </Message>
    );

    return (
      <Segment
        basic
        textAlign="left"
        className="SegmentGroup"
        loading={loading_a && loading_b && loading_c}
      >
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Grid columns={2} verticalAlign="top" centered>
            <Grid.Column width={10}>
              {message}
              <Form>
                <Form.Group>
                  <Trim
                    base_selected={base_selected}
                    trims={trims}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onTrimChange}
                    usdTokrw={this.usdTokrw}
                  />
                </Form.Group>
                <Form.Group>
                  <Color
                    color_selected={color_selected}
                    options={options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onColorChange}
                    usdTokrw={this.usdTokrw}
                  />
                </Form.Group>
                <Form.Group>
                  <Wheels
                    performance={base_selected === performance_index}
                    wheels_selected={wheels_selected}
                    options={options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onWheelsChange}
                    usdTokrw={this.usdTokrw}
                  />
                </Form.Group>
                <Form.Group>
                  <Interior
                    interior_selected={interior_selected}
                    options={options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onInteriorChange}
                    usdTokrw={this.usdTokrw}
                  />
                </Form.Group>
                <Form.Group>
                  <AutoPilot
                    autopilot_selected={autopilot_selected}
                    options={options}
                    calcTotalPrice={this.calcTotalPrice}
                    onChange={this.onAutoPilotChange}
                    usdTokrw={this.usdTokrw}
                  />
                </Form.Group>

                <Divider hidden />
                <Form.Group>
                  <Subsidy
                    onGovSubsidyChange={(e, { value }) => {
                      this.setState({
                        selected_gov_subsidy: value
                      });
                    }}
                    onLocalSubsidyChange={(e, { value }) => {
                      this.setState({
                        selected_local_subsidy: value
                      });
                    }}
                    gov_subsidy={gov_subsidy}
                    selected_gov_subsidy={selected_gov_subsidy}
                    local_subsidy={local_subsidy}
                    selected_local_subsidy={selected_local_subsidy}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column width={6}>
              <Tab
                // menu={{ secondary: true, pointing: true }}
                panes={[
                  {
                    menuItem: {
                      key: "cash",
                      icon: "money bill alternate outline",
                      content: "현금"
                    },
                    render: () => (
                      <Tab.Pane>
                        <Cash
                          total_price={total_price}
                          gov_subsidy={gov_subsidy[selected_gov_subsidy]}
                          local_subsidy={local_subsidy[selected_local_subsidy]}
                          calcFuncs={this.calcFuncs}
                          selectedOptions={this.selectedOptions}
                          usdTokrw={this.usdTokrw}
                          image={MODEL_3_IMAGE[color_selected][wheels_selected]}
                        />
                      </Tab.Pane>
                    )
                  },
                  {
                    menuItem: {
                      key: "loan",
                      icon: "credit card outline",
                      content: "할부"
                    },
                    render: () => (
                      <Tab.Pane>
                        <Loan
                          prepay={prepay}
                          loan_rate={loan_rate}
                          installment_months={installment_months}
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
                              loan_rate: Number(value)
                            });
                          }}
                          onMonthsChange={(e, { value }) => {
                            this.setState({
                              installment_months: Number(value)
                            });
                          }}
                          calcFuncs={this.calcFuncs}
                          selectedOptions={this.selectedOptions}
                          usdTokrw={this.usdTokrw}
                          image={MODEL_3_IMAGE[color_selected][wheels_selected]}
                        />
                      </Tab.Pane>
                    )
                  }
                ]}
              />
            </Grid.Column>
          </Grid>
        </Responsive>

        <Responsive {...Responsive.onlyMobile}>
          {message}
          <Accordion>
            <Accordion.Title
              active={active_index === 0}
              index={0}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              트림
            </Accordion.Title>
            <Accordion.Content active={active_index === 0}>
              <Trim
                base_selected={base_selected}
                trims={trims}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onTrimChange}
                usdTokrw={this.usdTokrw}
              />
            </Accordion.Content>

            <Accordion.Title
              active={active_index === 1}
              index={1}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              색상
            </Accordion.Title>
            <Accordion.Content active={active_index === 1}>
              <Color
                color_selected={color_selected}
                options={options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onColorChange}
                usdTokrw={this.usdTokrw}
              />
            </Accordion.Content>

            <Accordion.Title
              active={active_index === 2}
              index={2}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />휠
            </Accordion.Title>
            <Accordion.Content active={active_index === 2}>
              <Wheels
                performance={base_selected === performance_index}
                wheels_selected={wheels_selected}
                options={options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onWheelsChange}
                usdTokrw={this.usdTokrw}
              />
            </Accordion.Content>

            <Accordion.Title
              active={active_index === 3}
              index={3}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              인테리어
            </Accordion.Title>
            <Accordion.Content active={active_index === 3}>
              <Interior
                interior_selected={interior_selected}
                options={options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onInteriorChange}
                usdTokrw={this.usdTokrw}
              />
            </Accordion.Content>

            <Accordion.Title
              active={active_index === 4}
              index={4}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              오토파일럿
            </Accordion.Title>
            <Accordion.Content active={active_index === 4}>
              <AutoPilot
                autopilot_selected={autopilot_selected}
                options={options}
                calcTotalPrice={this.calcTotalPrice}
                onChange={this.onAutoPilotChange}
                usdTokrw={this.usdTokrw}
              />
            </Accordion.Content>

            <Accordion.Title
              active={active_index === 5}
              index={5}
              onClick={this.onAccordionClick}
            >
              <Icon name="dropdown" />
              전기차 보조금
            </Accordion.Title>
            <Accordion.Content active={active_index === 5}>
              <Subsidy
                onGovSubsidyChange={(e, { value }) => {
                  this.setState({
                    selected_gov_subsidy: value
                  });
                }}
                onLocalSubsidyChange={(e, { value }) => {
                  this.setState({
                    selected_local_subsidy: value
                  });
                }}
                gov_subsidy={gov_subsidy}
                selected_gov_subsidy={selected_gov_subsidy}
                local_subsidy={local_subsidy}
                selected_local_subsidy={selected_local_subsidy}
              />
            </Accordion.Content>
          </Accordion>

          <Divider />

          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: {
                  key: "cash",
                  icon: "money bill alternate outline",
                  content: "현금"
                },
                render: () => (
                  <Cash
                    total_price={total_price}
                    gov_subsidy={gov_subsidy[selected_gov_subsidy]}
                    local_subsidy={local_subsidy[selected_local_subsidy]}
                    calcFuncs={this.calcFuncs}
                    selectedOptions={this.selectedOptions}
                    usdTokrw={this.usdTokrw}
                    image={MODEL_3_IMAGE[color_selected][wheels_selected]}
                  />
                )
              },
              {
                menuItem: {
                  key: "loan",
                  icon: "credit card outline",
                  content: "할부"
                },
                render: () => (
                  <Loan
                    prepay={prepay}
                    loan_rate={loan_rate}
                    installment_months={installment_months}
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
                        loan_rate: Number(value)
                      });
                    }}
                    onMonthsChange={(e, { value }) => {
                      this.setState({
                        installment_months: Number(value)
                      });
                    }}
                    calcFuncs={this.calcFuncs}
                    selectedOptions={this.selectedOptions}
                    usdTokrw={this.usdTokrw}
                    image={MODEL_3_IMAGE[color_selected][wheels_selected]}
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

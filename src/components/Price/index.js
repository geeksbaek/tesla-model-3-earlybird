import React, { Component } from "react";
import {
  Segment,
  Grid,
  Form,
  Responsive,
  Divider,
  Accordion,
  Icon,
  Tab
} from "semantic-ui-react";
import axios from "axios";
import YAML from "yamljs";

import {
  EXCHANGE_URL,
  MODEL_3_OPTIONS_URL,
  SALETEX_URL,
  SUBSIDY_URL
} from "./Common";

import PriceMessage from "./PriceMessage";
import Trim from "./Trim";
import Color from "./Color";
import Wheels from "./Wheels";
import Interior from "./Interior";
import AutoPilot from "./AutoPilot";
import Subsidy from "./Subsidy";
import Cash from "./Cash";
import Loan from "./Loan";
import { PriceContext } from "./PriceContext";

import "./index.css";

export default class Price extends Component {
  state = {
    trims: [],
    options: { color: [], interior: [], wheels: [], autopilot: [] },

    selected: {
      trim: { index: 0, 가격: 0 },
      color: { index: 0, 가격: 0 },
      interior: { index: 0, 가격: 0 },
      wheels: { index: 0, 가격: 0 },
      autopilot: { index: 0, 가격: 0 },
      subsidy: { gov: {}, local: {} },
      price_sum: 0
    },
    saletex: {
      개별소비세: { 과세: 0, 감면: 0 },
      교육세: { 과세: 0, 감면: 0 },
      취득세: { 과세: 0, 감면: 0 },
      자동차세: { 과세: 0, 감면: 0 }
    },
    exchange: { krw: 1 },

    loading_a: true,
    loading_b: true,
    loading_c: true,

    gov_subsidy: [],
    selected_gov_subsidy: 1,
    local_subsidy: [],
    selected_local_subsidy: 1,
    performance_index: -1,

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
    let wheelsIndex = 0;
    if (v["이름"] === "Performance") {
      wheelsIndex = 2;
    } else if (this.state.wheels_selected === 1) {
      wheelsIndex = 1;
    }

    this.setState({
      selected: {
        ...this.state.selected,
        trim: v,
        wheels: this.state.options.wheels[wheelsIndex]
      },
      wheels_price: 0
    });
  };

  onColorChange = (i, v) =>
    this.setState({
      selected: { ...this.state.selected, color: v }
    });

  onWheelsChange = (i, v) =>
    this.setState({
      selected: { ...this.state.selected, wheels: v }
    });

  onInteriorChange = (i, v) =>
    this.setState({
      selected: { ...this.state.selected, interior: v }
    });

  onAutoPilotChange = (i, v) =>
    this.setState({
      selected: { ...this.state.selected, autopilot: v }
    });

  onGovSubsidyChange = (i, v) =>
    this.setState({
      selected: {
        ...this.state.selected,
        subsidy: {
          ...this.state.selected.subsidy,
          gov: v
        }
      }
    });

  onLocalSubsidyChange = (i, v) =>
    this.setState({
      selected: {
        ...this.state.selected,
        subsidy: {
          ...this.state.selected.subsidy,
          local: v
        }
      }
    });

  usdTokrw = usd => (usd * this.state.exchange.krw).toFixed(0);
  calcTotalPrice = () =>
    this.setState(prev => {
      return {
        selected: {
          ...prev.selected,
          price_sum:
            Number(this.usdTokrw(prev.selected.trim["가격"])) +
            Number(this.usdTokrw(prev.selected.color["가격"])) +
            Number(this.usdTokrw(prev.selected.wheels["가격"])) +
            Number(this.usdTokrw(prev.selected.interior["가격"])) +
            Number(this.usdTokrw(prev.selected.autopilot["가격"]))
        },
        total_price:
          Number(this.usdTokrw(prev.selected.trim["가격"])) +
          Number(this.usdTokrw(prev.selected.color["가격"])) +
          Number(this.usdTokrw(prev.selected.wheels["가격"])) +
          Number(this.usdTokrw(prev.selected.interior["가격"])) +
          Number(this.usdTokrw(prev.selected.autopilot["가격"]))
      };
    });

  componentDidMount() {
    axios.get(EXCHANGE_URL).then(res => {
      this.setState({
        exchange: { date: res.data.date, krw: res.data.rates.KRW }
      });

      axios.get(MODEL_3_OPTIONS_URL).then(res => {
        let data = YAML.parse(res.data);
        this.setState({
          selected: {
            ...this.state.selected,
            trim: data.trims[0],
            color: data.options.color[0],
            wheels: data.options.wheels[0],
            interior: data.options.interior[0],
            autopilot: data.options.autopilot[0]
          },
          trims: data.trims,
          options: data.options,
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
          selected: {
            ...this.state.selected,
            subsidy: {
              gov: res.data.gov[this.state.selected_gov_subsidy],
              local: res.data.local[this.state.selected_local_subsidy]
            }
          },
          gov_subsidy: res.data.gov,
          local_subsidy: res.data.local,
          loading_c: false
        });
      });
    });
  }

  render() {
    const {
      selected,
      saletex,
      loading_a,
      loading_b,
      loading_c,
      trims,
      options,
      gov_subsidy,
      selected_gov_subsidy,
      local_subsidy,
      selected_local_subsidy,
      exchange,
      performance_index,
      active_index
    } = this.state;

    return (
      <PriceContext.Provider
        value={{ selected: this.state.selected, saletex: this.state.saletex }}
      >
        <Segment
          basic
          textAlign="left"
          className="SegmentGroup"
          loading={loading_a && loading_b && loading_c}
        >
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <Grid columns={2} verticalAlign="top" centered>
              <Grid.Column width={10}>
                <PriceMessage exchange={exchange} />
                <Form>
                  <Form.Group>
                    <Trim
                      base_selected={selected.trim.index}
                      trims={trims}
                      calcTotalPrice={this.calcTotalPrice}
                      onChange={this.onTrimChange}
                      usdTokrw={this.usdTokrw}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Color
                      color_selected={selected.color.index}
                      options={options}
                      calcTotalPrice={this.calcTotalPrice}
                      onChange={this.onColorChange}
                      usdTokrw={this.usdTokrw}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Wheels
                      performance={selected.trim.index === performance_index}
                      wheels_selected={selected.wheels.index}
                      options={options}
                      calcTotalPrice={this.calcTotalPrice}
                      onChange={this.onWheelsChange}
                      usdTokrw={this.usdTokrw}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Interior
                      interior_selected={selected.interior.index}
                      options={options}
                      calcTotalPrice={this.calcTotalPrice}
                      onChange={this.onInteriorChange}
                      usdTokrw={this.usdTokrw}
                    />
                  </Form.Group>
                  <Form.Group>
                    <AutoPilot
                      autopilot_selected={selected.autopilot.index}
                      options={options}
                      calcTotalPrice={this.calcTotalPrice}
                      onChange={this.onAutoPilotChange}
                      usdTokrw={this.usdTokrw}
                    />
                  </Form.Group>

                  <Divider hidden />
                  <Form.Group>
                    <Subsidy
                      onGovSubsidyChange={this.onGovSubsidyChange}
                      onLocalSubsidyChange={this.onLocalSubsidyChange}
                      calcTotalPrice={this.calcTotalPrice}
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
                          <Cash usdTokrw={this.usdTokrw} />
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
                          <Loan usdTokrw={this.usdTokrw} />
                        </Tab.Pane>
                      )
                    }
                  ]}
                />
              </Grid.Column>
            </Grid>
          </Responsive>

          <Responsive {...Responsive.onlyMobile}>
            <PriceMessage exchange={exchange} />
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
                  base_selected={selected.trim.index}
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
                  color_selected={selected.color.index}
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
                  performance={selected.trim.index === performance_index}
                  wheels_selected={selected.wheels.index}
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
                  interior_selected={selected.interior.index}
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
                  autopilot_selected={selected.autopilot.index}
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
                  onGovSubsidyChange={this.onGovSubsidyChange}
                  onLocalSubsidyChange={this.onLocalSubsidyChange}
                  calcTotalPrice={this.calcTotalPrice}
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
                  render: () => <Cash usdTokrw={this.usdTokrw} />
                },
                {
                  menuItem: {
                    key: "loan",
                    icon: "credit card outline",
                    content: "할부"
                  },
                  render: () => <Loan usdTokrw={this.usdTokrw} />
                }
              ]}
            />
          </Responsive>
        </Segment>
      </PriceContext.Provider>
    );
  }
}

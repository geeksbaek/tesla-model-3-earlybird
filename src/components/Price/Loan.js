import React, { useContext, useState } from "react";
import {
  Button,
  Divider,
  Card,
  List,
  Popup,
  Form,
  Input,
  Label,
  Header,
  Image,
  Responsive,
  Modal
} from "semantic-ui-react";
import { PriceContext } from "./PriceContext";
import { Common, TexFn, 원리금균등상환_월납입금 } from "./Common";
import SelectedOption from "./SelectedOption";
import ExtraContent from "./ExtraContent";

const _receiptList = ({ prepay, loan_rate, installment_months }) => {
  const [state, setState] = useState({
    loan_rate: 3.5,
    installment_months: 60
  });
  const { selected, saletex } = useContext(PriceContext);
  const Tex = TexFn(selected, saletex);

  return [
    {
      subject: "차량 가격",
      price: Tex.보조금_감면_전_차량가격,
      icon: "car",
      popup: true,
      popupContent: "공장도 가격 + 부가가치세 + 개별소비세 + 교육세"
    },
    { divider: true },
    {
      subject: "선납금1 (보조금)",
      price: Tex.보조금,
      color: "green",
      popup: true,
      popupContent: "정부 보조금 + 지방자치단체 보조금"
    },
    {
      subject: "선납금2 (그 외)",
      price: prepay,
      color: "green"
    },
    { divider: true },
    {
      subject: "대출원금",
      price: Tex.보조금_감면_후_차량가격 - prepay,
      popup: true,
      popupContent: "차량 가격 - 선납금"
    },
    { divider: true },
    {
      subject: "취득세",
      price: Tex.취득세,
      color: "orange",
      popup: true,
      popupContent: `${Common.comma(Tex.취득세_과세)} 원 중 ${Common.comma(
        Tex.취득세_감면
      )} 원 감면됨`
    },
    {
      subject: "자동차세",
      price: Tex.자동차세,
      color: "orange",
      popup: true,
      popupContent: "비영업용 기준"
    },
    { divider: true },
    {
      subject: "월납입금",
      price: 원리금균등상환_월납입금(
        Tex.보조금_감면_후_차량가격 - prepay,
        loan_rate,
        installment_months
      ),
      color: "red",
      icon: "won sign",
      popup: true,
      popupContent: "원리금 균등상환방식 (취득세, 자동차세 별도)"
    }
  ];
};

const LoanForm = props => {
  const { selected, saletex } = useContext(PriceContext);
  const Tex = TexFn(selected, saletex);

  return (
    <Form unstackable size="small">
      <Form.Group widths="equal">
        <Form.Field
          width={1}
          readOnly
          control={Input}
          label="선납금1 (보조금)"
          placeholder="선납금1"
          value={Common.comma(Tex.보조금)}
        />
        <Form.Field
          width={1}
          control={Input}
          label="선납금2 (그 외)"
          placeholder="선납금2"
          value={Common.comma(props.state.prepay)}
          onChange={props.onPrepayChange}
        />
      </Form.Group>
      <Responsive {...Responsive.onlyMobile}>
        <Divider hidden fitted />
        <Divider hidden fitted />
        <Divider hidden fitted />
        <Divider hidden fitted />
      </Responsive>
      <Form.Group widths="equal">
        <Form.Field
          width={1}
          type="number"
          control={Input}
          label="할부 연이율 (%)"
          error={props.state.loan_rate === 0}
          value={props.state.loan_rate || ""}
          onChange={props.onLoanRateChange}
        />
        <Form.Field
          width={1}
          type="number"
          control={Input}
          label="할부 개월 수"
          error={props.state.installment_months === 0}
          value={props.state.installment_months || ""}
          onChange={props.onMonthsChange}
        />
      </Form.Group>
    </Form>
  );
};

const BuildReceipt = ({ list }) => {
  return list.map((v, i) => {
    if (v.divider) {
      return <Divider key={i} />;
    }

    const item = (
      <List.Item key={i}>
        <List.Content floated="left">
          <List.Icon name={v.icon} />
          {v.subject}
        </List.Content>
        <List.Content floated="right">
          <List.Header style={{ color: v.color }}>
            {`₩ ${Common.comma(v.price)}`}
          </List.Header>
        </List.Content>
      </List.Item>
    );

    if (v.popup) {
      return (
        <Popup
          key={i}
          trigger={item}
          content={v.popupContent}
          size="small"
          position="top right"
        />
      );
    }
    return item;
  });
};

const Loan = props => {
  const [state, setState] = useState({
    prepay: 0,
    loan_rate: 4,
    installment_months: 60
  });

  const onPrepayChange = (e, { value }) => {
    if (value.match(/[^\d,]/g)) return;
    setState({ ...state, prepay: Number(value.replace(/[,.]/g, "")) });
  };

  const onLoanRateChange = (e, { value }) => {
    setState({ ...state, loan_rate: Number(value) });
  };

  const onMonthsChange = (e, { value }) => {
    setState({ ...state, installment_months: Number(value) });
  };

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header textAlign="center">예상 할부 결제액</Card.Header>
      </Card.Content>
      <Card.Content>
        <List>
          <List.Item>
            <List.Content>
              <List.Content>
                <SelectedOption usdTokrw={props.usdTokrw} />
              </List.Content>
            </List.Content>
          </List.Item>
          <Divider />
          <List.Item>
            <LoanForm
              state={state}
              onPrepayChange={onPrepayChange}
              onLoanRateChange={onLoanRateChange}
              onMonthsChange={onMonthsChange}
            />
          </List.Item>
          <Divider />

          <BuildReceipt list={_receiptList(state)} />
        </List>
      </Card.Content>
      <ExtraContent />
    </Card>
  );
};

export default Loan;

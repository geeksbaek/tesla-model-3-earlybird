import React, { useContext } from "react";
import { Divider, Card, List, Popup } from "semantic-ui-react";

import { PriceContext } from "./PriceContext";
import { Common, TexFn } from "./Common";
import SelectedOption from "./SelectedOption";
import ExtraContent from "./ExtraContent";

const _receiptList = () => {
  const { selected, saletex } = useContext(PriceContext);
  const Tex = TexFn(selected, saletex);
  let price = selected.price_sum;

  return [
    { subject: "차량 공장도 가격", price: price, icon: "car" },
    { divider: true },
    {
      subject: "부가가치세",
      price: Tex.부가가치세,
      color: "orange"
    },
    {
      subject: "개별소비세",
      price: Tex.개별소비세,
      color: "orange",
      popup: true,
      popupContent: `₩ ${Common.comma(Tex.개별소비세_과세)} 중 ₩ ${Common.comma(
        Tex.개별소비세_감면
      )} 감면됨`
    },
    {
      subject: "교육세",
      price: Tex.교육세,
      color: "orange",
      popup: true,
      popupContent: `₩ ${Common.comma(Tex.교육세_과세)} 중 ₩ ${Common.comma(
        Tex.교육세_감면
      )} 감면됨`
    },
    {
      subject: "취득세",
      price: Tex.취득세,
      color: "orange",
      popup: true,
      popupContent: `₩ ${Common.comma(Tex.취득세_과세)} 중 ₩ ${Common.comma(
        Tex.취득세_감면
      )} 감면됨`
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
      subject: "정부 보조금",
      price: selected.subsidy.gov.subsidy,
      color: "green"
    },
    {
      subject: "지방자치단체 보조금",
      price: selected.subsidy.local.subsidy,
      color: "green"
    },
    { divider: true },
    {
      subject: "최종 가격",
      price: Tex.보조금_감면_후_차량가격 + Tex.취득세 + Tex.자동차세,
      icon: "won sign",
      popup: true,
      popupContent: "취득세, 자동차세 포함"
    }
  ];
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

const Cash = props => {
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
                <SelectedOption usdTokrw={props.usdTokrw} />
              </List.Description>
            </List.Content>
          </List.Item>
          <Divider />

          <BuildReceipt list={_receiptList()} />
        </List>
      </Card.Content>
      <ExtraContent />
    </Card>
  );
};

export default Cash;

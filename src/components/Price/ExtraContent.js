import React from "react";
import { List, Label, Icon, Button, Card } from "semantic-ui-react";
import { Common } from "./Common";

const ExtraContent = props => {
  const iter = (v, i) => (
    <List.Item key={i}>
      <Label as="a" color={v["가격"] > 0 ? "red" : null} horizontal>
        {v["이름"]}
        <Label.Detail>
          {`₩${Common.comma(props.usdTokrw(v["가격"]))}`}
        </Label.Detail>
      </Label>
    </List.Item>
  );

  return (
    <Card.Content extra textAlign="center">
      <Button icon labelPosition="left" primary>
        <Icon name="save" />
        견적 저장
      </Button>
      <Button
        icon
        labelPosition="right"
        href="https://www.tesla.com/ko_KR/model3/reserve"
        target="_blank"
      >
        <Icon name="shop" />
        사전 예약
      </Button>
    </Card.Content>
  );
};

export default ExtraContent;

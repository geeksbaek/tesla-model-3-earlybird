import React from "react";
import { Message, Divider } from "semantic-ui-react";

const PriceMessage = ({ exchange }) => {
  return (
    <Message info>
      <Message.List>
        <Message.Header>먼저 읽어주세요</Message.Header>
        <Divider hidden fitted />
        <Divider hidden fitted />
        <Divider hidden fitted />
        <Divider hidden fitted />
        <Message.Item>
          여기에서 표기되는 가격은 미국 달러에서{" "}
          <strong>{exchange.date}</strong> 기준 환율 (1 USD=
          <strong>{exchange.krw.toFixed(2)}</strong> KRW)을 적용하여 원화로
          변환된 값입니다.
        </Message.Item>
        <Message.Item>
          탁송비, 공채비용, 부대비용 등은 계산에 포함되어 있지 않습니다.
        </Message.Item>
        <Message.Item>
          계산된 가격과 실제 가격은 차이가 발생할 수 있으며, 이로 인해 발생하는
          불이익에 대한 책임은 사용자에게 있습니다.
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
};

export default PriceMessage;

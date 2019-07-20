import black_18 from "../../assets/img/black_18.png";
import black_19 from "../../assets/img/black_19.png";
import black_20 from "../../assets/img/black_20.png";
import midnight_18 from "../../assets/img/midnight_18.png";
import midnight_19 from "../../assets/img/midnight_19.png";
import midnight_20 from "../../assets/img/midnight_20.png";
import blue_18 from "../../assets/img/blue_18.png";
import blue_19 from "../../assets/img/blue_19.png";
import blue_20 from "../../assets/img/blue_20.png";
import white_18 from "../../assets/img/white_18.png";
import white_19 from "../../assets/img/white_19.png";
import white_20 from "../../assets/img/white_20.png";
import red_18 from "../../assets/img/red_18.png";
import red_19 from "../../assets/img/red_19.png";
import red_20 from "../../assets/img/red_20.png";

import black_white_18 from "../../assets/img/black_white_18.png";
import black_white_19 from "../../assets/img/black_white_19.png";
import black_white_20 from "../../assets/img/black_white_20.png";
import midnight_white_18 from "../../assets/img/midnight_white_18.png";
import midnight_white_19 from "../../assets/img/midnight_white_19.png";
import midnight_white_20 from "../../assets/img/midnight_white_20.png";
import blue_white_18 from "../../assets/img/blue_white_18.png";
import blue_white_19 from "../../assets/img/blue_white_19.png";
import blue_white_20 from "../../assets/img/blue_white_20.png";
import white_white_18 from "../../assets/img/white_white_18.png";
import white_white_19 from "../../assets/img/white_white_19.png";
import white_white_20 from "../../assets/img/white_white_20.png";
import red_white_18 from "../../assets/img/red_white_18.png";
import red_white_19 from "../../assets/img/red_white_19.png";
import red_white_20 from "../../assets/img/red_white_20.png";

const _images = [
  [
    [white_18, white_white_18],
    [white_19, white_white_19],
    [white_20, white_white_20]
  ],
  [
    [black_18, black_white_18],
    [black_19, black_white_19],
    [black_20, black_white_20]
  ],
  [
    [midnight_18, midnight_white_18],
    [midnight_19, midnight_white_19],
    [midnight_20, midnight_white_20]
  ],
  [
    [blue_18, blue_white_18],
    [blue_19, blue_white_19],
    [blue_20, blue_white_20]
  ],
  [[red_18, red_white_18], [red_19, red_white_19], [red_20, red_white_20]]
];

export const GetImage = selected => {
  return _images[selected.color ? selected.color.index : 0][
    selected.wheels ? selected.wheels.index : 0
  ][selected.interior ? selected.interior.index : 0];
};

export const Common = {
  comma: x =>
    Number(x)
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

export const EXCHANGE_URL =
  "https://api.exchangeratesapi.io/latest?base=USD&symbols=KRW";
export const MODEL_3_OPTIONS_URL =
  "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/model_3.yaml";
export const SALETEX_URL =
  "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/saletex.yaml";
export const SUBSIDY_URL =
  "https://raw.githubusercontent.com/geeksbaek/tesla-model-3-korea/master/data/subsidy.json";

const 부가가치세 = price => price * 0.1;

const 자동차세 = saletex => saletex.자동차세.과세;

const 개별소비세_과세 = (price, saletex) => price * saletex.개별소비세.과세;

const 개별소비세_감면 = (price, saletex) =>
  Math.min(개별소비세_과세(price, saletex), saletex.개별소비세.감면);

const 개별소비세 = (price, saletex) =>
  개별소비세_과세(price, saletex) - 개별소비세_감면(price, saletex);

const 교육세_과세 = (price, saletex) =>
  개별소비세_과세(price, saletex) * saletex.교육세.과세;

const 교육세_감면 = (price, saletex) =>
  Math.min(교육세_과세(price, saletex), saletex.교육세.감면);

const 교육세 = (price, saletex) =>
  교육세_과세(price, saletex) - 교육세_감면(price, saletex);

const 취득세_과세 = (price, saletex) =>
  (price + 개별소비세(price, saletex) + 교육세(price, saletex)) *
  saletex.취득세.과세;

const 취득세_감면 = (price, saletex) =>
  Math.min(취득세_과세(price, saletex), saletex.취득세.감면);

const 취득세 = (price, saletex) =>
  취득세_과세(price, saletex) - 취득세_감면(price, saletex);

const 보조금 = selected =>
  selected.subsidy.gov.subsidy + selected.subsidy.local.subsidy;

const 보조금_감면_전_차량가격 = (price, saletex) =>
  price +
  부가가치세(price) +
  개별소비세(price, saletex) +
  교육세(price, saletex);

const 보조금_감면_후_차량가격 = (selected, saletex) =>
  보조금_감면_전_차량가격(selected.price_sum, saletex) - 보조금(selected);

export const TexFn = (selected, saletex) => {
  return {
    부가가치세: 부가가치세(selected.price_sum),
    자동차세: 자동차세(saletex),
    개별소비세_과세: 개별소비세_과세(selected.price_sum, saletex),
    개별소비세_감면: 개별소비세_감면(selected.price_sum, saletex),
    개별소비세: 개별소비세(selected.price_sum, saletex),
    교육세_과세: 교육세_과세(selected.price_sum, saletex),
    교육세_감면: 교육세_감면(selected.price_sum, saletex),
    교육세: 교육세(selected.price_sum, saletex),
    취득세_과세: 취득세_과세(selected.price_sum, saletex),
    취득세_감면: 취득세_감면(selected.price_sum, saletex),
    취득세: 취득세(selected.price_sum, saletex),
    보조금: 보조금(selected),
    보조금_감면_전_차량가격: 보조금_감면_전_차량가격(
      selected.price_sum,
      saletex
    ),
    보조금_감면_후_차량가격: 보조금_감면_후_차량가격(selected, saletex)
  };
};

export const 원리금균등상환_월납입금 = (대출원금, 연이자율, 할부개월) => {
  let 월이자율 = (연이자율 / 12) * 0.01;
  let x = Math.pow(1 + 월이자율, 할부개월);
  return (대출원금 * 월이자율 * x) / (x - 1);
};

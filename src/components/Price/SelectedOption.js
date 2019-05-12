import React, { useContext } from "react";
import { List, Label, Modal, Image, Button } from "semantic-ui-react";

import { PriceContext } from "./PriceContext";
import { Common, GetImage } from "./Common";

const SelectedOption = props => {
  const { selected } = useContext(PriceContext);

  const iter = (v, i) => (
    <List.Item key={i}>
      <Label as="a" color={v["가격"] > 0 ? "red" : null} horizontal>
        {v["이름"]}
        <Label.Detail>
          {`₩ ${Common.comma(props.usdTokrw(v["가격"]))}`}
        </Label.Detail>
      </Label>
    </List.Item>
  );

  return (
    <>
      <Modal
        trigger={<Image as={Button} src={GetImage(selected)} />}
        closeIcon
        size="fullscreen"
      >
        <Modal.Content>
          <Image src={GetImage(selected)} centered />
        </Modal.Content>
      </Modal>
      <List>
        {Object.values(selected)
          .filter(v => v.index !== undefined)
          .map(iter)}
      </List>
    </>
  );
};

export default SelectedOption;

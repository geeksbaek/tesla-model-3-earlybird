import React, { Component } from "react";
import { Container, Grid, Segment, Tab, Image } from "semantic-ui-react";
import "./index.css";
import Logo from "./assets/img/compare-model3--center.png";
import Price from "./Price";

const panes = [
  {
    menuItem: { key: "price", icon: "won sign", content: "가격 비교" },
    render: () => <Price />
  }
];

class App extends Component {
  render() {
    return (
      <Container className="container">
        <Grid centered verticalAlign="middle">
          {/* <Grid.Row>
            <Segment basic>
              <Image src={Logo} size="big" centered />
            </Segment>
          </Grid.Row> */}
          <Grid.Row verticalAlign="middle">
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;

import React, { Component } from "react";
import { Container, Segment, Tab, Image } from "semantic-ui-react";
import "./App.css";
import { HashRouter, Route, Router, Switch } from "react-router-dom";
import Timeline from "./Timeline";
import Price from "./Price";
import Comments from "./Comments";
import TabMenu from "./TabMenu";

const panes = [
  {
    menuItem: {
      key: "timeline",
      path: "/",
      icon: "newspaper",
      content: "뉴스"
    },
    render: () => <Timeline />
  },
  {
    menuItem: {
      key: "price",
      path: "/price",
      icon: "calculator",
      content: "가격"
    },
    render: () => <Price />
  },
  {
    menuItem: {
      key: "comments",
      path: "/comments",
      icon: "talk",
      content: "댓글"
    },
    render: () => <Comments />
  }
];

class App extends Component {
  // state = {
  //   activeItem: panes[0].menuItem.content
  // };

  // componentDidMount() {
  //   console.log(window.history.location);
  // }

  // handleItemClick = (e, { name, to }) => {
  //   this.setState({
  //     activeItem: name
  //   });
  // };

  render() {
    return (
      <Container style={{ padding: "10px 0" }}>
        <HashRouter>
          <TabMenu panes={panes} />
          {panes.map((v, i) => (
            <Route key={i} exact path={v.menuItem.path} render={v.render} />
          ))}
        </HashRouter>
      </Container>
    );
  }
}

export default App;

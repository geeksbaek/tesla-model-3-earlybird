import React, { Component } from "react";
import "./App.css";
import { HashRouter, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Price from "./components/Price";
import Feeds from "./components/Feeds";
import Diff from "./components/Diff";
import Comments from "./components/Comments";
import TabMenu from "./components/TabMenu";

import { FirebaseProvider } from "./api/Context";

const panes = [
  {
    menuItem: {
      key: "price",
      path: "/",
      icon: "calculator",
      content: "Model 3 가격"
    },
    render: () => <Price />
  },
  {
    menuItem: {
      key: "news",
      path: "/news",
      icon: "newspaper",
      content: "Tesla 소식"
    },
    render: () => <Feeds />
  },
  // {
  //   menuItem: {
  //     key: "diff",
  //     path: "/diff",
  //     icon: "paragraph",
  //     content: "Diff"
  //   },
  //   render: () => <Diff />
  // },
  {
    menuItem: {
      key: "discussions",
      path: "/discussions",
      icon: "discussions",
      content: "의견"
    },
    render: () => <Comments />
  }
];

class App extends Component {
  render() {
    return (
      <FirebaseProvider>
        <Container style={{ padding: "10px 0" }}>
          <HashRouter>
            <TabMenu panes={panes} />
            {panes.map((v, i) => (
              <Route key={i} exact path={v.menuItem.path} render={v.render} />
            ))}
          </HashRouter>
        </Container>
      </FirebaseProvider>
    );
  }
}

export default App;

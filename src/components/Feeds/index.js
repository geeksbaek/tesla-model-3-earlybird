import React from "react";
import axios from "axios";
import { Segment, Grid, Card, Loader, Dimmer } from "semantic-ui-react";

const newsApi =
  "https://asia-northeast1-tesla-238517.cloudfunctions.net/tesla-news";

export default class Feeds extends React.Component {
  state = { items: [], loading: true };

  componentDidMount() {
    axios.get(newsApi).then(res => {
      this.setState({
        loading: false,
        items: res.data.items.map((v, i) => {
          let ago = parseInt(Math.abs(new Date(v.pubDate) - new Date()) / 36e5);

          return (
            <Card.Content>
              <Card.Header
                as="a"
                href={v.link || v.originallink}
                target="_blank"
              >
                <div dangerouslySetInnerHTML={{ __html: v.title }} />
              </Card.Header>
              <Card.Meta>{ago === 0 ? "방금" : `${ago}시간 전`}</Card.Meta>
              <Card.Description>
                <div dangerouslySetInnerHTML={{ __html: v.description }} />
              </Card.Description>
            </Card.Content>
          );
        })
      });
    });
  }

  render() {
    const { items, loading } = this.state;
    return (
      <Grid>
        <Grid.Row only="mobile">
          <Dimmer active={loading} inverted>
            <Loader inverted active={loading} inline="centered" />
          </Dimmer>
          <Segment basic style={{ margin: "0" }}>
            <Card.Group centered>
              {this.state.items.map((v, i) => {
                return (
                  <Card key={i} fluid>
                    {v}
                  </Card>
                );
              })}
            </Card.Group>
          </Segment>
        </Grid.Row>
        <Grid.Row only="computer tablet">
          <Dimmer active={loading} inverted>
            <Loader inverted active={loading} inline="centered" />
          </Dimmer>
          <Segment basic style={{ margin: "0" }}>
            <Card.Group centered>
              {items.map((v, i) => (
                <Card key={i}>{v}</Card>
              ))}
            </Card.Group>
          </Segment>
        </Grid.Row>
      </Grid>
    );
  }
}

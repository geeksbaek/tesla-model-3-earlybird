import React from "react";
import axios from "axios";
import { Segment, Grid, Card, Loader, Dimmer } from "semantic-ui-react";

const newsApi = "http://localhost:8080/DiffCheck/KR";

export default class Diff extends React.Component {
  state = { diff_html: "", html_history: [], loading: true };

  componentDidMount() {
    axios.get(newsApi).then(res => {
      this.setState({
        loading: false,
        diff_html: res.data.diff_html.replace(/&para;/g, ""),
        html_history: res.data.html_history
      });
    });
  }

  render() {
    const { items, diff_html, html_history } = this.state;
    return (
      <Grid>
        <Grid.Row>
          <Segment basic style={{ margin: "0" }}>
            <Card.Group centered>
              <div dangerouslySetInnerHTML={{ __html: diff_html }} />
            </Card.Group>
          </Segment>
        </Grid.Row>
      </Grid>
    );
  }
}

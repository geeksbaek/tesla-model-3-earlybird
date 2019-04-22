import React from "react";
import axios from "axios";
import { Segment, Card, Icon } from "semantic-ui-react";

const newsApi =
  'https://newsapi.org/v2/everything?q=tesla&pageSize=18&sortBy=publishedAt&apiKey=e995a927278f46b7b14fea677442fe4e';
const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};
export default class Feeds extends React.Component {
  state = { items: [] };

  componentDidMount() {
    axios.get(newsApi).then(res => {
      this.setState({
        items: res.data.articles.map((v, i) => {
          return {
            key: i,
            header: (
              <Card.Header as="a" href={v.url} target="_blank">
                {v.title}
              </Card.Header>
            ),
            description: v.description,
            extra: new Date(v.publishedAt).toLocaleDateString(
              "ko-KR",
              dateOptions
            ),
            image: v.urlToImage
          };
        })
      });
    });
  }

  render() {
    const { items } = this.state;
    return (
      <Segment basic>
        <Card.Group centered items={items} />
      </Segment>
    );
  }
}

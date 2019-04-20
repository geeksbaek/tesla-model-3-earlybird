import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "semantic-ui-react";

class TabMenu extends Component {
  render() {
    return (
      <Menu attached="top" tabular pointing secondary>
        {this.props.panes.map((v, i) => (
          <Menu.Item
            as={Link}
            key={i}
            to={v.menuItem.path}
            name={v.menuItem.content}
            icon={v.menuItem.icon}
            active={this.props.location.pathname === v.menuItem.path}
            onClick={this.handleItemClick}
            position={i === this.props.panes.length - 1 ? "right" : null}
          />
        ))}
      </Menu>
    );
  }
}

export default withRouter(TabMenu);

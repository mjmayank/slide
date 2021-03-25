import React from 'react';
import ReactDom from 'react-dom';

import { StateContext } from "./index.tsx";
import Tag from './tag.tsx';

interface Props {
  username: string;
  finalRecords: Record<string, Record<string, any>>;
}

interface State {
  data: Record<string, Record<string, any>>;
  setData(username: string, value: Record<string, any>): void; 
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);

    this.state = {
      data: props.finalRecords,
      setData: this.setData,
    }
  }

  setData = (username: string, value: Record<string, any>) => {
    this.setState(state => ({
      data: {
      ...state.data,
      [username]: {
        ...state.data[username],
        ...value,
      },
    }}));
  }

  getListElementForUsername = (username: string) => {
    let checkNode = document.getElementById('ext-root-' + username);
    if (checkNode) {
      return checkNode;
    }
    let nodes = document.querySelectorAll('._7UhW9.xLCgt.MMzan.KV-D4.fDxYl');
    nodes.forEach(node => {
      let DOMusername = node?.textContent;
      if (username === DOMusername) {
        let root = node?.appendChild(document.createElement('div'));
        root!.id = "ext-root-" + username;
        return root;
      }
    });
  }

  render() {
    const usernames = Object.keys(this.props.finalRecords);

    return (
      <StateContext.Provider value={this.state}>
        {
          usernames.map(username => {
            const node = this.getListElementForUsername(username);
            if (node) {
              return (
                ReactDom.createPortal(
                  <Tag username={ username } record={ this.state.data[username] } list={true}/>,
                  node,
                )
              );
            } else {
              return false;
            }
          })
        }
      </StateContext.Provider>
    )
  }
}
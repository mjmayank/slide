import { useState, useContext } from 'react';
import { Dialog } from 'evergreen-ui';

import {
  addToAirtable,
  StateContext
} from './index';

interface Props {
  list?: boolean;
  username: string;
  status?: string | null;
}

function App(props:Props) {
  const [isShown, setIsShown] = useState(false);
  const { } = useContext(StateContext);

  if (props.status) {
    return (
      <div className={ props.list ? "lead-list" : "lead" }>{ props.status }</div>
    );
  } else {
    return (
      <div>
        <Dialog
          isShown={isShown}
          title="Loading confirmation"
          onCloseComplete={() => setIsShown(false)}
        >
          Dialog content
        </Dialog>
        <div
          onClick={ e => { e.preventDefault(); addToAirtable(props.username); setIsShown(true); } }
          className="lead-empty"
        >
          Add to Airtable
        </div>
      </div>
    )
  }
}

export default App;

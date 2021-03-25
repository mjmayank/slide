import { useState, useContext } from 'react';
import { Dialog } from 'evergreen-ui';
import ColorHash from 'color-hash';

import {
  addToAirtable,
  transcribeAirtableToKeyFields,
  StateContext,
  getContrast,
} from './index';
import LeadForm from './LeadForm.tsx';

interface Props {
  list?: boolean;
  username: string;
  record?: Record<string, any>;
}

function App(props:Props) {
  const record = props.record ? transcribeAirtableToKeyFields(props.record) : {};

  const [isShown, setIsShown] = useState(false);
  const [notes, setNotes] = useState(record.notes || '');
  const [leadType, setLeadType] = useState(record.status || 'Hot Lead - Requires Attn');
  const [programMatch, setProgramMatch] = useState<string | null>(record.programMatch || null);
  const [valuePieceSent, setValuePieceSent] = useState<string | null>(record.valuePieceSent || null);
  const { data } = useContext(StateContext);

  if (record.status) {
    var colorHash = new ColorHash();
    const bgColor = colorHash.hex(record.status);
    const textColor = getContrast(bgColor);
    const style = {
      color: textColor,
      backgroundColor: bgColor,
    }
    return (
      <StateContext.Consumer>
        { (({data, setData}) => (
          <div>
            <Dialog
              isShown={isShown}
              title={ `Add ${props.username} to Airtable` }
              onCloseComplete={() => setIsShown(false)}
              onConfirm={ () => { addToAirtable(props.username, notes, leadType, programMatch, valuePieceSent); setIsShown(false); setData(props.username, { 'status': leadType } ); } }
            >
              <LeadForm
                username={ props.username }
                notes={ notes }
                leadType={ leadType }
                programMatch={ programMatch }
                valuePieceSent={ valuePieceSent }
                setNotes={ setNotes }
                setLeadType={ setLeadType }
                setProgramMatch={ setProgramMatch }
                setValuePieceSent={ setValuePieceSent }
              />
            </Dialog>
            <button
              onClick={ () => setIsShown(true) }
              className={ props.list ? "lead-list" : "lead" }
              style={ style }
            >
              { record.status }
            </button>
          </div>
        ))}
      </StateContext.Consumer>
    );
  } else {
    return (
      <StateContext.Consumer>
        { (({data, setData}) => (
          <div>
            <Dialog
              isShown={isShown}
              title={ `Add ${props.username} to Airtable` }
              onCloseComplete={() => setIsShown(false)}
              onConfirm={ () => { addToAirtable(props.username, notes, leadType, programMatch, valuePieceSent); setIsShown(false); setData(props.username, { 'status': leadType } ); } }
            >
              <LeadForm
                username={ props.username }
                notes={ notes }
                leadType={ leadType }
                programMatch={ programMatch }
                valuePieceSent={ valuePieceSent }
                setNotes={ setNotes }
                setLeadType={ setLeadType }
                setProgramMatch={ setProgramMatch }
                setValuePieceSent={ setValuePieceSent }
              />
            </Dialog>
            <button
              onClick={ () => setIsShown(true) }
              className="lead-empty"
            >
              Add to Airtable
            </button>
          </div>
        ))}
      </StateContext.Consumer>
    )
  }
}

export default App;

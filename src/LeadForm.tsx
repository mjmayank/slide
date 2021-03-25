import React, { useState, useContext } from 'react';
import { Select, Textarea as EvergreenTextarea } from 'evergreen-ui';

interface Props {
  leadType: string;
  notes: string;
  programMatch: string | null;
  valuePieceSent: string | null;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setLeadType: React.Dispatch<React.SetStateAction<string>>;
  setProgramMatch: React.Dispatch<React.SetStateAction<string | null>>;
  setValuePieceSent: React.Dispatch<React.SetStateAction<string | null>>;
  username: string;
}

interface State {
  leadType: string;
  notes: string;
}

const LEAD_TYPES = [
  'Hot Lead - Requires Attn',
  'Warm Lead',
  'Interested Leads',
  '"Not Right Now"',
  'New Connection',
  'Pitched',
  'Closed Leads',
  'Follow Up Action',
];

const PROGRAM_MATCH = [
  '',
  'Private Coaching',
  'Course',
  'Flirting Forward',
  'Intensive',
];

const VALUE_PIECE = [
  '',
  'Freebie',
  'Video',
  'Facebook Group',
];

function App(props:Props) {
  return (
    <div>
      <div>Lead Type</div>
      <Select
        value={props.leadType}
        onChange={ e => props.setLeadType(e.target.value as string) }
      >
        { LEAD_TYPES.map(leadType => (<option key={leadType} value={leadType}>{ leadType }</option>))}
      </Select>
      <div>Program Match</div>
      <Select
        value={props.programMatch ? props.programMatch : ''}
        onChange={ e => props.setProgramMatch(e.target.value as string) }
      >
        { PROGRAM_MATCH.map(leadType => (<option key={leadType} value={leadType}>{ leadType }</option>))}
      </Select>
      <div>Value Piece Sent</div>
      <Select
        value={props.valuePieceSent ? props.valuePieceSent : ''}
        onChange={ e => props.setValuePieceSent(e.target.value as string) }
      >
        { VALUE_PIECE.map(leadType => (<option key={leadType} value={leadType}>{ leadType }</option>))}
      </Select>
      <div>Notes</div>
      <EvergreenTextarea value={props.notes} onChange={ (e:any) => props.setNotes(e.target.value as string) }></EvergreenTextarea>
    </div>
  )
}

export default App;

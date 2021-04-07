import React from 'react';
import { Select, Textarea as EvergreenTextarea, TextInput } from 'evergreen-ui';

interface Props {
  leadType: string;
  name: string;
  notes: string;
  programMatch: string | null;
  valuePieceSent: string | null;
  setName: React.Dispatch<React.SetStateAction<string>>;
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
      <div className='lead-section'>
        <div className='lead-label'>Name</div>
        <TextInput value={props.name} onChange={ (e:any) => props.setName(e.target.value as string) }></TextInput>
      </div>
      <div className='lead-section'>
        <div className='lead-label'>Lead Type</div>
        <Select
          value={props.leadType}
          onChange={ e => props.setLeadType(e.target.value as string) }
        >
          { LEAD_TYPES.map(leadType => (<option key={leadType} value={leadType}>{ leadType }</option>))}
        </Select>
      </div>
      <div className='lead-section'>
        <div className='lead-label'>Program Match</div>
        <Select
          value={props.programMatch ? props.programMatch : ''}
          onChange={ e => props.setProgramMatch(e.target.value as string) }
        >
          { PROGRAM_MATCH.map(leadType => (<option key={leadType} value={leadType}>{ leadType }</option>))}
        </Select>
        </div>
      <div className='lead-section'>
        <div className='lead-label'>Value Piece Sent</div>
        <Select
          value={props.valuePieceSent ? props.valuePieceSent : ''}
          onChange={ e => props.setValuePieceSent(e.target.value as string) }
        >
          { VALUE_PIECE.map(leadType => (<option key={leadType} value={leadType}>{ leadType }</option>))}
        </Select>
      </div>
      <div className='lead-section'>
        <div className='lead-label'>Notes</div>
        <EvergreenTextarea value={props.notes} onChange={ (e:any) => props.setNotes(e.target.value as string) }></EvergreenTextarea>
      </div>
    </div>
  )
}

export default App;

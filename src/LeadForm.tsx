import React, { useState } from 'react';
import {
  Select,
  Textarea as EvergreenTextarea,
  TextInput,
  Combobox,
  Autocomplete,
} from 'evergreen-ui';

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
  'Add New'
];

const VALUE_PIECE = [
  '',
  'Freebie',
  'Video',
  'Facebook Group',
  'Add New'
];

function App(props:Props) {
  const [programMatchInput, setProgramMatchInput] = useState(props.programMatch || '');
  const [valuePieceInput, setValuePieceInput] = useState(props.valuePieceSent || '');

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
        <Autocomplete
          allowOtherValues
          onChange={ value => {
            if(value === 'Add New') {
              value = programMatchInput;
            }
            setProgramMatchInput(value);
            props.setProgramMatch(value as string);
            return value;
          } }
          items={ PROGRAM_MATCH }
          itemToString={ item => {
            if(item === 'Add New') {
              return `+ Add '${programMatchInput}'`
            }
            return item;
          } }
        >
          {(autoCompleteProps) => {
            return (
              <TextInput
                placeholder="Program Match"
                ref={autoCompleteProps.getRef}
                {...autoCompleteProps.getInputProps({
                  onFocus: () => {
                    autoCompleteProps.openMenu()
                  },
                  onChange: (e:any) => {
                    setProgramMatchInput(e.target.value);
                  }
                })}
                value={programMatchInput}
              />
            )
          }}
        </Autocomplete>
      </div>



      <div className='lead-section'>
        <div className='lead-label'>Value Piece Sent</div>
        <Autocomplete
          allowOtherValues
          onChange={ value => {
            console.log('onchange', value);
            if(value === 'Add New') {
              value = valuePieceInput;
            }
            setValuePieceInput(value);
            props.setValuePieceSent(value as string);
            return value;
          } }
          items={ VALUE_PIECE }
          itemToString={ item => {
            if(item === 'Add New') {
              return `+ Add '${valuePieceInput}'`
            }
            return item;
          } }
        >
          {(autoCompleteProps) => {
            return (
              <TextInput
                placeholder="Value Piece Sent"
                ref={autoCompleteProps.getRef}
                {...autoCompleteProps.getInputProps({
                  onFocus: () => {
                    autoCompleteProps.openMenu()
                  },
                  onChange: (e:any) => {
                    setValuePieceInput(e.target.value);
                  }
                })}
                value={valuePieceInput}
              />
            )
          }}
        </Autocomplete>
      </div>


      <div className='lead-section'>
        <div className='lead-label'>Notes</div>
        <EvergreenTextarea value={props.notes} onChange={ (e:any) => props.setNotes(e.target.value as string) }></EvergreenTextarea>
      </div>
    </div>
  )
}

export default App;

import React, { useState } from 'react';
import ReactDom from 'react-dom';

import {
  Button,
  TextInput,
} from 'evergreen-ui';

interface Props {
  apiKey: string,
  baseId: string,
  setApiKey(value:string): void;
  setBaseId(value:string): void;
}

function App(props: Props) {
  const {
    apiKey,
    baseId,
    setApiKey,
    setBaseId,
  } = props;
  const apiKeyTextInputChanged = (e:React.SyntheticEvent) => {
    setApiKey((e.target as HTMLInputElement).value)
  }

  const baseIdTextInputChanged = (e:React.SyntheticEvent) => {
    setBaseId((e.target as HTMLInputElement).value)
  }

  return (
    <div>
      <ul className='onboarding-list'>
      <li className='onboarding-list-item'>
          <div>1. Copy your API key (in the purple text box)</div>
          <Button
            is="a"
            appearance="primary"
            intent="none"
            href="https://airtable.com/account"
            target="_blank"
          >
            Open Account Preferences
          </Button>
        </li>
        <li className='onboarding-list-item'>
          <div>
            2. Paste API key it here
          </div>
          <TextInput
            value={ apiKey }
            onChange={ apiKeyTextInputChanged }
            placeholder={ 'API Key' }
          />
        </li>
        <li className='onboarding-list-item'>
          <div>3. Open the Airtable API</div>
          <Button
            appearance="primary"
            intent="none"
            is="a"
            href="https://airtable.com/api"
            target="_blank"
          >
            Open Airtable API
          </Button>
        </li>
        <li className='onboarding-list-item'>
          <div>
            4. Select the correct Airtable base from the list
          </div>
        </li>
        <li className='onboarding-list-item'>
          <div>
            5. Copy the Base ID and paste it here. (You can find it in the Introduction)
          </div>
          <TextInput value={ baseId } onChange={ baseIdTextInputChanged } placeholder={ 'Base ID' }/>
        </li>
      </ul>
    </div>
  )
}

export default App;
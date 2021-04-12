import React, { useState } from 'react';
import ReactDom from 'react-dom';

import {
  Button,
  TextInput,
} from 'evergreen-ui';

interface Props {
  apiKey: string,
  baseId: string,
  emailAddress: string,
  setApiKey(value:string): void;
  setBaseId(value:string): void;
  setEmailAddress(value: string): void;
}

function App(props: Props) {
  const {
    apiKey,
    baseId,
    emailAddress,
    setApiKey,
    setBaseId,
    setEmailAddress,
  } = props;
  const apiKeyTextInputChanged = (e:React.SyntheticEvent) => {
    setApiKey((e.target as HTMLInputElement).value)
  }

  const baseIdTextInputChanged = (e:React.SyntheticEvent) => {
    setBaseId((e.target as HTMLInputElement).value)
  }

  const emailAddressTextInputChanged = (e:React.SyntheticEvent) => {
    setEmailAddress((e.target as HTMLInputElement).value)
  }

  return (
    <div>
      <ul className='onboarding-list'>
      <li className='onboarding-list-item'>
          <div>1. Enter your email address</div>
          <TextInput
            value={ emailAddress }
            onChange={ emailAddressTextInputChanged }
            placeholder={ 'Email Addresss' }
            type={ 'email' }
            autoComplete={ 'email' }
          />
      </li>
      <li className='onboarding-list-item'>    
          <div>2. Copy your API key (in the purple text box)</div>
          <Button
            is="a"
            className="setup-button"
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
            3. Paste API key it here
          </div>
          <TextInput
            value={ apiKey }
            onChange={ apiKeyTextInputChanged }
            placeholder={ 'API Key' }
          />
        </li>
        <li className='onboarding-list-item'>
          <div>
            4. Copy this base. In the top right corner, click “Copy Base”
          </div>
          <Button
            appearance="primary"
            className="setup-button"
            intent="none"
            is="a"
            href="https://airtable.com/shr9xYWQtESFWWr1B"
            target="_blank"
          >
            Open Base Template
          </Button>
        </li>
        <li className='onboarding-list-item'>
          <div>5. Select the correct Airtable base from the list (should be called "Lead Tracker")</div>
          <Button
            appearance="primary"
            className="setup-button"
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
            6. Copy the Base ID and paste it here. (You can find it in the Introduction)
          </div>
          <TextInput value={ baseId } onChange={ baseIdTextInputChanged } placeholder={ 'Base ID' }/>
        </li>
      </ul>
    </div>
  )
}

export default App;
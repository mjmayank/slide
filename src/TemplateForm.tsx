import React, { useState } from 'react';
import ReactDom from 'react-dom';

import {
  Button,
  Textarea,
  TextInput,
} from 'evergreen-ui';

interface Props {
  templateTitle: string,
  templateText: string,
  setTemplateTitle(value:string): void;
  setTemplateText(value:string): void;
}

function App(props: Props) {
  const {
    templateTitle,
    templateText,
    setTemplateTitle,
    setTemplateText,
  } = props;

  return (
    <div>
      <div>
        Template Title
        <TextInput
          placeholder="Template title"
          value={ templateTitle }
          onChange={ (e: any) => setTemplateTitle(e.target.value) }
        />
      </div>
      <div>
        Body
        <Textarea
          value={ templateText }
          onChange={ (e: any) => setTemplateText(e.target.value) }
        />
      </div>
    </div>
  )
}

export default App;
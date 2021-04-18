import { useState } from 'react';
import amplitude from 'amplitude-js';

import {
  Dialog,
  Popover,
  Menu,
} from 'evergreen-ui';
import TemplateForm from './TemplateForm';

export const TEMPLATE_SYNC_KEY = 'TEMPLATE_SYNC_KEY';

export interface Template {
  title: string;
  text: string; 
}

interface Props {
  templates: Template[];
}

function App(props:Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateText, setTemplateText] = useState('');
  const [templates, setTemplates] = useState<{ title: string, text: string}[]>(props.templates);

  return (
    <div className="QBdPU">
      <Popover
        content={({ close }) => (
          <Menu>
            { templates.length > 0 && <Menu.Group>
              {
                templates.map( template => (
                  <Menu.Item
                    key={ `${template.title}-${template.text}`}
                    onSelect={() => {
                      amplitude.getInstance().logEvent('template_used');
                      const textArea = document.querySelector('[placeholder="Message..."]');
                      (textArea as HTMLTextAreaElement).value = template.text;
                      close();
                    } }
                  >
                      { `${template.title} - ${template.text.substring(0, 10)}` }
                  </Menu.Item>
                ))
              }
            </Menu.Group> }
            <Menu.Group>
              <Menu.Item
                onSelect={() => {
                  setModalOpen(true);
                  close();
                } }
              >
                  Add new template
              </Menu.Item>
            </Menu.Group>
          </Menu>
        )}
      >
        <img className="template-button-img" src={ chrome.runtime.getURL('/img/template_icon.png') } />
      </Popover>
      <Dialog
        isShown={ modalOpen }
        title="Add new template"
        onConfirm={ () => {
          const newTemplates = [ ...templates, { title: templateTitle, text: templateText } ]
          setTemplates(newTemplates);
          chrome.storage.sync.set({
            [TEMPLATE_SYNC_KEY]: newTemplates,
          });
          setTemplateTitle('');
          setTemplateText('');
          setModalOpen(false);
          amplitude.getInstance().logEvent('template_created');
        } }
        onCloseComplete={() => setModalOpen(false)}
      >
        <TemplateForm
          templateTitle={ templateTitle }
          templateText={ templateText }
          setTemplateText={ setTemplateText }
          setTemplateTitle={ setTemplateTitle }
        />
      </Dialog>
    </div>
  )
}

export default App;

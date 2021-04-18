import { Popover, Pane, Menu, toaster } from 'evergreen-ui';

function App() {
  return (
    <div className="QBdPU">
      <Popover
        content={({ close }) => (
          <Menu>
            <Menu.Group>
              <Menu.Item
                onSelect={() => {
                  const textArea = document.querySelector('[placeholder="Message..."]');
                  (textArea as HTMLTextAreaElement).value = 'hello!';
                  close();
                } }
              >
                  Template 1
              </Menu.Item>
            </Menu.Group>
            <Menu.Group>
              <Menu.Item
                onSelect={() => {
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
    </div>
  )
}

export default App;

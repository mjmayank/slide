import React from 'react';
import ReactDom from 'react-dom';
import Airtable from 'airtable';
import amplitude from 'amplitude-js';

import { StateContext, URL_UPDATED_EVENT, transcribeAirtableToKeyFields } from "./index.tsx";
import Tag from './tag.tsx';
import Setup from './Setup';
import TemplateEntry, { TEMPLATE_SYNC_KEY, Template } from './Template';
import { Dialog, toaster } from 'evergreen-ui';

const AIRTABLE_API_KEY = 'airtable_private_key';
const AIRTABLE_BASE_ID_KEY = 'airtable_base'
const EMAIL_ADDRESS_KEY = 'slide_email_address'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface Props {
  finalRecords: Record<string, AirtableRecord>;
}

type AirtableRecord = Record<string, any>;

interface State {
  apiKey: string;
  baseId: string;
  currentUser: string;
  data: Record<string, AirtableRecord>;
  emailAddress: string;
  isOnboardingShown: boolean;
  setData(username: string, value: AirtableRecord): void; 
  templates: Template[];
  username: string | null;
}

interface ChromeSyncResult {
  [key: string]: any,
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);

    chrome.storage.sync.get(EMAIL_ADDRESS_KEY, result => {
      if (currentUser) {
        amplitude.getInstance().init("12a0fcd83ce36edfd172d32a8a927bb9", result[EMAIL_ADDRESS_KEY]);
      } else {
        amplitude.getInstance().init("12a0fcd83ce36edfd172d32a8a927bb9");
      }
    });

    // chrome.storage.sync.remove([AIRTABLE_API_KEY, AIRTABLE_BASE_ID_KEY, EMAIL_ADDRESS_KEY], () => {})

    const currentUser = document.querySelector('._7UhW9.vy6Bb.qyrsm.KV-D4.fDxYl.T0kll')?.textContent
      || document.querySelector('a.gmFkV')?.textContent
      || '';

    this.state = {
      apiKey: '',
      baseId: '',
      currentUser,
      data: props.finalRecords,
      emailAddress: '',
      isOnboardingShown: false,
      setData: this.setData,
      templates: [],
      username: null,
    }
  }

  base: Airtable.Base | undefined;

  setBaseId = (value: string) => {
    this.setState(state => ({ ...state, baseId: value }));
  }

  setApiKey = (value: string) => {
    this.setState(state => ({ ...state, apiKey: value }));
  }

  setEmailAddress = (value: string) => {
    this.setState(state => ({ ...state, emailAddress: value }));
  }

  setAirtableBaseId = (result:ChromeSyncResult) => {
    if (result[AIRTABLE_BASE_ID_KEY]) {
      const baseId = result[AIRTABLE_BASE_ID_KEY];
      this.base = Airtable.base(baseId);
      this.setState(state => ({ ...state, baseId }));
      this.setState(state => ({ ...state, isOnboardingShown: false }))
    } else {
      this.setState(state => ({ ...state, isOnboardingShown: true }))
    }
  }

  setAirtableApiKey = (result:ChromeSyncResult) => {
    if (result[AIRTABLE_API_KEY]) {
      const apiKey = result[AIRTABLE_API_KEY];
      (Airtable.configure as any)({
        apiKey,
        endpointUrl: 'https://api.airtable.com'
      });
      this.setState(state => ({ ...state, apiKey }));
    }
  }

  initializeAirtable = () => {
    chrome.storage.sync.get(AIRTABLE_API_KEY, result => {
      this.setAirtableApiKey(result);
      chrome.storage.sync.get([AIRTABLE_BASE_ID_KEY], result => {
        this.setAirtableBaseId(result);
        this.initialQuery();
      });
    });
  }

  initializeTemplates = () => {
    chrome.storage.sync.get(TEMPLATE_SYNC_KEY, result => {
      console.log(result);
      console.log(result[TEMPLATE_SYNC_KEY]);
      this.setState(state => ({
        ...state,
        templates: (result[TEMPLATE_SYNC_KEY] as Template[]),
      }));
    });
  }

  saveAirtableValues = (apiKey: string, baseId: string, emailAddress: string) => {
    chrome.storage.sync.set({
      [AIRTABLE_API_KEY]: apiKey,
      [AIRTABLE_BASE_ID_KEY]: baseId,
      [EMAIL_ADDRESS_KEY]: emailAddress,
    },
    () => {
      this.initializeAirtable();
      this.setState(state => ({ ...state, isOnboardingShown: false }));
      amplitude.getInstance().setUserId(emailAddress);
    })
  }

  componentDidMount() {
    amplitude.getInstance().logEvent('viewed_instagram', { 'url': window.location.href, 'username': this.state.currentUser });
    this.initializeAirtable();
    this.initializeTemplates();
    chrome.runtime.onMessage.addListener(this.handleMessage);

    const targetNode = document.querySelector('.N9abW');
    if (targetNode) {
      const config = { childList: true, subtree: true };
      const observer = new MutationObserver(() => this.forceUpdate());
      observer.observe(targetNode, config);
    }
  }

  page = (records:any, fetchNextPage:any) => {
    // This function (`page`) will get called for each page of records.
    records.forEach(this.recordState);
  
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
  
  }

  recordState = (record:any) => {
    const username = record.get('IG Handle');
    const transcribedRecords = transcribeAirtableToKeyFields(record.fields);
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        [username]: {
          ...transcribedRecords,
          id: record.id,
        }
      },
    }))
  }

  initialQuery = () => {
    const query = this.constructQuery();
    if (query && this.base) {
      this.base('Table 1').select({
        // Selecting the first 3 records in Grid view:
        filterByFormula: query,
      }).eachPage(this.page);
    }
  }

  constructQuery = () => {
    const state = this.state;
    let activeUsernames:string[] = [];
    let nodes = document.querySelectorAll('._7UhW9.xLCgt.MMzan.KV-D4.fDxYl');
    nodes.forEach(node => {
      if (node.childElementCount === 0){
        const username = node?.textContent;
        if (username && !username.includes(',')) {
          activeUsernames.push(username);
        }
      }
    });
    const queriedUsernames = Object.keys(state.data);
    activeUsernames = activeUsernames.filter( function( el ) {
      return queriedUsernames.indexOf( el ) < 0;
    } );
    if (activeUsernames.length === 0) {
      return;
    }
    let query = 'OR(';
    activeUsernames.forEach(username => {
      query += `{IG Handle}='${username}',`;
    });
    if(query.slice(-1) === ',') {
      query = query.slice(0, -1)
    }
    query += ')';
    return query;
  }

  handleMessage = (message:any) => {
    if (message.name === URL_UPDATED_EVENT) {
      if (message) {
        this.initialQuery();
        //often times the URL will change while the page is still rendering
        const usernameNode = document.querySelector('.Igw0E.IwRSH.eGOV_.ybXk5._4EzTm')
        let currentUser = this.state.currentUser;
        if(!this.state.currentUser) {
          currentUser = document.querySelector('._7UhW9.vy6Bb.qyrsm.KV-D4.fDxYl.T0kll')?.textContent
            || document.querySelector('a.gmFkV')?.textContent
            || '';
        }
        const username = usernameNode?.textContent;
        if (username) {
          this.setState(state => ({
            ...state,
            username,
            currentUser,
          }));
        }
      }
    }
  }

  setData = (username: string, value: Record<string, any>) => {
    this.setState(state => ({
      data: {
      ...state.data,
      [username]: {
        ...state.data[username],
        ...value,
      },
    }}));
  }

  getListElementForUsername = (username: string) => {
    let checkNode = document.getElementById('ext-root-' + username);
    if (checkNode) {
      return checkNode;
    }
    let nodes = document.querySelectorAll('._7UhW9.xLCgt.MMzan.KV-D4.fDxYl');
    nodes.forEach(node => {
      let DOMusername = node?.textContent;
      if (username === DOMusername) {
        let root = node?.parentNode?.appendChild(document.createElement('div'));
        root!.id = "ext-root-" + username;
        return root;
      }
    });
  }

  getDirectElementForUsername = () => {
    let checkNode = document.getElementById('ext-root');
    if (checkNode) {
      return checkNode;
    }
    let node = document.querySelector('.sqdOP.yWX7d._4pI4F._8A5w5')?.parentElement;
    if (node) {
      let root = node.appendChild(document.createElement('div'));
      root.id = "ext-root";
      return root;
    }
  }

  updateInAirtable = (username:string, notes: string, leadType: string, programMatch: string|null, valuePieceSent:string|null) => {
    if (!this.base) {
      return;
    }
    amplitude.getInstance().logEvent('update_in_airtable', { 'url': window.location.href, 'username': this.state.currentUser });
    this.base('Table 1').update([
      {
        "id": this.state.data[username].id,
        "fields": {
          "IG Handle": username,
          "Lead Type": leadType,
          "Notes": notes,
          "Value Piece Sent": valuePieceSent ? [valuePieceSent] : null,
          "Program Match": programMatch,
        },
      }
    ], { typecast: true }, function(err:any, records:Airtable.Record<any>[]) {
      if (err) {
        toaster.danger('There was an error saving your lead')
        console.error(err);
        return;
      }
      records.forEach(function(record:Airtable.Record<any>) {
        console.log(record.get('Lead Type'));
      });
    });
  }

  addToAirtable = (username:string, data: Record<string, any>) => {
    const {
      name,
      notes,
      leadType,
      programMatch,
      valuePieceSent,
    } = data;

    if (this.state.data[username]) {
      return this.updateInAirtable(username, notes, leadType, programMatch, valuePieceSent);
    }
    amplitude.getInstance().logEvent('add_to_airtable', { 'url': window.location.href, 'username': this.state.currentUser });
  
    var today = new Date();
    var followUp = new Date();
    followUp.setDate(followUp.getDate() + 3)

    if (!this.base) {
      return;
    }

    this.base('Table 1').create([
      {
        "fields": {
          "First Name": name,
          "IG Handle": username,
          "Lead Type": leadType,
          "Entry Month": MONTHS[today.getMonth()],
          "First Contacted": today.toISOString().split('T')[0],
          "Follow Up": followUp.toISOString().split('T')[0],
          "Notes": notes,
          "Value Piece Sent": valuePieceSent ? [valuePieceSent] : null,
          "Program Match": programMatch,
        }
      }
    ], { typecast: true }, function(err: any, records: any) {
      if (err) {
        toaster.danger('There was an error saving your lead')
        console.error(err);
        return;
      }
      records.forEach(function (record: any) {
        console.log(record.getId());
      });
    });
  }

  render() {
    const usernames = Object.keys(this.state.data);
    const {
      apiKey,
      baseId,
      emailAddress,
      isOnboardingShown,
      username,
    } = this.state;

    const usernameNode = this.getDirectElementForUsername();

    let templateNode: HTMLElement | null = document.getElementById('template-button');
    if(!templateNode) {
      templateNode = document.createElement('button');
      templateNode.className = 'wpO6b';
      templateNode.id = 'template-button';
      const addPicButton = document.querySelector('[aria-label="Add Photo or Video"]')?.parentElement?.parentElement;
      if (addPicButton) {
        addPicButton!.parentElement?.insertBefore(templateNode, addPicButton!);
      }
    }

    return (
      <StateContext.Provider value={this.state}>
        { <Dialog
            isShown={ isOnboardingShown }
            title="Set up your connection to Airtable"
            onCloseComplete={() => { this.setState(state => ({ isOnboardingShown: false })) } }
            onConfirm={ () => this.saveAirtableValues(apiKey, baseId, emailAddress) }
          >
            <Setup
              apiKey={ apiKey }
              baseId={ baseId }
              emailAddress={ emailAddress }
              setApiKey={ this.setApiKey }
              setBaseId={ this.setBaseId }
              setEmailAddress={ this.setEmailAddress }
            />
          </Dialog> }
        {
          usernames.map(username => {
            const node = this.getListElementForUsername(username);
            if (node) {
              return (
                ReactDom.createPortal(
                  <Tag username={ username } record={ this.state.data[username] } list={true} addToAirtable={this.addToAirtable}/>,
                  node,
                )
              );
            } else {
              return false;
            }
          })
        }
        { username && usernameNode && ReactDom.createPortal(<Tag username={ username } record={ this.state.data[username] } addToAirtable={this.addToAirtable}></Tag>, usernameNode) }
        { templateNode && ReactDom.createPortal(<TemplateEntry templates={ this.state.templates } />, templateNode) }
      </StateContext.Provider>
    )
  }
}
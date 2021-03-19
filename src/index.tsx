import React from 'react';
import ReactDOM from 'react-dom';

import Airtable from 'airtable';
import Tag from './tag';
import reportWebVitals from './reportWebVitals';
import "./normalize.css"

export const StateContext = React.createContext({});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const URL_UPDATED_EVENT = "EVENT__URL_UPDATED";
const DATA_RECEIVED = "EVENT__DATA_RECEIVED";

const AIRTABLE_SECRET = 'keyrCJgTKaSw8FM3o';

interface AirtableRecord {
  username: string;
  entryMonth: string; // Month
  firstContactedDate: Date;
  followUpDate: Date;
  leadType: string[];
}

(Airtable.configure as any)({
  apiKey: AIRTABLE_SECRET,
  endpointUrl: 'https://api.airtable.com'
});

var base = Airtable.base('appvvS3KTnAUTFGkW');
let finalRecords: Record<string, string> = {};

let renderInList = () => {
  let nodes = document.querySelectorAll('._7UhW9.xLCgt.MMzan.KV-D4.fDxYl');
      nodes.forEach(node => {
        let username = node?.textContent;
        let checkNode = document.getElementById('ext-root-' + username);
        if (checkNode) {
          return;
        }
        let root = node?.appendChild(document.createElement('div'));
        root!.id = "ext-root-" + username;
        if (username && finalRecords[username]) {
          ReactDOM.render(
            <StateContext.Provider value={finalRecords}>
              <React.StrictMode>
                <Tag username={ username } status={ finalRecords[username] } list={true}/>
              </React.StrictMode>
            </StateContext.Provider>,
            document.getElementById('ext-root-' + username)
          );
        }
    });
};

export const addToAirtable = (username:string) => {
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

  var today = new Date();
  var followUp = new Date();
  followUp.setDate(followUp.getDate() + 3)

  base('Table 1').create([
    {
      "fields": {
        "IG Handle": username,
        "Lead Type": ['Warm Lead'],
        "Entry Month": MONTHS[today.getMonth()],
        "First Contacted": today.toISOString().split('T')[0],
        "Follow Up": followUp.toISOString().split('T')[0],
      }
    }
  ], function(err: any, records: any) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record: any) {
      console.log(record.getId());
    });
  });
}

base('Table 1').select({
  // Selecting the first 3 records in Grid view:
  maxRecords: 5,
  view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.
  records.forEach(function (record) {
    var username = record.get('IG Handle');
    finalRecords[username] = record.get('Lead Type')[0];
  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, function done(err) {
  if (err) { console.error(err); return; }

  const delay = (t:any) => new Promise(resolve => setTimeout(resolve, t));
  delay(3000).then(
    () => {
      renderInList();
    });
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.name === URL_UPDATED_EVENT) {
    if (message) {
      renderInList();
      //often times the URL will change while the page is still rendering
      let node = document.querySelector('.Igw0E.IwRSH.eGOV_.ybXk5._4EzTm')
      let username = node?.textContent;
      if (node) {
        let checkNode = document.getElementById('ext-root');
        if (checkNode) {
          return;
        }
        let root = node.appendChild(document.createElement('div'));
        root.id = "ext-root";
        let status = null;
        if (username && finalRecords[username]) {
          status = finalRecords[username];
        }
        ReactDOM.render(
          <StateContext.Provider value={finalRecords} >
            <React.StrictMode>
              <Tag status={ status } username={ username! }/>
            </React.StrictMode>
          </StateContext.Provider>,
          document.getElementById('ext-root')
        );
      }
    }
  }
});

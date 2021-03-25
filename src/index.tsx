import React from 'react';
import ReactDOM from 'react-dom';

import Airtable from 'airtable';
import Tag from './tag';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./normalize.css"
import amplitude from 'amplitude-js';

export const StateContext = React.createContext({ data: {}, setData: (username: string, value: Record<string, any>) => {} });
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

amplitude.getInstance().init("12a0fcd83ce36edfd172d32a8a927bb9");

(Airtable.configure as any)({
  apiKey: AIRTABLE_SECRET,
  endpointUrl: 'https://api.airtable.com'
});

var base = Airtable.base('appvvS3KTnAUTFGkW');
let finalRecords: Record<string, Record<string, any>> = {};

let constructQuery = () => {
  let activeUsernames:string[] = [];
  let nodes = document.querySelectorAll('._7UhW9.xLCgt.MMzan.KV-D4.fDxYl');
  nodes.forEach(node => {
    const username = node?.textContent;
    if (username && !username.includes(',')) {
      activeUsernames.push(username);
    }
  });
  let query = 'OR(';
  activeUsernames.forEach(username => {
    query += `{IG Handle}='${username}',`;
  });
  if(query.slice(-1) === ',') {
    query = query.slice(0, -1)
  }
  query += ')';
  console.log('query');
  console.log(query);
  return query;
}

const AIRTABLE_TO_RECORD:Record<string, string> = {
  'IG Handle': 'username',
  'Lead Type': 'status',
  'Entry Month': 'entryMonth',
  'Notes': 'notes',
  'Value Piece Sent': 'valuePiece',
  'Program Match': 'programMatch',
}

/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
export var getContrast = function (hexcolor: string){

	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}

	// If a three-character hexcode, make six-character
	if (hexcolor.length === 3) {
		hexcolor = hexcolor.split('').map(function (hex) {
			return hex + hex;
		}).join('');
	}

	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);

	// Get YIQ ratio
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

	// Check contrast
	return (yiq >= 128) ? 'black' : 'white';

};

export const transcribeAirtableToKeyFields = (record:Record<string, any>) => {
  let newRecord:Record<string, string> = {};
  Object.keys(record).forEach(key => {
    if(AIRTABLE_TO_RECORD[key]) {
      newRecord[AIRTABLE_TO_RECORD[key]] = record[key];
    } else {
      newRecord[key] = record[key];
    }
  })
  return newRecord;
}

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
        <React.StrictMode>
          <App username={ username } finalRecords={ finalRecords }/>
        </React.StrictMode>,
        document.getElementById('ext-root-' + username)
      );
    }
  });
};

export const addToAirtable = (username:string, notes: string, leadType: string, programMatch: string|null, valuePieceSent:string|null) => {
  amplitude.getInstance().logEvent('add_to_airtable');
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
        "Lead Type": [leadType],
        "Entry Month": MONTHS[today.getMonth()],
        "First Contacted": today.toISOString().split('T')[0],
        "Follow Up": followUp.toISOString().split('T')[0],
        "Notes": notes,
        "Value Piece Sent": valuePieceSent ? [valuePieceSent] : null,
        "Program Match": programMatch,
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

const initialQuery = () => {
  console.log('making API request now');
  base('Table 1').select({
    // Selecting the first 3 records in Grid view:
    filterByFormula: constructQuery(),
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function (record) {
      var username = record.get('IG Handle');
      finalRecords[username] = record.fields;
    });
  
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
  
  }, function done(err) {
    if (err) { console.error(err); return; }
    renderInList();
  });
}

setTimeout(() => {
  initialQuery();
}, 3000)

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.name === URL_UPDATED_EVENT) {
    if (message) {
      initialQuery();
      //often times the URL will change while the page is still rendering
      let node = document.querySelector('.sqdOP.yWX7d._4pI4F._8A5w5')?.parentElement;
      let usernameNode = document.querySelector('.Igw0E.IwRSH.eGOV_.ybXk5._4EzTm')
      let username = usernameNode?.textContent;
      if (node) {
        let checkNode = document.getElementById('ext-root');
        if (checkNode) {
          return;
        }
        let root = node.appendChild(document.createElement('div'));
        root.id = "ext-root";
        let status = null;
        if (!username) {
          return;
        }
        ReactDOM.render(
            <React.StrictMode>
              <App finalRecords={ finalRecords } username={ username! }/>
            </React.StrictMode>,
          document.getElementById('ext-root')
        );
      }
    }
  }
});

const targetNode = document.querySelector('.N9abW');
if (targetNode) {
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(renderInList);
  observer.observe(targetNode, config);
}
import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';
import reportWebVitals from './reportWebVitals';
import "./normalize.css"

export const StateContext = React.createContext({ data: {}, setData: (username: string, value: Record<string, any>) => {} });
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export const URL_UPDATED_EVENT = "EVENT__URL_UPDATED";
const DATA_RECEIVED = "EVENT__DATA_RECEIVED";

interface AirtableRecord {
  username: string;
  entryMonth: string; // Month
  firstContactedDate: Date;
  followUpDate: Date;
  leadType: string[];
}

let finalRecords: Record<string, Record<string, any>> = {};

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

const AIRTABLE_TO_RECORD:Record<string, string> = {
  'First Name': 'name',
  'IG Handle': 'username',
  'Lead Type': 'status',
  'Entry Month': 'entryMonth',
  'Notes': 'notes',
  'Value Piece Sent': 'valuePiece',
  'Program Match': 'programMatch',
}

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
  ReactDOM.render(
    <React.StrictMode>
      <Main finalRecords={ finalRecords }/>
    </React.StrictMode>,
    document.querySelector('._7UhW9.vy6Bb.qyrsm.KV-D4.fDxYl.T0kll'),
  );
}

setTimeout(() => {
  renderInList();
  console.log('rendered');
}, 3000)

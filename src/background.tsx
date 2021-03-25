const COMPLETE = "complete"; // Based on chrome spec. Don't change!

const URL_UPDATED_EVENT = "EVENT__URL_UPDATED";
const DATA_RECEIVED = "EVENT__DATA_RECEIVED";

export { }

// update on URL update
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  console.log('URL update');
  console.log(change)
  if (change && change.status === COMPLETE) {
    console.log('inside');
    chrome.tabs.sendMessage(
      tabId,
      {
        name: URL_UPDATED_EVENT,
      },
      {}
    );
  }
});

chrome.webRequest.onCompleted.addListener((details) => {
  console.log('network request');
  console.log(details);
  if (details) {
    console.log('inside');
    chrome.tabs.sendMessage(
      details.tabId,
      {
        name: URL_UPDATED_EVENT,
      },
      {}
    );
  }
}, { urls: ['https://i.instagram.com/api/v1/direct_v2/inbox/*'] })
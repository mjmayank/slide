const COMPLETE = "complete"; // Based on chrome spec. Don't change!

const URL_UPDATED_EVENT = "EVENT__URL_UPDATED";
const DATA_RECEIVED = "EVENT__DATA_RECEIVED";

export { }

// update on URL update
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  console.log('outside');
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
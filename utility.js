export async function getActiveTabURL() {
  let queryOptions = { active: true, currentWindow: true };
  let tab = await chrome.tab.query(queryOptions);
  return tab;
}

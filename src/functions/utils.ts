export const getActiveTabURL = async () => {
  const tabs: Array<any> = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return tabs[0];
};

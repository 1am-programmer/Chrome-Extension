chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    //To make sure we are on a page that says youtube.com/watch because every youtube video has it
    const queryParameters = tab.url.split("?")[1];
    //Grabs all the params of a youtube video, which is ideally unique
    const urlParameters = new URLSearchParams(queryParameters);

    console.log(urlParameters);
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
      // random: "random",
    });
  }
});

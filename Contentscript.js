(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";

  //When a message is being sent to the content script, we can also send a response back
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    }
  });

  const newVideoLoaded = () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("/assets/bookmark.png");
      bookmarkBtn.className = "ytp-button" + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current time stamp";
      //Grabs the left conrol in youtube videos
      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];

      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      //Add our bookmark button to the left controls
      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };
  const addNewBookmarkEventHandler = () => {
    /**
     * Gets the time in our video
     * Converts the time in our console to stand time
     */
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at" + currentTime,
    };
  };

  // newVideoLoaded();
})();

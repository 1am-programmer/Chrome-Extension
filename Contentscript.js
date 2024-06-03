(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  //When a message is being sent to the content script, we can also send a response back
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });

      response(currentVideoBookmarks);
    }
  });

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
      /*Checks if our current video has any bookmarks or if it exists in storage, if it exists, we Json parse it, since we already 
      Json stringify it, but if it doesnt exist then we return an empty array
      */
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];
    currentVideoBookmarks = await fetchBookmarks();

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
  const addNewBookmarkEventHandler = async () => {
    /**
     * Gets the time in our video
     * Converts the time in our console to stand time
     */
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at" + currentTime,
    };

    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort(
          (a, b) => (a.time = b.time)
        )
      ),
    });
  };

  const getTime = (t) => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substring(11, 8);
  };
  // newVideoLoaded();
})();

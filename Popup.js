import { getActiveTabURL } from "./utility";

const addNewBookmark = (bookmarkElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  newBookmarkElement.id = "bookmark-" + bookmark.time;
};

const viewBookmarks = (currentBookmarks = []) => {
  //Get the bookmarks from the html, and if there are no bookmarks, set it to an empty string
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class= "row> No bookmarks to show</i>';
  }
};

const onPlay = (e) => {};

const onDelete = (e) => {};

const setBookmarksAttributes = () => {};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML =
      '<div class="title">This is not a youtube video page. </div>';
  }
});

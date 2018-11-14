'use strict';

function getActiveTabInCurrentWindow(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (activeTabsInCurrentWindow) {
    var activeTabInCurrentWindow = activeTabsInCurrentWindow[0];
    callback(activeTabInCurrentWindow);
  });
}

function getAllTabs(windowId, callback) {
  var queryInfo = {
    windowId: windowId
  };
  chrome.tabs.query(queryInfo, function (tabs) {
    callback(tabs);
  });
}

function getPropertyOfAllTabsInWindowAsText(propertyName, windowId, callback) {
  getAllTabs(windowId, function (tabsInWindow) {
    var propertyOfAllTabsInWindow = "";
    var tabsInWindowLength = tabsInWindow.length;
    for (var t = 0; t < tabsInWindowLength; ++t) {
      //console.log(tabsInWindow[t]);
      propertyOfAllTabsInWindow += tabsInWindow[t][propertyName] + "\r\n";
    }
    callback(propertyOfAllTabsInWindow);
  });
}

function getLinksOfAllTabsInWindowAsHtmlList(isOrdered, windowId, callback) {
  getAllTabs(windowId, function (tabsInWindow) {
    var linksOfAllTabsInWindow = (isOrdered ? "<ol>" : "<ul>") + "\r\n";
    var tabsInCurrentWindowLength = tabsInWindow.length;
    for (var t = 0; t < tabsInCurrentWindowLength; ++t) {
      linksOfAllTabsInWindow += "\t<li><a href=\"" + tabsInWindow[t].url + "\">" + tabsInWindow[t].title + "</a></li>\r\n";
    }
    linksOfAllTabsInWindow += (isOrdered ? "</ol>" : "</ul>") + "\r\n";
    callback(linksOfAllTabsInWindow);
  });
}

function getLinksOfAllTabsInWindowAsMarkdownList(isOrdered, windowId, callback) {
  getAllTabs(windowId, function (tabsInWindow) {
    var linksOfAllTabsInWindow = "";
    var tabsInWindowLength = tabsInWindow.length;
    for (var t = 0; t < tabsInWindowLength; ++t) {
      if (isOrdered) {
        linksOfAllTabsInWindow += (t + 1).toString() + ".";
      } else {
        linksOfAllTabsInWindow += "-";
      }
      linksOfAllTabsInWindow += " [" + tabsInWindow[t].title + "](" + tabsInWindow[t].url + ")\r\n";
    }
    callback(linksOfAllTabsInWindow);
  });
}

function iterateThroughAllWindows(callback, done) {
  chrome.windows.getAll({ populate: false }, function (wins) {
    var winsLength = wins.length;
    //console.log("winsLength = " + winsLength);
    var winIndex = 0;

    SeqExec.loop(function loopBody(cont) {
      var w = winIndex;
      winIndex += 1;
      callback(wins[w], w, winsLength, cont);
    }, function stopCondition() {
      if (winIndex < winsLength) {
        return false;
      } else {
        done();
        return true;
      }
    });

  });
}

function getPropertyOfAllTabsInAllWindowsAsText(propertyName, callback) {
  var propertyOfAllTabsInAllWindows = "";
  iterateThroughAllWindows(function (win, winIndex, winsLength, cont) {
    propertyOfAllTabsInAllWindows += "Window #" + win.id + ":\r\n\r\n";
    getPropertyOfAllTabsInWindowAsText(propertyName, win.id, function (propertyOfAllTabsInWindow) {
      propertyOfAllTabsInAllWindows += propertyOfAllTabsInWindow;
      if (winsLength > 1 && winIndex < winsLength - 1) {
        propertyOfAllTabsInAllWindows += "\r\n";
      }
      cont(); // continue
    });
  }, function () {
    callback(propertyOfAllTabsInAllWindows)
  });
}

function getLinksOfAllTabsInAllWindowsAsHtmlList(isOrdered, callback) {
  var linksOfAllTabsInAllWindows = "";
  iterateThroughAllWindows(function (win, winIndex, winsLength, cont) {
    linksOfAllTabsInAllWindows += "<h1>Window #" + win.id + "</h1>\r\n";
    getLinksOfAllTabsInWindowAsHtmlList(isOrdered, win.id, function (linksOfAllTabsInWindow) {
      linksOfAllTabsInAllWindows += linksOfAllTabsInWindow;
      cont(); // continue
    });
  }, function () {
    callback(linksOfAllTabsInAllWindows)
  });
}

function getLinksOfAllTabsInAllWindowsAsMarkdownList(isOrdered, callback) {
  var linksOfAllTabsInAllWindows = "";
  iterateThroughAllWindows(function (win, winIndex, winsLength, cont) {
    linksOfAllTabsInAllWindows += "# Window #" + win.id + "\r\n\r\n";
    getLinksOfAllTabsInWindowAsMarkdownList(isOrdered, win.id, function (linksOfAllTabsInWindow) {
      linksOfAllTabsInAllWindows += linksOfAllTabsInWindow;
      if (winsLength > 1 && winIndex < winsLength - 1) {
        linksOfAllTabsInAllWindows += "\r\n";
      }
      cont(); // continue
    });
  }, function () {
    callback(linksOfAllTabsInAllWindows)
  });
}

function popupMenuItemClick(e) {
  var titlesOfAllTabsInAllWindows = "";

  switch(e.target.id) {


    case "copy_title_of_active_tab_in_current_window_as_string":
    getActiveTabInCurrentWindow(function (activeTabInCurrentWindow) {
      ClipboardUtils.copyText(activeTabInCurrentWindow.title);
      window.close();
    });
    break;

    case "copy_url_of_active_tab_in_current_window_as_string":
    getActiveTabInCurrentWindow(function (activeTabInCurrentWindow) {
      ClipboardUtils.copyText(activeTabInCurrentWindow.url);
      window.close();
    });
    break;

    case "copy_link_of_active_tab_in_current_window_as_html":
    getActiveTabInCurrentWindow(function (activeTabInCurrentWindow) {
      ClipboardUtils.copyText("<a href=\"" + activeTabInCurrentWindow.url + "\">" + activeTabInCurrentWindow.title + "<a/>");
      window.close();
    });
    break;

    case "copy_link_of_active_tab_in_current_window_as_markdown":
    getActiveTabInCurrentWindow(function (activeTabInCurrentWindow) {
      ClipboardUtils.copyText("[" + activeTabInCurrentWindow.title + "](" + activeTabInCurrentWindow.url + ")");
      window.close();
    });
    break;

    case "copy_link_of_active_tab_in_current_window_as_markdown_ordered_list_item":
    getActiveTabInCurrentWindow(function (activeTabInCurrentWindow) {
      ClipboardUtils.copyText("1. [" + activeTabInCurrentWindow.title + "](" + activeTabInCurrentWindow.url + ")");
      window.close();
    });
    break;

    case "copy_link_of_active_tab_in_current_window_as_markdown_unordered_list_item":
    getActiveTabInCurrentWindow(function (activeTabInCurrentWindow) {
      ClipboardUtils.copyText("- [" + activeTabInCurrentWindow.title + "](" + activeTabInCurrentWindow.url + ")");
      window.close();
    });
    break;


    case "copy_titles_of_all_tabs_in_current_window_as_text":
    getPropertyOfAllTabsInWindowAsText("title", chrome.windows.WINDOW_ID_CURRENT, function (titlesOfAllTabsInCurrentWindow) {
      ClipboardUtils.copyText(titlesOfAllTabsInCurrentWindow);
      window.close();
    });
    break;

    case "copy_urls_of_all_tabs_in_current_window_as_text":
    getPropertyOfAllTabsInWindowAsText("url", chrome.windows.WINDOW_ID_CURRENT, function (urlsOfAllTabsInCurrentWindow) {
      ClipboardUtils.copyText(urlsOfAllTabsInCurrentWindow);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_current_window_as_html_ordered_list":
    getLinksOfAllTabsInWindowAsHtmlList(true, chrome.windows.WINDOW_ID_CURRENT, function (linksOfAllTabsInCurrentWindow) {
      ClipboardUtils.copyText(linksOfAllTabsInCurrentWindow);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_current_window_as_html_unordered_list":
    getLinksOfAllTabsInWindowAsHtmlList(false, chrome.windows.WINDOW_ID_CURRENT, function (linksOfAllTabsInCurrentWindow) {
      ClipboardUtils.copyText(linksOfAllTabsInCurrentWindow);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_current_window_as_markdown_ordered_list":
    getLinksOfAllTabsInWindowAsMarkdownList(true, chrome.windows.WINDOW_ID_CURRENT, function (linksOfAllTabsInCurrentWindow) {
      ClipboardUtils.copyText(linksOfAllTabsInCurrentWindow);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_current_window_as_markdown_unordered_list":
    getLinksOfAllTabsInWindowAsMarkdownList(false, chrome.windows.WINDOW_ID_CURRENT, function (linksOfAllTabsInCurrentWindow) {
      ClipboardUtils.copyText(linksOfAllTabsInCurrentWindow);
      window.close();
    });
    break;


    case "copy_titles_of_all_tabs_in_all_windows_as_text":
    getPropertyOfAllTabsInAllWindowsAsText("title", function (titlesOfAllTabsInAllWindows) {
      ClipboardUtils.copyText(titlesOfAllTabsInAllWindows);
      window.close();
    });
    break;

    case "copy_urls_of_all_tabs_in_all_windows_as_text":
    getPropertyOfAllTabsInAllWindowsAsText("url", function (urlsOfAllTabsInAllWindows) {
      ClipboardUtils.copyText(urlsOfAllTabsInAllWindows);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_all_windows_as_html_ordered_list":
    getLinksOfAllTabsInAllWindowsAsHtmlList(true, function (linksOfAllTabsInAllWindows) {
      ClipboardUtils.copyText(linksOfAllTabsInAllWindows);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_all_windows_as_html_unordered_list":
    getLinksOfAllTabsInAllWindowsAsHtmlList(false, function (linksOfAllTabsInAllWindows) {
      ClipboardUtils.copyText(linksOfAllTabsInAllWindows);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_all_windows_as_markdown_ordered_list":
    getLinksOfAllTabsInAllWindowsAsMarkdownList(true, function (linksOfAllTabsInAllWindows) {
      ClipboardUtils.copyText(linksOfAllTabsInAllWindows);
      window.close();
    });
    break;

    case "copy_links_of_all_tabs_in_all_windows_as_markdown_unordered_list":
    getLinksOfAllTabsInAllWindowsAsMarkdownList(false, function (linksOfAllTabsInAllWindows) {
      ClipboardUtils.copyText(linksOfAllTabsInAllWindows);
      window.close();
    });
    break;


    default:
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var popupMenuItems = document.querySelectorAll('.popup-menu-item');
  for (var i = 0; i < popupMenuItems.length; i++) {
    popupMenuItems[i].addEventListener('click', popupMenuItemClick);
  }
});

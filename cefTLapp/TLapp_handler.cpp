// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include "cefTLapp/TLapp_handler.h"

#include <sstream>
#include <string>

#include "include/base/cef_bind.h"
#include "include/cef_app.h"
#include "include/cef_url.h"
#include "include/wrapper/cef_closure_task.h"
#include "include/wrapper/cef_helpers.h"
#include "include/wrapper/cef_stream_resource_handler.h"
#include "cefTLapp/resource_util.h"

namespace {

TLappHandler* g_instance = NULL;

}  // namespace

const char chTLappOrigin[] = "http://tlapp/";

bool ParseTlAppUrl(const std::string& url,
	std::string* file_name,
	std::string* mime_type) {
	// Retrieve the path component.
	CefURLParts parts;
	CefParseURL(url, parts);
	std::string file = CefString(&parts.path);
	if (file.size() < 2)
		return false;

	// Remove the leading slash.
	file = file.substr(1);

	// Verify that the file name is valid.
	for (size_t i = 0; i < file.size(); ++i) {
		const char c = file[i];
		if (!isalpha(c) && !isdigit(c) && c != '_' && c != '.')
			return false;
	}

	// Determine the mime type based on the file extension, if any.
	size_t pos = file.rfind(".");
	if (pos != std::string::npos) {
		std::string ext = file.substr(pos + 1);
		if (ext == "html")
			*mime_type = "text/html";
		else if (ext == "png")
			*mime_type = "image/png";
		else if (ext == "svg")
			*mime_type = "image/svg+xml";
		else if (ext == "js")
			*mime_type = "text/javascript";
		else if (ext == "css")
			*mime_type = "text/css";
		else
			return false;
	}
	else {
		// Default to an html extension if none is specified.
		*mime_type = "text/html";
		file += ".html";
	}

	*file_name = file;
	return true;
}


TLappHandler::TLappHandler()
    : is_closing_(false) {
  DCHECK(!g_instance);
  g_instance = this;
}

TLappHandler::~TLappHandler() {
  g_instance = NULL;
}

// static
TLappHandler* TLappHandler::GetInstance() {
  return g_instance;
}

void TLappHandler::OnAfterCreated(CefRefPtr<CefBrowser> browser) {
  CEF_REQUIRE_UI_THREAD();

  // Add to the list of existing browsers.
  browser_list_.push_back(browser);
}

bool TLappHandler::DoClose(CefRefPtr<CefBrowser> browser) {
  CEF_REQUIRE_UI_THREAD();

  // Closing the main window requires special handling. See the DoClose()
  // documentation in the CEF header for a detailed destription of this
  // process.
  if (browser_list_.size() == 1) {
    // Set a flag to indicate that the window close should be allowed.
    is_closing_ = true;
  }

  // Allow the close. For windowed browsers this will result in the OS close
  // event being sent.
  return false;
}

void TLappHandler::OnBeforeClose(CefRefPtr<CefBrowser> browser) {
  CEF_REQUIRE_UI_THREAD();

  // Remove from the list of existing browsers.
  BrowserList::iterator bit = browser_list_.begin();
  for (; bit != browser_list_.end(); ++bit) {
    if ((*bit)->IsSame(browser)) {
      browser_list_.erase(bit);
      break;
    }
  }

  if (browser_list_.empty()) {
    // All browser windows have closed. Quit the application message loop.
    CefQuitMessageLoop();
  }
}

void TLappHandler::OnLoadError(CefRefPtr<CefBrowser> browser,
                                CefRefPtr<CefFrame> frame,
                                ErrorCode errorCode,
                                const CefString& errorText,
                                const CefString& failedUrl) {
  CEF_REQUIRE_UI_THREAD();

  // Don't display an error for downloaded files.
  if (errorCode == ERR_ABORTED)
    return;

  // Display a load error message.
  std::stringstream ss;
  ss << "<html><body bgcolor=\"white\">"
        "<h2>Failed to load URL " << std::string(failedUrl) <<
        " with error " << std::string(errorText) << " (" << errorCode <<
        ").</h2></body></html>";
  frame->LoadString(ss.str(), failedUrl);
}

void TLappHandler::CloseAllBrowsers(bool force_close) {
  if (!CefCurrentlyOn(TID_UI)) {
    // Execute on the UI thread.
    CefPostTask(TID_UI,
        base::Bind(&TLappHandler::CloseAllBrowsers, this, force_close));
    return;
  }

  if (browser_list_.empty())
    return;

  BrowserList::const_iterator it = browser_list_.begin();
  for (; it != browser_list_.end(); ++it)
    (*it)->GetHost()->CloseBrowser(force_close);
}

bool TLappHandler::OnBeforePopup(CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	const CefString& target_url,
	const CefString& target_frame_name,
	const CefPopupFeatures& popupFeatures,
	CefWindowInfo& windowInfo,
	CefRefPtr<CefClient>& client,
	CefBrowserSettings& settings,
	bool* no_javascript_access) {
	CEF_REQUIRE_IO_THREAD();
	::ShellExecute(NULL, NULL, target_url.c_str(), L"", NULL, SW_SHOWNORMAL);
	return true;
}



CefRefPtr<CefResourceHandler> TLappHandler::GetResourceHandler(
	CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	CefRefPtr<CefRequest> request) {
	CEF_REQUIRE_IO_THREAD();

	
	std::string url = request->GetURL();
	if (url == std::string())
		return NULL;
	std::string mime_type;
	CefRefPtr<CefStreamReader> stream = GetBinaryResourceReader(url.c_str(), mime_type);
	if (stream)
		return new CefStreamResourceHandler(mime_type, stream);

	return NULL;
}

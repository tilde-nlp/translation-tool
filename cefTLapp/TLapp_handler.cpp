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
	browser_ = browser;
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
		browser_ = NULL;
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

void TLappHandler::OnBeforeContextMenu(
	CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	CefRefPtr<CefContextMenuParams> params,
	CefRefPtr<CefMenuModel> model)
{
	//return; //ja neko negrib mainît
	if (params->IsEditable() || params->GetSelectionText() != L"")
	{

		model->Remove(MENU_ID_REDO);
		model->SetLabel(MENU_ID_UNDO, L"Undo");
		model->SetLabel(MENU_ID_CUT, L"Cut");
		model->SetLabel(MENU_ID_COPY, L"Copy");
		model->SetLabel(MENU_ID_PASTE, L"Paste");
		model->SetLabel(MENU_ID_DELETE, L"Delete");
		model->SetLabel(MENU_ID_SELECT_ALL, L"Select All");
	}
	else
		model->Clear();
}

bool TLappHandler::OnContextMenuCommand(
	CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	CefRefPtr<CefContextMenuParams> params,
	int command_id,
	EventFlags event_flags)
{
	return false; //ja neko negrib mainît
}

bool TLappHandler::OnDragEnter(CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefDragData> dragData,
	DragOperationsMask mask)
{
	return true;
}

CefRefPtr<CefBrowser> TLappHandler::GetBrowser() const {
	return browser_;
}
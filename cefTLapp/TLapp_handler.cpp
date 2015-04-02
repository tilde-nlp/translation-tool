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
bool replace(std::string& str, const std::string& from, const std::string& to) {
	size_t start_pos = str.find(from);
	if (start_pos == std::string::npos)
		return false;
	str.replace(start_pos, from.length(), to);
	return true;
}
int WriteSingleValue(const HKEY &hive, const wchar_t *path, const wchar_t *valueName, const std::wstring &wsValue)
{
	HKEY key;

	HRESULT	rc = RegCreateKeyExW(hive, path, 0, 0, REG_OPTION_NON_VOLATILE, KEY_WRITE, NULL, &key, NULL);
	if (rc == ERROR_SUCCESS)
	{
		rc = RegSetValueExW(key, valueName, 0, REG_SZ, (BYTE*)wsValue.c_str(), (wsValue.length() + 1)*sizeof(wchar_t));
		RegCloseKey(key);

		if (rc == ERROR_SUCCESS)
			return ERROR_SUCCESS;
		else
		{
			//REPORT_ERROR(ERR_SEVERITY_LOW, L"Failed to write to registry");
			return ERROR_GEN_FAILURE;
		}
	}
	else
	{
		//REPORT_ERROR(ERR_SEVERITY_LOW, L"Failed to open a registry key");
		return ERROR_GEN_FAILURE;
	}
}
int MultiReadSingleValue(const wchar_t *path, const wchar_t *valueName, std::wstring &wsValue)
{
	int retVal = ERROR_GEN_FAILURE;

	const DWORD bufSize = 1024;
	wchar_t buffer[bufSize];
	wchar_t *readbuf = NULL;

	HKEY key;
	HRESULT	rc;

	rc = RegOpenKeyExW(HKEY_CURRENT_USER, path, 0, KEY_READ, &key);
	if (rc == ERROR_SUCCESS)
	{
		DWORD dataSize = 0;
		rc = RegQueryValueExW(key, valueName, 0, 0, 0, &dataSize);
		if (rc == ERROR_SUCCESS && dataSize > 0)
		{
			if (dataSize <= (bufSize*sizeof(wchar_t)))
				readbuf = buffer;
			else
				readbuf = (wchar_t*)malloc(dataSize);

			rc = RegQueryValueEx(key, valueName, 0, 0, (LPBYTE)readbuf, &dataSize);
			if (rc == ERROR_SUCCESS)
				wsValue.assign(readbuf, (dataSize / 2) - 1);

			if (readbuf != buffer)
				free(readbuf);
		}
		RegCloseKey(key);

		if (rc == ERROR_SUCCESS)
		{
			retVal = ERROR_SUCCESS;
		}
	}

	if (retVal != ERROR_SUCCESS)
	{
		rc = RegOpenKeyExW(HKEY_LOCAL_MACHINE, path, 0, KEY_READ, &key);
		if (rc == ERROR_SUCCESS)
		{
			DWORD dataSize = 0;
			rc = RegQueryValueExW(key, valueName, 0, 0, 0, &dataSize);
			if (rc == ERROR_SUCCESS && dataSize > 0)
			{
				if (dataSize <= (bufSize*sizeof(wchar_t)))
					readbuf = buffer;
				else
					readbuf = (wchar_t*)malloc(dataSize);

				rc = RegQueryValueEx(key, valueName, 0, 0, (LPBYTE)readbuf, &dataSize);
				if (rc == ERROR_SUCCESS)
					wsValue.assign(readbuf, (dataSize / 2) - 1);

				if (readbuf != buffer)
					free(readbuf);
			}
			RegCloseKey(key);

			if (rc == ERROR_SUCCESS)
			{
				retVal = ERROR_SUCCESS;
			}
		}
	}

	return retVal;
}

int StringToWString(std::wstring &ws, const std::string &s)
{
	std::wstring wsTmp(s.begin(), s.end());

	ws = wsTmp;

	return 0;
}
void TLappHandler::OnAddressChange(CefRefPtr<CefBrowser> browser,
	CefRefPtr<CefFrame> frame,
	const CefString& url)
{
	std::string u = url.ToString();
	if (u.find("http://tlapp/#/getkey") != std::string::npos)
	{
		MessageBoxA(NULL, "get key!", "getKey", 0);
		std::string key = "5646542315418542546584";

		
		std::wstring wkey;
		if (MultiReadSingleValue(L"Software\\Tilde\\TLapp", L"CurrentKey", wkey) == ERROR_SUCCESS)
		frame->ExecuteJavaScript(L"getKey('" + wkey + L"')",url,0);
	}
	if (u.find("http://tlapp/#/setkey") != std::string::npos)
	{
		MessageBoxA(NULL, "set key!", "setKey", 0);
		replace(u, "http://tlapp/#/setkey/", "");
		std::wstring a;
		StringToWString(a, u);
		WriteSingleValue(HKEY_CURRENT_USER, L"Software\\Tilde\\TLapp", L"CurrentKey", a);
		MessageBoxA(NULL, u.c_str(), "key is", 0);
	}
	//string u = url.c_str();
	//if (url)

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
bool TLappHandler::OnProcessMessageReceived(
	CefRefPtr<CefBrowser> browser,
	CefProcessId source_process,
	CefRefPtr<CefProcessMessage> message)  {
	//if (message_router_->OnProcessMessageReceived(browser, source_process,
	//	message)) {
	//	return true;
	//}

	// Handle IPC messages from the browser process...
	CefRefPtr<CefFrame> frame = browser->GetMainFrame();
	std::string message_name = message->GetName();
	if (message_name == "getautocomplete")
	{
		std::wstring text = message->GetArgumentList()->GetString(0).ToWString();
		//CommandProcessor.FillCommandQueue(L"tldic://getautocomplete/" + text + L"/");
	}
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
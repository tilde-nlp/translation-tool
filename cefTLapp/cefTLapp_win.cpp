// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include <windows.h>
#include "cefTLapp/TLapp_handler.h"
#include "cefTLapp/TLapp_app.h"
#include "include/cef_sandbox_win.h"
#if defined(WIKI)
#include "ceftlapp/resource_wiki.h"
#elif defined(TTOOL)
#include "ceftlapp/resource.h"
#endif
#include "ClientHandler.h"
#include "ClientV8ExtensionHandler.h"

// When generating projects with CMake the CEF_USE_SANDBOX value will be defined
// automatically if using the required compiler version. Pass -DUSE_SANDBOX=OFF
// to the CMake command-line to disable use of the sandbox.
// Uncomment this line to manually enable sandbox support.
// #define CEF_USE_SANDBOX 1
HINSTANCE hInst;				// current instance
TCHAR szTitle[256];				// The title bar text
TCHAR szWindowClass[256];		// the main window class name
ATOM MyRegisterClass(HINSTANCE hInstance);
BOOL InitInstance(HINSTANCE, int);
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

// The global ClientHandler reference.
CefRefPtr<TLappHandler> g_handler;

unsigned int m_nDpi;

#if defined(CEF_USE_SANDBOX)
// The cef_sandbox.lib static library is currently built with VS2013. It may not
// link successfully with other VS versions.
#pragma comment(lib, "cef_sandbox.lib")
#endif

inline int GetScreenDPI()
{
	HDC hdcScreen = GetDC(NULL);
	int iDPI = 96; // assume failure
	if (hdcScreen)
	{
		iDPI = GetDeviceCaps(hdcScreen, LOGPIXELSX);
		ReleaseDC(NULL, hdcScreen);
	}
	return iDPI;
}

int DpiAdjustInt(int nValue)
{
	float scale = ((float)m_nDpi / 96.f);
	return (int)(((float)nValue) * scale);
}

// Entry point function for all processes.
int APIENTRY wWinMain(HINSTANCE hInstance,
	HINSTANCE hPrevInstance,
	LPTSTR    lpCmdLine,
	int       nCmdShow) {
	UNREFERENCED_PARAMETER(hPrevInstance);
	UNREFERENCED_PARAMETER(lpCmdLine);

	void* sandbox_info = NULL;

#if defined(CEF_USE_SANDBOX)
	// Manage the life span of the sandbox information object. This is necessary
	// for sandbox support on Windows. See cef_sandbox_win.h for complete details.
	CefScopedSandboxInfo scoped_sandbox;
	sandbox_info = scoped_sandbox.sandbox_info();
#endif

	// Provide CEF with command-line arguments.
	CefMainArgs main_args(hInstance);

	CefRefPtr<TLapp> app(new TLapp);

	int exit_code = CefExecuteProcess(main_args, app.get(), sandbox_info);
	if (exit_code >= 0) {
		// The sub-process has completed so return here.
		return exit_code;
	}

	// Specify CEF global settings here.
	CefSettings settings;

#if !defined(CEF_USE_SANDBOX)
	settings.no_sandbox = true;
#endif
	//custom settings
	settings.log_severity = LOGSEVERITY_DISABLE;
	//settings.log_severity = LOGSEVERITY_VERBOSE;
	//settings.pack_loading_disabled = 1;

	// Initialize CEF.
	CefInitialize(main_args, settings, app.get(), sandbox_info);
	LoadString(hInstance, IDS_APP_TITLE, szTitle, 256);
	LoadString(hInstance, IDC_CEFCLIENT, szWindowClass, 256);
	MyRegisterClass(hInstance);

	if (!InitInstance(hInstance, nCmdShow))
		return FALSE;

	// Run the CEF message loop. This will block until CefQuitMessageLoop() is
	// called.
	CefRunMessageLoop();

	// Shut down CEF.
	CefShutdown();

	return 0;
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//   PURPOSE: Saves instance handle and creates main window
//   COMMENTS:
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow) {
	HWND hWnd;

	hInst = hInstance;  // Store instance handle in our global variable

	hWnd = CreateWindow(szWindowClass, szTitle,
		WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN, CW_USEDEFAULT, 0,
		CW_USEDEFAULT, 0, NULL, NULL, hInstance, NULL);

	if (!hWnd)
		return FALSE;

	ShowWindow(hWnd, nCmdShow);
	UpdateWindow(hWnd);

	return TRUE;
}
//
//  FUNCTION: MyRegisterClass()
//  PURPOSE: Registers the window class.
//  COMMENTS:
//
//    This function and its usage are only necessary if you want this code
//    to be compatible with Win32 systems prior to the 'RegisterClassEx'
//    function that was added to Windows 95. It is important to call this
//    function so that the application will get 'well formed' small icons
//    associated with it.
//
ATOM MyRegisterClass(HINSTANCE hInstance) {
	WNDCLASSEX wcex;
	wcex.cbSize = sizeof(WNDCLASSEX);
	wcex.style = CS_HREDRAW | CS_VREDRAW;
	wcex.lpfnWndProc = WndProc;
	wcex.cbClsExtra = 0;
	wcex.cbWndExtra = 0;
	wcex.hInstance = hInstance;
	wcex.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_CEFTLAPP));
	wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
	wcex.hbrBackground = 0;// (HBRUSH)(COLOR_WINDOW + 1);
	wcex.lpszMenuName = NULL;
	wcex.lpszClassName = szWindowClass;
	wcex.hIconSm = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));

	return RegisterClassEx(&wcex);
}

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//  PURPOSE:  Processes messages for the main window.
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam,
	LPARAM lParam) {

	PAINTSTRUCT ps;
	switch (message) {
	case WM_CREATE: {
		g_handler = new TLappHandler();
		CefBrowserSettings browser_settings;
		CefWindowInfo info;
		RECT rect;
		GetClientRect(hWnd, &rect);
		info.SetAsChild(hWnd, rect);

		CefBrowserHost::CreateBrowser(info, g_handler.get(), "http://tlapp/", browser_settings, NULL);
		return 0;
	}
	case WM_PAINT:
		BeginPaint(hWnd, &ps);
		EndPaint(hWnd, &ps);
		return 0;
	case WM_GETMINMAXINFO:
	{
		m_nDpi = ::GetScreenDPI();
		((MINMAXINFO *)lParam)->ptMinTrackSize.x = DpiAdjustInt(1000);
		((MINMAXINFO *)lParam)->ptMinTrackSize.y = DpiAdjustInt(670);
		return 0;
	}
	case WM_SIZE: {
		if (!g_handler.get())
			break;

		// For off-screen browsers when the frame window is minimized set the
		// browser as hidden to reduce resource usage.	
		if (g_handler->GetBrowser()) {
			CefWindowHandle hwnd =
				g_handler->GetBrowser()->GetHost()->GetWindowHandle();
			if (hwnd) {
				if (wParam == SIZE_MINIMIZED) {
					// For windowed browsers when the frame window is minimized set the
					// browser window size to 0x0 to reduce resource usage.
					SetWindowPos(hwnd, NULL,
						0, 0, 0, 0, SWP_NOZORDER | SWP_NOMOVE | SWP_NOACTIVATE);
				}
				else {
					// Resize the window to match the new frame size.
					RECT rect;
					GetClientRect(hWnd, &rect);
					::SetWindowPos(hwnd, HWND_TOP, rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top, SWP_NOZORDER);
				}
			}
		}
	} break;
	case WM_MOVING:
	case WM_MOVE:
		if (g_handler.get() && g_handler->GetBrowser())
			g_handler->GetBrowser()->GetHost()->NotifyMoveOrResizeStarted();
		return 0;
	case WM_ERASEBKGND:
		if (g_handler.get() && g_handler->GetBrowser()) {
			CefWindowHandle hwnd =
				g_handler->GetBrowser()->GetHost()->GetWindowHandle();
			if (hwnd) {
				return 0;
			}
		}
		break;
	case WM_CLOSE:
		if (g_handler.get() && !g_handler->IsClosing()) {
			CefRefPtr<CefBrowser> browser = g_handler->GetBrowser();
			if (browser.get()) {
				// Notify the browser window that we would like to close it. This
				// will result in a call to ClientHandler::DoClose() if the
				// JavaScript 'onbeforeunload' event handler allows it.
				browser->GetHost()->CloseBrowser(false);
				// Cancel the close.
				return 0;
			}
		}
		// Allow the close.
		break;
	case WM_DESTROY:
		// Quitting CEF is handled in ClientHandler::OnBeforeClose().
		return 0;
	}

	return DefWindowProc(hWnd, message, wParam, lParam);
}

void TLapp::OnWebKitInitialized()
{
	std::string app_code =
		"var app;"
		"if (!app)"
		"    app = {};"
		"(function() {"
		"    app.ChangeTextInJS = function(text) {"
		"        native function ChangeTextInJS();"
		"        return ChangeTextInJS(text);"
		"    };"
		"})();;";

	CefRegisterExtension("v8/app", app_code, new ClientV8ExtensionHandler(this));
}
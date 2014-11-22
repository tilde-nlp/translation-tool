// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#ifndef CEF_TESTS_CEFTLAPP_APP_H_
#define CEF_TESTS_CEFTLAPP_APP_H_

#include "include/cef_app.h"
#include <winhttp.h>
#include <sstream>
class TLapp : public CefApp,
                  public CefBrowserProcessHandler {
 public:
	 TLapp(){};

	 bool GetIEHttpsProxy(CefString *pbsProxy, int *pnPort)
	 {
		 if (!pbsProxy || !pnPort)
		 {
			 return false;
		 }

		 bool bRetVal = false;

		 WINHTTP_CURRENT_USER_IE_PROXY_CONFIG ProxyConfig = {};
		 if (WinHttpGetIEProxyConfigForCurrentUser(&ProxyConfig))
		 {
			 if (ProxyConfig.lpszProxy)
			 {
				 int nProxyPort = 0;
				 LPCTSTR ptzHttps = wcsstr(ProxyConfig.lpszProxy, L"https=");
				 LPCTSTR ptzHttp = wcsstr(ProxyConfig.lpszProxy, L"=");
				 if (ptzHttps)
				 {
					 LPCTSTR ptzColon = wcsstr(ptzHttps, L":");

					 if (ptzColon)
					 {
						 *(ProxyConfig.lpszProxy + (ptzColon - ProxyConfig.lpszProxy)) = 0; // Replace colon
						 swscanf_s(ptzColon + 1, L"%d", &nProxyPort);
						 *pnPort = nProxyPort;
					 }


					 *pbsProxy = CefString(ptzHttps + 6);
					 bRetVal = true;
				 }
				 else if (ptzHttp)
				 {
					 bRetVal = false;
				 }
				 else
				 {
					 LPCTSTR ptzColon = wcsstr(ProxyConfig.lpszProxy, L":");
					 if (ptzColon)
					 {
						 *(ProxyConfig.lpszProxy + (ptzColon - ProxyConfig.lpszProxy)) = 0; // Replace colon
						 swscanf_s(ptzColon + 1, L"%d", &nProxyPort);
						 *pnPort = nProxyPort;
					 }

					 ptzColon = wcsstr(ProxyConfig.lpszProxy, L"=");
					 if (ptzColon)
					 {
						 *pbsProxy = CefString(ptzColon + 1);
					 }
					 else
					 {
						 *pbsProxy = CefString(ProxyConfig.lpszProxy);
					 }
					 bRetVal = true;
				 }


			 }

			 // Free Proxy structure
			 if (ProxyConfig.lpszAutoConfigUrl)
			 {
				 GlobalFree(ProxyConfig.lpszAutoConfigUrl);
			 }
			 if (ProxyConfig.lpszProxy)
			 {
				 GlobalFree(ProxyConfig.lpszProxy);
			 }
			 if (ProxyConfig.lpszProxyBypass)
			 {
				 GlobalFree(ProxyConfig.lpszProxyBypass);
			 }
		 }

		 return bRetVal;
	 }
	 bool GetIEHttpProxy(CefString *pbsProxy, int *pnPort)
	 {
		 if (!pbsProxy || !pnPort)
		 {
			 return false;
		 }

		 bool bRetVal = false;

		 WINHTTP_CURRENT_USER_IE_PROXY_CONFIG ProxyConfig = {};
		 if (WinHttpGetIEProxyConfigForCurrentUser(&ProxyConfig))
		 {
			 if (ProxyConfig.lpszProxy)
			 {
				 int nProxyPort = 0;
				 LPCTSTR ptzHttps = wcsstr(ProxyConfig.lpszProxy, L"http=");
				 LPCTSTR ptzHttp = wcsstr(ProxyConfig.lpszProxy, L"=");
				 if (ptzHttps)
				 {
					 LPCTSTR ptzColon = wcsstr(ptzHttps, L":");
					 if (ptzColon)
					 {
						 *(ProxyConfig.lpszProxy + (ptzColon - ProxyConfig.lpszProxy)) = 0; // Replace colon
						 swscanf_s(ptzColon + 1, L"%d", &nProxyPort);
						 *pnPort = nProxyPort;
					 }
					 *pbsProxy = CefString(ptzHttps + 5);
					 bRetVal = true;
				 }
				 else if (ptzHttp)
				 {
					 bRetVal = false;
				 }
				 else
				 {
					 LPCTSTR ptzColon = wcsstr(ProxyConfig.lpszProxy, L":");
					 if (ptzColon)
					 {
						 *(ProxyConfig.lpszProxy + (ptzColon - ProxyConfig.lpszProxy)) = 0; // Replace colon
						 swscanf_s(ptzColon + 1, L"%d", &nProxyPort);
						 *pnPort = nProxyPort;
					 }

					 ptzColon = wcsstr(ProxyConfig.lpszProxy, L"=");
					 if (ptzColon)
					 {
						 *pbsProxy = CefString(ptzColon + 1);
					 }
					 else
					 {
						 *pbsProxy = CefString(ProxyConfig.lpszProxy);
					 }
					 bRetVal = true;
				 }
			 }

			 // Free Proxy structure
			 if (ProxyConfig.lpszAutoConfigUrl)
			 {
				 GlobalFree(ProxyConfig.lpszAutoConfigUrl);
			 }
			 if (ProxyConfig.lpszProxy)
			 {
				 GlobalFree(ProxyConfig.lpszProxy);
			 }
			 if (ProxyConfig.lpszProxyBypass)
			 {
				 GlobalFree(ProxyConfig.lpszProxyBypass);
			 }
		 }

		 return bRetVal;
	 }
	 bool GetAutoConfigUrl(CefString *pbsAutoConfigUrl)
	 {
		 if (!pbsAutoConfigUrl)
		 {
			 return false;
		 }

		 bool bRetVal = false;

		 WINHTTP_CURRENT_USER_IE_PROXY_CONFIG ProxyConfig = {};
		 if (WinHttpGetIEProxyConfigForCurrentUser(&ProxyConfig))
		 {
			 if (ProxyConfig.lpszAutoConfigUrl)
			 {
				 *pbsAutoConfigUrl = CefString(ProxyConfig.lpszAutoConfigUrl);
				 bRetVal = true;
			 }
			 else
				 bRetVal = false;

			 // Free Proxy structure
			 if (ProxyConfig.lpszAutoConfigUrl)
			 {
				 GlobalFree(ProxyConfig.lpszAutoConfigUrl);
			 }
			 if (ProxyConfig.lpszProxy)
			 {
				 GlobalFree(ProxyConfig.lpszProxy);
			 }
			 if (ProxyConfig.lpszProxyBypass)
			 {
				 GlobalFree(ProxyConfig.lpszProxyBypass);
			 }
		 }

		 return bRetVal;
	 }

  // CefApp methods:
  virtual CefRefPtr<CefBrowserProcessHandler> GetBrowserProcessHandler()
      OVERRIDE { return this; }


 // CefApp methods. Important to return |this| for the handler callbacks.
 virtual void OnBeforeCommandLineProcessing(
 const CefString& process_type,
 CefRefPtr<CefCommandLine> command_line)
  {
	  /*CefString strProxy;
	  CefString strAutoConfigUrl;
	  int nPort;

	  std::wstringstream ss;
	 
	  if (GetIEHttpsProxy(&strProxy, &nPort))
		ss << L"https=" << strProxy.c_str() << L":" << nPort << L";";

	  if (GetIEHttpProxy(&strProxy, &nPort))
		  ss << L"http=" << strProxy.c_str() << L":" << nPort;
	  
	  if (GetAutoConfigUrl(&strAutoConfigUrl))
		  command_line->AppendSwitchWithValue(L"proxy-pac-url", strAutoConfigUrl.c_str());
	  else if (ss.str() != L"")	
		  command_line->AppendSwitchWithValue(L"proxy-server", ss.str());
	  else
		  command_line->AppendSwitch(L"no-proxy-server");
		*/
	  command_line->AppendSwitchWithValue(L"lang", L"en");
	  //CefString commandline = command_line->GetCommandLineString().c_str();
  }


 private:
  // Include the default reference counting implementation.
	 IMPLEMENT_REFCOUNTING(TLapp);
};

#endif  // CEF_TESTS_CEFTLAPP_APP_H_

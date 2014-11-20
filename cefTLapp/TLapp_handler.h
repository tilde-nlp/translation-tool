// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#ifndef CEF_TESTS_CEFTLAPP_TLAPP_HANDLER_H_
#define CEF_TESTS_CEFTLAPP_TLAPP_HANDLER_H_

#include "include/cef_client.h"
#include "Shellapi.h"
#include <list>

class TLappHandler : public CefClient,
                      public CefDisplayHandler,
                      public CefLifeSpanHandler,
                      public CefLoadHandler,
					  public CefRequestHandler{
 public:
  TLappHandler();
  ~TLappHandler();

  // Provide access to the single global instance of this object.
  static TLappHandler* GetInstance();

  // CefClient methods:
  virtual CefRefPtr<CefDisplayHandler> GetDisplayHandler() OVERRIDE {
    return this;
  }
  virtual CefRefPtr<CefLifeSpanHandler> GetLifeSpanHandler() OVERRIDE {
    return this;
  }
  virtual CefRefPtr<CefLoadHandler> GetLoadHandler() OVERRIDE {
    return this;
  }

  virtual CefRefPtr<CefRequestHandler> GetRequestHandler() OVERRIDE{
	  return this;
  }
  // CefDisplayHandler methods:
  virtual void OnTitleChange(CefRefPtr<CefBrowser> browser,
                             const CefString& title) OVERRIDE;

  // CefLifeSpanHandler methods:
  virtual void OnAfterCreated(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual bool DoClose(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual void OnBeforeClose(CefRefPtr<CefBrowser> browser) OVERRIDE;

  // CefLoadHandler methods:
  virtual void OnLoadError(CefRefPtr<CefBrowser> browser,
                           CefRefPtr<CefFrame> frame,
                           ErrorCode errorCode,
                           const CefString& errorText,
                           const CefString& failedUrl) OVERRIDE;

  // CefRequestHandler methods

  virtual CefRefPtr<CefResourceHandler> GetResourceHandler(
	  CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  CefRefPtr<CefRequest> request) OVERRIDE;
  

  // Request that all existing browser windows close.
  void CloseAllBrowsers(bool force_close);

  bool IsClosing() const { return is_closing_; }

  virtual bool OnBeforePopup(CefRefPtr<CefBrowser> browser,
	  CefRefPtr<CefFrame> frame,
	  const CefString& target_url,
	  const CefString& target_frame_name,
	  const CefPopupFeatures& popupFeatures,
	  CefWindowInfo& windowInfo,
	  CefRefPtr<CefClient>& client,
	  CefBrowserSettings& settings,
	  bool* no_javascript_access) OVERRIDE;


 private:
  // List of existing browser windows. Only accessed on the CEF UI thread.
  typedef std::list<CefRefPtr<CefBrowser> > BrowserList;
  BrowserList browser_list_;

  bool is_closing_;

  // Include the default reference counting implementation.
  IMPLEMENT_REFCOUNTING(TLappHandler);
};

#endif  // CEF_TESTS_CEFTLAPP_TLAPP_HANDLER_H_

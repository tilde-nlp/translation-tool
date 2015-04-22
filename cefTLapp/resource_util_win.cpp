// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include "ceftlapp/resource_util.h"
#include "include/base/cef_logging.h"
#include "include/cef_stream.h"
#include "include/wrapper/cef_byte_read_handler.h"
#include "ceftlapp/resource.h"

namespace {

	bool LoadBinaryResource(int binaryId, DWORD &dwSize, LPBYTE &pBytes) {
		HINSTANCE hInst = GetModuleHandle(NULL);
		HRSRC hRes = FindResource(hInst, MAKEINTRESOURCE(binaryId),
			MAKEINTRESOURCE(256));
		if (hRes) {
			HGLOBAL hGlob = LoadResource(hInst, hRes);
			if (hGlob) {
				dwSize = SizeofResource(hInst, hRes);
				pBytes = (LPBYTE)LockResource(hGlob);
				if (dwSize > 0 && pBytes)
					return true;
			}
		}

		return false;
	}

	int GetResourceId(const char* resource_name, std::string& mime_type)
	{
		// Map of resource labels to BINARY id values.
		static struct _resource_map
		{
			char* name;
			int id;
			char* m_type;
		}
		resource_map[] =
		{
			{ "http://tlapp/", IDS_MAIN_HTML, "text/html" },
			{ "http://tlapp/index.html", IDS_MAIN_HTML, "text/html" },
			{ "http://tlapp/css/index.css", IDS_CSS_INDEX, "text/css" },
			//images
			{ "http://tlapp/img/arrow.png", IDS_IMG_ARROW_RIGHT, "image/png" },
			{ "http://tlapp/img/arrow-right.svg", IDS_IMG_ARROW, "image/svg+xml" },
			{ "http://tlapp/img/hugo.png", IDS_IMG_HUGO, "image/png" },
			{ "http://tlapp/img/tilde.png", IDS_IMG_TILDE, "image/png" },
			{ "http://tlapp/img/landing.png", IDS_IMG_LANDING, "image/png" },	
			{ "http://tlapp/img/landingWhite.png", IDS_IMG_LANDING_WHITE, "image/png" },
			{ "http://tlapp/img/mobile.png", IDS_IMG_MOBILE, "image/png" },
			{ "http://tlapp/img/doc_letsmt.svg", IDS_IMG_DOC_LETSMT, "image/svg+xml" },
			{ "http://tlapp/img/doc_letsmt-active.svg", IDS_IMG_DOC_LETSMT_ACTIVE, "image/svg+xml" },
			{ "http://tlapp/img/text_letsmt.svg", IDS_IMG_TEXT_LETSMT, "image/svg+xml" },
			{ "http://tlapp/img/text_letsmt-active.svg", IDS_IMG_TEXT_LETSMT_ACTIVE, "image/svg+xml" },	
			{ "http://tlapp/img/web_letsmt.svg", IDS_IMG_WEB_LETSMT, "image/svg+xml" },
			{ "http://tlapp/img/web_letsmt-active.svg", IDS_IMG_WEB_LETSMT_ACTIVE, "image/svg+xml" },
			{ "http://tlapp/img/settings_letsmt.svg", IDS_IMG_SETTINGS_LETSMT, "image/svg+xml" },
			{ "http://tlapp/img/settings_letsmt-active.svg", IDS_IMG_SETTINGS_LETSMT_ACTIVE, "image/svg+xml" },
			{ "http://tlapp/img/logo_large.svg", IDS_IMG_LOGO, "image/svg+xml" },
			//js
			{ "http://tlapp/js/angular.min.js", IDS_JS_ANGULAR_MIN_JS, "text/javascript" },
			{ "http://tlapp/js/angular-route.min.js", IDS_JS_ANGULAR_ROUTE_MIN_JS, "text/javascript" },
			{ "http://tlapp/js/angular-filter.js", IDS_JS_ANGULAR_FILTER_MIN_JS, "text/javascript" },
			{ "http://tlapp/js/jquery-2.1.1.min.js", IDS_JQUERY_MIN_JS, "text/javascript" },			
			{ "http://tlapp/js/myPageCtrl.js", IDS_JS_MYPAGECTRL_JS, "text/javascript" },
			{ "http://tlapp/js/myTranslatorApp.js", IDS_JS_MYTRANSLATORAPP_JS, "text/javascript" },
			//templates
			{ "http://tlapp/templates/about.html", IDS_TEMPLATES_ABOUT_HTML, "text/html" },
			{ "http://tlapp/templates/home.html", IDS_TEMPLATES_HOME_HTML, "text/html" },
			{ "http://tlapp/templates/mobileApplications.html", IDS_TEMPLATES_MOBILEAPP_HTML, "text/html" },
			{ "http://tlapp/templates/translate-document.html", IDS_TEMPLATES_TRANSL_DOC_HTML, "text/html" },
			{ "http://tlapp/templates/translate-text.html", IDS_TEMPLATES_TRANSL_TEXT_HTML, "text/html" },
			{ "http://tlapp/templates/translate-website.html", IDS_TEMPLATES_TRANSL_WEB_HTML, "text/html" },
			{ "http://tlapp/templates/key.html", IDS_TEMPLATES_KEY_HTML, "text/html" },
			//text widget resources			
			{ "http://tlapp/text-widget/translator.css", IDS_TEXT_WIDGET_WIDGET_CSS, "text/css" },
			{ "http://tlapp/text-widget/translator.js", IDS_TEXT_WIDGET_CORE_JS, "text/javascript" }
		};

		for (int i = 0; i < sizeof(resource_map) / sizeof(_resource_map); ++i)
		{
			if (!strcmp(resource_map[i].name, resource_name))
			{
				mime_type = resource_map[i].m_type;
				return resource_map[i].id;
			}
		}

		return 0;
	}

}  // namespace

bool LoadBinaryResource(const char* resource_name, std::string& resource_data)
{
	std::string mime_type;
	int resource_id = GetResourceId(resource_name, mime_type);
	if (resource_id == 0)
		return false;

	DWORD dwSize;
	LPBYTE pBytes;

	if (LoadBinaryResource(resource_id, dwSize, pBytes)) {
		resource_data = std::string(reinterpret_cast<char*>(pBytes), dwSize);
		return true;
	}

	return false;
}

CefRefPtr<CefStreamReader> GetBinaryResourceReader(const char* resource_name, std::string& mime_type)
{
	int resource_id = GetResourceId(resource_name, mime_type);
	if (resource_id == 0)
		return NULL;

	DWORD dwSize;
	LPBYTE pBytes;

	if (LoadBinaryResource(resource_id, dwSize, pBytes))
	{
		return CefStreamReader::CreateForHandler(
			new CefByteReadHandler(pBytes, dwSize, NULL));
	}

	return NULL;
}



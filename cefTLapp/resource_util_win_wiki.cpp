// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include "ceftlapp/resource_util.h"
#include "include/base/cef_logging.h"
#include "include/cef_stream.h"
#include "include/wrapper/cef_byte_read_handler.h"
#include "ceftlapp/resource_wiki.h"

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
			{ "http://tlapp/style.css", IDS_CSS_INDEX, "text/css" },
			{ "http://tlapp/javascript.js", IDS_JS_INDEX, "text/javascript" },
			{ "http://tlapp/templates/home.html", IDS_TEMPLATES_HOME_HTML, "text/html" },
			{ "http://tlapp/templates/translate-document.html", IDS_TEMPLATES_TRANSL_DOC_HTML, "text/html" },
			{ "http://tlapp/templates/translate-text.html", IDS_TEMPLATES_TRANSL_TEXT_HTML, "text/html" },
			{ "http://tlapp/templates/translate-website.html", IDS_TEMPLATES_TRANSL_WEB_HTML, "text/html" }
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



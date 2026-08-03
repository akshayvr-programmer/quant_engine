#include "AIClient.h"

#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <iostream>

static size_t writeCallback(
    void* contents,
    size_t size,
    size_t nmemb,
    void* userp
)
{
    ((std::string*)userp)->append(
        static_cast<char*>(contents),
        size * nmemb
    );

    return size * nmemb;
}

AIClient::AIClient(
    const std::string& apiKey
)
    : apiKey(apiKey)
{
}

std::string AIClient::chat(
    const std::string& prompt
)
{
    CURL* curl = curl_easy_init();

    if (!curl)
    {
        return "Failed to initialize CURL.";
    }

    std::string response;

    nlohmann::json body = {

        { "model", "claude-sonnet-4-5" },


        { "max_tokens", 4096 },

        {
            "messages",
            {
                {
                    { "role", "user" },
                    { "content", prompt }
                }
            }
        }

    };

    struct curl_slist* headers = nullptr;

    headers = curl_slist_append(
        headers,
        ("x-api-key: " + apiKey).c_str()
    );

    headers = curl_slist_append(
        headers,
        "anthropic-version: 2023-06-01"
    );

    headers = curl_slist_append(
        headers,
        "content-type: application/json"
    );

    curl_easy_setopt(
        curl,
        CURLOPT_URL,
        "https://api.anthropic.com/v1/messages"
    );

    curl_easy_setopt(
        curl,
        CURLOPT_HTTPHEADER,
        headers
    );

    std::string requestBody = body.dump();

    curl_easy_setopt(
        curl,
        CURLOPT_POST,
        1L
    );

    curl_easy_setopt(
        curl,
        CURLOPT_POSTFIELDS,
        requestBody.c_str()
    );

    curl_easy_setopt(
        curl,
        CURLOPT_POSTFIELDSIZE,
        requestBody.size()
    );

    curl_easy_setopt(
        curl,
        CURLOPT_WRITEFUNCTION,
        writeCallback
    );

    curl_easy_setopt(
        curl,
        CURLOPT_WRITEDATA,
        &response
    );

    CURLcode result =
        curl_easy_perform(curl);
    std::cout
    << "\nClaude Raw Response:\n"
    << response
    << "\n";


    curl_slist_free_all(headers);

    curl_easy_cleanup(curl);

    if (result != CURLE_OK)
    {
        return curl_easy_strerror(result);
    }

    auto json = nlohmann::json::parse(response);

    if (json.contains("error"))
    {
        return json["error"]["message"];
    }

    if (!json.contains("content"))
    {
        return response;
    }

    return json["content"][0]["text"];
}
// Add a listener to intercept HTTP responses
browser.webRequest.onHeadersReceived.addListener(
    function (details) {
        // check if the request header "Referer" is https://photos.google.com/
        let referer = details.requestHeaders.find(header => header.name.toLowerCase() === 'referer');
        console.log("Referer header:", referer);
        if (referer && referer.value === 'https://photos.google.com/') {
            // Iterate through the response headers to find Content-Disposition
            for (let header of details.responseHeaders) {
                if (header.name.toLowerCase() === 'content-disposition') {
                    // Check if the header contains the target filename
                    console.log("Original Content-Disposition header:", header.value);

                    // replace the number in the header
                    header.value = header.value.replace(
                        /filename=Photos-\d+\.zip/,
                        `filename=Photos-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`
                    );
                }
            }
            return { responseHeaders: details.responseHeaders }
        };
    },
    { urls: ["https://doc-bg-as-photos-data-export.googleusercontent.com/download/*", "https://photos.google.com/*"] },
    ["blocking", "responseHeaders"]
);

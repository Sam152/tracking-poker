type Parts = { bucket: string; key: string };
export function s3UriToParts(uri: string): Parts {
    const matches = uri.match(/(s3:\/\/)(?<bucket>[A-Za-z0-9\-]+)\/(?<key>.*)/);
    return matches.groups as Parts;
}

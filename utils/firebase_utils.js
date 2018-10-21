module.exports = {
  encodeAsFirebaseKey: function(string) {
    return string
      .replace(/\%/g, "%25")
      .replace(/\./g, "%2E")
      .replace(/\#/g, "%23")
      .replace(/\$/g, "%24")
      .replace(/\//g, "%2F")
      .replace(/\[/g, "%5B")
      .replace(/\]/g, "%5D");
  },
  decodeFirebaseKey: function(string) {
    return string
      .replace(/%25/g, "%")
      .replace(/%2E/g, ".")
      .replace(/%23/g, "#")
      .replace(/%24/g, "$")
      .replace(/%2F/g, "/")
      .replace(/%5B/g, "[")
      .replace(/%5D/g, "]");
  }
};

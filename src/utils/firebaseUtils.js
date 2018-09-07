module.exports = {
  snapshotToArray: function(snapshot) {
    const arr = [];

    snapshot.forEach(childSnapshot => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;

      arr.push(item);
    });

    return arr;
  },

  encodeAsFirebaseKey: function(string) {
    return string
      .replace(/\%/g, "%25")
      .replace(/\./g, "%2E")
      .replace(/\#/g, "%23")
      .replace(/\$/g, "%24")
      .replace(/\//g, "%2F")
      .replace(/\[/g, "%5B")
      .replace(/\]/g, "%5D");
  }
};

const snapshotToArray = snapshot => {
  const arr = [];

  snapshot.forEach(childSnapshot => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;

    arr.push(item);
  });

  return arr;
};

export default snapshotToArray;

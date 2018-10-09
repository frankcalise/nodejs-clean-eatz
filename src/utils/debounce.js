export default function(a, b, c) {
  var d, e;
  return function() {
    function h() {
      // eslint-disable-next-line
      (d = null), c || (e = a.apply(f, g));
    }
    var f = this,
      g = arguments;
    return (
      clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
    );
  };
}

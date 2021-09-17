Object.myCreate = function(prototype) {
  function F() {}
  F.prototype = prototype
  return new F()
}
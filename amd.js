(function() {
  var modules = {};

  function require(name) {
    return modules[name];
  }

  function define(name, imports, fn) {
    var exports = {};
    var params = imports.map(function(moduleName) {
      switch (moduleName) {
      case 'require':
        return require;
      case 'exports':
        return exports;
      default:
        return modules[moduleName];
      }
    });

    fn.apply(null, params);

    modules[name] = exports;
  }

  window.define = window.define || define;
})();

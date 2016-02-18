(function() {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    menuService.toolbar.addItem({
      aria: 'Home',
      flex: 15,
      icon: 'menu',
      order: 1,
      state: 'home',
      show: true,
      title: 'Modern-Mean',
      type: 'button'
    });

    menuService.toolbar.addItem({
      flex: 100,
      order: 2,
      show: true,
    });


  }
})();
(function() {
  'use strict';

  describe('users.client.run.authcheck.js', function () {
    var $rootScope,
      Authentication,
      $httpBackend,
      $state;

    beforeEach(module('users.routes'));


    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _Authentication_, _$state_) {
      $httpBackend = _$httpBackend_;
      Authentication = _Authentication_;
      $rootScope = _$rootScope_;
      $state = _$state_;
    }));


    describe('user is not authenticated', function () {

      it('should allow access on routes with no roles defined', function () {
        $state.transitionTo('home');
        $rootScope.$digest();
        expect($state.current.name).to.equal('home');
      });

      it('should redirect to authentication.signin if they dont have access', function () {
        $state.transitionTo('admin.users');
        $rootScope.$digest();
        expect($state.current.name).to.equal('authentication.signin');
      });

    });

    describe('user is authenticated', function () {

      it('should allow access on routes with no roles defined', function () {
        $state.transitionTo('home');
        $rootScope.$digest();
        expect($state.current.name).to.equal('home');
      });

      it('should redirect to forbidded if they dont have access', function () {
        Authentication.user = {
          roles: ['user']
        };
        $state.transitionTo('admin.users');
        $rootScope.$digest();
        expect($state.current.name).to.equal('forbidden');
      });

      it('should allow access if user has one of the roles', function () {
        Authentication.user = {
          roles: ['admin']
        };
        $state.transitionTo('admin.users');
        $rootScope.$digest();
        expect($state.current.name).to.equal('admin.users');
      });

    });

    describe('signout', function () {

      it('should sign the user out on signout route', function () {
        var signoutSpy = chai.spy.on(Authentication, 'signout');
        $state.transitionTo('signout');
        $rootScope.$digest();
        expect(signoutSpy).to.have.been.called();
      });

    });

  });
})();

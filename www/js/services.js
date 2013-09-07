'use strict';

/* Services */

// Simple value service.
angular.module('NoonPacific.services', []).
  value('version', '0.1');

NoonPacific.service('eightTrackService', ["$rootScope", "$http", function ($rootScope, $http){
      var api, key, ver;
      ver = "2";
      key = "e520e797c7c36eb34c893e3d937e9b124965df00";
      api = "api_key=" + key + "&api_version=" + ver;
      return {
        createNewPlayToken: function() {
          return $http.get("http://8tracks.com/sets/new.json?" + api);
        },
        getMixes: function() {
          return $http.get("http://8tracks.com/mix_sets/dj:2254184.json?include=mixes&per_page=500&" + api);
        },
        getMix: function(latest, token) {
          return $http.get(" http://8tracks.com/sets/" + token + "/play.json?mix_id=" + latest + "&" + api).success(function(data) {
            return $rootScope.$broadcast('setLoaded', data);
          });
        },
        skip: function(mix, token) {
          return $http.get("http://8tracks.com/sets/" + token + "/skip.json?mix_id=" + mix + "&" + api).success(function(data) {
            return $rootScope.$broadcast('skipSuccess', data);
          });
        },
        next: function(mix, token) {
          return $http.get("http://8tracks.com/sets/" + token + "/next.json?mix_id=" + mix + "&" + api).success(function(data) {
            return $rootScope.$broadcast('skipSuccess', data);
          });
        }
      };
}]);

NoonPacific.factory('audio', function($document) {
    var audio;
    audio = $document[0].createElement('audio');
    return audio;
});


// phonegap ready service - listens to deviceready
NoonPacific.factory('phonegapReady', function() {
    return function (fn) {
        var queue = [];
        var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
    };
              
    document.addEventListener('deviceready', function () {
        queue.forEach(function (args) {
            fn.apply(this, args);
        });
        impl = fn;
    }, false);
              
    return function () {
        return impl.apply(this, arguments);
        };
    };
});

NoonPacific.factory('geolocation', function ($rootScope, phonegapReady) {
  return {
    getCurrentPosition: function (onSuccess, onError, options) {
        navigator.geolocation.getCurrentPosition(function () {
               var that = this,
               args = arguments;

               if (onSuccess) {
                   $rootScope.$apply(function () {
                        onSuccess.apply(that, args);
                   });
                   }
               }, function () {
                    var that = this,
                    args = arguments;

                   if (onError) {
                        $rootScope.$apply(function () {
                            onError.apply(that, args);
                        });
                   }
               },
            options);
        }
    };
});

NoonPacific.factory('accelerometer', function ($rootScope, phonegapReady) {
    return {
        getCurrentAcceleration: phonegapReady(function (onSuccess, onError) {
            navigator.accelerometer.getCurrentAcceleration(function () {
                var that = this,
                    args = arguments;

                if (onSuccess) {
                    $rootScope.$apply(function () {
                        onSuccess.apply(that, args);
                    });
                }
            }, function () {
                var that = this,
                args = arguments;

                if (onError) {
                    $rootScope.$apply(function () {
                        onError.apply(that, args);
                    });
                }
            });
        })
    };
});

NoonPacific.factory('notification', function ($rootScope, phonegapReady) {
    return {
        alert: phonegapReady(function (message, alertCallback, title, buttonName) {
            navigator.notification.alert(message, function () {
                var that = this,
                    args = arguments;

                $rootScope.$apply(function () {
                    alertCallback.apply(that, args);
                });
            }, title, buttonName);
        }),
        confirm: phonegapReady(function (message, confirmCallback, title, buttonLabels) {
            navigator.notification.confirm(message, function () {
                var that = this,
                    args = arguments;

                $rootScope.$apply(function () {
                    confirmCallback.apply(that, args);
                });
            }, title, buttonLabels);
        }),
        beep: function (times) {
            navigator.notification.beep(times);
        },
        vibrate: function (milliseconds) {
            navigator.notification.vibrate(milliseconds);
        }
    };
});

NoonPacific.factory('navSvc', function($navigate) {
    return {
        slidePage: function (path, type, isReverse) {
            $navigate.go(path,type,isReverse);
        },
        back: function () {
            $navigate.back();
        }
    }
});

NoonPacific.factory('compass', function ($rootScope, phonegapReady) {
    return {
        getCurrentHeading: phonegapReady(function (onSuccess, onError) {
            navigator.compass.getCurrentHeading(function () {
                var that = this,
                    args = arguments;

                if (onSuccess) {
                    $rootScope.$apply(function () {
                        onSuccess.apply(that, args);
                    });
                }
            }, function () {
                var that = this,
                    args = arguments;

                if (onError) {
                    $rootScope.$apply(function () {
                        onError.apply(that, args);
                    });
                }
            });
        })
    };
});

NoonPacific.factory('contacts', function ($rootScope, phonegapReady) {
    return {
        findContacts: phonegapReady(function (onSuccess, onError) {
            var options = new ContactFindOptions();
            options.filter="";
            options.multiple=true;
            var fields = ["displayName", "name"];
            navigator.contacts.find(fields, function(r){console.log("Success" +r.length);var that = this,
                args = arguments;
                if (onSuccess) {
                    $rootScope.$apply(function () {
                        onSuccess.apply(that, args);
                    });
                }
            }, function () {
                var that = this,
                    args = arguments;

                if (onError) {
                    $rootScope.$apply(function () {
                        onError.apply(that, args);
                    });
                }
            }, options)
        })
    }
});




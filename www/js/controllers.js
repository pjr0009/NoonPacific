'use strict';

var Song = function(n, a, y, art, l) {
    return {
        name: n,
        artist: a,
        year: y,
        artwork: art,
        duration: l
    };
};

/* Controllers */
function HomeCtrl ($scope, $http, eightTrackService, audio, $document, navSvc, $rootScope) {

      $scope.mixes = [];
      $scope.songs = [];
      $scope.playing = false;
      $scope.next_track = false;
      $scope.can_skip = true;
      $scope.route = "home";
      $scope.show_menu = false;
      $scope.current_index = 0;

      $scope.initEightTrack = function() {
        if($scope.mixes.length == 0) {
          return eightTrackService.createNewPlayToken().success(function(data) {
            return $scope.p_tkn = data.play_token;
          }).then(function() {
            $scope.loading_mixes = true;
            return eightTrackService.getMixes().success(function(data) {
              $scope.loading_mixes = false;
              return $scope.mixes = $.map(data.mixes, function(mix) {
                return {
                  id: mix.id,
                  name: mix.name,
                  tracks: mix.tracks_count,
                  smallPic: mix.cover_urls.sq56,
                  bigPic: mix.cover_urls.max1024,
                  plays: mix.plays_count
                };
              });
            });
          }).then(function() {
            $scope.loading_latest = true;
            $scope.mix = $scope.mixes[0];
            eightTrackService.getMix($scope.mix.id, $scope.p_tkn).then(function() {});
            return $scope.loading_latest = false;
          });
        };
      };
      $scope.fetchMix = function(index) {
        $scope.playing = false;
        $('#progress-bar').css("width", 0);
        $scope.mix = $scope.mixes[index];
        return eightTrackService.getMix($scope.mix.id, $scope.p_tkn).then(function() {
          $scope.can_skip = true;
          return $scope.slidePage('/', 'slide', true, $scope.toggle);
        });
      };
      $scope.$on('setLoaded', function(scope, set) {
        $scope.songs.length = $scope.mix.tracks;
        audio.src = set.set.track.url;
        $scope.songs[0] = new Song(set.set.track.name, set.set.track.performer, set.set.track.year, set.set.track.buy_link, set.set.track.play_duration);
        $('#progress-bar').css("width", 0);
      });
      $scope.$on('skipSuccess', function(scope, set) {
        if (!set.at_end) {
          $scope.playing = true;
          audio.src = set.set.track.url;
          $scope.can_skip = set.set.skip_allowed;
          console.log($scope.can_skip);
          $scope.songs[$scope.current_index + 1] = new Song(set.set.track.name, set.set.track.performer, set.set.track.year, set.set.track.buy_link, set.set.track.play_duration);
          $('#progress-bar').css("width", 0);
          audio.play();
          if ($scope.current_index < $scope.songs.length - 1) {
            return $scope.current_index += 1;
          }
        }
      });

      $(audio).on('timeupdate', function() {
          var time = ((this.currentTime / this.duration) * 100).toString() + "%"
          console.log(this.currentTime / this.duration)
          if((this.current / this.duration) == 1){
            eightTrackService.next($scope.mix.id, $scope.p_tkn);            
            $('#progress-bar').css("width", 0);
          }
          else{
            $('#progress-bar').css("width", time);
          }

      });


      $scope.toggle_menu = function() {
        return $scope.show_menu = !$scope.show_menu;
      };
      $scope.toggle = function() {
        if ($scope.playing === true) {
          $scope.playing = false;
          return audio.pause();
        } else {
          $scope.playing = true;
          return audio.play();
        }
      };
      $scope.play_logic = function(){
        if($scope.playing == true || ($scope.playing == false && $scope.route == "mixes")){
          return true;
        } else {
          return false;
        }
      };

      $scope.skip = function() {
        if($scope.can_skip == true){
          $('.track-info-container').hide();
          audio.pause();
          return eightTrackService.skip($scope.mix.id, $scope.p_tkn);
        }
      };

      $scope.skip_icon = function(){
        if($scope.can_skip == false){
          return "muted";
        }
      }

      $scope.slidePage = function (path, type, isReverse, callback) {
        if(path == "/mixes"){
          $scope.route = "mixes";
        } else if (path == "/menu"){
          $scope.route = "menu";
        } else {
          $scope.route = "home";
        }
        navSvc.slidePage(path, type, isReverse);
        callback();
      };

      $scope.back = function () {
        $scope.route = "home";
        navSvc.back();
      };


      $scope.$watch('current_index', function(newVal) {
        return $scope.song = $scope.songs[$scope.current_index];
      });



      $scope.$watch('route', function(newVal){
        console.log(newVal)
        if(newVal != "home"){
          $("#progress-bar").css('background-color', '#666');
        } else {
          $("#progress-bar").css('background-color', '#f8f8f8');

        }
      });

      $scope.changeSettings = function () {
          $rootScope.showSettings = true;
      };
      $scope.closeOverlay = function () {
          $rootScope.showSettings = false;
      };
};


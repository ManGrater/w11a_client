var app = angular.module("AngularLab", ['growlNotifications', 'ngAnimate']);

app.config(['$httpProvider', function ($httpProvider) {
  // Intercept POST requests, convert to standard form encoding
  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
  $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
    var key, result = [];
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }
    return result.join("&");
  });
}]);

app.controller("MainController", function($scope, $http) {
  $scope.updateId = 0;
  $scope.updateName = '';
  $scope.updateDesc = '';

  var url = "http://w11a.ctrl-alt-believe.com/api";

  $scope.readResponse = '';

  $scope.notifications = {};
  var index = 0;
  $scope.add = function(notification) {
    var i;
    i = index++;
    $scope.notifications[i] = notification;
  };
  $scope.prepareUpdate = function(id, name, description) {
    $scope.updateId = id;
    $scope.updateName = name;
    $scope.updateDesc = description;
    // Hide and show stuff
    $('tr.normal').addClass('hidden');
    $('#toUpdate').removeClass('hidden');
  };

  $scope.create = function (name, description) {
      if (!name || !description) {
          $scope.add("Error, empty fields!");
          return;
      }
    $http.post(url + '/Categories',
      {
        'categoryName': name,
        'description': description
      })
      .success(function(data) {
        $scope.add('Category created: ' + name);
        $scope.read();
      })
      .error(function(data) {
        $scope.add('Error creating category: ' + data);
      });
  };

  $scope.read = function() {
    $('#toUpdate').addClass('hidden');
    $http.get(url + '/Categories')
      .success(function(data) {
        $scope.add('Fetch success');
        $scope.readResponse = data;
      })
      .error(function(data) {
        $scope.add('Error fetching categories');
      });
  };

  $scope.deleteCategory = function(id, index) {
    $http.delete(url + '/Categories/' + id)
      .success(function(data) {
        $scope.readResponse.splice(index, 1);
        $scope.add('Category deleted: ' + data.CategoryName);
      })
      .error(function(data) {
        $scope.add('Error deleting category');
      });
  };

  $scope.updateCategory = function(id, catName, catDesc) {
    console.log("id:" + id + ", name:" + catName + ", desc:" + catDesc);
    $http.put(url + '/Categories/' + id,
      {
        'categoryId': id,
        'categoryName': catName,
        'description': catDesc
      })
      .success(function(data) {
        $scope.add('Category updated');
        $scope.read();
      })
      .error(function(data) {
        $scope.add('Error updating category');
      });
  };
});
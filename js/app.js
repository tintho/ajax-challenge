"use strict";

var urlStart = 'https://api.parse.com/1/classes/input';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'eu1WUlrNaemmJDGR5fZWhET9T7xD5jd8ohv8G0O7';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'juXK2WfoFzaDFSewhwr28HmC9YTNmTpGDxJv16qh';
    })
    .controller('CommentController', function($scope, $http) {
        $scope.newComment = {
            score: 0,
            downvote: true
        };

        $scope.refreshComments = function () {
            $scope.loading = true;
            $http.get(urlStart + "?order=-score")
                .success(function (data) {
                    $scope.comments = data.results;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        //adds comment and submits to parse
        $scope.addComment = function () {
            $scope.loading = true;
            $http.post(urlStart, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function() {
                    $scope.form.$setPristine();
                    $scope.newComment = {
                        score: 0,
                        downvote: true
                    };
                    $scope.loading = false;
                })
        };

        $scope.changeScore = function(comment, amount) {
            if (amount == 1) {
                $scope.updateScore(comment, amount);
            } else if (comment.score == 0 && amount == -1) {
                comment.downvote = false;
            } else if (amount == -1 && comment.downvote) {
                $scope.updateScore(comment, amount);
            }
        };

        $scope.updateScore = function(comment, amount) {
            $http.put(urlStart + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function (responseData) {
                    comment.score = responseData.score;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });
        };

        //deletes comment
        $scope.deleteComment = function (comment) {
            $http.delete(urlStart + '/' + comment.objectId, comment)
                .success(function(data) {
                    $scope.refreshComments();
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });
        };
    });
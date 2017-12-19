﻿define(['knockout'], function (ko) {
    return function (params) {
        
        var title = ko.observable("Component History");
        var recentSearchPosts = ko.observableArray([]);
        var recentSearchView = ko.observable('postlist');
        var visitedPosts = ko.observableArray([]);
        var visitedPostsView = ko.observable('visitedpostlist');
        var currentPost = ko.observable();
        var currentPostVisited = ko.observable();

        var showPost = (data) => {
            $.getJSON(data.link, postData => {
                var post = {
                    title: postData.title,
                    score: postData.score,
                    creationDate: postData.creation_date,
                    body: postData.body
                }

                $.getJSON(postData.comments, cms => {

                    post.comments = ko.observableArray(cms);

                    $.getJSON(postData.answers, ans => {

                        $.getJSON(postData.linkedPosts, linkPosts => {

                            post.linkedPosts = ko.observableArray(linkPosts);
                        });
                        $.getJSON(postData.showTags, stags => {

                            post.showTags = ko.observableArray(stags);
                            currentPost(post);

                        });

                        ans.forEach(e => {
                            $.getJSON(e.comments, comments => {
                                e.comments = comments;
                            });
                        });


                        post.answers = ko.observableArray(ans);

                    });

                });

            });
            title("Post");
            recentSearchView('postview');
        };

        var ShowVisitedPost = (data) => {
            $.getJSON(data.link, postData => {
                var post = {
                    title: postData.title,
                    score: postData.score,
                    creationDate: postData.creation_date,
                    body: postData.body

                }

                $.getJSON(postData.comments, cms => {

                    post.comments = ko.observableArray(cms);

                    $.getJSON(postData.answers, ans => {

                        post.answers = ko.observableArray(ans);

                        $.getJSON(postData.linkedPosts, linkPosts => {

                            post.linkedPosts = ko.observableArray(linkPosts);

                            $.getJSON(postData.showTags, stags => {

                                post.showTags = ko.observableArray(stags);
                                currentPostVisited(post);

                            });
                        });
                    });

                });

            });

            title("Post");
            visitedPostsView('visitedPostsView');
        };

        var home = () => {
            title("Show posts");
            recentSearchView('postlist');
        };

        var homevisited = () => {
            title("Show posts");
            visitedPostsView('visitedpostlist');
        };

        $.getJSON("api/searches/", data => {
            recentSearchPosts(data.items);
            console.log(data.items);

            $.getJSON("api/visited/", data => {
                visitedPosts(data.items);
                console.log(data.items);
            });


        });
        
        return {
            title,
            recentSearchPosts,
            recentSearchView,
            visitedPosts,
            visitedPostsView,
            showPost,
            currentPost,
            home,
            homevisited,
            ShowVisitedPost,
            currentPostVisited,

        };
    }
});
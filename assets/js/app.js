var app = {
    compare: false,
    moviesObjs: [],
    idCounter: 0,
    recentSearch: [],
    blinkerInterval: '',
    addMovie(el, isInput) {
        event.preventDefault();
        var movie;

        if (isInput) {
            movie = el.val();
        }
        else {
            movie = el.attr('data-subject');
        }

        this.idCounter++;
        this.getOMDB(movie);

        el.val('');
    },
    getRecent() {
        $('#recentSearch').empty();
        var existing = JSON.parse(localStorage.getItem('search'));
        console.log(existing);
        if (!Array.isArray(existing)) {
            app.recentSearch = [];
        } else {
            app.recentSearch = existing;
        }

        for (var j = 0; j < app.recentSearch.length; j++) {
            var searchButtons = $("<div>").addClass("chip");
            var searchTitle = $('<span>').addClass("chipSearch").text(app.recentSearch[j]).attr("data-subject", app.recentSearch[j]);
            var searchClose = $('<span>').addClass('chipClose').html('<i class="close material-icons">close</i>').attr("data-subject", app.recentSearch[j]);
            $(searchButtons).append(searchTitle, searchClose);
            $("#recentSearch").append(searchButtons);
        }
    },
    chipGen(movie) {
        app.recentSearch.unshift(movie);
        if (app.recentSearch.length > 5) {
            app.recentSearch.pop();
        }
        console.log(app.recentSearch);

        // Save back to localStorage
        localStorage.setItem("search", JSON.stringify(app.recentSearch));
        // Get the existing data
        app.getRecent();
        // $(existing).push(JSON.stringify(movie));
        // localStorage.setItem('search', existing.toString());
    },
    wikiAPI(movie, rating, rating2, rating3, boxOffice) {
        var queryUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=' + movie + '&rvsection=0';

        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then(function (response) {
            var pages = response.query.pages;
            var id = Object.getOwnPropertyNames(pages);
            var budget = app.getWiki(pages, id, "budget");
            var gross = app.getWiki(pages, id, "gross");
            var box = app.getWiki(pages, id, "box office");

            var boxOff;
            if (boxOffice === undefined || isNaN(boxOffice) === true) {
                if (gross !== undefined || isNaN(gross) === false) {
                    boxOff = gross;
                } else if (box !== undefined || isNaN(box) === false) {
                    boxOff = box;
                } else {
                    boxOff = false;
                }
            } else {
                boxOff = boxOffice;
            }

            var movieObj = { id: app.idCounter, name: movie, rating: rating, rating2: rating2, rating3: rating3, budget: budget, gross: boxOff };
            app.moviesObjs.push(movieObj);
            console.log(app.moviesObjs);
        });

    },
    getWiki(pages, id, string) {
        var str1 = pages[id].revisions[0]['*'].toLowerCase();
        var location = str1.indexOf(string);
        var str2 = str1.substring(location, str1.length);
        var dollarLocation = str2.indexOf('$');
        var str3 = str2.substring(dollarLocation + 1, str2.length);
        var codeLocation = str3.indexOf('<');
        var total = str3.substring(0, codeLocation);
        var totalInt;
        if (total.indexOf('million') > -1) {
            totalInt = parseFloat(total) * 1000000;
        } else if (total.indexOf("billion") > -1) {
            totalInt = parseFloat(total) * 1000000000;
        }

        var returnNum = app.isDefined(totalInt, false, false);

        return returnNum;
    },
    getWikiUrl(movie, id) {
        var queryUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + movie + '&limit=1&format=json&origin=*&callback=';
        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then(function (response) {
            var http = response.indexOf('http');
            var str = response.substring(http, response.length);
            var end = str.indexOf('"]');
            var link = str.substring(0, end);
            var link = $('<li>').html('See on WikiPedia: <a href="' + link + '" target="_blank">' + link + '</a>');
            $('#ul' + id).append(link);
        })
    },
    deleteAddedMovie() {
        event.preventDefault();
        $(this).parent().remove();
        var dataNum = $(this).parent().attr('data-num');
        var num = parseInt(dataNum);
        if (app.moviesObjs.length === 2) {
            $("input").prop("disabled", false);
            $("#comment").text("");
            clearInterval(app.blinkerInterval);
        }
        app.moviesObjs = app.moviesObjs.filter(function (obj) {
            return obj.id !== num;
        });
    },
    movieCards(movie, plot, poster, year, rate, genre, director, id) {
        var outerContainer = $('<div>').addClass('close-container').attr('data-id', movie).attr('data-num', app.idCounter);
        var movieWrap = $('<div>').addClass('movie-wrap');
        var wrap = $('<div>').addClass('movie-title-wrap');
        var title = $('<h5>').addClass('movie-title').text(movie + " (" + year + ")");
        var btnDelete = $('<button>').addClass('button button-delete').html('<i class="material-icons">close</i>');
        var contentWrap = $('<div>').addClass('movie-content-wrap');
        var plotWrap = $('<div>').addClass('movie-plot-wrap');
        var posterWrap = $('<div>').addClass('movie-poster-wrap');
        var poster = $("<img>").addClass("movie-poster").attr("src", poster).appendTo(posterWrap);
        var plot = $('<div>').addClass('movie-plot').text(plot);
        var ul = $("<ul>").addClass('movie-info').attr('id', 'ul' + id);
        var rated = $("<li>").text("Rating: " + rate);
        var genre = $("<li>").text("Genre: " + genre);
        var director = $("<li>").text("Directed By: " + director);
        ul.append(rated, genre, director);
        wrap.append(title);
        plotWrap.append(plot, ul);
        contentWrap.append(wrap, plotWrap);
        movieWrap.append(posterWrap, contentWrap);
        outerContainer.append(movieWrap, btnDelete);
        $('#addedMovies').prepend(outerContainer);
    },
    compare() {
        event.preventDefault();
        clearInterval(app.blinkerInterval);
        console.log(app.moviesObjs);
        app.generateChartsIfExist(app.moviesObjs[0].gross, app.moviesObjs[1].gross, 'results1', 'Box Office Total', true);
        app.generateChartsIfExist(app.moviesObjs[0].budget, app.moviesObjs[1].budget, 'results2', 'Budget', true);
        app.generateChartsIfExist(app.moviesObjs[0].rating, app.moviesObjs[1].rating, 'results3', 'Internet Movie Data', false);
        app.generateChartsIfExist(app.moviesObjs[0].rating2, app.moviesObjs[1].rating2, 'results4', 'Rotten Tomatoes', false);
        app.generateChartsIfExist(app.moviesObjs[0].rating3, app.moviesObjs[1].rating3, 'results5', 'Metacritic', false);

        app.generateHeader();

        $("#search-wrap").hide();
        $("#results-wrap").show();

        $(window).scrollTop(0);
    },
    generateChartsIfExist(obj1, obj2, id, name, isGen1) {
        if (obj1 && obj2 && isGen1) {
            app.generateChart1(id, name, obj1, obj2);
        } else if (obj1 && obj2 && !isGen1) {
            app.generateChart2(id, name, obj1, obj2);
        }
    },
    blinker() {
        $("#compareMovies").fadeOut(300);
        $("#compareMovies").fadeIn(300);
        console.log('blink');
    },
    reset() {
        app.moviesObjs = [];

        var empty = ['addedMovies', 'movie-title1', 'movie-title2', 'chart-container'];
        var x;
        for (x of empty) {
            $('#' + x).empty();
        }

        $('#results-wrap').hide();
        $('#search-wrap').show();
        $("input").prop("disabled", false);
        $("#comment").text("");

        clearInterval(app.blinkerInterval);

    },
    isDefined(i, isCurrency, float) {
        if (i === undefined) {
            return false;
        } else if (i !== undefined && !float) {
            return i;
        } else if (i !== undefined && !isCurrency && float) {
            return parseFloat(i.Value);
        } else if (i !== undefined && isCurrency && float) {
            var str1 = i.replace(/,/g, "");
            var str2 = str1.replace("$", "");
            return parseFloat(str2);
        }
    },
    getOMDB(movie) {

        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            if (response.Response === "True" && app.moviesObjs.length < 2) {

                if (app.recentSearch.indexOf(movie) === -1){
                    app.chipGen(movie);
                }
                
                $('#movieNotFound').text('');

                var ratingValue = app.isDefined(response.Ratings[0], false, true),
                    rottenTomatoes = app.isDefined(response.Ratings[1], false, true),
                    metaCritic = app.isDefined(response.Ratings[2], false, true),
                    boxOffice = app.isDefined(response.BoxOffice, true, true);

                app.movieCards(movie, response.Plot, response.Poster, response.Year, response.Rated, response.Genre, response.Director, this.idCounter);
                app.wikiAPI(response.Title, ratingValue, rottenTomatoes, metaCritic, boxOffice);
                app.getWikiUrl(response.Title, this.idCounter);

                if (app.moviesObjs.length === 1) {
                    $("input").prop("disabled", true);
                    $("#comment").text("Click compare button to compare your movies!");
                    app.blinkerInterval = setInterval(app.blinker, 1000);
                }

            }
            if (response.Response !== "True") {
                $('#movieNotFound').text('Movie Not Found :-(');
            }

        });

    },
    chartContainer(id, name) {
        var chartWrap = $('<div>').addClass('chart-wrap');
        var chartTitle = $('<h4>').addClass('chart-title').text(name);
        var canvas = $("<canvas>").attr('id', id);
        chartWrap.append(chartTitle, canvas)
        $("#chart-container").append(chartWrap);
    },
    generateChart1(param1, param2, param3, param4) {
        this.chartContainer(param1, param2);

        var ctx = $('#' + param1);
        var myChart1 = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: [app.moviesObjs[0].name, app.moviesObjs[1].name],
                datasets: [{
                    label: param2,
                    data: [param3, param4],
                    backgroundColor: [
                        'rgba(238, 9, 121, .4)',
                        'rgba(8, 196, 159, .4)',
                    ],
                    borderColor: [
                        'rgba(238, 9, 121, 1)',
                        'rgba(8, 196, 159, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                },
                tooltips: {
                    // label: [param3, param4]
                    callbacks: {
                        label: function (t, d) {
                            var xLabel = d.xLabel >= 1000 ? + d.xLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '$' + t.xLabel;
                            console.log(xLabel);
                            return xLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            callback: function (value) {
                                if (parseInt(value) >= 1000) {
                                    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                } else {
                                    return '$' + value;
                                }
                            },
                            beginAtZero: true
                        }
                    }]
                }
            },
            aspectRatio: 1,
            duration: 3000
        })
    },
    generateChart2(param1, param2, param3, param4) {

        this.chartContainer(param1, param2);

        var ctx = $('#' + param1);
        var myChart1 = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: [app.moviesObjs[0].name, app.moviesObjs[1].name],
                datasets: [{
                    data: [param3, param4],
                    backgroundColor: [
                        'rgba(238, 9, 121, .4)',
                        'rgba(8, 196, 159, .4)',
                    ],
                    borderColor: [
                        'rgba(238, 9, 121, 1)',
                        'rgba(8, 196, 159, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            },
            aspectRatio: 1,
            duration: 3000
        });
    },
    generateHeader() {
        $("#movie-title1").text(app.moviesObjs[0].name);
        $("#movie-title2").text(app.moviesObjs[1].name);

    },
}

$(document).ready(function () {
    // localStorage.clear();

    $("#results-wrap").hide();
    app.getRecent();
    $(document).on('click', '.button-delete', app.deleteAddedMovie);
    $('#compareMovies').on('click', app.compare);
    $("#clear-button").on("click", app.reset);

    $('#addMovie').keypress(function (e) {
        var key = e.which;
        var el = $(this);
        if (key == 13) {
            app.addMovie(el, true);
        }
    });

    $(document).on('click', ".chipSearch", function (e) {
        e.preventDefault();
        var el = $(this);
        app.addMovie(el, false);
    });

    $(document).on('click', ".chipClose", function (e) {
        event.preventDefault();
        var subject = $(this).attr("data-subject");
        app.recentSearch = app.recentSearch.filter(function (ele) {
            return ele != subject;
        });
        localStorage.setItem("search", JSON.stringify(app.recentSearch));
        console.log(subject);
        console.log(app.recentSearch);
        console.log("delete");
    });
});
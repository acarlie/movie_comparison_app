var app = {
    compare: false,
    moviesArray:[],
    moviesObjs: [],
    idCounter: 0,

    addMovie(el){

        this.idCounter++
        event.preventDefault();
        var movie = el.val();
        this.moviesArray.push(movie);
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            if (response.Response === "True"){
                $('#movieNotFound').text('');
                console.log(response);
                var ratingName = response.Ratings[0].Source,
                    ratingValue = response.Ratings[0].Value,
                    rating = parseFloat(ratingValue),
                    moviePlot = response.Plot,
                    moviePoster = response.Poster,
                    movieYear = response.Year,
                    movieRated = response.Rated,
                    movieGenre = response.Genre,
                    directedBy = response.Director,
                    boxOffice = response.BoxOffice,
                    movieTitle = response.Title;
                app.movieCards(movie, moviePlot, moviePoster, movieYear, movieRated, movieGenre, directedBy);
                app.wikiAPI(movieTitle, rating, boxOffice);
            } else {
                $('#movieNotFound').text('Movie Not Found :-(');
            }

        });

        el.val('');
    },
    wikiAPI(movie, rating, boxOffice){
        var queryUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=' + movie + '&rvsection=0';

        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then(function (response) {
            var pages = response.query.pages;
            var id = Object.getOwnPropertyNames(pages);
            var budget = app.getWiki(pages, id, "budget");
            var gross = app.getWiki(pages, id, "gross");

            var boxOff;
            if (boxOffice === undefined){
                boxOff = gross;
            } else {
                boxOff = boxOffice;
            }
            
            console.log(movie + ' Budget: ' + budget);
            console.log(movie + ' Gross: ' + gross);
            var boxOffice = app.getWiki(pages, id, "box office");
            console.log(movie + ' Box Office: ' + boxOffice);

            var movieObj = { id: app.idCounter, name: movie, rating: rating, budget: budget, gross: boxOff };
            app.moviesObjs.push(movieObj);
            
            console.log(app.moviesObjs);
        });

    },
    getWiki(pages, id, string){
        // console.log(pages);
        // console.log(id);
        var str1 = pages[id].revisions[0]['*'].toLowerCase();
        console.log(str1);
        var location = str1.indexOf(string);
        var str2 = str1.substring(location, str1.length);
        var dollarLocation = str2.indexOf('$');
        var str3 = str2.substring(dollarLocation + 1, str2.length);
        var codeLocation = str3.indexOf('<');
        var total = str3.substring(0, codeLocation);
        var totalInt;
        if (total.indexOf('million')>-1){
            totalInt = parseFloat(total) * 1000000; 
        } else if (total.indexOf("billion")>-1){
            totalInt = parseFloat(total) * 1000000000;
        }
        console.log(totalInt)
        return totalInt;
    },
    deleteAddedMovie(){
        event.preventDefault();
        $(this).parent().parent().remove();
        var dataNum = $(this).parent().parent().attr('data-num');
        var num = parseInt(dataNum);
        app.moviesObjs = app.moviesObjs.filter(function( obj ) {
            return obj.id !== num;
        });
    },
    movieCards(movie, plot, poster, year, rate, genre, director){
        var movieWrap = $('<div>').addClass('movie-wrap').attr('data-id', movie).attr('data-num', app.idCounter);
        var wrap = $('<div>').addClass('movie-title-wrap');
        var title = $('<h5>').addClass('movie-title').text(movie + " (" + year + ")");
        var btnDelete = $('<button>').addClass('button button-delete').html('<i class="material-icons">close</i>');
        var poster = $("<img>").addClass("movie-poster").attr("src", poster);
        var plot = $('<div>').addClass('movie-plot').text(plot);
        var ul = $("<ul style='list-style-type:none;'>");
        var rated = $("<li>").text("Rating: " + rate);
        var genre = $("<li>").text("Genre: " + genre);
        var director =$("<li>").text("Directed By: " + director);
        ul.append(rated, genre, director);
        wrap.append(title, btnDelete);
        movieWrap.append(wrap,poster, plot, ul);
        $('#addedMovies').prepend(movieWrap);
    },
    compare(movie){
        event.preventDefault();
        app.compare = true;
        
        if(app.moviesObjs[0].gross !== undefined && app.moviesObjs[1].gross !== undefined){
            app.generateChart($("#results1"), 'Box Office Total', app.moviesObjs[0].gross, app.moviesObjs[1].gross);
        } 

        if (app.moviesObjs[0].budget !== undefined && app.moviesObjs[1].budget !== undefined){
            app.generateChart($("#results2"), 'Budget', app.moviesObjs[0].budget, app.moviesObjs[1].budget);
        }

        app.generateChart($("#results3"), 'Rotten Tomatoes Score', app.moviesObjs[0].rating, app.moviesObjs[1].rating);
        app.generateHeader();
    },
        
        //generate comparison page

    getOMDB(movie){ //so we can reuse this function using app.getOMDB(movie);
    
        for (var i = 0; i < 2 ; i++) {
            var movie = app.moviesArray[i]
            var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
        
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                var ratingName = response.Ratings[0].Source;
                var ratingValue = response.Ratings[0].Value;
                var valueNumber = ratingValue.slice(0,3);
        
                console.log(response)
                console.log(ratingName);
                console.log(ratingValue);
                console.log(valueNumber)
                
            });     
    }
        
    },
    generateChart(param1, param2, param3, param4) {
        // var ratingA = parseInt(app.moviesObjs[0].rating);
        // var ratingB = parseInt(app.moviesObjs[1].rating);
        var ctx = $(param1);
        var myChart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [app.moviesObjs[0].name, app.moviesObjs[1].name],
            datasets: [{
                label: param2,
                data: [param3, param4],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
        aspectRatio: 1,
        duration: 3000

    });
    },
    generateHeader() {
        $("#movie-title1").text(app.moviesObjs[0].name);
        $("#movie-title2").text(app.moviesObjs[1].name);
        $("#vs").show();
    },
}



$(document).ready(function(){

    $("#vs").hide();

  
    $(document).on('click', '.button-delete', app.deleteAddedMovie);

    $('#compareMovies').on('click', app.compare);

    $('#addMovie').keypress(function(e){
        var key = e.which;
        var el = $(this);
        if(key == 13){
            app.addMovie(el);
        } 

    });
    

});



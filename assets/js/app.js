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
                var ratingName = response.Ratings[0].Source,
                    ratingValue = response.Ratings[0].Value,
                    rating = parseFloat(ratingValue),
                    moviePlot = response.Plot,
                    moviePoster = response.Poster,
                    movieYear = response.Year,
                    movieRated = response.Rated,
                    movieGenre = response.Genre,
                    directedBy = response.Director;
                app.movieCards(movie, moviePlot, moviePoster, movieYear, movieRated, movieGenre, directedBy);
                app.wikiAPI(movie, rating);
            } else {
                $('#movieNotFound').text('Movie Not Found :-(');
            }

        });

        el.val('');
    },
    wikiAPI(movie, rating){
        var queryUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=' + movie + '&rvsection=0';

        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then(function (response) {
            var pages = response.query.pages;
            var id = Object.getOwnPropertyNames(pages);
            var budget = app.getWiki(pages, id, "budget");
            var gross = app.getWiki(pages, id, "gross");

            var movieObj = { id: app.idCounter, name: movie, rating: rating, budget: budget, gross: gross };
            app.moviesObjs.push(movieObj);

            console.log(app.moviesObjs);
        });

    },
    getWiki(pages, id, string){
        console.log(pages);
        console.log(id);
        var str1 = pages[id].revisions[0]['*'];
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
        var dataId = $(this).parent().parent().attr('data-id');
        app.moviesArray = app.arrayRemove(app.moviesArray, dataId);
    },
    arrayRemove(arr, value) {
        return arr.filter(function(ele){
            return ele != value;
        });
    },
    movieCards(movie, plot, poster, year, rate, genre, director){
        var movieWrap = $('<div>').addClass('movie-wrap').attr('data-id', movie);
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
        app.getOMDB(movie);
    },
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
        
    }
}



$(document).ready(function(){

  
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



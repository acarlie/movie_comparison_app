var app = {
    compare: false,
    moviesArray:[],
    moviesObjs: [],
    idCounter: 0,
    addMovie(el){
        this.idCounter++
        //We'll need to check OMDB to see if Movie exists and get the plot, if movie doesn't exist we'll need to tell the user it can't be found
        event.preventDefault();
        var movie = el.val();
        var ratingName,
            ratingValue,

            moviePlot,
            moviePoster;

        this.moviesArray.push(movie);

        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            if (response.Response === "True"){
                $('#movieNotFound').text('');
                ratingName = response.Ratings[0].Source;
                ratingValue = response.Ratings[0].Value;

                moviePlot = response.Plot;
                moviePoster = response.Poster;
                app.movieCards(movie, moviePlot, moviePoster);
                app.wikiAPI(movie, ratingValue);
 
            
            

            } else {
                console.log('not found');
                $('#movieNotFound').text('Movie Not Found :-(');
                //modal can't find movie
            }
     
        });

        el.val('');
    },
    wikiAPI(movie, rating){
        var queryUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=' + movie + '&rvsection=0';

        $.ajax({
                url: queryUrl,
                method: 'GET'
            }).then(function(response){
                var pages = response.query.pages;
                var id = Object.getOwnPropertyNames(pages);
                var budget = app.getWiki(pages, id, "budget");
                var gross = app.getWiki(pages, id, "gross");

                var movieObj = {id: app.idCounter, name: movie, rating: rating, budget: budget, gross: gross};
                app.moviesObjs.push(movieObj);

                console.log(app.moviesObjs);
            // retrieve budget string
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
    movieCards(movie, plot, poster){
        var movieWrap = $('<div>').addClass('movie-wrap').attr('data-id', movie);
        var wrap = $('<div>').addClass('movie-title-wrap');
        var title = $('<h5>').addClass('movie-title').text(movie);
        var btnDelete = $('<button>').addClass('button button-delete').html('<i class="material-icons">close</i>');
        var poster = $("<img>").addClass("movie-poster").attr("src", poster);
        var plot = $('<div>').addClass('movie-plot').text(plot);
        wrap.append(title, btnDelete);
        movieWrap.append(wrap,poster, plot);
        $('#addedMovies').prepend(movieWrap);
    },
    compare(movie){
        event.preventDefault();
        app.compare = true;
        app.getOMDB(movie);
        
        //generate comparison page
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



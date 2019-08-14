var app = {
    compare: false,
    moviesArray:[],
    addMovie(el){
        //We'll need to check OMDB to see if Movie exists and get the plot, if movie doesn't exist we'll need to tell the user it can't be found
        event.preventDefault();
        var movie = el.val();
        var ratingName,
            ratingValue,
            moviePlot;

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
                app.movieCards(movie, moviePlot);
 
            console.log(response);
            console.log(ratingName);
            console.log(ratingValue);
            
            } else {
                console.log('not found');
                $('#movieNotFound').text('Movie Not Found :-(');
                //modal can't find movie

            }
     
        });

        el.val('');
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
    movieCards(movie, plot){
        var movieWrap = $('<div>').addClass('movie-wrap').attr('data-id', movie);
        var wrap = $('<div>').addClass('movie-title-wrap');
        var title = $('<h5>').addClass('movie-title').text(movie);
        var btnDelete = $('<button>').addClass('button button-delete').html('<i class="material-icons">close</i>');
        var plot = $('<div>').addClass('movie-plot').text(plot);
        wrap.append(title, btnDelete);
        movieWrap.append(wrap, plot);
        $('#addedMovies').prepend(movieWrap);
    },
    compare(){
        event.preventDefault();
        app.compare = true;
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
        //generate comparison page
    },
    getOMDB(movie){ //so we can reuse this function using app.getOMDB(movie);
    
        var movie = app.moviesArray
        var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var ratingName = response.Ratings[0].Source;
            var ratingValue = response.Ratings[0].Value;
            var moviePlot = response.Plot;
            
        });
        
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
    

	$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=Avengers%3A_Endgame&rvsection=0',
/*        url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=The%20Lion%20King&rvsection=0', */
	    method: 'GET'
	  }).then(function(response){
      var pages = response.query.pages;
      var id = Object.getOwnPropertyNames(pages);
      var budget = getWiki("budget");
      var gross = getWiki("gross");
      console.log(budget);
      console.log(gross);
      // retrieve budget string
      function getWiki(string){
      var str1 = pages[id].revisions[0]['*'];
      var location = str1.indexOf(string);
      var str2 = str1.substring(location, str1.length);
      var dollarLocation = str2.indexOf('$');
      var str3 = str2.substring(dollarLocation + 1, str2.length);
     	var codeLocation = str3.indexOf('<');
      var total = str3.substring(0, codeLocation);
      var totalInt=0;
      if (total.indexOf('million')>-1){
          totalInt = parseFloat(total) * 1000000;
          
      }
      else if (total.indexOf("billion")>-1){
          totalInt = parseFloat(total) * 1000000000;
      }
     
      return totalInt;
	  };

});
});



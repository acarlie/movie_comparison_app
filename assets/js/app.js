var app = {
    compare: false,
    moviesArray:[],
    addMovie(el){
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
    

	$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=Avengers%3A_Endgame&rvsection=0',
/*        url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=The%20Lion%20King&rvsection=0', */
	    method: 'GET'
	  }).then(function(response){
      var pages = response.query.pages;
      var id = Object.getOwnPropertyNames(pages);
      // retrieve budget string
      var budgetStr1 = pages[id].revisions[0]['*'];
      console.log(budgetStr1);
      var budgetLocation = budgetStr1.indexOf('budget');
      var budgetStr2 = budgetStr1.substring(budgetLocation, budgetStr1.length);
      var budgetDollarLocation = budgetStr2.indexOf('$');
      var budgetStr3 = budgetStr2.substring(budgetDollarLocation + 1, budgetStr2.length);
     	var budgetCodeLocation = budgetStr3.indexOf('<');
      var budgetTotal = budgetStr3.substring(0, budgetCodeLocation);
      var budgetTotalInt=0;
      
      console.log(budgetTotal); //returns budget
      
      var grossStr1 = pages[id].revisions[0]['*'];
      var grossLocation = grossStr1.indexOf('gross');
      var grossStr2 = grossStr1.substring(grossLocation, grossStr1.length);
      var grossDollarLocation = grossStr2.indexOf('$');
      var grossStr3 = grossStr2.substring(grossDollarLocation + 1, grossStr2.length);
      var grossCodeLocation = grossStr3.indexOf('<');
      var grossTotal = grossStr3.substring(0, grossCodeLocation);
      var grossTotalInt=0;

      console.log(grossTotal);
      if (budgetTotal.indexOf('million')>-1){
          budgetTotalInt = parseFloat(budgetTotal) * 1000000;
          console.log(budgetTotalInt);
          
      }
      else if (budgetTotal.indexOf("billion")>-1){
          budgetTotalInt = parseFloat(budgetTotal) * 1000000000;
          console.log(budgetTotalInt);
      }
      if (grossTotal.indexOf('million')>-1){
            grossTotalInt = parseFloat(grossTotal) * 1000000;
            console.log(grossTotalInt);
            
        }
        else if (grossTotal.indexOf("billion")>-1){
            grossTotalInt = parseFloat(grossTotal) * 1000000000;
            console.log(grossTotalInt);
        }
      
	  });

});



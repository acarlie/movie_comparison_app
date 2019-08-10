$(document).ready(function(){

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
var app = {
    addMovie(el){
        event.preventDefault();
        var movie = el.val();
        app.generateButtons(movie);
        el.val('');
    },
    generateButtons(movie){
        var button = $('<button>').addClass('waves-effect waves-light btn').text(movie).attr('data-id', movie);
        $('#addedMovies').prepend(button);
        console.log(button);
    },
    compare(){
        event.preventDefault();
        //generate comparison page
    }
}

$('#addMovie').keypress(function(e){
    var key = e.which;
    var el = $(this);
    if(key == 13){
        app.addMovie(el);
    } 
});

$('#compareMovies').on('click', app.compare);
// needs more work once HTML is finished
var movie = "trolls" 

var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    var ratingName = response.Ratings[0].Source;
    var ratingValue = response.Ratings[0].Value;
    console.log(response)
    console.log(ratingName);
    console.log(ratingValue);
    
});


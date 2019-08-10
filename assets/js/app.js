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


var app = {
    compare: false,
    addMovie(el){
        event.preventDefault();
        var movie = el.val();
        app.generateButtons(movie);
        el.val('');
    },
    generateButtons(movie){
        var wrap = $('<div>').addClass('movie-wrap').attr('data-id', movie);
        var title = $('<h4>').addClass('movie-title').text(movie);
        var btnDelete = $('<button>').addClass('waves-effect waves-teal btn-flat button-delete').html('<i class="material-icons">close</i>');
        wrap.append(title, btnDelete);
        $('#addedMovies').prepend(wrap);
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

$(document).on('click', '.button-delete', function(){
    event.preventDefault();
    $(this).parent().remove();
})

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


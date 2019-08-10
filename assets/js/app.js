var app = {
    compare: false,
    moviesArray:[],
    addMovie(el){
        event.preventDefault();
        var movie = el.val();
        this.moviesArray.push(movie);
        app.generateButtons(movie);
        el.val('');
    },
    deleteAddedMovie(){
        event.preventDefault();
        $(this).parent().remove();
        var dataId = $(this).parent().attr('data-id');
        app.moviesArray = app.arrayRemove(app.moviesArray, dataId);
    },
    arrayRemove(arr, value) {
        return arr.filter(function(ele){
            return ele != value;
        });
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
    },
    getOMDB(movie){ //so we can reuse this function using app.getOMDB(movie);
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
    }
}

$(document).on('click', '.button-delete', app.deleteAddedMovie);

$('#compareMovies').on('click', app.compare);
$('#addMovie').keypress(function(e){
    var key = e.which;
    var el = $(this);
    if(key == 13){
        app.addMovie(el);
    } 
});

// needs more work once HTML is finished
var movie = "Die Hard"; 

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


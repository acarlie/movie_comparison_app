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


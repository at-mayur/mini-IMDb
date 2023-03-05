// getting movie id from url
var queryString = location.search;

// fetch all elements to update their values
var movieImg = document.getElementById("movie-img");
var movieTitle = document.getElementById("movie-title");
var movieYear = document.getElementById("movie-year");
var movieDurr = document.getElementById("movie-durr");
var movieRating = document.getElementById("movie-rating");
var movieVotes = document.getElementById("movie-votes");
var moviePlot = document.getElementById("movie-plot");
var movieRelease = document.getElementById("movie-release");
var movieGenre = document.getElementById("movie-genre");
var movieDirector = document.getElementById("movie-director");
var movieWriter = document.getElementById("movie-writer");
var movieActors = document.getElementById("movie-actors");
var movieLanguages = document.getElementById("movie-languages");

// Search input field
var searchField = document.getElementById("search-movie");
// div holding search results
var searchResult = document.getElementById("search-movie-results");

// variables to display and hide search results
var elementInFocus = false;
var searchBarInFocus = false;

// load function to set curr movie info
function load(){

    // getting movie id from url of page
    let movieId = queryString.substring(1);

    // create new ajax request
    let xHttpReq = new XMLHttpRequest();

    // action after successful response
    xHttpReq.onload = function(){
        // get response data
        let data = JSON.parse(xHttpReq.response);

        // if response is true
        if(data.Response){

            // set movie poster
            movieImg.innerHTML = getMovieImg(data);
            // set movie title and other data
            movieTitle.innerHTML = data.Title;
            movieYear.innerHTML = data.Year;
            movieDurr.innerHTML = data.Runtime;
            movieRating.innerHTML = data.imdbRating;
            movieVotes.innerHTML = data.imdbVotes;
            moviePlot.innerHTML = data.Plot;
            movieRelease.innerHTML = data.Released;

            // set movie additional info directors, writers , actors, languages, genres
            movieGenre.innerHTML = getMovieGenres(data);
            movieDirector.innerHTML = getMovieDirectors(data);
            movieWriter.innerHTML = getMovieWriters(data);
            movieActors.innerHTML = getMovieActors(data);
            movieLanguages.innerHTML = getMovieLanguages(data);

        }

    };

    // create and send request to get movie data
    xHttpReq.open("get", `http://www.omdbapi.com/?apikey=3b0138d9&i=${movieId}`, false);
    xHttpReq.send();

};

// function returning movie poster item
function getMovieImg(movie){
    let imgSrc = `<img class="card-img-top h-75" src="" alt="${ movie.Title }">`;

    if(movie.Poster !== "N/A"){
        imgSrc = `<img class="img-fluid rounded-start w-100 h-100" src="${movie.Poster}" alt="${movie.Title}">`
    }
    
    return imgSrc;
}

// function returning movie director item
function getMovieDirectors(movie){
    // initiate component
    let directorComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Director </div>`;

    // get all names from list
    let directors = movie.Director.split(",");

    // create and concat item for every name
    for(let director of directors){
        let newStr = `
            <span>
                <a href="#" class="text-decoration-none text-primary txt-hover">
                    ${director.trim()}
                </a>
            </span>
            <span class="mx-2 fs-6 fw-bold">.</span>
        `;

        directorComponent += newStr;
    }
    
    // return whole component
    return directorComponent;
}

// function returning movie writer item
function getMovieWriters(movie){
    // initiate component
    let writerComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Writer </div>`;

    // get all names from list
    let writers = movie.Writer.split(",");

    // create and concat item for every name
    for(let writer of writers){
        let newStr = `
            <span>
                <a href="#" class="text-decoration-none text-primary txt-hover">
                    ${writer.trim()}
                </a>
            </span>
            <span class="mx-2 fs-6 fw-bold">.</span>
        `;

        writerComponent += newStr;
    }
    
    // return whole component
    return writerComponent;
}

// function returning movie actor item
function getMovieActors(movie){
    // initiate component
    let actorComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Actors </div>`;

    // get all names from list
    let actors = movie.Actors.split(",");

    for(let actor of actors){
        let newStr = `
            <span>
                <a href="#" class="text-decoration-none text-primary txt-hover">
                    ${actor.trim()}
                </a>
            </span>
            <span class="mx-2 fs-6 fw-bold">.</span>
        `;

        actorComponent += newStr;
    }
    
    // return whole component
    return actorComponent;
}

// function returning movie lamguages item
function getMovieLanguages(movie){
    let languageComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Languages </div>`;

    let languages = movie.Language.split(",");

    for(let lang of languages){
        let newStr = `
            <span>
                <a href="#" class="text-decoration-none text-primary txt-hover">
                    ${lang.trim()}
                </a>
            </span>
            <span class="mx-2 fs-6 fw-bold">.</span>
        `;

        languageComponent += newStr;
    }
    
    return languageComponent;
}

// function returning movie genre item
function getMovieGenres(movie){
    let genreComponent = ``;

    let genres = movie.Genre.split(",");

    for(let gen of genres){
        let newStr = `
            <a href="#" class="text-white text-decoration-none p-1 border rounded-pill mx-1">${gen.trim()}</a>
        `;

        genreComponent += newStr;
    }
    
    return genreComponent;
}




// focus in event for Search input field
searchField.addEventListener("focusin", function(e){

    // display search results div if Search input field has some value
    if(searchField.value.length>0){
        searchResult.style.display = "block";
    }
    else{
        searchResult.style.display = "none";
    }

    // set variable
    searchBarInFocus = true;

});

// focus out event for Search input field
searchField.addEventListener("focusout", function(e){

    // make search bar focus var false
    searchBarInFocus = false;

    // if elementInFocus is true do nothing
    if(elementInFocus){
        return;
    }

    // otherwise hide search results
    searchResult.style.display = "none";

});

// if mouse is over search results
searchResult.onmouseover = function(){
    elementInFocus = true;
};

// if mouse is not over search results
searchResult.onmouseout = function(){
    elementInFocus = false;

    // if input field is out of focus then hide search results
    if(!searchBarInFocus){
        searchResult.style.display = "none";
    }
};


// event listener for search input field
searchField.addEventListener("input", function(e){

    // display search results only if value of search input field is present
    if(searchField.value.length>0){
        searchResult.style.display = "block";
    }
    else{
        searchResult.style.display = "none";
    }

    // create new ajax request
    let xHttpReq = new XMLHttpRequest();

    xHttpReq.onload = function(){
        let data = JSON.parse(xHttpReq.response);

        // if we get response true then display search results
        if(data.Response==="True"){

            let htmlContent = "";

            for(let movie of data.Search){
                // append every search result to htmlcontent
                htmlContent += getResultItem(movie);
            }

            // set innerHtml of search result div
            searchResult.innerHTML = htmlContent;

            // add event listeners to fav buttons
            for(let movie of data.Search){
                let favBtn = document.getElementById(`add-fav-${movie.imdbID}`);
                addFavourite(favBtn);
            }

        }
        else{
            // if response is false then display msg received
            searchResult.innerHTML = `
            <div class="search-results-item rounded p-2">
                ${data.Error}
            </div>
        `;
        }

    };

    xHttpReq.open("get", `http://www.omdbapi.com/?apikey=3b0138d9&s="${searchField.value}"`, false);
    xHttpReq.send();

});


// function to add event listener to fav btns
function addFavourite(addFavBtn){

    addFavBtn.addEventListener("click", function(event){
        event.preventDefault();

        // get movies list from local storage if present else create new array
        let movieData = localStorage.getItem("favMovies");
        let favMovies = movieData==undefined ? []:JSON.parse(movieData);

        // if movie is not present in list then add
        let index = favMovies.indexOf(addFavBtn.id.split("-")[2]);
        if(index===-1){
            favMovies.push(addFavBtn.id.split("-")[2]);
        }

        // if already present then
        localStorage.setItem("favMovies", JSON.stringify(favMovies));
        addFavBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

    });

}

// function returning search result item for each movie result
function getResultItem(movie){
    let imgSrc = "";

    if(movie.Poster !== "N/A"){
        imgSrc = `
            <div class="me-1">
                <img class="movie-poster" src="${ movie.Poster }" >
            </div>
        `;
    }
    
    let htmlItem = `
        <div class="search-results-item rounded p-2">
            <a href="movie.html?${ movie.imdbID }" target="_blank" class="search-prediction-details text-decoration-none">
                <div class="d-flex align-items-center">
                    ${ imgSrc }
                    <div>
                        <p class="mb-1">${ movie.Title }</p>
                        <p class="mb-1">${ movie.Year }</p>
                    </div>
                </div>
            </a>
            <a id="add-fav-${ movie.imdbID }" href="#" class="search-prediction-heart text-center fav-heart text-decoration-none">
                <i class="fa-regular fa-heart"></i>
            </a>
        </div>
    `;

    return htmlItem;

}

// calling load function
load();
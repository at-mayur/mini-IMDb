var queryString = location.search;
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

var searchField = document.getElementById("search-movie");
var searchResult = document.getElementById("search-movie-results");

var elementInFocus = false;
var searchBarInFocus = false;


function load(){

    let movieId = queryString.substring(1);

    let xHttpReq = new XMLHttpRequest();

    xHttpReq.onload = function(){
        let data = JSON.parse(xHttpReq.response);

        if(data.Response){

            movieImg.innerHTML = getMovieImg(data);
            movieTitle.innerHTML = data.Title;
            movieYear.innerHTML = data.Year;
            movieDurr.innerHTML = data.Runtime;
            movieRating.innerHTML = data.imdbRating;
            movieVotes.innerHTML = data.imdbVotes;
            moviePlot.innerHTML = data.Plot;
            movieRelease.innerHTML = data.Released;
            movieGenre.innerHTML = getMovieGenres(data);
            movieDirector.innerHTML = getMovieDirectors(data);
            movieWriter.innerHTML = getMovieWriters(data);
            movieActors.innerHTML = getMovieActors(data);
            movieLanguages.innerHTML = getMovieLanguages(data);

        }

    };

    xHttpReq.open("get", `http://www.omdbapi.com/?apikey=3b0138d9&i=${movieId}`, false);
    xHttpReq.send();

};


function getMovieImg(movie){
    let imgSrc = "";

    if(movie.Poster){
        imgSrc = `<img class="img-fluid rounded-start w-100 h-100" src="${movie.Poster}" alt="${movie.Title}">`
    }
    
    return imgSrc;
}

function getMovieDirectors(movie){
    let directorComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Director </div>`;

    let directors = movie.Director.split(",");

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
    
    return directorComponent;
}

function getMovieWriters(movie){
    let writerComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Writer </div>`;

    let writers = movie.Writer.split(",");

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
    
    return writerComponent;
}

function getMovieActors(movie){
    let actorComponent = `<div class="me-2 mb-2 fs-6 fw-bold">Actors </div>`;

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
    
    return actorComponent;
}

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





searchField.addEventListener("focusin", function(e){

    if(searchField.value.length>0){
        searchResult.style.display = "block";
    }
    else{
        searchResult.style.display = "none";
    }

    searchBarInFocus = true;

});

searchField.addEventListener("focusout", function(e){

    searchBarInFocus = false;

    if(elementInFocus){
        return;
    }

    searchResult.style.display = "none";

});

searchResult.onmouseover = function(){
    elementInFocus = true;
};

searchResult.onmouseout = function(){
    elementInFocus = false;

    if(!searchBarInFocus){
        searchResult.style.display = "none";
    }
};


searchField.addEventListener("input", function(e){

    if(searchField.value.length>0){
        searchResult.style.display = "block";
    }
    else{
        searchResult.style.display = "none";
    }

    let xHttpReq = new XMLHttpRequest();

    xHttpReq.onload = function(){
        let data = JSON.parse(xHttpReq.response);

        if(data.Search){

            let htmlContent = "";

            for(let movie of data.Search){
                htmlContent += getResultItem(movie);
            }

            searchResult.innerHTML = htmlContent;

            for(let movie of data.Search){
                let favBtn = document.getElementById(`add-fav-${movie.imdbID}`);
                addFavourite(favBtn);
            }

        }

    };

    xHttpReq.open("get", `http://www.omdbapi.com/?apikey=3b0138d9&s="${searchField.value}"`);
    xHttpReq.send();

});



function addFavourite(addFavBtn){

    addFavBtn.addEventListener("click", function(event){
        event.preventDefault();

        let movieData = localStorage.getItem("favMovies");
        let favMovies = movieData==undefined ? []:JSON.parse(movieData);

        let index = favMovies.indexOf(addFavBtn.id.split("-")[2]);
        if(index===-1){
            favMovies.push(addFavBtn.id.split("-")[2]);
        }

        localStorage.setItem("favMovies", JSON.stringify(favMovies));
        addFavBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

    });

}


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

load();
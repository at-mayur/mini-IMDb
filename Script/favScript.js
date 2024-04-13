var favMovieList = document.getElementById("fav-movies-lst");

// Search input field
var searchField = document.getElementById("search-movie");
// div holding search results
var searchResult = document.getElementById("search-movie-results");

// variables to display and hide search results
var elementInFocus = false;
var searchBarInFocus = false;

let apiRequest2;

// load function to set fav movies
function load(){
    // get favourite movies list from local storage
    let favMovies = JSON.parse(localStorage.getItem("favMovies"));

    let htmlContent = "";

    // for each movie id of list
    for(let movieId of favMovies){

        // create new ajax request
        let apiRequest = new XMLHttpRequest();

        apiRequest.onload = function(){
            let data = JSON.parse(apiRequest.response);

            if(data.Response){

                // add movie item to the htmlContent
                htmlContent += getMovieItem(data);

            }

        };

        // create and send request to get data of that movie
        apiRequest.open("get", `https://www.omdbapi.com/?apikey=3b0138d9&i=${movieId}`, false);
        apiRequest.send();

    }

    // set inner html of div holding list i.e. add all fav movies to display
    favMovieList.innerHTML = htmlContent;

    for(let movieId of favMovies){
        // add listener to remove btns
        removeItemEvent(movieId);
    }
};


// function to add event listener on remove from fav
function removeItemEvent(movieId){
    // fetch remove btn
    let rmBtn = document.getElementById(`fav-remove-${movieId}`);

    // click event listener for rm btn
    rmBtn.onclick = function(e){
        // prevent default action
        e.preventDefault();

        // get movies list from local storage if present
        let movieData = localStorage.getItem("favMovies");
        let favMovies = JSON.parse(movieData);

        // if movie is not present in list then do nothing
        let index = favMovies.indexOf(rmBtn.id.split("-")[2]);
        if(index===-1){
            return;
        }

        // if already present then
        favMovies.splice(index, 1);
        localStorage.setItem("favMovies", JSON.stringify(favMovies));
        document.getElementById(`fav-movie-${movieId}`).remove();

    };
}



// function returning fav movie item
function getMovieItem(movie){

    let imgSrc = `<img class="card-img-top h-75" src="" alt="${ movie.Title }">`;

    // if poster is present then add it to display
    if(movie.Poster !== "N/A"){
        imgSrc = `<img class="card-img-top h-75" src="${ movie.Poster }" alt="${ movie.Title }">`;
    }
    let htmlContent = `

        <div id="fav-movie-${movie.imdbID}" class="col-6 col-md-4 mb-3">

            <div class="card text-bg-dark" style="height: 90vh;">
                ${imgSrc}
                <div class="card-body">
                    <h5 class="card-title">${ movie.Title }</h5>
                    <div class="card-text d-flex justify-content-between">
                        <p>
                            <span class="text-warning"><i class="fa-solid fa-star"></i></span>
                            ${ movie.imdbRating }
                        </p>
                        <a class="text-white txt-shadow" href="#" style="text-decoration: none;">
                            <i class="fa-regular fa-star"></i>
                            <span class="ms-2">Rate</span>
                        </a>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <a class="text-white txt-shadow" href="#">
                        <i class="fa-solid fa-play"></i>
                        <span class="ms-2">Trailer</span>
                        
                    </a>
                    <a id="fav-remove-${movie.imdbID}" href="#" class="btn btn-danger d-block">
                        <i class="fa-solid fa-trash-can"></i>
                        Remove
                    </a>
                </div>
            </div>

        </div>
    
    `;

    return htmlContent;
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

    if(apiRequest2){
        apiRequest2.abort();
    }

    // create new ajax request
    apiRequest2 = new XMLHttpRequest();

    apiRequest2.onload = function(){
        let data = JSON.parse(apiRequest2.response);

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

    apiRequest2.open("get", `https://www.omdbapi.com/?apikey=3b0138d9&s="${searchField.value}"`);
    apiRequest2.send();

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
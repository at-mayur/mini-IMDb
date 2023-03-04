var favMovieList = document.getElementById("fav-movies-lst");

var searchField = document.getElementById("search-movie");
var searchResult = document.getElementById("search-movie-results");

var elementInFocus = false;
var searchBarInFocus = false;

function load(){
    let favMovies = JSON.parse(localStorage.getItem("favMovies"));

    let htmlContent = "";

    for(let movieId of favMovies){

        let xHttpReq = new XMLHttpRequest();

        xHttpReq.onload = function(){
            let data = JSON.parse(xHttpReq.response);

            if(data.Response){

                htmlContent += getMovieItem(data);

            }

        };

        xHttpReq.open("get", `http://www.omdbapi.com/?apikey=3b0138d9&i=${movieId}`, false);
        xHttpReq.send();

    }

    favMovieList.innerHTML = htmlContent;
};


function getMovieItem(movie){

    let imgSrc = "";

    if(movie.Poster){
        imgSrc = `<img class="card-img-top h-75" src="${ movie.Poster }" alt="${ movie.Title }">`
    }
    let htmlContent = `

        <div class="col-6 col-md-4 mb-3">

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
                <div class="card-footer d-flex justify-content-around">
                    <a class="text-white txt-shadow" href="#">
                        <i class="fa-solid fa-play"></i>
                        <span class="ms-2">Trailer</span>
                        
                    </a>
                </div>
            </div>

        </div>
    
    `;

    return htmlContent;
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
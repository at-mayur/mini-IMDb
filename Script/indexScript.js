
// Search input field
var searchField = document.getElementById("search-movie");
// div holding search results
var searchResult = document.getElementById("search-movie-results");

// variables to display and hide search results
var elementInFocus = false;
var searchBarInFocus = false;

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
    // set var false
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
        return;
    }

    // create new ajax request
    let xHttpReq = new XMLHttpRequest();

    // action to perform after getting successful response
    xHttpReq.onload = function(){
        // get data from response
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

    // create new ajax request
    xHttpReq.open("get", `https://www.omdbapi.com/?apikey=3b0138d9&s="${searchField.value}"`, false);

    // send request
    xHttpReq.send();

});


// function to add event listener to fav btns
function addFavourite(addFavBtn){

    // click event listener for fav btn
    addFavBtn.addEventListener("click", function(event){
        // prevent default action
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

    // if poster is available then create img tag otherwise display no poster
    if(movie.Poster !== "N/A"){
        imgSrc = `
            <div class="me-1">
                <img class="movie-poster" src="${ movie.Poster }" >
            </div>
        `;
    }
    
    // creating element with respective values
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
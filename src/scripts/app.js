import "../styles/app.scss";

import { getPromiseDataFromArray, flatten } from "./helpers";

(function() {
  function fetchFlickrPhotos(query) {
    let searchString = encodeURIComponent(query);
    let page = 1;
    let resultsPerPage = 10;
    let tags = encodeURI(query);
    let license = encodeURIComponent("4,5,6,9,10");
    let flickrAPIkey = process.env.FLICKR_API_KEY;

    /** License numbers
     * 4 = Attribution License               https://creativecommons.org/licenses/by/2.0/" />
     * 5 = Attribution-ShareAlike License    https://creativecommons.org/licenses/by-sa/2.0/" />
     * 6 = Attribution-NoDerivs License      https://creativecommons.org/licenses/by-nd/2.0/" />
     * 9 = Public Domain Dedication (CC0)    https://creativecommons.org/publicdomain/zero/1.0/" />
     * 10 = Public Domain Mark               https://creativecommons.org/publicdomain/mark/1.0/" />
     **/

    let resourceUrl = `https://api.flickr.com/services/rest?sort=relevance&parse_tags=1&content_type=7&license=${
      license
    }&method=flickr.photos.search&api_key=${flickrAPIkey}`;

    let flickrQueryParams = `&text=${searchString}&content_type=1&per_page=${
      resultsPerPage
    }&tags=${tags}&privacy_filter=1&safe_search=1&extras=url_m&format=json&nojsoncallback=1`;

    let flickrUrl = `${resourceUrl}${flickrQueryParams}`;

    return fetch(flickrUrl); // Returnerar ett promise
  }

  function fetchWordlabWords(query) {
    let wordLabAPIkey = process.env.BHT_API_KEY;
    let wordLabUrl = `https://words.bighugelabs.com/api/2/${wordLabAPIkey}/${
      query
    }/json`;

    return fetch(wordLabUrl); // Returnerar ett promise
  }

  let searchBtn = document.querySelector(".search-btn");

  searchBtn.addEventListener("click", onSearch);

  function onSearch(event, searchquery=null) { // Send in a searchquery so we can use the words on the sidebar for search
    event.preventDefault(); // prevent the form from reloading the page, since it's now a form element
    let query = searchquery ? searchquery : event.currentTarget.form.elements[0].value; // check if there is a searchquery, then use that as value, else use the value you write in the inputfield. 

    let apiCalls = [
      // En array that contains our promises
      fetchFlickrPhotos(query), 
      fetchWordlabWords(query) 
    ];

    // Return a promise!
    getPromiseDataFromArray(apiCalls)
      .then(res => {
        renderFlickrPhotos(res[0]); // First element will always be flickr data
        renderSidebarSuggestions(res[1]); // Second element will always be bht data
      })
      .catch(reason => {
        console.log(reason);
        let errormessage = document.querySelector(".results ul");
        errormessage.innerHTML = `<li  class="result"><h3>${reason}<h3></li>` 

            // Todo: Show error message to user
      });
  }

  function renderFlickrPhotos(flickrData) {
    let resultHolder = document.querySelector(".results ul");
    resultHolder.innerHTML = "";

    flickrData.photos.photo.map(photo => {
      let liEl = document.createElement("li");
      liEl.style.backgroundImage = `url(${photo.url_m})`;
      liEl.classList.add("result");

      resultHolder.appendChild(liEl);
      // 1. Create an li element
      // 2. Set the background-image property liEl.style.backgroundImage = `${photo.url_o}`
      // 3. Maybe create a p element
      // 4. liEl.appenChild(pEl);
      // 5. document.querySelector('.results ul').appendChild(liEl);
    });
  }

  function renderSidebarSuggestions(bhtData) {
    let words = bhtData.noun.syn;
    
    words = flatten(words);

    const frag = document.createDocumentFragment();


   words.forEach(word => {

    let liEl = document.createElement('li');
    let aEl =  document.createElement('a');

    liEl.addEventListener('click', (e) => onSearch(e, word)); 
   
    liEl.classList.add("sidebar"); 
    
    aEl.href = "#";
    aEl.textContent = word;

    liEl.appendChild(aEl);
    frag.appendChild(liEl);
   
  }); 


    const sidebarWordHolder = document.querySelector('aside ul');
    sidebarWordHolder.innerHTML = "";

    sidebarWordHolder.appendChild(frag);
    //aEl.href.appendChild(liEl); 
 

    // 0. Massage the bhtData (suggestion: make it into an array of strings, easier that way)
    // 1. Create an li element
    // 2. Set the background-image property liEl.style.backgroundImage = `${photo.url_o}`
    // 3. Maybe create a p element
    // 4. liEl.appenChild(pEl);
    // 5. document.querySelector('.results ul').appendChild(liEl);
  }
})();
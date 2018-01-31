import "../styles/app.scss";

import { getPromiseDataFromArray } from "./helpers";

(function() {
  function fetchFlickrPhotos(query) {
    let searchString = encodeURIComponent(query);
    let page = 1;
    let resultsPerPage = 10;
    let tags = encodeURI(query);
    let license = encodeURIComponent('4,5,6,9,10');
    let flickrAPIkey = process.env.FLICKR_API_KEY;

    /** License numbers
    * 4 = Attribution License               https://creativecommons.org/licenses/by/2.0/" />
    * 5 = Attribution-ShareAlike License    https://creativecommons.org/licenses/by-sa/2.0/" />
    * 6 = Attribution-NoDerivs License      https://creativecommons.org/licenses/by-nd/2.0/" />
    * 9 = Public Domain Dedication (CC0)    https://creativecommons.org/publicdomain/zero/1.0/" />
    * 10 = Public Domain Mark               https://creativecommons.org/publicdomain/mark/1.0/" />
    **/

    let resourceUrl =
      `https://api.flickr.com/services/rest?sort=relevance&parse_tags=1&content_type=7&license=${license}&method=flickr.photos.search&api_key=${flickrAPIkey}`

    let flickrQueryParams =
      `&text=${searchString}&content_type=1&per_page=${resultsPerPage}&tags=${tags}&privacy_filter=1&extras=url_o&format=json&nojsoncallback=1`;
    
    let flickrUrl = `${resourceUrl}${flickrQueryParams}`;


    return fetch(flickrUrl);
  }


  function fetchWordlabWords(query) {
    let wordLabAPIkey = process.env.BHT_API_KEY;
    let wordLabUrl = `https://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`;
      
           // res.noun.syn.map(function(result){ 

        //   console.log(res.noun.syn); }

    return fetch(wordLabUrl);
  };


  let searchBtn = document.querySelector('.search-btn');
  
  searchBtn.addEventListener('click', onSearch);

  function onSearch(event) {
    event.preventDefault();
      // prevent the form from reloading the page, since it's now a form element
    let query = event.currentTarget.form.elements[0].value;
    // if (!query.length){  Lägg till om söket är tomt. 
    //   return; // Can't search on nothing
    //   }
    //fetchWordlabWords(query); 

    let apiCalls = [
      fetchFlickrPhotos(query), // this is a promise
      fetchWordlabWords(query) // this is also a promise
    ];

    // Returnerar ett promise!
    getPromiseDataFromArray(apiCalls)
      .then((res) => {
        renderFlickrPhotos(res[0]); // First element will always be flickr data
        renderSidebarSuggestions(res[1]); // Second element will always be bht data
      });
  }

  function renderFlickrPhotos(flickrData) {
    document.querySelector('.results ul').innerHTML = "";
    
    flickrData.photos.photo.map((photo) => {
      let liEl = document.createElement('li');
      let imgEl = document.createElement('img');
      
      imgEl.src = photo.url_o;
      liEl.appendChild(imgEl);
      liEl.classList.add('result');

      document.querySelector('.results ul').appendChild(liEl);
      // 1. Create an li element
      // 2. Set the background-image property liEl.style.backgroundImage = `${photo.url_o}`
      // 3. Maybe create a p element
      // 4. liEl.appenChild(pEl);
      // 5. document.querySelector('.results ul').appendChild(liEl);
    });
  }

  function renderSidebarSuggestions(bhtData) {
      // 0. Massage the bhtData (suggestion: make it into an array of strings, easier that way)
      // 1. Create an li element
      // 2. Set the background-image property liEl.style.backgroundImage = `${photo.url_o}`
      // 3. Maybe create a p element
      // 4. liEl.appenChild(pEl);
      // 5. document.querySelector('.results ul').appendChild(liEl);
  }

})(); 
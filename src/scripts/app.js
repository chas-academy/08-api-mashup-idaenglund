import "../styles/app.scss";


//import { getPromiseDataFromArray } from "./helpers"; 

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
   

    fetch(flickrUrl)
      .then(res => res.json())
      .then(res => {
  
        return fetch(flickrUrl);
        // Promise

      })

      .catch(err => (err));
  }


  function fetchWordlabWords(query) {
    let wordLabAPIkey = process.env.BHT_API_KEY;
    debugger; 
    let wordLabUrl = `https://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`;
      


    fetch(wordLabUrl)
      .then(res => res.json())
      .then(res => {
        
        
        return fetch(wordLabUrl)
        // res.noun.syn.map(function(result){ 

        //   console.log(res.noun.syn); 
       
        // })
      })
      .catch(err => (err));
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

    let apiCAlls = [
      fetchFlickrPhotos(query), // this is a promise
      fetchWordlabWords(query) // this is also a promise
    ];

    Promise.all(apiCAlls)
    .then((res) => {
      return res.map(type => type.json());
    })
    .catch(reject); 
  }  
})(); 
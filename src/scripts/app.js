import "../styles/app.scss";
import { debug } from "util";

(function() {
  function fetchFlickrPhotos(query) {
    let searchString = encodeURIComponent(query);
    let page = 1;
    let resultsPerPage = 10;
    let tags = encodeURI(query);
    let license = encodeURIComponent('4,5,6,9,10');
    let flickrAPIkey = "18e13a01f3ad5cfa61400cf85e329ac4";

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

        console.log(res.noun.syn);
        
        //fetchFlickrPhotos(res);   

        //document.getElementById("imageid").src="../template/save.png";

      })

      .catch(err => (err));
  }


  function fetchWordlabWords(query) {
    let wordLabAPIkey = "fac5a1c372ca65318eaaa1c3b0548d69";
    let wordLabUrl = `https://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`;
      


    fetch(wordLabUrl)
      .then(res => res.json())
      .then(res => {
  
        res.noun.syn.map(function(result){ 

          console.log(res.noun.syn); 
          /*let li = document.createElement('li'),
          h3 = document.createElement('h3'); 

        li.innerHTML = ` <p>${res.noun.syn}</p>`

        li.appendChild('h3'); 
        document.getElementsByClassName('results').appendChild('li')
        */

          })
    
      })
      .catch(err => console.error(err));
  }

  // fetchWordlabWords("detest"); 

  let searchBtn = document.querySelector('.search-btn');
  
  searchBtn.addEventListener('click', onSearch);

  function onSearch(event) {
    event.preventDefault(); // prevent the form from reloading the page, since it's now a form element
    let searchString = event.currentTarget.form.elements[0].value;
    fetchWordlabWords(searchString); 

  }
})();

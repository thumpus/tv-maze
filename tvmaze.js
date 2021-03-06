"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  return response.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.show.image.medium}" 
              alt="${show.show.name} 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="epButton" id="${show.show.id}">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", ".epButton", async function(evt){
  let showId = evt.target.id;
  let episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
})
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodeResults = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  return episodeResults.data.map(e => ({
    name: e.name,
    season: e.season,
    number: e.number,
  }));
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty();
  for (let episode of episodes) {
    const $item = 
         $(`<li>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`)
         ;
    $episodesList.append($item);
  }
  $episodesArea.show();
  
}

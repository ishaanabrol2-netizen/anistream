# script.js

```javascript
/* =========================
LIVE WATCHERS
========================= */

const watchingCount =
document.getElementById("watchingCount");

function updateWatching(){

const viewers =
Math.floor(
Math.random() * 10000
) + 20000;

if(watchingCount){

watchingCount.innerHTML =
`${viewers.toLocaleString()} watching now`;

}

}

setInterval(updateWatching,3000);

/* =========================
MOUSE GLOW EFFECT
========================= */

const mouseGlow =
document.getElementById("mouseGlow");

if(mouseGlow){

document.addEventListener("mousemove",(e)=>{

mouseGlow.style.left =
`${e.clientX}px`;

mouseGlow.style.top =
`${e.clientY}px`;

});

}

/* =========================
INDEX PAGE ELEMENTS
========================= */

const animeRow =
document.getElementById("animeRow");

const airingRow =
document.getElementById("airingRow");

const trendingList =
document.getElementById("trendingList");

const trailerModal =
document.getElementById("trailerModal");

const trailerFrame =
document.getElementById("trailerFrame");

const closeBtn =
document.getElementById("closeBtn");

/* =========================
CREATE ANIME CARD
========================= */

function createAnimeCard(anime){

const loves =
Math.floor(
Math.random() * 900
) + 100;

const card =
document.createElement("div");

card.classList.add("card");

card.innerHTML = `

<img src="${anime.images.jpg.large_image_url}">

<div class="love">
❤️ ${loves}K
</div>

<div class="score">
⭐ ${anime.score || "N/A"}
</div>

<div class="play-btn">
▶
</div>

<div class="card-info">

<h3>
${anime.title}
</h3>

<p>
${anime.type || "TV"}
</p>

</div>

`;

card.onclick = ()=>{

window.location.href =
`watch.html?id=${anime.mal_id}`;

};

return card;

}

/* =========================
LOAD HOMEPAGE ANIME
========================= */

async function loadAnime(){

if(!animeRow) return;

animeRow.innerHTML = "";
airingRow.innerHTML = "";
trendingList.innerHTML = "";

const topRes = await fetch(
"https://api.jikan.moe/v4/top/anime?limit=20"
);

const topData = await topRes.json();

const airingRes = await fetch(
"https://api.jikan.moe/v4/seasons/now"
);

const airingData = await airingRes.json();

/* TRENDING CARDS */

topData.data.forEach((anime)=>{

animeRow.appendChild(
createAnimeCard(anime)
);

});

/* AIRING */

airingData.data.slice(0,12).forEach((anime)=>{

const card =
document.createElement("div");

card.classList.add("airing-card");

card.innerHTML = `

<img src="${anime.images.jpg.large_image_url}">

<div class="airing-details">

<h3>
${anime.title}
</h3>

<p>
${anime.broadcast?.time || "Today"}
</p>

<div class="ep-badge">

EP ${anime.episodes || "??"}

</div>

</div>

`;

card.onclick = ()=>{

window.location.href =
`watch.html?id=${anime.mal_id}`;

};

airingRow.appendChild(card);

});

/* RIGHT TRENDING */

topData.data.slice(0,10).forEach((anime,index)=>{

const item =
document.createElement("div");

item.classList.add("trend-item");

item.innerHTML = `

<div class="rank">
${String(index + 1).padStart(2,'0')}
</div>

<div class="trend-thumb">

<img src="${anime.images.jpg.large_image_url}">

</div>

<div class="trend-info">

<h3>
${anime.title}
</h3>

<p>
⭐ ${anime.score || "N/A"}
</p>

</div>

<div class="trend-score">
#${anime.rank}
</div>

`;

item.onclick = ()=>{

window.location.href =
`watch.html?id=${anime.mal_id}`;

};

trendingList.appendChild(item);

});

}

loadAnime();

/* =========================
SEARCH SYSTEM
========================= */

const searchInput =
document.getElementById("searchInput");

const searchPanel =
document.getElementById("searchPanel");

const searchResults =
document.getElementById("searchResults");

if(searchInput){

searchInput.addEventListener("input", async ()=>{

const query =
searchInput.value.trim();

if(query.length < 2){

searchPanel.style.display =
"none";

return;

}

const response = await fetch(
`https://api.jikan.moe/v4/anime?q=${query}&limit=12`
);

const data = await response.json();

searchResults.innerHTML = "";

searchPanel.style.display =
"block";

if(data.data){


data.data.forEach((anime)=>{

searchResults.appendChild(
createAnimeCard(anime)
);

});

}

});

}

/* =========================
WATCH PAGE
========================= */

async function loadWatchPage(){

const params =
new URLSearchParams(
window.location.search
);

const id = params.get("id");

if(!id) return;

const titleEl =
document.getElementById("title");

if(!titleEl) return;

const synopsisEl =
document.getElementById("synopsis");

const genresEl =
document.getElementById("genres");

const metaEl =
document.getElementById("meta");

const player =
document.getElementById("player");

const episodesEl =
document.getElementById("episodes");

const recommendations =
document.getElementById("recommendations");

const stats =
document.getElementById("stats");

const bg =
document.getElementById("bg");

const response = await fetch(
`https://api.jikan.moe/v4/anime/${id}/full`
);

const anime =
(await response.json()).data;

if(bg){

bg.style.backgroundImage =
`url(${anime.images.jpg.large_image_url})`;

}

titleEl.innerHTML =
anime.title;

metaEl.innerHTML = `

<div class="meta-item">
⭐ ${anime.score || "N/A"}
</div>

<div class="meta-item">
🎬 ${anime.type || "TV"}
</div>

<div class="meta-item">
📺 ${anime.episodes || "??"} Episodes
</div>

<div class="meta-item">
🔥 ${anime.status || "Airing"}
</div>

<div class="meta-item">
📅 ${anime.year || "Unknown"}
</div>

`;

synopsisEl.innerHTML =
anime.synopsis || "No synopsis available.";

anime.genres.forEach((genre)=>{

const div =
document.createElement("div");

div.classList.add("genre");

div.innerHTML =
genre.name;

genresEl.appendChild(div);

});

if(player){

player.src =
anime.trailer.embed_url ||
"https://www.youtube.com/embed/dQw4w9WgXcQ";

}

const totalEpisodes =
anime.episodes || 12;

for(let i=1;i<=Math.min(totalEpisodes,50);i++){

const ep =
document.createElement("div");

ep.classList.add("ep");

ep.innerHTML = `

<div class="ep-title">
Episode ${i}
</div>

<div class="ep-desc">
Watch episode ${i}
</div>

`;

ep.onclick = ()=>{

window.location.href =
`player.html?id=${id}&ep=${i}`;

};

episodesEl.appendChild(ep);

}

const recResponse = await fetch(
`https://api.jikan.moe/v4/anime/${id}/recommendations`
);

const recData =
(await recResponse.json()).data;

recData.slice(0,12).forEach((rec)=>{

const card =
document.createElement("div");

card.classList.add("recommend-card");

card.innerHTML = `

<img src="${rec.entry.images.jpg.large_image_url}">

<div class="recommend-info">

<h3>
${rec.entry.title}
</h3>

</div>

`;

card.onclick = ()=>{

window.location.href =
`watch.html?id=${rec.entry.mal_id}`;

};

recommendations.appendChild(card);

});

if(stats){

stats.innerHTML = `

<div class="comment">
<div class="comment-user">
⭐ Score
</div>
<div class="comment-text">
${anime.score || "N/A"}
</div>
</div>

<div class="comment">
<div class="comment-user">
🏆 Rank
</div>
<div class="comment-text">
#${anime.rank || "N/A"}
</div>
</div>

<div class="comment">
<div class="comment-user">
❤️ Favorites
</div>
<div class="comment-text">
${anime.favorites?.toLocaleString() || "N/A"}
</div>
</div>

`;

}

}

loadWatchPage();

/* =========================
PLAYER PAGE
========================= */

async function loadPlayerPage(){

const playerPage =
document.getElementById("playerPage");

if(!playerPage) return;

const params =
new URLSearchParams(
window.location.search
);

const id = params.get("id") || "5114";

const ep = params.get("ep") || "1";

const player =
document.getElementById("player");

const titleEl =
document.getElementById("title");

const metaEl =
document.getElementById("meta");

const descEl =
document.getElementById("description");

const genresEl =
document.getElementById("genres");

const episodesEl =
document.getElementById("episodes");

const nextAnime =
document.getElementById("nextAnime");

const response = await fetch(
`https://api.jikan.moe/v4/anime/${id}/full`
);

const anime =
(await response.json()).data;

player.src =
anime.trailer.embed_url ||
"https://www.youtube.com/embed/dQw4w9WgXcQ";

titleEl.innerHTML =
`${anime.title} — Episode ${ep}`;

metaEl.innerHTML = `

<div class="meta-item">
⭐ ${anime.score || "N/A"}
</div>

<div class="meta-item">
📺 ${anime.episodes || "??"} Episodes
</div>

<div class="meta-item">
🎬 ${anime.type || "TV"}
</div>

<div class="meta-item">
🔥 ${anime.status || "Airing"}
</div>

`;

descEl.innerHTML =
anime.synopsis || "No synopsis available.";

anime.genres.forEach((genre)=>{

const div =
document.createElement("div");

div.classList.add("genre");

div.innerHTML =
genre.name;

genresEl.appendChild(div);

});

const totalEpisodes =
anime.episodes || 12;

for(let i=1;i<=Math.min(totalEpisodes,60);i++){

const card =
document.createElement("div");

card.classList.add("ep");

if(i == ep){

card.classList.add("active");

}

card.innerHTML = `

<div class="ep-title">
Episode ${i}
</div>

<div class="ep-desc">
Watch episode ${i}
</div>

`;

card.onclick = ()=>{

window.location.href =
`player.html?id=${id}&ep=${i}`;

};

episodesEl.appendChild(card);

}

const recRes = await fetch(
`https://api.jikan.moe/v4/anime/${id}/recommendations`
);

const recData =
(await recRes.json()).data;

if(recData.length > 0){

const rec =
recData[0].entry;

nextAnime.innerHTML = `

<img src="${rec.images.jpg.large_image_url}">

<div class="next-info">

<h3>
${rec.title}
</h3>

<p>
Recommended anime based on your current watch.
</p>

</div>

`;

nextAnime.onclick = ()=>{

window.location.href =
`player.html?id=${rec.mal_id}`;

};

}

}

loadPlayerPage();

/* =========================
TRAILER MODAL CLOSE
========================= */

if(closeBtn){

closeBtn.onclick = ()=>{

trailerModal.style.display =
"none";

trailerFrame.src = "";

};

}

```

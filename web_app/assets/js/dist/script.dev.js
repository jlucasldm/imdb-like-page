"use strict";

//valores da api
var api_Key = '77e69574c201600a6f9114b3eb3478d0';
var moviesUrl = 'https://api.themoviedb.org/3/search/movie?api_key=77e69574c201600a6f9114b3eb3478d0&query=';
var imagesUrl = 'https://image.tmdb.org/t/p/w342'; //selecionando o elemento de entrada da barra de busca

var searchButton = document.querySelector('#search'); //botão da barra de pesquisa

var inputElement = document.querySelector('#searchBar'); //barra de busca

var movieContainer = document.querySelector('#movieContainer'); //div que contem os filmes
//const imageElement = document.querySelector('img')
//gerando url dos trailers (ainda em idioma ingles)

function generateTrailerUrl(movieId) {
  var url = "https://api.themoviedb.org/3/movie/".concat(movieId, "/videos?api_key=77e69574c201600a6f9114b3eb3478d0&language=en-US");
  return url;
} //formatando o request


function request(url, onComplete, onError) {
  fetch(url).then(function (res) {
    return res.json();
  }).then(onComplete)["catch"](onError);
} //formatando o request de filmes


function searchMovie(value) {
  var url = moviesUrl + value;
  request(url, iterateMovies, handleError);
} //recebendo dados e inserindo os cartazes dos filmes


function iterateMovies(data) {
  movieContainer.innerHTML = ''; //limpa o resultado da busca anterior

  var movies = data.results; //devolve um array com objetos de filmes

  var movieCard = generateMovieCards(movies);
  movieContainer.appendChild(movieCard);
  console.log('Data: ', data);
}

function handleError(error) {
  console.log('Error: ', error);
} //responsável por construir os cards dos filmes


function generateMovieCards(movies) {
  var movieCard = document.createElement('div');
  movieCard.setAttribute('class', 'movie');
  var content = document.createElement('div');
  content.classList = 'content';
  var contentClose = "<p id=\"content-close\">dale dele doly nessa porra</p>";
  content.innerHTML = contentClose; //aqui eu construo as estruturas em html. posso só fazer por fora direitinho depois transfiro pra cá

  /*const movieTemplate = `
      <section class="section">
          ${generateMoviePoster(movies)}
      </section>
      <div class="content">
          <p id="content-close">dale dele doly nessa porra</p>
      </div>
  `;*/

  var section = generateMoviePoster(movies); //movieCard.innerHTML = movieTemplate;

  movieCard.appendChild(section);
  movieCard.appendChild(content);
  return movieCard;
} //construindo a barra de busca


searchButton.onclick = function (event) {
  event.preventDefault(); //o navegador não vai tentar enviar nada ao servidor

  var value = inputElement.value;
  searchMovie(value);
  /*var newUrl = moviesUrl + value;
    //fetch recebe uma url como parametro para retornar uma Promise, algo retornado da url (um Json nesse caso)
  fetch(newUrl)
      //.then retorna uma nova Promise, diferente da original. Recebe uma função caso a promise é um sucesso
      .then((res) => res.json())  //.json itera sobre a promisse e retorna os dados
      .then(iterateMovies)
          /*(data) => {   //estão sendo usadas sintaxes de arrow function. esse .then atua sobre o dado gerado acima
          var movies = data.results; //devolve um array com objetos de filmes
          var movieCard = generateMovieCards(movies);
          movieContainer.appendChild(movieCard);
          console.log('Data: ', data);
      })
      //.catch é um .then mas caso apresente erro
      .catch((error) => {
          console.log('Error: ', error);
      });*/

  inputElement.value = ''; //reseta o valor inserido na barra de busca

  console.log('Value: ', value);
}; //recebendo o path dos cartazes, inserindo-os como o endereço para a tag img


function generateMoviePoster(movies) {
  var section = document.createElement('section');
  section.classList = 'section';
  movies.map(function (movie) {
    //.map itera sobre cada elemento do array invocando a função dada como parametro
    if (movie.poster_path) {
      //tentar entender depois o uso de `` em javascript e pq da formatação estranha da tag aí embaixo
      var img = document.createElement('img');
      img.src = imagesUrl + movie.poster_path;
      img.setAttribute('data-movie-id', movie.id);
      section.appendChild(img);
      /*return `<img 
          src=${imagesUrl + movie.poster_path} 
          data-movie-id=${movie.id}
      />`;*/
    }
  });
  return section;
}

function generateMovieTrailer(video) {
  var iframe = document.createElement('iframe');
  iframe.src = "https://www.youtube.com/embed/".concat(video.key); //colocar no css depois

  iframe.width = 360;
  iframe.height = 315;
  iframe.allowFullscreen = true;
  return iframe;
}

function generateTrailerTemplate(data, content) {
  content.innerHTML = '<p id="content-close">dale dele doly nessa porra</p>';
  var trailers = data.results; //var length = 0;

  /*if(trailers.length > 4){
      length = 4;
  }else{
      length = trailers.length;
  }*/

  var trailerContainer = document.createElement('div');
  /*for(var i = 0; i < length; i++){
      trailer = trailers[i];
      var iframe = generateMovieTrailer(trailer);
      trailerContainer.appendChild(iframe);
      content.appendChild(trailerContainer);
  }*/

  trailer = trailers[0];
  var iframe = generateMovieTrailer(trailer);
  trailerContainer.appendChild(iframe);
  content.appendChild(trailerContainer);
} //delimita as ações para quando algo é clicado na tela (se for tag img ou com id "content-close")


document.onclick = function (event) {
  var target = event.target;

  if (target.tagName.toLowerCase() === 'img') {
    console.log('imagem clicada: ', event);
    var movieId = target.dataset.movieId; //itero sobre os dados do target buscando o movieId da imagem clicada

    console.log('Movie Id: ', movieId); //essa estrutura DEVERÁ ser mudada quando eu fizer a interface dos resultados da pesquisa

    var section = target.parentElement; //section é o elemento pai do elemento que eu clico

    var content = section.nextElementSibling; //eu busco o próximo elemento filho da section

    content.classList.add('content-dispay'); //adiciono uma classe css nesse elemento, que é jusatmente a div de dados do filme

    var url = generateTrailerUrl(movieId); //buscando pelos trailers

    fetch(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      //exibir os trailers
      console.log('Trailers: ', data);
      generateTrailerTemplate(data, content);
    })["catch"](function (error) {
      console.log('Error: ', error);
    });
  }

  if (target.id === 'content-close') {
    var content = target.parentElement;
    content.classList.remove('content-dispay');
    console.log('Elemento retornado: ', content);
  }
};
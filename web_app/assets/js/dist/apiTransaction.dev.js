"use strict";

//valores da api
var api_Key = '77e69574c201600a6f9114b3eb3478d0';
var moviesSearchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&query='; //const moviesSearchUrlMulti = 'https://api.themoviedb.org/3/search/multi?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&query=';

var imagesUrlSmall = 'https://image.tmdb.org/t/p/w185';
var imagesUrlBig = 'https://image.tmdb.org/t/p/w342'; //const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br';
//selecionando o elemento de entrada da barra de busca

var searchButton = document.querySelector('#search'); //botão da barra de pesquisa

var inputElement = document.querySelector('#searchBar'); //barra de busca

var movieContainer = document.querySelector('#movieContainer'); //div que contem os filmes
//const imageElement = document.querySelector('img')
//gerando url dos trailers (ainda em idioma ingles)

function generateTrailerUrl(movieId) {
  var url = "https://api.themoviedb.org/3/movie/".concat(movieId, "/videos?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br");
  return url;
}

function generateMoviesUrl(movieId) {
  var url = "https://api.themoviedb.org/3/movie/".concat(movieId, "?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br");
  return url;
} //formatando o request


function request(url, onComplete, onError) {
  fetch(url).then(function (res) {
    return res.json();
  }).then(onComplete)["catch"](onError);
} //formatando o request de filmes


function searchMovie(value) {
  var url = moviesSearchUrl + value;
  request(url, iterateMovies, handleError);
} //recebendo dados e inserindo os cartazes dos filmes


function iterateMovies(data) {
  movieContainer.innerHTML = ''; //limpa o resultado da busca anterior

  var movies = data.results; //devolve um array com objetos de filmes

  console.log('lista de filmes: ', movies);
  var movieList = generateMovieList(movies);
  movieContainer.appendChild(movieList);
  console.log('Dados brutos: ', data);
}

function handleError(error) {
  console.log('Error: ', error);
}

function logMoviesData(moviesUrl) {
  /*fetch(moviesUrl)
      .then((res) => {
          var resultado = res.json();
          console.log('resultado: ', resultado);
          return resultado;})
      .catch((error) => {
          console.log('Error: ', error);
      });*/
  request(moviesUrl, function (data) {
    var result = iterateMovieDetails(data);
    console.log('resultado do request logMoviesData ', result);
    return result;
  }, handleError);
}

function iterateMovieDetails(data) {
  return data;
}

function acessMovieData(movieId) {
  var url = generateMoviesUrl(movieId);
  var data = logMoviesData(url);
  console.log('o logMoviesData retornou: ', data);
  return data;
  /*request(url, (data) => {
      console.log('Dados detalhados do filme: ', data);
      return data;
  }, handleError);*/
} //responsável por construir os cards dos filmes recebendo um array com objetos de filmes


function generateMovieList(movies) {
  var movieList = document.createElement('div');
  movieList.setAttribute('class', 'movieList');
  var list = generateMoviesInList(movies);
  movieList.appendChild(list);
  return movieList;
} //construindo a barra de busca


searchButton.onclick = function (event) {
  event.preventDefault(); //o navegador não vai tentar enviar nada ao servidor

  var value = inputElement.value;
  searchMovie(value);
  inputElement.value = ''; //reseta o valor inserido na barra de busca

  console.log('Value: ', value);
};

function generateMovieCard(movie) {
  //criando estruturas fundamentais do card do filme
  var movieCard = document.createElement('div');
  movieCard.setAttribute('class', 'movieCard');
  var posterContainer = document.createElement('div');
  posterContainer.setAttribute('class', 'posterContainer');
  var info = document.createElement('div');
  info.setAttribute('class', 'info');
  var title = document.createElement('div');
  title.setAttribute('class', 'title');
  var movieData = document.createElement('div');
  movieData.setAttribute('class', 'movieData'); //var percentage = document.createElement('div');
  //percentage.setAttribute('class', 'percentage');

  if (movie.poster_path && movie.title && movie.vote_average && movie.release_date && movie.overview && movie.genre_ids) {
    //----------------inserindo imagem-----------------
    var imgS = document.createElement('img');
    imgS.src = imagesUrlSmall + movie.poster_path;
    imgS.setAttribute('data-movie-id', movie.id);
    posterContainer.appendChild(imgS); //----------------inserindo titulo-----------------

    var spanTitle = document.createElement('span');
    spanTitle.innerHTML = movie.title;
    title.appendChild(spanTitle);
    info.appendChild(title); //----------------inserindo porcentagem-----------------
    //var spanPercentage = document.createElement('span');
    //spanPercentage.innerHTML = movie.vote_average;

    var percentage = document.createElement('div');
    percentage.setAttribute('class', 'percentage');
    percentage.innerHTML = movie.vote_average; //percentage.appendChild(spanPercentage);

    movieData.appendChild(percentage);
    info.appendChild(movieData); //----------------inserindo ano de lancamento-----------------

    var year = document.createElement('span');
    year.setAttribute('class', 'year');
    year.innerHTML = movie.release_date;
    movieData.appendChild(year);
    info.appendChild(movieData); //----------------inserindo sinopse-----------------

    var sinopse = document.createElement('div');
    sinopse.setAttribute('class', 'sinopse'); //var paragraph =document.createElement('p');
    //paragraph.innerHTML = movie.overview;

    sinopse.innerHTML = movie.overview; //sinopse.appendChild(paragraph);

    movieData.appendChild(sinopse);
    info.appendChild(movieData); //if (movie.genre_ids) {
    //var genreList = getGenre(genreUrl);
    //console.log('lista de generos ', genreList);
    //----------------inserindo genero-----------------

    var genreHolder = document.createElement('div');
    genreHolder.setAttribute('class', 'genreHolder');

    for (var j = 0; j < 3; j++) {
      genreId = movie.genre_ids[j];
      var genre = checkGenre(genreId); //var genre = translateGenre(genreId, genreList);
      //console.log('o genero aí ', genreId);

      if (j === 0) {
        var genreSpan1 = document.createElement('div');
        genreSpan1.setAttribute('class', 'genre1');
        genreSpan1.innerHTML = genre;
        genreHolder.appendChild(genreSpan1);
      } else if (j === 1) {
        var genre2Details = document.createElement('div');
        genre2Details.setAttribute('class', 'genre2');
        genre2Details.innerHTML = genre;
        genreHolder.appendChild(genre2Details);
      } else {
        var genre3Details = document.createElement('div');
        genre3Details.setAttribute('class', 'genre3');
        genre3Details.innerHTML = genre;
        genreHolder.appendChild(genre3Details);
      }

      movieData.appendChild(genreHolder);
      info.appendChild(movieData);
    }

    movieCard.appendChild(posterContainer);
    movieCard.appendChild(info); //everything.appendChild(movieCard);
  }

  return movieCard;
}
/*
function generateMovieDetails(movie){
    console.log('movie overview', movie.overview);
    //criando a div que vai comportar dados do filme(detailsCard) + trailer
    var detailsContainer = document.createElement('div');
    detailsContainer.setAttribute('class', 'detailsContainer');
    var detailsCard = document.createElement('div');
    detailsCard.setAttribute('class', 'detailsCard');

    var detailsTitleCard = document.createElement('div');
    detailsTitleCard.setAttribute('class', 'detailsTitleCard');

    var detailsMovieCard = document.createElement('div');
    detailsMovieCard.setAttribute('class', 'detailsMovieCard');

    var detailsInfoCard = document.createElement('div');
    detailsInfoCard.setAttribute('class', 'detailsInfoCard');

    var detailsPosterContainer = document.createElement('div');
    detailsPosterContainer.setAttribute('class', 'detailsPosterContainer');

    var detailsSinopse = document.createElement('div');
    detailsSinopse.setAttribute('class', 'detailsSinopse');

    var detailsInfo = document.createElement('div');
    detailsInfo.setAttribute('class', 'detailsInfo');

    var detailsTitleSinopse = document.createElement('div');
    detailsTitleSinopse.setAttribute('class', 'detailsTitle');
    var sinopseP = document.createElement('p');
    var hr1 = document.createElement('hr');
    sinopseP.innerHTML = 'Sinopse';
    detailsTitleSinopse.appendChild(sinopseP);
    detailsTitleSinopse.appendChild(hr1);

    var detailsTitleInfo = document.createElement('div');
    detailsTitleInfo.setAttribute('class', 'detailsTitle');
    var infoP = document.createElement('p');
    var hr2 = document.createElement('hr');
    infoP.innerHTML = 'Informações';
    detailsTitleInfo.appendChild(infoP);
    detailsTitleInfo.appendChild(hr2);

    var detailsSinopseText = document.createElement('div');
    detailsSinopseText.setAttribute('class', 'sinopseText');

    //estrutura que segura as informações de lucro e tal
    var detailsDataHolder = document.createElement('div');
    detailsDataHolder.setAttribute('class', 'dataHolder');

    var dataContainerSituacao = document.createElement('div');
    dataContainerSituacao.setAttribute('class', 'dataContainer');

    var dataSituacaoTitle = document.createElement('div');
    dataSituacaoTitle.setAttribute('class', 'dataTitle');
    var situacaoP = document.createElement('p');
    situacaoP.innerHTML = 'Situação';
    dataSituacaoTitle.appendChild(situacaoP);
    dataContainerSituacao.appendChild(dataSituacaoTitle);

    if (movie.poster_path && movie.title && movie.vote_average && movie.release_date && movie.overview && movie.genre_ids) {
        //----------------inserindo imagem-----------------
        var imgB = document.createElement('img');
        imgB.src = imagesUrlBig + movie.poster_path;

        detailsPosterContainer.appendChild(imgB);

        //----------------inserindo titulo-----------------

        var detailsSpanTitle = document.createElement('span');
        detailsSpanTitle.setAttribute('class', 'spanTitle');
        detailsSpanTitle.innerHTML = movie.title;

        detailsTitleCard.appendChild(detailsSpanTitle);


        //----------------inserindo ano de lancamento-----------------

        var detailsYear = document.createElement('span');
        detailsYear.setAttribute('class', 'spanYear');
        detailsYear.innerHTML = movie.release_date;

        detailsTitleCard.appendChild(detailsYear);


        //----------------inserindo sinopse-----------------

        var detailsSinopseP = document.createElement('p');
        detailsSinopseP.innerHTML = movie.overview;

        detailsSinopseText.appendChild(detailsSinopseP);


        detailsSinopse.appendChild(detailsTitleSinopse);
        detailsSinopse.appendChild(detailsSinopseText);
        detailsInfoCard.appendChild(detailsSinopse);
        detailsInfo.appendChild(detailsTitleInfo);

        detailsDataHolder.appendChild(dataContainerSituacao);
        detailsInfo.appendChild(detailsDataHolder);
        detailsInfoCard.appendChild(detailsInfo);

        detailsMovieCard.appendChild(detailsInfoCard);
        detailsMovieCard.appendChild(detailsPosterContainer);
        detailsCard.appendChild(detailsTitleCard);
        detailsCard.appendChild(detailsMovieCard);
        detailsContainer.appendChild(detailsCard);

    }

    console.log('detailsContainer', detailsContainer);
    return detailsContainer;

}*/


function checkGenre(genreId) {
  if (genreId === 28) {
    genreId = 'Ação';
  } else if (genreId === 12) {
    genreId = 'Aventura';
  } else if (genreId === 16) {
    genreId = 'Animação';
  } else if (genreId === 35) {
    genreId = 'Comédia';
  } else if (genreId === 80) {
    genreId = 'Crime';
  } else if (genreId === 99) {
    genreId = 'Crime';
  } else if (genreId === 18) {
    genreId = 'Drama';
  } else if (genreId === 10751) {
    genreId = 'Família';
  } else if (genreId === 14) {
    genreId = 'Fantasia';
  } else if (genreId === 36) {
    genreId = 'História';
  } else if (genreId === 27) {
    genreId = 'Terror';
  } else if (genreId === 10402) {
    genreId = 'Música';
  } else if (genreId === 9648) {
    genreId = 'Mistério';
  } else if (genreId === 10749) {
    genreId = 'Romance';
  } else if (genreId === 878) {
    genreId = 'Ficção científica';
  } else if (genreId === 10770) {
    genreId = 'Cinema TV';
  } else if (genreId === 53) {
    genreId = 'Thriller';
  } else if (genreId === 10752) {
    genreId = 'Guerra';
  } else if (genreId === 37) {
    genreId = 'Faroeste';
  }

  return genreId;
} //recebendo um array com objetos de filmes, cria uma estrutura que comporta todos os filmes+detalhes


function generateMoviesInList(movies) {
  var everything = document.createElement('div');
  everything.setAttribute('class', 'everything');

  for (var i = 0; i < movies.length; i++) {
    //criando a div que vai comportar dados do filme(detailsCard) + trailer
    var detailsContainer = document.createElement('div');
    detailsContainer.setAttribute('class', 'detailsContainer');
    var detailsCard = document.createElement('div');
    detailsCard.setAttribute('class', 'detailsCard');
    var detailsTitleCard = document.createElement('div');
    detailsTitleCard.setAttribute('class', 'detailsTitleCard');
    var detailsMovieCard = document.createElement('div');
    detailsMovieCard.setAttribute('class', 'detailsMovieCard');
    var detailsInfoCard = document.createElement('div');
    detailsInfoCard.setAttribute('class', 'detailsInfoCard');
    var detailsPosterContainer = document.createElement('div');
    detailsPosterContainer.setAttribute('class', 'detailsPosterContainer');
    var detailsSinopse = document.createElement('div');
    detailsSinopse.setAttribute('class', 'detailsSinopse');
    var detailsInfo = document.createElement('div');
    detailsInfo.setAttribute('class', 'detailsInfo');
    var detailsTitleSinopse = document.createElement('div');
    detailsTitleSinopse.setAttribute('class', 'detailsTitle');
    var sinopseP = document.createElement('p');
    var hr1 = document.createElement('hr');
    sinopseP.innerHTML = 'Sinopse';
    detailsTitleSinopse.appendChild(sinopseP);
    detailsTitleSinopse.appendChild(hr1);
    var detailsTitleInfo = document.createElement('div');
    detailsTitleInfo.setAttribute('class', 'detailsTitle');
    var infoP = document.createElement('p');
    var hr2 = document.createElement('hr');
    infoP.innerHTML = 'Informações';
    detailsTitleInfo.appendChild(infoP);
    detailsTitleInfo.appendChild(hr2);
    var detailsSinopseText = document.createElement('div');
    detailsSinopseText.setAttribute('class', 'sinopseText'); //estrutura que segura as informações de lucro e tal

    var detailsDataHolder = document.createElement('div');
    detailsDataHolder.setAttribute('class', 'dataHolder'); //esrabelecendo o holder de situação (sem os dados)

    var dataContainerSituacao = document.createElement('div');
    dataContainerSituacao.setAttribute('class', 'dataContainer');
    var dataSituacaoTitle = document.createElement('div');
    dataSituacaoTitle.setAttribute('class', 'dataTitle');
    var situacaoP = document.createElement('p');
    situacaoP.innerHTML = 'Situação';
    dataSituacaoTitle.appendChild(situacaoP);
    dataContainerSituacao.appendChild(dataSituacaoTitle); //esrabelecendo o holder de idioma (sem os dados)

    var dataContainerIdioma = document.createElement('div');
    dataContainerIdioma.setAttribute('class', 'dataContainer');
    var dataIdiomaTitle = document.createElement('div');
    dataIdiomaTitle.setAttribute('class', 'dataTitle');
    var idiomaP = document.createElement('p');
    idiomaP.innerHTML = 'Idioma';
    dataIdiomaTitle.appendChild(idiomaP);
    dataContainerIdioma.appendChild(dataIdiomaTitle); //esrabelecendo o holder de duração (sem os dados)

    var dataContainerDuracao = document.createElement('div');
    dataContainerDuracao.setAttribute('class', 'dataContainer');
    var dataDuracaoTitle = document.createElement('div');
    dataDuracaoTitle.setAttribute('class', 'dataTitle');
    var duracaoP = document.createElement('p');
    duracaoP.innerHTML = 'Duração';
    dataDuracaoTitle.appendChild(duracaoP);
    dataContainerDuracao.appendChild(dataDuracaoTitle); //esrabelecendo o holder de orçamento (sem os dados)

    var dataContainerOrcamento = document.createElement('div');
    dataContainerOrcamento.setAttribute('class', 'dataContainer');
    var dataOrcamentoTitle = document.createElement('div');
    dataOrcamentoTitle.setAttribute('class', 'dataTitle');
    var orcamentoP = document.createElement('p');
    orcamentoP.innerHTML = 'Orçamento';
    dataOrcamentoTitle.appendChild(orcamentoP);
    dataContainerOrcamento.appendChild(dataOrcamentoTitle); //esrabelecendo o holder de receita (sem os dados)

    var dataContainerReceita = document.createElement('div');
    dataContainerReceita.setAttribute('class', 'dataContainer');
    var dataReceitaTitle = document.createElement('div');
    dataReceitaTitle.setAttribute('class', 'dataTitle');
    var receitaP = document.createElement('p');
    receitaP.innerHTML = 'Receita';
    dataReceitaTitle.appendChild(receitaP);
    dataContainerReceita.appendChild(dataReceitaTitle); //esrabelecendo o holder de receita (sem os dados)

    var dataContainerLucro = document.createElement('div');
    dataContainerLucro.setAttribute('class', 'dataContainer');
    var dataLucroTitle = document.createElement('div');
    dataLucroTitle.setAttribute('class', 'dataTitle');
    var lucroP = document.createElement('p');
    lucroP.innerHTML = 'Lucro';
    dataLucroTitle.appendChild(lucroP);
    dataContainerLucro.appendChild(dataLucroTitle); //construindo o genreAndPercentageHolder

    var genreAndPercentageHolder = document.createElement('div');
    genreAndPercentageHolder.setAttribute('class', 'genreAndPercentageDetailsHolder');
    var genreDetailsHolder = document.createElement('div');
    genreDetailsHolder.setAttribute('class', 'genreDetailsHolder');
    var percentageDetailsHolder = document.createElement('div');
    percentageDetailsHolder.setAttribute('class', 'percentageDetailsHolder');
    var movie = movies[i];

    if (movie.poster_path && movie.title && movie.vote_average && movie.release_date && movie.overview && movie.genre_ids) {
      //----------------inserindo imagem-----------------
      var imgB = document.createElement('img');
      imgB.src = imagesUrlBig + movie.poster_path;
      detailsPosterContainer.appendChild(imgB); //----------------inserindo titulo-----------------

      var detailsSpanTitle = document.createElement('span');
      detailsSpanTitle.setAttribute('class', 'spanTitle');
      detailsSpanTitle.innerHTML = movie.title;
      detailsTitleCard.appendChild(detailsSpanTitle); //----------------inserindo ano de lancamento-----------------

      var detailsYear = document.createElement('span');
      detailsYear.setAttribute('class', 'spanYear');
      detailsYear.innerHTML = movie.release_date;
      detailsTitleCard.appendChild(detailsYear); //----------------inserindo sinopse-----------------

      var detailsSinopseP = document.createElement('p');
      detailsSinopseP.innerHTML = movie.overview;
      detailsSinopseText.appendChild(detailsSinopseP);
      var dados = acessMovieData(movie.id);

      if (dados) {
        console.log('conseguiu retornar um valor! ', dados);
      } //---------------inserindo genero------------------


      for (var j = 0; j < 3; j++) {
        genreId = movie.genre_ids[j];
        var genre = checkGenre(genreId);

        if (j === 0) {
          var genre1Details = document.createElement('div');
          genre1Details.setAttribute('class', 'genre1Details');
          genre1Details.innerHTML = genre;
          genreDetailsHolder.appendChild(genre1Details);
        } else if (j === 1) {
          var genre2Details = document.createElement('div');
          genre2Details.setAttribute('class', 'genre2Details');
          genre2Details.innerHTML = genre;
          genreDetailsHolder.appendChild(genre2Details);
        } else {
          var genre3Details = document.createElement('div');
          genre3Details.setAttribute('class', 'genre3Details');
          genre3Details.innerHTML = genre;
          genreDetailsHolder.appendChild(genre3Details);
        }
      } //------------------------inserindo porcentagem----------


      var percentageDetails = document.createElement('div');
      percentageDetails.setAttribute('class', 'percentageDetails');
      percentageDetails.innerHTML = movie.vote_average;
      percentageDetailsHolder.appendChild(percentageDetails);
      var movieCard = generateMovieCard(movie);
      everything.appendChild(movieCard);
      detailsSinopse.appendChild(detailsTitleSinopse);
      detailsSinopse.appendChild(detailsSinopseText);
      detailsInfoCard.appendChild(detailsSinopse);
      detailsInfo.appendChild(detailsTitleInfo);
      detailsDataHolder.appendChild(dataContainerSituacao);
      detailsDataHolder.appendChild(dataContainerIdioma);
      detailsDataHolder.appendChild(dataContainerDuracao);
      detailsDataHolder.appendChild(dataContainerOrcamento);
      detailsDataHolder.appendChild(dataContainerReceita);
      detailsDataHolder.appendChild(dataContainerLucro);
      detailsInfo.appendChild(detailsDataHolder);
      detailsInfoCard.appendChild(detailsInfo);
      genreAndPercentageHolder.appendChild(genreDetailsHolder);
      genreAndPercentageHolder.appendChild(percentageDetailsHolder);
      detailsInfoCard.appendChild(genreAndPercentageHolder);
      detailsMovieCard.appendChild(detailsInfoCard);
      detailsMovieCard.appendChild(detailsPosterContainer);
      detailsCard.appendChild(detailsTitleCard);
      detailsCard.appendChild(detailsMovieCard);
      detailsContainer.appendChild(detailsCard);
      everything.appendChild(detailsContainer);
    }
  }

  return everything;
}
/*
function generateMovieTrailer(video) {
    var iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    //colocar no css depois
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;
    return iframe;
}


function generateTrailerTemplate(data, elementoDeInsercao) {
    elementoDeInsercao.innerHTML = '<p id="content-close">dale dele doly nessa porra</p>';
    var trailers = data.results;
    var trailerContainer = document.createElement('div');

    trailer = trailers[0];
    var iframe = generateMovieTrailer(trailer);
    trailerContainer.appendChild(iframe);
    elementoDeInsercao.appendChild(trailerContainer);
}


//delimita as ações para quando algo é clicado na tela (se for tag img ou com id "content-close")
document.onclick = function (event) {
    var target = event.target;
    if (target.tagName.toLowerCase() === 'img') {
        console.log('imagem clicada: ', event);
        var movieId = target.dataset.movieId; //itero sobre os dados do target buscando o movieId da imagem clicada
        console.log('Movie Id: ', movieId);
        //essa estrutura DEVERÁ ser mudada quando eu fizer a interface dos resultados da pesquisa
        var posterContainer = target.parentElement; //section é o elemento pai do elemento que eu clico
        var movieCard = posterContainer.parentElement;
        var content = movieCard.nextElementSibling; //eu busco o próximo elemento filho da section
        content.classList.add('content-dispay'); //adiciono uma classe css nesse elemento, que é jusatmente a div de dados do filme

        var url = generateTrailerUrl(movieId);
        //buscando pelos trailers
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                //exibir os trailers
                console.log('Trailers: ', data);
                generateTrailerTemplate(data, content);
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    if (target.id === 'content-close') {
        var content = target.parentElement;
        content.classList.remove('content-dispay');
        console.log('Elemento retornado: ', content);
    }
}*/
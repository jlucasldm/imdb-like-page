//valores da api
const api_Key = '77e69574c201600a6f9114b3eb3478d0';
const moviesSearchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&query=';
//const moviesSearchUrlMulti = 'https://api.themoviedb.org/3/search/multi?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&query=';
const imagesUrlSmall = 'https://image.tmdb.org/t/p/w185';
const imagesUrlBig = 'https://image.tmdb.org/t/p/w342';
//const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br';

//selecionando o elemento de entrada da barra de busca
const searchButton = document.querySelector('#search'); //botão da barra de pesquisa
const inputElement = document.querySelector('#searchBar'); //barra de busca
const movieContainer = document.querySelector('#movieContainer'); //div que contem os filmes
//const imageElement = document.querySelector('img')

//gerando url dos trailers (ainda em idioma ingles)
function generateTrailerUrl(movieId) {
    var url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br`;
    return url;
}

function generateMoviesUrl(movieId) {
    var url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br`;
    return url;
}

//formatando o request
function request(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete)
        .catch(onError);
}

//formatando o request de filmes
function searchMovie(value) {
    var url = moviesSearchUrl + value;
    request(url, iterateMovies, handleError);
}

/*
function getGenre(genreUrl){
    request(genreUrl, iterateGenre, handleError);
}

function iterateGenre(data){
    var genreList = data.genres;
    var genreTranslated = 
}

function translateGenre(genreId, genreList){
    console.log('genreList ', genreList);
    for(var i=0; i<19; i++){
        var genre = genreList[i];
        if(genreId === genre.id){
            return genre;
        }
    }
}*/

//recebendo dados e inserindo os cartazes dos filmes
function iterateMovies(data) {
    movieContainer.innerHTML = ''; //limpa o resultado da busca anterior
    var movies = data.results; //devolve um array com objetos de filmes
    var movieCard = generateMovieList(movies);
    movieContainer.appendChild(movieCard);
    console.log('Data: ', data);
}

function handleError(error) {
    console.log('Error: ', error);
}

//responsável por construir os cards dos filmes recebendo um array com objetos de filmes
function generateMovieList(movies) {
    var movieList = document.createElement('div');
    movieList.setAttribute('class', 'movieList');
    var list = generateMoviesInList(movies);

    //criando parte dos dados (até agora so tem trailer)
    //var content = document.createElement('div');
    //content.classList = 'content';
    //var contentClose = `<p id="content-close">dale dele doly nessa porra</p>`;
    //content.innerHTML = contentClose;
    movieList.appendChild(list);
    //movieList.appendChild(content);
    return movieList;
}

//construindo a barra de busca
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
    movieData.setAttribute('class', 'movieData');

    var percentage = document.createElement('div');
    percentage.setAttribute('class', 'percentage');

    if (movie.poster_path && movie.title && movie.vote_average && movie.release_date && movie.overview && movie.genre_ids) {
        //----------------inserindo imagem-----------------
        var imgS = document.createElement('img');
        imgS.src = imagesUrlSmall + movie.poster_path;
        imgS.setAttribute('data-movie-id', movie.id);

        posterContainer.appendChild(imgS);

        //----------------inserindo titulo-----------------
        var spanTitle = document.createElement('span');
        spanTitle.innerHTML = movie.title;

        title.appendChild(spanTitle);
        info.appendChild(title);

        //----------------inserindo porcentagem-----------------
        var spanPercentage = document.createElement('span');
        spanPercentage.innerHTML = movie.vote_average;

        percentage.appendChild(spanPercentage);
        movieData.appendChild(percentage);
        info.appendChild(movieData);

        //----------------inserindo ano de lancamento-----------------
        var year = document.createElement('span');
        year.setAttribute('class', 'year');
        year.innerHTML = movie.release_date;

        movieData.appendChild(year);
        info.appendChild(movieData);


        //----------------inserindo sinopse-----------------
        var sinopse = document.createElement('div');
        sinopse.setAttribute('class', 'sinopse');
        //var paragraph =document.createElement('p');
        //paragraph.innerHTML = movie.overview;
        sinopse.innerHTML = movie.overview;

        //sinopse.appendChild(paragraph);
        movieData.appendChild(sinopse);
        info.appendChild(movieData);

        //if (movie.genre_ids) {
        //var genreList = getGenre(genreUrl);
        //console.log('lista de generos ', genreList);
        //----------------inserindo genero-----------------
        var genreHolder = document.createElement('div');
        genreHolder.setAttribute('class', 'genreHolder');
        for (var j = 0; j < 3; j++) {
            genreId = movie.genre_ids[j];
            var genre = '';

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
            //var genre = translateGenre(genreId, genreList);

            //console.log('o genero aí ', genreId);
            if (j === 0) {
                var genreSpan1 = document.createElement('div');
                genreSpan1.setAttribute('class', 'genre1');
                genreSpan1.innerHTML = genreId;

                genreHolder.appendChild(genreSpan1);
            } else if (j === 1) {
                var genreSpan2 = document.createElement('div');
                genreSpan2.setAttribute('class', 'genre2');
                genreSpan2.innerHTML = genreId;

                genreHolder.appendChild(genreSpan2);
            } else {
                var genreSpan3 = document.createElement('div');
                genreSpan3.setAttribute('class', 'genre3');
                genreSpan3.innerHTML = genreId;

                genreHolder.appendChild(genreSpan3);
            }
            movieData.appendChild(genreHolder);
            info.appendChild(movieData);

        }

        movieCard.appendChild(posterContainer);
        movieCard.appendChild(info);
        //everything.appendChild(movieCard);
    }

    return movieCard;
}

//recebendo um array com objetos de filmes, cria uma estrutura que comporta todos os filmes+detalhes
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


        //criando estruturas fundamentais do card do filme
        /*var movieCard = document.createElement('div');
        movieCard.setAttribute('class', 'movieCard');

        var posterContainer = document.createElement('div');
        posterContainer.setAttribute('class', 'posterContainer');

        var info = document.createElement('div');
        info.setAttribute('class', 'info');

        var title = document.createElement('div');
        title.setAttribute('class', 'title');

        var movieData = document.createElement('div');
        movieData.setAttribute('class', 'movieData');

        var percentage = document.createElement('div');
        percentage.setAttribute('class', 'percentage');*/

        var movie = movies[i];

        if (movie.poster_path && movie.title && movie.vote_average && movie.release_date && movie.overview && movie.genre_ids) {
            //----------------inserindo imagem-----------------
            /*var imgS = document.createElement('img');
            imgS.src = imagesUrlSmall + movie.poster_path;
            imgS.setAttribute('data-movie-id', movie.id);

            posterContainer.appendChild(imgS);*/

            var imgB = document.createElement('img');
            imgB.src = imagesUrlBig + movie.poster_path;

            detailsPosterContainer.appendChild(imgB);

            //----------------inserindo titulo-----------------
            /*var spanTitle = document.createElement('span');
            spanTitle.innerHTML = movie.title;

            title.appendChild(spanTitle);
            info.appendChild(title);*/

            var detailsSpanTitle = document.createElement('span');
            detailsSpanTitle.setAttribute('class', 'spanTitle');
            detailsSpanTitle.innerHTML = movie.title;

            detailsTitleCard.appendChild(detailsSpanTitle);

            //----------------inserindo porcentagem-----------------
            /*var spanPercentage = document.createElement('span');
            spanPercentage.innerHTML = movie.vote_average;

            percentage.appendChild(spanPercentage);
            movieData.appendChild(percentage);
            info.appendChild(movieData);

            //----------------inserindo ano de lancamento-----------------
            var year = document.createElement('span');
            year.setAttribute('class', 'year');
            year.innerHTML = movie.release_date;

            movieData.appendChild(year);
            info.appendChild(movieData);*/

            var detailsYear = document.createElement('span');
            detailsYear.setAttribute('class', 'spanYear');
            detailsYear.innerHTML = movie.release_date;

            detailsTitleCard.appendChild(detailsYear);


            //----------------inserindo sinopse-----------------
            /*var sinopse = document.createElement('div');
            sinopse.setAttribute('class', 'sinopse');
                //var paragraph =document.createElement('p');
                //paragraph.innerHTML = movie.overview;
            sinopse.innerHTML = movie.overview;

                //sinopse.appendChild(paragraph);
            movieData.appendChild(sinopse);
            info.appendChild(movieData);*/

            var detailsSinopseP = document.createElement('p');
            detailsSinopseP.innerHTML = movie.overview;

            detailsSinopseText.appendChild(detailsSinopseP);


            //if (movie.genre_ids) {
            //var genreList = getGenre(genreUrl);
            //console.log('lista de generos ', genreList);
            //----------------inserindo genero-----------------
            /*var genreHolder = document.createElement('div');
            genreHolder.setAttribute('class', 'genreHolder');
            for (var j = 0; j < 3; j++) {
                genreId = movie.genre_ids[j];
                var genre = '';

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
                    //var genre = translateGenre(genreId, genreList);

                    //console.log('o genero aí ', genreId);
                if (j === 0) {
                    var genreSpan1 = document.createElement('div');
                    genreSpan1.setAttribute('class', 'genre1');
                    genreSpan1.innerHTML = genreId;

                    genreHolder.appendChild(genreSpan1);
                } else if (j === 1) {
                    var genreSpan2 = document.createElement('div');
                    genreSpan2.setAttribute('class', 'genre2');
                    genreSpan2.innerHTML = genreId;

                    genreHolder.appendChild(genreSpan2);
                } else {
                    var genreSpan3 = document.createElement('div');
                    genreSpan3.setAttribute('class', 'genre3');
                    genreSpan3.innerHTML = genreId;

                    genreHolder.appendChild(genreSpan3);
                }
                movieData.appendChild(genreHolder);
                info.appendChild(movieData);
                
            }

            movieCard.appendChild(posterContainer);
            movieCard.appendChild(info);
            everything.appendChild(movieCard);*/

            var movieCard = generateMovieCard(movie);
            everything.appendChild(movieCard);

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
};*/
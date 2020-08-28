//valores da api
const api_Key = '77e69574c201600a6f9114b3eb3478d0';
const moviesSearchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&query=';
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

function generateMoviesUrl(movieId){
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

//recebendo dados e inserindo os cartazes dos filmes
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
    request(moviesUrl,((data) => {
        console.log('log_movies_data: ', data);
    }), handleError);
}


function acessMovieData(movieId) {
    var url = generateMoviesUrl(movieId);
    logMoviesData(url);
    //return data;
    /*request(url, (data) => {
        console.log('Dados detalhados do filme: ', data);
        return data;
    }, handleError);*/
}

//responsável por construir os cards dos filmes recebendo um array com objetos de filmes
function generateMovieList(movies) {
    var movieList = document.createElement('div');
    movieList.setAttribute('class', 'movieList');
    var list = generateMoviesInList(movies);

    movieList.appendChild(list);

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


function generateMovieCard(movie){
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

    //var percentage = document.createElement('div');
    //percentage.setAttribute('class', 'percentage');


        //----------------inserindo imagem-----------------
        var imgS = document.createElement('img');
        imgS.src = imagesUrlSmall + movie.poster_path;
        imgS.setAttribute('data-movie-id', movie.id);

        if(movie.poster_path){
            posterContainer.appendChild(imgS);
        }

        //----------------inserindo titulo-----------------
        /*var spanTitle = document.createElement('span');
        spanTitle.innerHTML = movie.title;

        title.appendChild(spanTitle);
        info.appendChild(title);*/

        var divTitle = document.createElement('div');
        divTitle.innerHTML = movie.title;

        title.appendChild(divTitle);
        info.appendChild(title);

        //----------------inserindo porcentagem-----------------
        //var spanPercentage = document.createElement('span');
        //spanPercentage.innerHTML = movie.vote_average;
        var percentage = document.createElement('div');
        percentage.setAttribute('class', 'percentage');
        percentage.innerHTML = movie.vote_average;

        //percentage.appendChild(spanPercentage);
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
            var genre = checkGenre(genreId);

            //var genre = translateGenre(genreId, genreList);

            //console.log('o genero aí ', genreId);
            if (j === 0 && genre) {
                var genreSpan1 = document.createElement('div');
                genreSpan1.setAttribute('class', 'genre');
                genreSpan1.innerHTML = genre;

                genreHolder.appendChild(genreSpan1);
            } else if (j === 1 && genre) {
                var genre2Details = document.createElement('div');
                genre2Details.setAttribute('class', 'genre');
                genre2Details.innerHTML = genre;

                genreHolder.appendChild(genre2Details);
            } else if(genre){
                var genre3Details = document.createElement('div');
                genre3Details.setAttribute('class', 'genre');
                genre3Details.innerHTML = genre;

                genreHolder.appendChild(genre3Details);
            }
            movieData.appendChild(genreHolder);
            info.appendChild(movieData);

        }

        movieCard.appendChild(posterContainer);
        movieCard.appendChild(info);
        //everything.appendChild(movieCard);
        return movieCard;

}

function generateMovieDetails(movie){
    console.log('dale boy e o movie id é', movie.id);
    //criando a div que vai comportar dados do filme(detailsCard) + trailer
    //var detailsContainer = document.createElement('div');
    //detailsContainer.setAttribute('class', 'detailsContainer');
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

    //esrabelecendo o holder de situação (sem os dados)
    var dataContainerSituacao = document.createElement('div');
    dataContainerSituacao.setAttribute('class', 'dataContainer');

    var dataSituacaoTitle = document.createElement('div');
    dataSituacaoTitle.setAttribute('class', 'dataTitle');
    var situacaoP = document.createElement('p');
    situacaoP.innerHTML = 'Situação';
    dataSituacaoTitle.appendChild(situacaoP);

    var  dataSituacao = document.createElement('div');
    dataSituacao.setAttribute('class', 'data');
    dataSituacao.innerHTML = movie.status;

    dataContainerSituacao.appendChild(dataSituacaoTitle);
    dataContainerSituacao.appendChild(dataSituacao);

    //esrabelecendo o holder de idioma (sem os dados)
    var dataContainerIdioma = document.createElement('div');
    dataContainerIdioma.setAttribute('class', 'dataContainer');

    var dataIdiomaTitle = document.createElement('div');
    dataIdiomaTitle.setAttribute('class', 'dataTitle');
    var idiomaP = document.createElement('p');
    idiomaP.innerHTML = 'Idioma';
    dataIdiomaTitle.appendChild(idiomaP);

    var dataIdioma = document.createElement('div');
    dataIdioma.setAttribute('class', 'data');
    dataIdioma.innerHTML = movie.spoken_languages[0].name;

    dataContainerIdioma.appendChild(dataIdiomaTitle);
    dataContainerIdioma.appendChild(dataIdioma);


    //esrabelecendo o holder de duração (sem os dados)
    var dataContainerDuracao = document.createElement('div');
    dataContainerDuracao.setAttribute('class', 'dataContainer');

    var dataDuracaoTitle = document.createElement('div');
    dataDuracaoTitle.setAttribute('class', 'dataTitle');
    var duracaoP = document.createElement('p');
    duracaoP.innerHTML = 'Duração';
    dataDuracaoTitle.appendChild(duracaoP);

    var dataDuracao = document.createElement('div');
    dataDuracao.setAttribute('class', 'data');
    dataDuracao.innerHTML = movie.runtime + ' minutos';

    dataContainerDuracao.appendChild(dataDuracaoTitle);
    dataContainerDuracao.appendChild(dataDuracao);


    //esrabelecendo o holder de orçamento (sem os dados)
    var dataContainerOrcamento = document.createElement('div');
    dataContainerOrcamento.setAttribute('class', 'dataContainer');

    var dataOrcamentoTitle = document.createElement('div');
    dataOrcamentoTitle.setAttribute('class', 'dataTitle');
    var orcamentoP = document.createElement('p');
    orcamentoP.innerHTML = 'Orçamento';
    dataOrcamentoTitle.appendChild(orcamentoP);

    var dataOrcamento = document.createElement('div');
    dataOrcamento.setAttribute('class', 'data');
    dataOrcamento.innerHTML = '$' + movie.budget;

    dataContainerOrcamento.appendChild(dataOrcamentoTitle);
    dataContainerOrcamento.appendChild(dataOrcamento);


    //esrabelecendo o holder de receita (sem os dados)
    var dataContainerReceita = document.createElement('div');
    dataContainerReceita.setAttribute('class', 'dataContainer');

    var dataReceitaTitle = document.createElement('div');
    dataReceitaTitle.setAttribute('class', 'dataTitle');
    var receitaP = document.createElement('p');
    receitaP.innerHTML = 'Receita';
    dataReceitaTitle.appendChild(receitaP);

    var dataReceita = document.createElement('div');
    dataReceita.setAttribute('class', 'data');
    dataReceita.innerHTML = '$' + movie.revenue;

    dataContainerReceita.appendChild(dataReceitaTitle);
    dataContainerReceita.appendChild(dataReceita);

    //esrabelecendo o holder de receita (sem os dados)
    var dataContainerLucro = document.createElement('div');
    dataContainerLucro.setAttribute('class', 'dataContainer');

    var dataLucroTitle = document.createElement('div');
    dataLucroTitle.setAttribute('class', 'dataTitle');
    var lucroP = document.createElement('p');
    lucroP.innerHTML = 'Lucro';
    dataLucroTitle.appendChild(lucroP);

    var dataLucro = document.createElement('div');
    dataLucro.setAttribute('class', 'data');
    var lucro = movie.revenue - movie.budget;
    dataLucro.innerHTML = '$' + lucro;

    dataContainerLucro.appendChild(dataLucroTitle);
    dataContainerLucro.appendChild(dataLucro);


    //construindo o genreAndPercentageHolder
    var genreAndPercentageHolder = document.createElement('div');
    genreAndPercentageHolder.setAttribute('class', 'genreAndPercentageDetailsHolder');

    var genreDetailsHolder = document.createElement('div');
    genreDetailsHolder.setAttribute('class', 'genreDetailsHolder');

    var percentageDetailsHolder = document.createElement('div');
    percentageDetailsHolder.setAttribute('class', 'percentageDetailsHolder');


    
        //----------------inserindo imagem-----------------
        var imgB = document.createElement('img');
        imgB.src = imagesUrlBig + movie.poster_path;
        if(movie.poster_path){
            detailsPosterContainer.appendChild(imgB);
        }

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

        //----------------inserindo dados detalhados--------


        //---------------inserindo genero------------------
        for (var j = 0; j < 3; j++) {
            genre = movie.genres[j];
            console.log('genero ', genre);

            if (j === 0 && genre) {
                var genre1Details = document.createElement('div');
                genre1Details.setAttribute('class', 'genreDetails');
                genre1Details.innerHTML = genre.name;

                genreDetailsHolder.appendChild(genre1Details);
            } else if (j === 1 && genre) {
                var genre2Details = document.createElement('div');
                genre2Details.setAttribute('class', 'genreDetails');
                genre2Details.innerHTML = genre.name;

                genreDetailsHolder.appendChild(genre2Details);
            } else if(genre) {
                var genre3Details = document.createElement('div');
                genre3Details.setAttribute('class', 'genreDetails');
                genre3Details.innerHTML = genre.name;

                genreDetailsHolder.appendChild(genre3Details);
            }
        }

        //------------------------inserindo porcentagem----------
        var percentageDetails = document.createElement('div');
        percentageDetails.setAttribute('class', 'percentageDetails');
        percentageDetails.innerHTML = movie.vote_average;

        percentageDetailsHolder.appendChild(percentageDetails);


        //-----------------------inserindo elementos---------------
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
        //detailsContainer.appendChild(detailsCard);

        console.log('details container direto da função: ', detailsContainer);

        //return (detailsContainer);
        return detailsCard;
    
}

function checkGenre(genreId){
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
}


//recebendo um array com objetos de filmes, cria uma estrutura que comporta todos os filmes+detalhes
function generateMoviesInList(movies) {
    var everything = document.createElement('div');
    everything.setAttribute('class', 'everything');

    for(var i=0; i<movies.length; i++){
        var movie = movies[i];

        var dados = acessMovieData(movie.id);
        if (dados) {
            console.log('conseguiu retornar um valor! ', dados);
        }

        var movieCard = generateMovieCard(movie);

        var movieHolder = document.createElement('div');
        movieHolder.setAttribute('class', 'movieHolder');

        if(movieCard){
            movieHolder.appendChild(movieCard);
            everything.appendChild(movieHolder);
        }
    }
    return everything;
}


function generateMovieTrailer(video) {
    //var trailerHolder = document.createElement('div');
    //trailerHolder.setAttribute('class', 'trailerHolder');
    if(video){
        var trailerContainer = document.createElement('div');
        trailerContainer.setAttribute('class', 'trailerContainer');

        var iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'trailerIframe');

        iframe.src = `https://www.youtube.com/embed/${video.key}`;
        //colocar no css depois
        iframe.allowFullscreen = true;
        trailerContainer.appendChild(iframe);
        return trailerContainer;
        //return iframe;
    }
}

function insertMovieDetails(movie, elementoDeInsercao) {
    //movie é um objeto com varios dados do filme tlg
    console.log('movie: ', movie);
    var detailsContainer = generateMovieDetails(movie);

    if(detailsContainer){
        console.log('details container', detailsContainer);
        elementoDeInsercao.appendChild(detailsContainer);
    }
}

function generateTrailerTemplate(data, elementoDeInsercao) {
    var trailers = data.results;
    //var trailerContainer = document.createElement('div');
    //trailerContainer.setAttribute('class', 'trailerContainer');

    trailer = trailers[0];
    var iframe = generateMovieTrailer(trailer);
    //trailerContainer.appendChild(iframe);
    //elementoDeInsercao.appendChild(trailerContainer);
    elementoDeInsercao.appendChild(iframe);
}


//delimita as ações para quando algo é clicado na tela (se for tag img ou com id "content-close")
document.onclick = function (event) {
    var target = event.target;
    var details = document.getElementsByClassName('detailsCard').length;
    if (target.tagName.toLowerCase() === 'img' && target.parentElement.class !== 'detailsPosterContainer' && !details) {
        console.log('imagem clicada: ', event);
        var movieId = target.dataset.movieId;
        console.log('Movie Id: ', movieId);
        //essa estrutura DEVERÁ ser mudada quando eu fizer a interface dos resultados da pesquisa
        var posterContainer = target.parentElement; //section é o elemento pai do elemento que eu clico
        var movieCard = posterContainer.parentElement;
        var movieHolder = movieCard.parentElement;

        var detailsCardHolder = document.createElement('div');
        detailsCardHolder.setAttribute('class', 'detailsCardHolder');

        var detailsContainer = document.createElement('div');
        detailsContainer.setAttribute('class', 'detailsContainer');

        detailsCardHolder.appendChild(detailsContainer);

        movieHolder.appendChild(detailsCardHolder);
        //detailsCardHolder.classList.add('content-dispay'); //adiciono uma classe css nesse elemento, que é jusatmente a div de dados do filme
       
        var movieUrl = generateMoviesUrl(movieId);
        fetch(movieUrl)
            .then((res) => res.json())
            .then((data) => {
                //exibir os trailers
                console.log('Trailers: ', data);
                insertMovieDetails(data, detailsContainer);
            })
            .catch((error) => {
                console.log('Error: ', error);
            });

        var trailerUrl = generateTrailerUrl(movieId);

        fetch(trailerUrl)
            .then((res) => res.json())
            .then((data) => {
                //exibir os trailers
                console.log('Trailers: ', data);
                generateTrailerTemplate(data, detailsCardHolder);
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    if (target.className === 'detailsTitleCard' || target.className === 'spanTitle' || target.className === 'spanYear') {
        var toHide;
        if (target.className === 'spanTitle' || target.className === 'spanYear'){
            toHide = target.parentElement.parentElement.parentElement.parentElement;
        }else{
            toHide = target.parentElement.parentElement.parentElement;
        }
        
        //var toHide = document.getElementsByClassName('detailsContainer'); //detailsCardHolder
        console.log('toHide ', toHide);
        toHide.remove();
        //content.classList.remove('content-dispay');
        //console.log('Elemento retornado: ', content);
    }
};

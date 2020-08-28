//valores da api
const api_Key = '77e69574c201600a6f9114b3eb3478d0';
const moviesSearchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&query=';
const genresSearchUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br&with_genres='; //o proximo parametro precisa ser um numero
const languageUrl = 'https://api.themoviedb.org/3/configuration/languages?api_key=77e69574c201600a6f9114b3eb3478d0';
const imagesUrlSmall = 'https://image.tmdb.org/t/p/w185';
const imagesUrlBig = 'https://image.tmdb.org/t/p/w342';


//selecionando o elemento de entrada da barra de busca
const searchButton = document.querySelector('#search'); //botão da barra de pesquisa
const inputElement = document.querySelector('#searchBar'); //barra de busca
const movieContainer = document.querySelector('#movieContainer'); //div que contem os filmes


//gerando url do trailer de um filme, buscado pelo seu id
function generateTrailerUrl(movieId) {
    var url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=77e69574c201600a6f9114b3eb3478d0&language=pt-br`;
    return url;
}

//gerando o url dos dados de um único filme, buscado pelo seu id
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

//definindo a função de erro no request
function handleError(error) {
    console.log('Error: ', error);
}

//identificando a entrada da busca (se por nome de filme ou gênero) e fazendo o request
function searchMovie(value) {
    var id = genreStringToId(value);
    var url;
    if(value === id){
        url = moviesSearchUrl + value;
    }else{
        url = genresSearchUrl + id;
    }
    request(url, iterateMovies, handleError);
}

//dando request nos dados de línguas, iterando sobre eles e invocando a função(insertLanguage) para inserir um dado em um elemento
function searchAndInsertLanguages(elementoDeInsercao, languageId){
    var url = languageUrl;
    request(url, (data) => {
        insertLanguage(data, elementoDeInsercao, languageId);
    }, handleError);
}

//usando os dados recebidos do request para inserir o dado 'língua' em um elemento
function insertLanguage(data, elementoDeInsercao, languageId){
    var language;
    console.log('id da lingua: ', languageId);
    for (var i = 0; i < data.length; i++) {
        language = data[i];
        if (languageId === language.iso_639_1) {
            elementoDeInsercao.innerHTML = language.name;
        }
    }
}

//recebe dados do request e insere os detalhes do flme em questão
function insertMovieDetails(movie, elementoDeInsercao) {
    console.log('movie: ', movie);
    var detailsContainer = generateMovieDetails(movie);

    if (detailsContainer) {
        console.log('details container', detailsContainer);
        elementoDeInsercao.appendChild(detailsContainer);
    }
}

//recebendo dados e inserindo a lista de filmes no container
function iterateMovies(data) {
    movieContainer.innerHTML = '';
    var movies = data.results;
    console.log('lista de filmes retornados pela entrada: ', movies);
    var movieList = generateMovieList(movies);
    movieContainer.appendChild(movieList);
}

//responsável por construir a lista de card de filmes
function generateMovieList(movies) {
    var movieList = document.createElement('div');
    movieList.setAttribute('class', 'movieList');
    var list = generateMoviesInList(movies);

    movieList.appendChild(list);

    return movieList;
}

//construindo a barra de busca e estabelecendo seu funcionamento
searchButton.onclick = function (event) {
    event.preventDefault();
    var value = inputElement.value;
    value = value.toLowerCase();
    searchMovie(value);
    inputElement.value = '';
};

//gerando o card de cada filme separadamente
function generateMovieCard(movie){
    //---------container de todos os elementos-------------
    var movieCard = document.createElement('div');
    movieCard.setAttribute('class', 'movieCard');


    //---------------container do poster-------------------
    var posterContainer = document.createElement('div');
    posterContainer.setAttribute('class', 'posterContainer');
    //inserindo poster
    var imgS = document.createElement('img');
    if (movie.poster_path) {
        imgS.src = imagesUrlSmall + movie.poster_path;
        imgS.setAttribute('data-movie-id', movie.id);
    }
    posterContainer.appendChild(imgS);



    //---container das informações do filme (title + movieData)---
    var info = document.createElement('div');
    info.setAttribute('class', 'info');
    //-----------------container do título------------------------
    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    //inserindo título
    var divTitle = document.createElement('div');
    if (movie.title) {
        divTitle.innerHTML = movie.title;
    }
    title.appendChild(divTitle);
    info.appendChild(title);



    //-------container dos dados gerais (sinopse, gênero, porcentagem, ano);-----------
    var movieData = document.createElement('div');
    movieData.setAttribute('class', 'movieData');

    //inserindo porcentagem
    var percentage = document.createElement('div');
    percentage.setAttribute('class', 'percentage');
    if(movie.vote_average){
        percentage.innerHTML = movie.vote_average;
    }
    movieData.appendChild(percentage);
    info.appendChild(movieData);

    //inserindo ano de lançamento
    var year = document.createElement('div');
    year.setAttribute('class', 'year');
    if(movie.release_date){
        year.innerHTML = movie.release_date;
    }
    movieData.appendChild(year);
    info.appendChild(movieData);

    //inserindo sinopse
    var sinopse = document.createElement('div');
    sinopse.setAttribute('class', 'sinopse');
    if(movie.overview){
        sinopse.innerHTML = movie.overview;
    }
    movieData.appendChild(sinopse);
    info.appendChild(movieData);

    //inserindo gênero
    var genreHolder = document.createElement('div');
    genreHolder.setAttribute('class', 'genreHolder');
    for (var j = 0; j < 3; j++) {
        genreId = movie.genre_ids[j];
        var genre = genreIdToString(genreId);

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

    //inserindo demais elementos
    movieCard.appendChild(posterContainer);
    movieCard.appendChild(info);

    return movieCard;

}

//gerando o card com os detalhes dos filmes
function generateMovieDetails(movie){
    //gerando a div que comporta toda a estrutura dos dados detalhados do filme (detailsMovieCard + detailsTitleCard)
    var detailsCard = document.createElement('div');
    detailsCard.setAttribute('class', 'detailsCard');



    //gerando div que comporta o título e ano
    var detailsTitleCard = document.createElement('div');
    detailsTitleCard.setAttribute('class', 'detailsTitleCard');

    //gerando título e a estrutura que o comporta
    var detailsSpanTitle = document.createElement('span');
    detailsSpanTitle.setAttribute('class', 'spanTitle');
    if (movie.title) {
        detailsSpanTitle.innerHTML = movie.title;
    }
    //inserindo título 
    detailsTitleCard.appendChild(detailsSpanTitle);

    //gerando ano de lançamento e a estrutura que o comporta
    var detailsYear = document.createElement('span');
    detailsYear.setAttribute('class', 'spanYear');
    if (movie.release_date) {
        detailsYear.innerHTML = movie.release_date;
    }
    //inserindo ano de lançamento
    detailsTitleCard.appendChild(detailsYear);



    //gerando div que comporta os dados do filme e o poster
    var detailsMovieCard = document.createElement('div');
    detailsMovieCard.setAttribute('class', 'detailsMovieCard');

    //gerando div que comporta os dados do filme
    var detailsInfoCard = document.createElement('div');
    detailsInfoCard.setAttribute('class', 'detailsInfoCard');

    //gerando div que comporta o poster
    var detailsPosterContainer = document.createElement('div');
    detailsPosterContainer.setAttribute('class', 'detailsPosterContainer');
    //gerando o poster
    var imgB = document.createElement('img');
    if (movie.poster_path) {
        imgB.src = imagesUrlBig + movie.poster_path;
    }
    //inserindo o poster
    detailsPosterContainer.appendChild(imgB);



    //gerando div que comporta os dados da sinopse
    var detailsSinopse = document.createElement('div');
    detailsSinopse.setAttribute('class', 'detailsSinopse');

    //gerando div do título "sinopse"
    var detailsTitleSinopse = document.createElement('div');
    detailsTitleSinopse.setAttribute('class', 'detailsTitle');
    var sinopseP = document.createElement('p');
    var hr1 = document.createElement('hr');
    sinopseP.innerHTML = 'Sinopse';
    detailsTitleSinopse.appendChild(sinopseP);
    detailsTitleSinopse.appendChild(hr1);

    //gerando div que vai conter o texto da sinopse
    var detailsSinopseText = document.createElement('div');
    detailsSinopseText.setAttribute('class', 'sinopseText');
    //gerando sinopse
    var detailsSinopseP = document.createElement('p');
    if (movie.overview) {
        detailsSinopseP.innerHTML = movie.overview;
    }
    //inserindo sinopse
    detailsSinopseText.appendChild(detailsSinopseP);



    //gerando div que vai comportar cada elemento de informações (título e dados de "situação", "duração" ...)
    var detailsInfo = document.createElement('div');
    detailsInfo.setAttribute('class', 'detailsInfo');

    //gerando div do título "informações"
    var detailsTitleInfo = document.createElement('div');
    detailsTitleInfo.setAttribute('class', 'detailsTitle');
    var infoP = document.createElement('p');
    var hr2 = document.createElement('hr');
    infoP.innerHTML = 'Informações';
    detailsTitleInfo.appendChild(infoP);
    detailsTitleInfo.appendChild(hr2);

    //estrutura que segura as informações de lucro, situação...
    var detailsDataHolder = document.createElement('div');
    detailsDataHolder.setAttribute('class', 'dataHolder');

    //gerando o holder de 'situação' (sem os dados)
    var dataContainerSituacao = document.createElement('div');
    dataContainerSituacao.setAttribute('class', 'dataContainer');
    //gerando a estrutura do título 'situação'
    var dataSituacaoTitle = document.createElement('div');
    dataSituacaoTitle.setAttribute('class', 'dataTitle');
    var situacaoP = document.createElement('p');
    situacaoP.innerHTML = 'Situação';
    dataSituacaoTitle.appendChild(situacaoP);
    //gerando a estrutura do dado de 'situação'
    var  dataSituacao = document.createElement('div');
    dataSituacao.setAttribute('class', 'data');
    dataSituacao.innerHTML = movie.status;
    //inserindo elementos
    dataContainerSituacao.appendChild(dataSituacaoTitle);
    dataContainerSituacao.appendChild(dataSituacao);

    //gerando o holder de 'idioma' (sem os dados)
    var dataContainerIdioma = document.createElement('div');
    dataContainerIdioma.setAttribute('class', 'dataContainer');
    //gerando a estrutura do título 'idioma'
    var dataIdiomaTitle = document.createElement('div');
    dataIdiomaTitle.setAttribute('class', 'dataTitle');
    var idiomaP = document.createElement('p');
    idiomaP.innerHTML = 'Idioma';
    dataIdiomaTitle.appendChild(idiomaP);
    //gerando a estrutura do dado de 'idioma'
    var dataIdioma = document.createElement('div');
    dataIdioma.setAttribute('class', 'data');
    searchAndInsertLanguages(dataIdioma, movie.original_language);
    //inserindo elementos
    dataContainerIdioma.appendChild(dataIdiomaTitle);
    dataContainerIdioma.appendChild(dataIdioma);

    //gerando o holder de duração (sem os dados)
    var dataContainerDuracao = document.createElement('div');
    dataContainerDuracao.setAttribute('class', 'dataContainer');
    //gerando estrutura do título 'duração'
    var dataDuracaoTitle = document.createElement('div');
    dataDuracaoTitle.setAttribute('class', 'dataTitle');
    var duracaoP = document.createElement('p');
    duracaoP.innerHTML = 'Duração';
    dataDuracaoTitle.appendChild(duracaoP);
    //gerando estrutura do dado 'duração'
    var dataDuracao = document.createElement('div');
    dataDuracao.setAttribute('class', 'data');
    dataDuracao.innerHTML = movie.runtime + ' minutos';
    //inserindo elementos
    dataContainerDuracao.appendChild(dataDuracaoTitle);
    dataContainerDuracao.appendChild(dataDuracao);

    //gerando o holder de orçamento (sem os dados)
    var dataContainerOrcamento = document.createElement('div');
    dataContainerOrcamento.setAttribute('class', 'dataContainer');
    //gerando a estrutura do título 'orçamento'
    var dataOrcamentoTitle = document.createElement('div');
    dataOrcamentoTitle.setAttribute('class', 'dataTitle');
    var orcamentoP = document.createElement('p');
    orcamentoP.innerHTML = 'Orçamento';
    dataOrcamentoTitle.appendChild(orcamentoP);
    //gerando estrutura do dado 'orçamento'
    var dataOrcamento = document.createElement('div');
    dataOrcamento.setAttribute('class', 'data');
    dataOrcamento.innerHTML = '$' + (movie.budget).toLocaleString('pt-BR');
    //inserindo elementos
    dataContainerOrcamento.appendChild(dataOrcamentoTitle);
    dataContainerOrcamento.appendChild(dataOrcamento);

    //gerando o holder de receita (sem os dados)
    var dataContainerReceita = document.createElement('div');
    dataContainerReceita.setAttribute('class', 'dataContainer');
    //gerando a estrutura do título 'receita'
    var dataReceitaTitle = document.createElement('div');
    dataReceitaTitle.setAttribute('class', 'dataTitle');
    var receitaP = document.createElement('p');
    receitaP.innerHTML = 'Receita';
    dataReceitaTitle.appendChild(receitaP);
    //gerando estrutura do dado 'receita'
    var dataReceita = document.createElement('div');
    dataReceita.setAttribute('class', 'data');
    dataReceita.innerHTML = '$' + (movie.revenue).toLocaleString('pt-BR');
    //inserindo elementos
    dataContainerReceita.appendChild(dataReceitaTitle);
    dataContainerReceita.appendChild(dataReceita);

    //esrabelecendo o holder do lucro (sem os dados)
    var dataContainerLucro = document.createElement('div');
    dataContainerLucro.setAttribute('class', 'dataContainer');
    //gerando estrutura do título 'lucro'
    var dataLucroTitle = document.createElement('div');
    dataLucroTitle.setAttribute('class', 'dataTitle');
    var lucroP = document.createElement('p');
    lucroP.innerHTML = 'Lucro';
    dataLucroTitle.appendChild(lucroP);
    //gerando estrutura do dado 'lucro'
    var dataLucro = document.createElement('div');
    dataLucro.setAttribute('class', 'data');
    var lucro = movie.revenue - movie.budget;
    dataLucro.innerHTML = '$' + (lucro).toLocaleString('pt-BR');
    //inserindo elementos
    dataContainerLucro.appendChild(dataLucroTitle);
    dataContainerLucro.appendChild(dataLucro);



    //gerando a estrutura que comporta os gêneros e a porcentagem
    var genreAndPercentageHolder = document.createElement('div');
    genreAndPercentageHolder.setAttribute('class', 'genreAndPercentageDetailsHolder');
    //gerando a estrutura que comporta os gêneros
    var genreDetailsHolder = document.createElement('div');
    genreDetailsHolder.setAttribute('class', 'genreDetailsHolder');
    //inserindo genero
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
        } else if (genre) {
            var genre3Details = document.createElement('div');
            genre3Details.setAttribute('class', 'genreDetails');
            genre3Details.innerHTML = genre.name;

            genreDetailsHolder.appendChild(genre3Details);
        }
    }

    //gerando a estrutura que comporta a porcentagem
    var percentageDetailsHolder = document.createElement('div');
    percentageDetailsHolder.setAttribute('class', 'percentageDetailsHolder');
    //inserindo porcentagem
    var percentageDetails = document.createElement('div');
    percentageDetails.setAttribute('class', 'percentageDetails');
    if(movie.vote_average){
        percentageDetails.innerHTML = movie.vote_average;
    }
    percentageDetailsHolder.appendChild(percentageDetails);



    //inserindo demais elementos(estruturas que já contém os dados relevantes) na página
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

    return detailsCard;
    
}


/*função para converter generos de id->string (poderia ter feito uma função, como fiz com searchAndInsertLanguages(). Mas me pareceu no momento 
menos esforço buscar manualmente os dados e construir a série de 'ifs', ao invés dedicar mais tempo ao estudo e pesquisa das estruturas 
necessárias além de construí-las.Acabei depois aprendendo ao desenvolver searchAndInsertLanguages(), mas me falta tempo para construir uma nova 
função, testá-la e implementá-la).
*/
function genreIdToString(genreId){
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
        genreId = 'Documentário';
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

//função para converter gêneros de string->id
function genreStringToId(genre){
    genre = genre.toLowerCase();
    if (genre === 'acao' || genre === 'ação' || genre === 'açao' || genre === 'acão') {
        genre = '28';
    } else if (genre === 'aventura') {
        genre = '12';
    } else if (genre === 'animacao' || genre === 'animação' || genre === 'animaçao' || genre === 'animacão') {
        genre = '16';
    } else if (genre === 'comedia' || genre === 'comédia') {
        genre = '35';
    } else if (genre === 'crime') {
        genre = '80';
    } else if (genre === 'documentario' || genre === 'documentário') {
        genre = '99';
    } else if (genre === 'drama') {
        genre = '18';
    } else if (genre === 'familia' || genre === 'famílila') {
        genre = '10751';
    } else if (genre === 'fantasia') {
        genre = '14';
    } else if (genre === 'historia' || genre === 'história') {
        genre = '36';
    } else if (genre === 'terror') {
        genre = '27';
    } else if (genre === 'musica' || genre === 'música') {
        genre = '10402';
    } else if (genre === 'misterio' || genre === 'mistério') {
        genre = '9648';
    } else if (genre === 'romance') {
        genre = '10749';
    } else if (genre === 'ficcao cientifica' || genre === 'ficção científica') {
        genre = '878';
    } else if (genre === 'cinema tv') {
        genre = '10770';
    } else if (genre === 'thriller') {
        genre = '53';
    } else if (genre === 'guerra') {
        genre = '10752';
    } else if (genre === 'faroeste') {
        genre = '37';
    }

    return genre;
}

//gerando as estruturas dos filmes de forma individual, e retornando-as em uma estrutura maior
function generateMoviesInList(movies) {
    var everything = document.createElement('div');
    everything.setAttribute('class', 'everything');

    for(var i=0; i<movies.length; i++){
        var movie = movies[i];
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

//gera o trailer e a estrutura que o comporta
function generateMovieTrailer(video) {
    if(video){
        var trailerContainer = document.createElement('div');
        trailerContainer.setAttribute('class', 'trailerContainer');

        var iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'trailerIframe');

        iframe.src = `https://www.youtube.com/embed/${video.key}`;

        iframe.allowFullscreen = true;
        trailerContainer.appendChild(iframe);
        return trailerContainer;

    }
}

//evoca a função que gera a estrutura do trailer e a insere em outro elemento
function insertTrailer(data, elementoDeInsercao) {
    var trailers = data.results;
    trailer = trailers[0];
    var iframe = generateMovieTrailer(trailer);

    elementoDeInsercao.appendChild(iframe);
}

//delimita as ações para o funcionamento da estrutura que comporta os detalhes dos filmes+trailer
document.onclick = function (event) {
    var target = event.target;
    var details = document.getElementsByClassName('detailsCard').length;

    //se a imagem do movieCard é clicada, gerar os detalhes+trailer do filme
    if ((target.tagName.toLowerCase() === 'img') && target.parentElement.class !== 'detailsPosterContainer' && !details) {
        var movieId = target.dataset.movieId;

        var posterContainer = target.parentElement;
        var movieCard = posterContainer.parentElement;
        var movieHolder = movieCard.parentElement;

        var detailsCardHolder = document.createElement('div');
        detailsCardHolder.setAttribute('class', 'detailsCardHolder');

        var detailsContainer = document.createElement('div');
        detailsContainer.setAttribute('class', 'detailsContainer');

        detailsCardHolder.appendChild(detailsContainer);
        movieHolder.appendChild(detailsCardHolder);
       
        var movieUrl = generateMoviesUrl(movieId);
        request(movieUrl, (data) => {
            console.log('Trailers: ', data);
            insertMovieDetails(data, detailsContainer);
        }, handleError);

        var trailerUrl = generateTrailerUrl(movieId);
        request(trailerUrl, (data)=>{
            console.log('Trailers: ', data);
            insertTrailer(data, detailsCardHolder);
        }, handleError);
    }

    //se a barra superior da estrutura que comporta detalhes+trailer de um filme é clicada, o elemento deve ser removido da página
    if (target.className === 'detailsTitleCard' || target.className === 'spanTitle' || target.className === 'spanYear') {
        var toHide;
        if (target.className === 'spanTitle' || target.className === 'spanYear'){
            toHide = target.parentElement.parentElement.parentElement.parentElement;
        }else{
            toHide = target.parentElement.parentElement.parentElement;
        }
        toHide.remove();
    }
};

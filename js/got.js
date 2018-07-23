function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function getReady() {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // itt a json content, benne a data változóban
  var userDatas = JSON.parse(xhttp.responseText);
  var characterData = doRemoveDeadCharacters(userDatas[2].data);
  doSortCharactersByName(characterData);
  getCharacterList(characterData);
  console.log(characterData);
  /*
      Pár sorral lejebb majd ezt olvashatod:
      IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ!

      Na azokat a függvényeket ITT HÍVD MEG!

      A userDatas NEM GLOBÁLIS változó, ne is tegyétek ki globálisra. Azaz TILOS!
      Ha valemelyik függvényeteknek kell, akkor paraméterként adjátok át.
    */
}

// Írd be a json fileod nevét/útvonalát úgy, ahogy nálad van
getData('/json/characters.json', successAjax);

// Live servert használd mindig!!!!!
/* IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ! */
function doRemoveDeadCharacters(parameterArray) {
  for (var i = 0; i < parameterArray.length; i++) {
    if (parameterArray[i].dead === 'true') {
      parameterArray.splice(i, 1);
      i--;
    }
  }

  return parameterArray;
}

function getSingleCharacterProperty(parameterObject, parameterProperty) {
  return parameterObject[parameterProperty];
}

function getCharacterProfileImg(parameterObject, imgType) {
  var characterPicture = document.createElement('img');
  characterPicture.className = 'character-picture';
  characterPicture.characterData = parameterObject;
  if (imgType === 'portrait') {
    characterPicture.src = `/${getSingleCharacterProperty(parameterObject, 'portrait')}`;
  }
  if (imgType === 'picture' ) {
    characterPicture.src = `/${getSingleCharacterProperty(parameterObject, 'picture')}`;
  }
  if (imgType === 'picture' && parameterObject.name === 'Jorah Mormont') {
    characterPicture.src = `/${getSingleCharacterProperty(parameterObject, 'picture')}.jpg`;
  }
  return characterPicture;
}

function getCharacterNameP(parameterObject) {
  var characterName = document.createElement('p');
  characterName.className = 'character-name';
  characterName.innerHTML = getSingleCharacterProperty(parameterObject, 'name');

  return characterName;
}

function getCharacterBioP(parameterObject) {
  var characterBio = document.createElement('p');
  characterBio.className = 'character-bio';
  characterBio.innerHTML = getSingleCharacterProperty(parameterObject, 'bio');

  return characterBio;
}

function getRightSide(parameterObject) {
  var rightSideDiv = document.querySelector('.character-data');
  var characterPicture = getCharacterProfileImg(parameterObject, 'picture');
  var characterName = getCharacterNameP(parameterObject);
  var characterBio = getCharacterBioP(parameterObject);
  characterBio.className = 'character-bio';
  rightSideDiv.innerHTML = '';
  rightSideDiv.appendChild(characterPicture);
  rightSideDiv.appendChild(characterName);
  if (parameterObject.house !== '') {
    var characterHouse = document.createElement('img');
    characterHouse.className = 'house-image';
    characterHouse.src = `/assets/houses/${parameterObject.house}.png`;
    rightSideDiv.appendChild(characterHouse);
  }
  rightSideDiv.appendChild(characterBio);
}

function doRemoveSelected() {
  var images = document.querySelectorAll('img');
  for (var i = 0; i < images.length; i++) {
    if (images[i].classList.contains('selected')) {
      images[i].classList.remove('selected');
    }
  }
}

function getSingleCharacter(parameterObject) {
  var characterDiv = document.createElement('div');
  characterDiv.className = 'character-div';
  var characterPicture = getCharacterProfileImg(parameterObject, 'portrait');
  var characterName = getCharacterNameP(parameterObject);
  characterPicture.addEventListener('click', function ev() {
    getRightSide(this.characterData);
    doRemoveSelected();
    this.classList.add('selected');
  });
  characterDiv.appendChild(characterPicture);
  characterDiv.appendChild(characterName);

  return characterDiv;
}

function getCharacterList(parameterArray) {
  var characterListDiv = document.querySelector('.character-list');
  for (var i = 0; i < parameterArray.length; i++) {
    var singleCharacterDiv = getSingleCharacter(parameterArray[i]);
    characterListDiv.appendChild(singleCharacterDiv);
  }
}

function doSortCharactersByName(parameterArray) {
  var endIndex = parameterArray.length - 1;
  var newEndIndex;
  while (endIndex > 1) {
    newEndIndex = 0;
    for (var i = 0; i < endIndex; i++) {
      if (parameterArray[i].name > parameterArray[i + 1].name) {
        [parameterArray[i], parameterArray[i + 1]] = [parameterArray[i + 1], parameterArray[i]];
        newEndIndex = i;
      }
    }
    endIndex = newEndIndex;
  }
}

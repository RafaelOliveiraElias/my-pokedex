const gen1 =[1, 151, 'gen1'];
const gen2 =[152, 251, 'gen2'];
const gen3 =[252, 386, 'gen3'];
const gen4 =[387, 493, 'gen4'];
const gen5 =[494, 649, 'gen5'];
const gen6 =[650, 721, 'gen6'];
const gen7 =[722, 809, 'gen7'];
const gen8 =[810, 898, 'gen8'];

const todasGens = [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8]
const buttons = document.getElementById('buttons');
const h3type = document.getElementById('h3type');
const bttnAddTeam = document.getElementById('addTeam');

var xValues = ["HP", "Att", "Def", "S-Att", "S-Def", 'Spe'];
var barColors = ["#CC0000", "#CC0000","#CC0000","#CC0000","#CC0000", "#CC0000"];
const chartXXX = new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label: false ,
      backgroundColor: barColors,
      data: [45, 49, 49, 65, 65, 45]
    }],
  },
  options: {
    tooltips: {enabled: false},
    hover: {mode: null},
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 120,   
        beginAtZero: true
      },
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    legend: {display: false},
    events: [],
 }
});

function generateGraphic(values) {
  chartXXX.data.datasets[0].data = values
  chartXXX.update();
}

function addendTyper(data1,appendend,class1) {
  const divType = document.createElement('div');
  const imgType1 = document.createElement('img');
  const imgType2 = document.createElement('img');

  if (data1.types.length === 1) {
    imgType1.src = `./iconsTypes/${data1.types[0].type.name}.png`
    imgType1.style.width = '80px';
    divType.appendChild(imgType1);
    divType.className = class1 + 'Solo'
    appendend.appendChild(divType);
    return 'Type: '
  }
  if (data1.types.length === 2) {
    imgType1.src = `./iconsTypes/${data1.types[0].type.name}.png`
    imgType1.style.width = '80px';
    imgType2.src = `./iconsTypes/${data1.types[1].type.name}.png`
    imgType2.style.width = '80px';
    divType.appendChild(imgType1);
    divType.appendChild(imgType2);
    divType.className = class1 + 'Duo'
    appendend.appendChild(divType);
    return 'Types: '
  }
}

function append(data) {
  const ul = document.querySelector('ul');
  
  const li = document.createElement('li');
  const divNome = document.createElement('div');
  const divImage = document.createElement('div');

  const img = document.createElement('img');

  divNome.innerHTML = data.name;
  divNome.className = 'names';
  img.src = data.imageUrl;
  divImage.className = 'icons1'
  divImage.appendChild(img);

  li.appendChild(divNome);
  li.appendChild(divImage);

  addendTyper(data,li,'typeIcons');

  li.addEventListener('click', () => {
    mainPkmn(data);
    })
  li.id = "firstPageText";
  ul.appendChild(li);
}
function mainPkmn (data) {
    document.getElementById('pkmnSelect').innerText = data.name;
    const mapAbilities = data.abilities;
    document.getElementById('pkmnSelectAbilities').innerText = mapAbilities;
    document.getElementById('pkmnSelectHeight').innerText = data.height;
    document.getElementById('pkmnSelectWeight').innerText = data.weight;
    const teste = document.getElementById('pkmnSelectType')
    while (teste.firstChild) {
      teste.removeChild(teste.lastChild);
    }
    h3type.innerText = addendTyper(data, document.getElementById('pkmnSelectType'), 'typeSelect');

    const imagesWhile = document.getElementById('pkmnSelectImg');
    while (imagesWhile.firstChild) {
      imagesWhile.removeChild(imagesWhile.lastChild);
    }
    const imgF = document.createElement('img');
    imgF.src = data.oficialArt;
    imagesWhile.appendChild(imgF);

    const imagesWhileS = document.getElementById('pkmnSelectImgShinny');
    while (imagesWhileS.firstChild) {
      imagesWhileS.removeChild(imagesWhileS.lastChild);
    }
    const imgFS = document.createElement('img');
    imgFS.src = data.frontShiny;
    imagesWhileS.appendChild(imgFS);
    const arrayValues = [data.hp, data.att, data.def, data.spa, data.sdf, data.spe]
    generateGraphic(arrayValues);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function extractNameAndImage(pokemonData) {
  return {
    name: `${pokemonData.name.charAt(0).toUpperCase()}${pokemonData.name.slice(1)}`,
    imageUrl: pokemonData.sprites.front_default,
    types: pokemonData.types,
    abilities: pokemonData.abilities.map((each) => ' ' + capitalizeFirstLetter(each.ability.name)),
    height: `${(pokemonData.height*0.1).toFixed(1)} m`,
    weight: `${(pokemonData.weight*0.1).toFixed(1)} kg`,
    oficialArt: pokemonData.sprites.other['official-artwork'].front_default,
    frontShiny: pokemonData.sprites.front_shiny,
    hp: pokemonData.stats[0].base_stat,
    att: pokemonData.stats[1].base_stat,
    def: pokemonData.stats[2].base_stat,
    spa: pokemonData.stats[3].base_stat,
    sdf: pokemonData.stats[4].base_stat,
    spe: pokemonData.stats[5].base_stat,
  };
}

async function fetchPokemon(pokemoNumber) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemoNumber}`);
    const data = await response.json();
    const pokemon = extractNameAndImage(data);

    append(pokemon);
  } catch (error) {
    console.log(error);
  }
}


async function fetchPokemonData(pokemoNumber) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemoNumber}`);
  const data = await response.json();
  
  return data;
}

async function fetchPokemonAsyncAwait(gen = [1 , 151]) {
  try {
    const listOfFunctions = [];
    for (let index = gen[0]; index <= gen[1]; index += 1 ) {
      listOfFunctions.push(await fetchPokemon(`${index}`))
    }
    const pokemonDataList = await Promise.all(listOfFunctions);

    const pokemonList = pokemonDataList.map(extractNameAndImage);

    pokemonList.forEach(append);
  } catch (error) {
    console.log(error);
  }
}
const saveListPkmsn = (item) => {
  localStorage.setItem('listPmns', item);
};
async function addListpkmn() {
  const choosenList = document.getElementById('designList');
  if (choosenList.lastElementChild.id === 'chosenNot') {
    const selected = document.getElementById('pkmnSelect').innerText;
    const choosePkmn = await fetchPokemonData(selected.toLowerCase());
    const divChoosed = document.querySelectorAll('#chosenNot')[0];
    const imgChoosed = document.createElement('img');
    imgChoosed.id = 'choosedImg'
    imgChoosed.className = choosePkmn.name
    imgChoosed.addEventListener('click', () => {
      const values = extractNameAndImage(choosePkmn);
      mainPkmn(values);
    })
    const spanChoosed = document.createElement('span');
    const butChoosed = document.createElement('button');
    butChoosed.innerText = 'x'
    butChoosed.id = 'removePkmn'
    imgChoosed.src = await choosePkmn.sprites.versions['generation-viii'].icons.front_default;
    spanChoosed.innerText = await capitalizeFirstLetter(choosePkmn.name);
    divChoosed.appendChild(butChoosed);
    divChoosed.appendChild(imgChoosed);
    divChoosed.appendChild(spanChoosed);

    document.querySelectorAll('#chosenNot')[0].id = 'chosen';
    saveListPkmsn(choosenList.innerHTML);
    butChoosed.addEventListener('click', (event) => {
      const liNew = document.createElement('div');
      liNew.id = 'chosenNot';
      choosenList.appendChild(liNew);
      event.target.parentElement.remove();
      saveListPkmsn(choosenList.innerHTML);
    })
  } else {
    alert('List is full')
  };
}
const getWholeSavedList = async () => {
  
  if (localStorage.getItem('listPmns') !== null) {
    const listPkmnChosen = document.getElementById('designList');
    listPkmnChosen.innerHTML = localStorage.getItem('listPmns');
    Array.from(document.querySelectorAll('#removePkmn')).forEach((item) =>
    item.addEventListener('click', (event) => {
      const liNew = document.createElement('div');
        liNew.id = 'chosenNot';
        listPkmnChosen.appendChild(liNew);
        event.target.parentElement.remove();
        saveListPkmsn(listPkmnChosen.innerHTML);
    }));
    Array.from(document.querySelectorAll('#choosedImg')).forEach((item) =>
    item.addEventListener('click', async (event) => {
      const choosePkmn = await fetchPokemonData(`${event.target.className}`);
      const values = extractNameAndImage(choosePkmn);
      mainPkmn(values);
    }));
  }
};


window.onload = () => {
  fetchPokemonAsyncAwait();
  todasGens.forEach((cada) => {
    document.getElementById(cada[2]).addEventListener('click', ()=>{
      document.querySelectorAll('li').forEach((each) => each.remove())
      fetchPokemonAsyncAwait(cada)
      document.getElementById('genName').innerText = `Pokedex ${cada[2][0].toUpperCase()}${cada[2].slice(1,3)} ${cada[2][3]}`
    })
  })
  bttnAddTeam.addEventListener('click', addListpkmn);
  document.getElementById('cleanList').addEventListener('click', () => {
    const listPkmnChosen = document.getElementById('designList');
    while (listPkmnChosen.firstChild) {
      listPkmnChosen.removeChild(listPkmnChosen.lastChild);
    }
    for (let index = 0; index < 6; index += 1) {  
    const divRegular = document.createElement('div');
    divRegular.id = 'chosenNot';
      listPkmnChosen.appendChild(divRegular);
    }
    saveListPkmsn(listPkmnChosen.innerHTML);
  })
  getWholeSavedList();
};

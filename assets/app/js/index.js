var pathImages = "assets/app/img/pokemons/";

class Pokemons {

    HttpUrlPokemons = {
        Method: 'GET',
        Url: 'src/resources/pokemons.json',
        Type: 'JSON'
    }

    ListPokemons = []

    pokemonSelected = {
        _id: 1,
        Iamge: "",
        Name: ""
    }
    /** Prepare and render items. */
    async renderList() {
        console.log('Render List Pokemons');
        if(this.ListPokemons.length == 0) {
            await this.servicePokemons();
        }
        let self = this;
        let listUl = document.getElementById('list-pokemons');
        listUl.innerHTML = '';
        Promise.all(
            self.ListPokemons.map((pokemon) => {
                if(self.pokemonSelected._id == pokemon._id) {
                    self.pokemonSelected = pokemon;
                }else {
                    self.addItem(listUl, pokemon);
                }
            })
        ).then(() => {
            /** Render pokemon selected. */
            self.renderInformationAdditional();
        });        
    }
    /** HttpRequest JSON [Pokemons] */
    async servicePokemons() {
        await fetch(this.HttpUrlPokemons.Url, {
            method: this.HttpUrlPokemons.Method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
              },
        })
        .then(res => res.json())
        .then((out) => {
            ClassPokemon.ListPokemons = out;
        }).catch((err) => {
            console.log('Pokemon Model loaded from PokemonModel.js because an error occurred in [Http CORS]. Copy and paste this project in server.');
            ClassPokemon.ListPokemons = PokemonModel
        });
    }
    /** Add item to list pokemons */
    addItem(listUl, pokemon) {
        let item = null;
        let img = null;
        item = document.createElement('li');
        item.setAttribute('data-id', pokemon._id);
        item.setAttribute('class', 'm-list__li m-grid__3 m-grid__s__4')
        item.addEventListener('click', this.onPokemonSelect);
        img = new Image();
        img.setAttribute('class', 'm-list__li__img');
        img.src = pathImages + pokemon.Image;
        item.appendChild(img);
        listUl.appendChild(item);
    }
    /** Event from element Pokemon tag li. */
    onPokemonSelect(event) {
        let id = event.currentTarget.getAttribute('data-id');
        ClassPokemon.pokemonSelected = ClassPokemon.ListPokemons.find(x=>x._id==parseInt(id));
        ClassPokemon.renderInformationAdditional();
        ClassPokemon.renderList();
    }
    /** For more pokemons. */
    renderListMore() {
        let listUl = document.getElementById('list-pokemons');
        let pokemon = JSON.parse(JSON.stringify(this.ListPokemons[this.ListPokemons.length-1]));
        var i = 0;
        for(i=0; i<=20; i++) {
            pokemon._id++;
            this.addItem(listUl, pokemon);
            this.ListPokemons.push(pokemon);
        }
    }
    /** Information additional from pokemon selected. */
    renderInformationAdditional() {
        document.getElementsByClassName('pk-name')[0].innerHTML = this.pokemonSelected.Name;
        document.getElementsByClassName('pk-image')[0].setAttribute('src', pathImages + this.pokemonSelected.Image);
        /** Load Information Additional.**/
        document.getElementsByClassName('pk-description-no')[0].innerHTML = this.pokemonSelected.Data.Position;
        document.getElementsByClassName('pk-description-level')[0].innerHTML = this.pokemonSelected.Data.Level;
        document.getElementsByClassName('pk-description-type')[0].innerHTML = this.pokemonSelected.Data.Type;
        document.getElementsByClassName('pk-description-ability')[0].innerHTML = this.pokemonSelected.Data.Ability;
        document.getElementsByClassName('pk-description-height')[0].innerHTML = this.pokemonSelected.Data.Height;
        document.getElementsByClassName('pk-description-weight')[0].innerHTML = this.pokemonSelected.Data.Weight;
    }
}

/** Init Class Pokemon and render List.*/
const ClassPokemon = new Pokemons();
ClassPokemon.renderList();
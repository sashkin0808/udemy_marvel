class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=1cb01f3a746829bb001ca035bedfbd85';
    _baseOffset = 210;
    _

    getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res =  await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transormCharacter);
    }
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transormCharacter(res.data.results[0]);
    }

    _transormCharacter = (char) => {
        let visibleDescription = char.description?char.description:'has no description :(';
        visibleDescription = visibleDescription.length > 200?visibleDescription.substr(0, 200) + '...':visibleDescription;
        return {
            id: char.id,
            name: char.name,
            description: visibleDescription,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}
export default MarvelService;
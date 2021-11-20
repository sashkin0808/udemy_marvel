import { React, Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import Spinner from '../spinner/spinner';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemloading: false,
        offset: 1541,
        charEnded: false
    };
    selected = null;

    marvelService = new MarvelService();

    onCharListLoaded = (newChars) => {
        let ended = false;

        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({chars, offset})=>({
            chars: [...chars, ...newChars], 
            loading: false,
            newItemloading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }
    onCharListLoading = () => {
        this.setState({
            newItemloading: true
        })
    }
    onError = () => {
        this.setState({
            loading:false,
            error: true
        })
    }
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    componentDidMount() {
        this.onRequest();
    }

    selRefs = [];

    setRef = (ref) => {
        this.selRefs.push(ref);
    }
    changeSelected = (i) => {
        this.selRefs.map(item => item.classList.remove('char__item_selected'));
        this.selRefs[i].classList.add('char__item_selected');
    }

    render () {
        const {chars,loading, error, newItemloading, offset, charEnded} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> :  null;
        const elements = chars.map((item, i) => {
            const {name, thumbnail, id} = item;
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li className="char__item" 
                    tabIndex={0}
                    ref={this.setRef}
                    key={id} 
                    onFocus={()=>{this.changeSelected(i);}}
                    onClick={()=>{this.props.onCharSelected(id); this.changeSelected(i);}}>
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        });
        const content = !(loading || error) ? elements : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button 
                    className="button button__main button__long" 
                    disabled={newItemloading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={()=>{this.onRequest(offset)}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        ) 
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
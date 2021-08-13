import './sass/main.scss';

import API from './js/fetchCountries';
import getRefs from './js/get-refs';
import counrtyCardTpl from './tamplates/country-card.hbs';

import debounce from "lodash.debounce";

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';


const refs = getRefs();

refs.input.addEventListener('input', debounce(countrySearchInput, 2000))

function countrySearchInput(e) {
    e.preventDefault();
    clearContainer()
    const searchQuery = e.target.value;


    API.fetchCountries(searchQuery)
        .then(onSearch)
        .catch(onFetchError)
    
}

function onSearch(inputValue) {
    if (inputValue.length > 10) {
        error({
      title: `Too many matches found. Please enter a more specific query!`,
        styling: 'brighttheme',
       delay: 3000,
    });
    }
    else if (inputValue.status === 404) {
         error({
      title: `No country has been found.`,
             styling: 'brighttheme',
             delay: 3000,
    });
    }
    else if (inputValue.length >= 2 && inputValue.length <= 10) {
        let countriesHtml = inputValue
            .map((country) => `<h1>${country.name}</h1>`)
            .join('');
        refs.container.innerHTML = `<ul>${countriesHtml}</ul>`;
    }
    else if (inputValue.length === 1) {
        renderCountryCard(inputValue, counrtyCardTpl)
    }
}

function renderCountryCard(countries, template) {
  const markup = countries.map(countries => template(countries)).join();
 refs.container.innerHTML = markup
}

function onFetchError(error) {
    error({
                title: `Please start entering your country`,
                delay: 3000,
            })
}

function clearContainer() {
    refs.container.innerHTML = '';
}
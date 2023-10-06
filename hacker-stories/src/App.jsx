/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps*/

import * as React from 'react'
import axios from 'axios'

const storiesFetchInit = 'STORIES_FETCH_INIT'
const storiesFetchSuccess = 'STORIES_FETCH_SUCCESS'
const storiesFetchFailure = 'STORIES_FETCH_FAILURE'
const removeStory = 'REMOVE_STORY'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const useStorageState = (key, initalState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initalState)
  React.useEffect(()=> {
    localStorage.setItem(key, value)}, [value, key]
  )
  return [value, setValue]
}


const storiesReducer = (state, action) => {
  switch (action.type) {
    case storiesFetchInit:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case storiesFetchSuccess:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case storiesFetchFailure:
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case removeStory:
      return {
        ...state,
        data: state.data.filter((story) =>
          action.payload.objectID !== story.objectID
        ),
      }
    default:
      throw new Error()
  }
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
    <form onSubmit = {onSearchSubmit}>
      <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {onSearchInput}>
        <strong> Search: </strong>
      </InputWithLabel>

      <button type = "submit" disabled = {!searchTerm}>
        Submit 
      </button>
    </form>
  )

const App = () =>  {

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const[url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  const handleSearchInput = (event) =>{
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
  }

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, 
    {data: [], isLoading: false, isError: false}
    )
  
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories(
      {
        type: storiesFetchInit
      }
    )
    try { 
      const result = await axios.get(url)

      dispatchStories({
        type : storiesFetchSuccess,
        payload: result.data.hits
      });
    } catch {
      dispatchStories({
        type : storiesFetchFailure
      })
    }
  }, [url])

  React.useEffect(() =>{
    handleFetchStories()
  }, [handleFetchStories])

  

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item
    })
  }

  return(
    <div>
      <h1>
        Hello World
      </h1>

      <SearchForm  searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

      <p>
        This is what you searched {searchTerm}
      </p>
      <hr />

      {stories.isError && <p> Something went wrong... </p>}

      { stories.isLoading ? (
        <p> Loading... </p>
      ) : (
        <List list= {stories.data} OnRemoveItem = {handleRemoveStory} />
      )    
      }
    </div>
  )}

const InputWithLabel = ({id, type, value, onInputChange, isFocused, children}) => {
  return(
    <>
      <label htmlFor={id}> {children} </label>
      <input id = {id} type={type} value = {value} autoFocus = {isFocused} onChange= {onInputChange}/>
    </>
    )
}

const List = ( {list, OnRemoveItem} ) => (
    <ul>
    {list.map((item) => (
      <Item key = {item.objectID} item = {item} OnRemoveItem = {OnRemoveItem}/>
    ))}
    </ul>
  );

const Item = ({item, OnRemoveItem}) => {
     return(   
      <li>
        <span>
          <a href = {item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
          <button type = 'button' onClick = {() =>
            OnRemoveItem(item)
          }>
            Dismiss
          </button>
        </span>
      </li>
    )
  }



export default App

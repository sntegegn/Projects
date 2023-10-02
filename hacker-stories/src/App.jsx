import * as React from 'react'
/* eslint-disable react/prop-types */

const useStorageState = (key, initalState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initalState)
  React.useEffect(()=> {
    localStorage.setItem(key, value)}, [value, key]
  )
  return [value, setValue]
}

const App = () =>  {
  const initailStories = [
    {
      title : 'React',
      url : 'https://reactjs.org/',
      author : 'Jordan Walke',
      num_comments : 3,
      points : 4,
      objectID: 0,
    },
    {
      title : 'Redux',
      url : 'https://redux.js.org/',
      author : 'Dan Abramov, Andrew Clark',
      num_comments : 2,
      points : 5,
      objectID: 1,
    }
  ];

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const [stories, setStories] = React.useState(initailStories)

  const handleSearch = (event) =>{
    setSearchTerm(event.target.value)
  };

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID != story.objectID
    )
    setStories(newStories)
  }

  const searchedStories = stories.filter((story) => 
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return(
    <div>
      <h1>
        Hello World
      </h1>

      <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {handleSearch}>
        <strong> Search: </strong>
      </InputWithLabel>

      <p>
        This is what you searched {searchTerm}
      </p>
      <hr />
      <List list= {searchedStories} OnRemoveItem = {handleRemoveStory} />

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

const List = ( {list, OnRemoveItem} ) => {
    <ul>
    {list.map((item) => (
      <Item key = {item.objectID} item = {item} OnRemoveItem = {OnRemoveItem}/>
    ))}
    </ul>
};

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

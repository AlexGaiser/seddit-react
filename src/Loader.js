import React from 'react';
import './App.css';

const Loader = (props) => {
  return(
      <React.Fragment>
        <h4 className="loading-text">Loading Data....</h4>
        <div className="loader"></div>
      </React.Fragment>
  )
}
export default Loader
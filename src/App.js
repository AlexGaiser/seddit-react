import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios'
import Loader from './Loader'
import redditLogo from './Reddit_logo_full_1.png'
import javascript from './javascript.png'
import django from './django.png'
import python from './python.png'
import textblob from './textblob-logo.png'
class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoaded: false,
            sideLoaded: false,
            resultsLoaded: false
        }
    }

    componentDidMount= async ()=>{
        const response = await Axios.get('/reddit/getsublist')
        console.log(response.data)
        const sublist = this.redditList(response.data.posts)
        const subcount = response.data.count 
        console.log(response.data);
        this.setState({
            isLoaded: true,
            sideLoaded: true,
            sublist: sublist,
            subcount: subcount, 
            isHovering: false, 
            showModal: false,
        })
    }
    redditList = (list)=>{
        const sublist = list.map((sub)=>{
            return <div className ="sidebar-item" >{`r/${sub.subreddit}`}</div>
        })
        return sublist
    }

    handleMouseOver=()=>{
        this.setState(this.toggleHoverState);
    }

    toggleHoverState =(state)=>{
        return {isHovering: !state.isHovering}
    }

    toggleInfo =()=>{
        this.setState({showModal:!this.state.showModal})
    }
    showModal=()=> {
        this.setState({showModal:true})
      }
    
      hideModal=()=>{
        this.setState({showModal:false})
      }
    handleChange=(event)=>{
        const {name,value} = event.target
        this.setState({[name]:value})
    }
    searchData= async(event)=>{
        event.preventDefault()
        this.setState({isLoaded:false, resultsLoaded:false})
        const response = await Axios.get(`/reddit/search=${this.state.searchWord}`)
        console.log(response.data);
        const {subjectivity, polarity} = response.data.sentiment
        const sentimentData = <h1>Polarity: {(polarity*100).toFixed(2)} | Subjectivity: {(subjectivity*100).toFixed(2)}</h1>
        const recordCount = response.data.count
        const polMessage = this.sentimentMessage(polarity, subjectivity)
        this.setState({ 
            sentimentData: sentimentData,
            recordCount: recordCount,
            isLoaded: true,
            resultsLoaded: true,
            polMessage: polMessage
                        })
    }

    fetchData = async(event) =>{
        this.setState({isLoaded:false, resultsLoaded:false})
        event.preventDefault()
        const response = await Axios.get(`/reddit/subreddit=${this.state.searchBox}`)
        console.log(response.data)
        const {subjectivity, polarity} = response.data.sentiment
        const sentimentData = <h1>Polarity: {(polarity*100).toFixed(2)} | Subjectivity: {(subjectivity*100).toFixed(2)}</h1>
        const recordCount = response.data.count

        const polMessage = this.sentimentMessage(polarity, subjectivity)
        this.setState({ 
            sentimentData: sentimentData,
            recordCount: recordCount,
            isLoaded: true,
            resultsLoaded: true,
            polMessage: polMessage
                        })
    }
    sentimentMessage=(polarity, subjectivity)=>{
        console.log(polarity)
        console.log(subjectivity)
        let polMessage = ''
        if(polarity > .1){
            polMessage = 'This result indicates a very positive sentiment rating'
        }
        else if(polarity>.075){
            polMessage = 'This result indicates an above average positive sentiment rating'
        } 
        else if(polarity >=.06){
            polMessage = 'This result has a neutral sentiment rating'
        }
        else if(polarity < .035 && polarity > 0.00){
            polMessage = 'This result has a very negative sentiment rating'
        }
        

        else if(polarity < .06){
            polMessage = 'This result has a slightly negative sentiment rating'
        }
        
        let subMessage = ''
        if (subjectivity> .34){
            subMessage = 'its content is subjective.'
        }
        else if(subjectivity <= .34 && subjectivity > 0){
            subMessage = 'its content is objective.'
        }
        
        else {
            subMessage = 'insufficient subjectivity data'
            polMessage = 'error: insufficient polarity data'
        } 
        return `${polMessage} and ${subMessage}`
    }

render() {
    return (
        <div>
      <div className="App" >
      
        <div className="app-main" >
        
            <img src={redditLogo} alt ='reddit-logo' className="reddit-logo"/>
            <h1 onClick={this.showModal} className="main-title">Seddit: Reddit Sentiment Analysis Machine </h1>
            <div className="search-field">
            <div className={this.state.showModal ? "modal modal-show":"modal"} onClick={this.hideModal}>
                <h4>Seddit:</h4>
                <p>Seddit is a media evaluation tool that uses Natural Language Processing and Sentiment Analysis to inform users and business leaders how topics are being discussed within the reddit community. It can also give a breakdown of the  polarity and subjectivity of a given community.
                <p>At time of writing, Seddit only has around 31,000 entries. However, it's dynamic design allows it to run better and faster searches the longer it runs. So please, enter a search and help Seddit grow!</p>
                <p>This program uses Python for its data collection and textual analysis. Django for it's server-side framework, React.js for client-side rendering of data, and Postgres for its database. 
                </p>
                </p>
                <h4>Sentiment Analysis:</h4>
                <p>Sentiment Analysisthe process of computationally identifying and categorizing opinions expressed in a piece of text, especially in order to determine whether the writer's attitude towards a particular topic, product, etc. is positive, negative, or neutral.
                </p>
                <h4>Polarity:</h4>
                <p>
                Polarity is a measurement of whether the expressed opinion in a document, a sentence or an entity feature/aspect is positive, negative, or neutral. For our purposes, higher numbers indicate a more positive sentiment, and lower numbers indicate a more negative response.
                </p>
                <h4>
                    Subjectivity:
                </h4>
                <p>
                    Subjectivity is a measurement of how subjective or objective a statement is. In our case, higher numbers indicate that a statement is based more heavily on subjective opinion, and lower numbers indicate a higher level of objectivity in the way the opinion was expressed.  
                </p>
            </div>
                <form onSubmit={this.searchData}>
                    <h3>Search By Keyword:</h3>
                        <div className="search-container">
                        <input className="search-input"
                            name = "searchWord" 
                            placeholder="search" 
                            type = "text" 
                            onChange={this.handleChange}
                        />
                    <button className="search-button">Submit</button>
                    </div>
                </form>
                <form onSubmit={this.fetchData}>
                <h3>Search By Subreddit:</h3>
                    <div className="search-container">
                        <input className="search-input"
                            name = "searchBox" 
                            placeholder="choose a subreddit" 
                            type = "text" 
                            onChange={this.handleChange}
                        />
                    <button className="search-button">Submit</button>
                    </div>
                </form>
                </div>
            <div className= "results-field">
                <div>{this.state.isLoaded ? this.state.sentimentData : <Loader/>}</div>
                <p className="pol-message">{this.state.isLoaded && this.state.polMessage}</p>
                
                <div className="records-sampled">{this.state.resultsLoaded && `Records sampled: ${this.state.recordCount}`}</div>
            
            </div>
        </div>
        
            
            
            <div className="sidebar-container">
                    <h4 className="subcount">Subreddits: {this.state.isLoaded && this.state.subcount}</h4>
                
                    {this.state.isLoaded && this.state.sublist}
            </div>
        </div>
        <div  className = "icons" >
      <h1>Built With:</h1>
      <img src ={python} className="icon"/>
      <img src ={django} className="icon"/>
      <img src ={textblob} className="icon"/>
      <img src ={javascript} className="icon"/>
      <img src={logo} className="icon"/>

        </div>
        </div>
    );
  }
}


export default App;

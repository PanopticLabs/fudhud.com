import React, { Component } from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import twitterLogo from '../assets/Twitter_Logo_Blue.png';
import redditLogo from '../assets/Reddit_Logo_Orange.png';
import { Avatar, Card, CircularProgress, Typography, Divider } from '@material-ui/core';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RepeatIcon from '@material-ui/icons/Repeat';

const socket = io('http://165.227.32.248:5000')

class SocialMediaFeed extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
    socket.on('msg', (data) => this.updateMessages(data));
  }

  componentDidMount() {
    socket.emit('join', {'service' : 'redditstream'});
    socket.emit('join', {'service' : 'tweetstream'});
  }

  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this).childNodes[0]
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = node.scrollTop;
  }

  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this).childNodes[0]
    if(this.scrollTop !== 0){
      const scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
      node.scrollTop = scrollTop
    }
  }
  //componentWillReceiveProps(nextProps) {}

  updateMessages(data) {
    const { messages } = this.state
    const { topics } = this.props
    //console.log(data)
    if(topics === []){
      messages.unshift(data)
      this.setState({messages})
    } else {
      const intersect = data.topics.filter((n) => topics.includes(n))
      if(intersect.length > 0){
        messages.unshift(data)
        this.setState({messages})
      }
    }
  }

  urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const html = text.replace(urlRegex, function(url) {
      return(`<a href=${url} target='_blank' rel='noopener noreferrer'>${url}</a>`)
    })

    return(<span dangerouslySetInnerHTML={{ __html: html }} />)
  }

  render() {
    const { classes } = this.props
    const { messages } = this.state

    return (
      <Card style={{height:`${630 + theme.spacing(2)}px`, overflow:'hidden'}}>
        <div style={{overflowY:'scroll', paddingRight:'17px', boxSizing: 'content-box', width:'100%', height:'100%'}}>
          {messages.length === 0 && (
            <div style={{textAlign:'center'}}>
              <Typography color='textSecondary' style={{textAlign:'center', padding:'20px', fontStyle:'italic', opacity:'0.5', fontSize:'0.9rem'}}>Loading Social Media...</Typography>
              <CircularProgress color="secondary"/>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={classes.containerDiv}>
              <div className={classes.messageDiv}>
                <div className={classes.userDiv}>
                  {message.service === 'tweetstream' ? (
                    <Avatar alt={message.name} src={message.pic} className={classes.picAvatar} />
                  ) : (
                    <Avatar className={classes.letterAvatar}>{message.author.toUpperCase().charAt(0)}</Avatar>
                  )}
                  <div className={classes.nameDiv}>
                    {message.service === 'redditstream' ? (
                      <Typography color='textSecondary' variant="subtitle1" style={{marginTop:'5px',lineHeight:'25px', fontSize:'1rem'}}>
                        {message.author}
                      </Typography>
                    ) : (
                      <Typography color='textSecondary' variant="subtitle1" style={{lineHeight:'25px', fontSize:'1rem'}}>
                        {message.name}
                      </Typography>
                    )}

                    {message.service === 'tweetstream' && (
                      <Typography color='textSecondary' variant="subtitle2" style={{lineHeight:'20px', fontSize:'0.8rem'}}>
                        @{message.screen_name}
                      </Typography>
                    )}
                  </div>
                  <a href={message.link} target="_blank" rel="noopener noreferrer">
                    {message.service === 'tweetstream' && (
                      <img className={classes.feedLogo} src={twitterLogo} alt='twitter'/>
                    )}
                    {message.service === 'redditstream' && (
                      <img className={classes.feedLogo} src={redditLogo} alt='reddit'/>
                    )}
                  </a>
                </div>
                <div className={classes.textDiv}>
                  {message.service === 'tweetstream' && (
                    <Typography color='textSecondary'>{this.urlify(message.tweet)}</Typography>
                  )}
                  {message.service === 'redditstream' && (
                    <Typography color='textSecondary' dangerouslySetInnerHTML={{ __html: message.comment.replace('\n', '</p><p>') }} />
                  )}
                </div>
                {message.media && (
                  <div>
                    <a href={message.media} target="_blank" rel="noopener noreferrer">
                      <img className={classes.media} src={message.media} alt='twitterimage'/>
                    </a>
                  </div>
                )}
                {message.service === 'tweetstream' && (
                  <div className={classes.rtDiv}>
                    <span className={classes.badge}>
                      <RepeatIcon className={classes.icon}/>
                      <span className={classes.count}>{message.rt_count}</span>
                    </span>
                    <span className={classes.badge}>
                      <FavoriteIcon className={classes.icon}/>
                      <span className={classes.count}>{message.fav_count}</span>
                    </span>
                  </div>
                )}
              </div>
              {(index !== message.length-1) && (
                <Divider />
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  }
}

const theme = createMuiTheme();

const styles = {
  containerDiv: {
    width:'calc(100% + 17px)',
    padding:0,
    margin:0,
  },
  messageDiv: {
    margin:theme.spacing(4),
    position:'relative',
    width:`calc(100% - ${theme.spacing(4)})`,
  },
  userDiv: {
    height:50,
  },
  nameDiv: {
    display:'inline-block',
    position:'absolute',
    top:0,
    left:50,
    width:200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textDiv: {
    wordWrap: 'break-word',
  },
  rtDiv: {

  },
  badge: {
    marginRight:theme.spacing(2),
  },
  icon: {
    height:20,
    width:20,
    verticalAlign:'middle',
  },
  count: {
    fontSize:'0.8rem',
    lineHeight:'20px',
    verticalAlign:'middle',
    padding:theme.spacing(0.5,1),
    marginLeft:theme.spacing(1),
    borderRadius:'12px',
    backgroundColor:'rgba(0,0,0,0.1)',
  },
  picAvatar: {
    marginRight: 10,
  },
  letterAvatar: {
    color: '#fff',
    backgroundColor: '#16a6f9',
    marginRight: 10,
  },
  feedLogo: {
    height:'24px',
    width:'24px',
    position:'absolute',
    top:0,
    right:0,
  },
  media: {
    maxWidth:'calc(100% - 5px)',
  },
}

SocialMediaFeed.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SocialMediaFeed);

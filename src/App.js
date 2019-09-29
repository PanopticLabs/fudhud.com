import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Img from 'react-image'
import Cookies from 'universal-cookie'
import clsx from 'clsx';
import logo from './assets/fudhud.svg'
import DownshiftMultiple from './components/DownshiftMultiple'
import TwitterFrequency from './components/TwitterFrequency'
import RedditFrequency from './components/RedditFrequency'
import SocialMediaFeed from './components/SocialMediaFeed'
import { ThemeProvider } from '@material-ui/styles'
import { withStyles, createMuiTheme } from '@material-ui/core/styles'
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  CssBaseline,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import ClearIcon from '@material-ui/icons/Clear'

const cookies = new Cookies()
const drawerWidth = 240
const currentPalette = 'dark'

const palette = {
  'light' : {
    logoBackground: '#031429',
    appBar: '#062245',
    sideBar: '#062245',
    sideBarIcon: '#16a6f9',
    sideBarText: '#16a6f9',
    background : '#e0f2fc',
    paper: '#fff',
    primaryText: '#16a6f9',
    secondaryText: '#393B3D',
    highlight: '#16a6f9',
  },
  'dark' : {
    logoBackground: '#1B1D1F',
    appBar: '#26282B',
    sideBar: '#1B1D1F',
    sideBarIcon: '#16a6f9',
    sideBarText: '#16a6f9',
    background : '#393B3D',
    paper: '#26282B',
    primaryText: '#16a6f9',
    secondaryText: '#aaa',
    highlight: '#16a6f9',
  }
}

const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: 'none',
      }
    },
    MuiCard: {
      root: {
        boxShadow: 'none',
        borderRadius: '20px',
      }
    },
    MuiOutlinedInput: {
      root: {
        '& fieldset': {
          borderColor: 'transparent',
        },
      },
    },
  },
  palette: {
    primary: {
      main: palette[currentPalette].appBar,
    },
    secondary: {
      main: palette[currentPalette].highlight,
    },
    background: {
      default: palette[currentPalette].background,
      paper: palette[currentPalette].paper
    },
    text: {
      primary: palette[currentPalette].primaryText,
      secondary: palette[currentPalette].secondaryText,
    }
  },
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      open: (cookies.get('open') !== undefined && cookies.get('open') === 'true') ? true : false,
      time: (cookies.get('time') === undefined) ? 'Week' : cookies.get('time'),
      customized: (cookies.get('customized') !== undefined && cookies.get('customized') === 'true') ? true : false,
      coinLimit: (cookies.get('coinLimit') === undefined) ? 5 : cookies.get('coinLimit'),
      coinList: (cookies.get('coinList') === undefined) ? [] : cookies.get('coinList'),
      coins: (cookies.get('coins') === undefined) ? [] : cookies.get('coins'),
    }
  }

  handleDrawerOpen = () => {
    cookies.set('open', true)
    this.setState({open : true});
  }

  handleDrawerClose = () => {
    cookies.set('open', false)
    this.setState({open : false});
  }

  componentDidMount = () => {
    this.queryAPI()
  }

  queryAPI = () => {
    const { customized, coinList, coinLimit } = this.state
    let query = ''
    if(customized) {
      let first = true
      coinList.forEach(function (item){
        if(first){
          first = false
          query += '?'
        } else {
          query += '&'
        }
        query += `topics[]=${item}`
      })
    } else {
      query = `?limit=${coinLimit}`
    }
    fetch(`https://api.panoptic.io/fudhud/coins${query}`)
      .then(response => response.json())
      .then(json => {
        const coins = json.data
        const coinList = []
        coins.forEach(function (item){
          coinList.push(item.symbol)
        })
        cookies.set('coinList', coinList)
        cookies.set('coins', coins)
        this.setState({coins : coins, coinList: coinList})
      })
  }

  addCoins = ( coinArray ) => {
    const { coinList } = this.state
    const newList = [...coinList, ...coinArray]
    cookies.set('customized', true)
    cookies.set('coinList', newList)
    this.setState({customized: true, coinList: newList}, this.queryAPI)
  }

  removeCoin = ( coin ) => {
    const { coins, coinList } = this.state
    const newList = coinList.filter(function(i) {
    	return i != coin
    })
    const newCoins = coins.filter(function(i) {
      return i.symbol != coin
    })
    cookies.set('coinList', newList)
    cookies.set('coins', newCoins)
    this.setState({coinList: newList, coins: newCoins})
  }

  cycleTime = () => {
    const { time } = this.state
    if(time === 'Week'){
      cookies.set('time', 'Month')
      this.setState({time : 'Month'})
    } else if(time === 'Month'){
      cookies.set('time', 'Quarter')
      this.setState({time : 'Quarter'})
    } else if(time === 'Quarter'){
      cookies.set('time', 'Year')
      this.setState({time : 'Year'})
    } else if(time === 'Year'){
      cookies.set('time', 'Week')
      this.setState({time : 'Week'})
    }
  }

  render() {
    const { classes } = this.props
    const { open, time, coinList, coins } = this.state

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                color="inherit"
                className={clsx(classes.menuButton, {
                  [classes.hide]: !open,
                })}
                onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
              <DownshiftMultiple addCoins={this.addCoins} classes={classes} />
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
            open={open}
          >
            <div className={classes.toolbar}>
              <img src={logo} className={clsx(classes.logo)} alt='FUDHUD'/>
            </div>
            <List>
              <ListItem button key={time} onClick={() => this.cycleTime()}>
                <ListItemIcon>
                  <WatchLaterIcon className={classes.systemIcon}/>
                </ListItemIcon>
                <ListItemText primary={time} style={{color: palette[currentPalette].sideBarText}}/>
              </ListItem>
              <Divider />
              {coins.map((object, index) => (
                <ListItem button key={object.name}>
                  <ListItemIcon>
                    <Img
                      src={object.imageURL}
                      loader={<CircularProgress color="secondary" style={{height: theme.spacing(4), width: theme.spacing(4)}}/>}
                      unloader={<Avatar className={classes.letterAvatar}>{object.symbol.toUpperCase()}</Avatar>}
                      alt={object.name.toLowerCase()}
                      className={classes.coinIcon}
                    />
                  </ListItemIcon>
                  <ListItemText primary={object.name} className={classes.listText}/>
                  <ClearIcon onClick={() => this.removeCoin(object.symbol)}/>
                </ListItem>
              ))}
              <Divider />
              <ListItem button key={'API'} style={{display:'none'}}>
                <ListItemIcon>
                  <SettingsApplicationsIcon className={classes.systemIcon}/>
                </ListItemIcon>
                <ListItemText primary={'API'} style={{color: palette[currentPalette].sideBarText}}/>
              </ListItem>
            </List>
          </Drawer>
          {coinList.length > 0 && (
            <main className={classes.content}>
              <div className={classes.spacer}></div>
              <Box display="flex" flexWrap="wrap">
                <Box flexGrow={1} className={classes.mainFlexItem}>
                  <TwitterFrequency
                    time={time.toLowerCase()}
                    coinList={coinList}
                  />
                  <div className={classes.flexMargin} />
                  <RedditFrequency
                    time={time.toLowerCase()}
                    coinList={coinList}
                  />
                </Box>
                <Box className={classes.flexItem}>
                  <SocialMediaFeed
                    theme={theme}
                    topics={coinList}
                  />
                </Box>
              </Box>
            </main>
          )}
        </div>
      </ThemeProvider>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
  },
  logo: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    verticalAlign: 'middle',
    margin: theme.spacing(1),
    position: 'absolute',
    left: theme.spacing(3.5),
    transform: 'translateX(-50%)'
  },
  appBar: {
    width: `calc(100% - ${theme.spacing(9) + 1}px)`,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    padding: theme.spacing(0, 2),
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: palette[currentPalette].sideBar,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
  drawerClose: {
    backgroundColor: palette[currentPalette].sideBar,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(9) + 1
  },
  toolbar: {
    backgroundColor: palette[currentPalette].logoBackground,
    width: drawerWidth - 1,
    height: theme.spacing(8),
    //background: 'linear-gradient(45deg, #132B36 30%, #131E22 90%)'
  },
  spacer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  searchIcon: {
    verticalAlign: 'middle',
    color: '#fff',
    marginRight:theme.spacing(1),
  },
  systemIcon: {
    color: palette[currentPalette].sideBarIcon,
    height: theme.spacing(4),
    width: theme.spacing(4),
    margin:theme.spacing(0,0.5),
  },
  coinIcon: {
    border: `2px solid ${palette[currentPalette].sideBarIcon}`,
    backgroundColor: 'transparent',
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: '50%',
    margin:theme.spacing(0,0.5),
  },
  letterAvatar: {
    fontSize:'0.55rem',
    color: palette[currentPalette].sideBar,
    border: `2px solid ${palette[currentPalette].sideBarIcon}`,
    backgroundColor: palette[currentPalette].sideBarIcon,
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: '50%',
    margin:theme.spacing(0,0.5),
  },
  listText: {
    color: palette[currentPalette].sideBarText,
    width:200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  flexItem: {
    margin:theme.spacing(1),
    width:'350px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth:'100%',
    },
  },
  mainFlexItem: {
    margin:theme.spacing(1),
    maxWidth:`calc(100% - ${350 + theme.spacing(2)}px)`,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth:'100%',
    },
  },
  flexMargin: {
    marginBottom:theme.spacing(2),
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionBox: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(0.5),
    left: 0,
    right: 0,
    backgroundColor: `${palette[currentPalette].appBar}ee`,
  },
  chip: {
    margin: theme.spacing(0.5, 1, 0.5, 0),
    color: palette[currentPalette].primaryText,
    backgroundColor: '#ffffff10',
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
    color:palette[currentPalette].primaryText,
  },
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

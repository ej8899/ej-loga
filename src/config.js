//
// GLOBAL object
//


// TASK:
// add this to index.js
// import './config.js'; // for global configuration variables (EJ added)

const globalconfig = {
  // application details:
  appVersion: "1.0",
  appDeveloper: "Ernie Johnson",
  appName: "erniejohnson.ca - web developer portfolio",

  // debug mode true or false
  // usage is:  if (global.config.debug) console.log("debugging info here"); // or of course, other options for debug purposes
  debug: true,

  cookiesModal: true, // use modal windows in this app.
  useToday: true, // use today to set current day view in scheduler - fails tests if true (tests were modified to support this - to remove)

  // api keys
  youtubekey: 123,

  // additional global vars and functions:
  timeClock: 12,       // 12 or 24 for clock setting - // todo - save to localstorage
  currentTheme: 'light', // light or dark

  link: {
    github: "https://github.com/ej8899/",
    linkedin: "https://www.linkedin.com/in/ernie-johnson/",
    twitter: "http://www.twitter.com/ejdevscom",
    youtube: "https://www.youtube.com/@oldmancodes",
  },

  // usage: isFalsey(value) - is true if false value - checks Nan, 0, null, undefined, false, and ""
  isFalsey: function (value:any) {
    return !value;
  },

  // usage: global.config.goSleep(xxx).then(()=> { ... });
  goSleep: function (ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },  
};

/*
Setup for a global function like this:

const isFalsey = (value) => !value;
global.isFalsey = isFalsey;

*/

export default globalconfig;
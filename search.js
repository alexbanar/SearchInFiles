path = require('path');
fs = require('fs')

//for getting from user
var filesSearchExtention;
//for getting from user
var filesSearchString = null;
//for checking if there is at least one file
//with the extention that user entered
var isFileWithUserInputExtention = false;

/**
function that recursively finds files in current directory
with inputed file extention and/or containment string
 */
var filesListGet = function(currentPath, filesList) {
  //var path = ((typeof path !== "undefined") ? path : require('path'));
  //var fs = ((typeof fs !== "undefined") ? fs : require('fs'));
  //filesList = filesList || [];

  var filesAndOrDirsNames = fs.readdirSync(currentPath);

  filesList = ((typeof filesList !== "undefined") ? filesList : []);
    filesAndOrDirsNames.forEach(function(fileOrDirName) {
      var nextPath = path.join(currentPath, fileOrDirName)
        if (fs.statSync(nextPath).isDirectory()) {
            filesList = filesListGet(nextPath, filesList);
        }
        else {
          var fileName = fileOrDirName;

          //file name length need to be greater at least by 2
          //than the command name extention length, because of
          //at least one letter for the file name and one place for '.'(dot)
          if(fileName.length > (filesSearchExtention.length + 1)) {
            //if in the fileName the plase of '.'(dot) with file extention
            //after it is greater exactly by 1 than
            //beginnig place of the extention in the fileName
            if (fileName.indexOf('.' + filesSearchExtention)
                    == (fileName.length - filesSearchExtention.length - 1)) {
              isFileWithUserInputExtention = true;
              //if there was only first command line parameter
              //(after 'search.js' application name) that contains
              //the string for checking extention of existing files
              if(filesSearchString == null)
              {
                filesList.push(nextPath);
              }
              //if there was the second command line parameter
              //(after 'search.js' application name) that contains
              //the string for searching files that contain this string
              else {//check if the String for Searching
                    // in files indeed is contained in files
                var fileContent = fs.readFileSync(nextPath, 'utf8');
                //if(fileContent.indexOf(filesSearchString) >= 0) {
                  //pattern for searching whole word strings matching
                  //to string that has been received from the user
                  var regex = new RegExp('\\b' + filesSearchString + '\\b');
                  //if whole word has been found in all data from file
                  if(fileContent.search(regex) >= 0) {
                    filesList.push(nextPath);
                  }
                //}
                  else {
                    console.log("No file was found:\n"
                                + "There are no files with the extention "
                                + "'" + filesSearchExtention + "'\n"
                                + "and that contain string word "
                                + "'" + filesSearchString + "'\n"
                                + "under the current directory");
                  }
              }
            }
          }
        }
    });

    return filesList;
};

/**
function that gets input paramaters from user from command line,
checks if it was one(file extention) or two(file extention
and string for searching it in files) of them
on a command line(otherwise prints USAGE message),
and then calls to function that recursively finds files in current directory
with inputed file extention and/or containment string
 */
var filesPathGetByExtentionAndOrString = function() {
  //There is no command line parameters after 'search.js' application name
  if(process.argv.length <= 2) {
    console.log("USAGE: node search [EXT] [TEXT]");
    process.exit(-1);
  }
/*
  //(process.argv.length is 3) ==
  // (There is only one command line parameter instead of two
  // after'search.js' application name)
  if(process.argv.length < 4) {
    console.log("Too few command line parameters");
    console.log("USAGE: node search [EXT] [TEXT]");
    process.exit(-1);
  }
*/
  //There is more than 2 command line parameters
  // after 'search.js' application name
  if(process.argv.length > 4) {
    console.log("Too much command line parameters");
    console.log("USAGE: node search [EXT] [TEXT]");
    process.exit(-1);
  }

  var isEnteredOnlyFileExtention = true;
  //if only one command line parameter (for files extention)
  //(after 'search.js' application name)
  //if(process.argv.length == 3) {
    //get the first command line parameter for files extention
    //search after 'search.js' application name
    filesSearchExtention = process.argv[2];
  //}

  //if two command line parameters (for files extention and
  // the string for searching files that contain it )
  //(after 'search.js' application name)
  if(process.argv.length == 4) {
    //get the second command line parameter (after 'search.js' application name)
    //that contain the string for searching files that contain this string word
    filesSearchString = process.argv[3];
    isEnteredOnlyFileExtention = false;
  }
  //calls to function that recursively finds files in current directory
  //with inputed file extention and/or containment string
  var finalFilesList = filesListGet(__dirname);
  //if user entered only file extention parameter in command line
  //and if there was no file with the extention that user entered
  if( (isEnteredOnlyFileExtention == true)
        && (isFileWithUserInputExtention == false)) {
    console.log("No file was found:\n"
                + "There are no files with the extention "
                + "'" + filesSearchExtention + "'\n"
                + "under the current directory");
  }
  //if the user entered file extention parameter and the string
  //parameter for searching files that contain it in command line
  //and if there was no file with the extention that user entered
  else if((isFileWithUserInputExtention == false)) {
    console.log("No file was found:\n"
                + "There are no files with the extention "
                + "'" + filesSearchExtention + "'\n"
                + "and that contain string word "
                + "'" + filesSearchString + "'\n"
                + "under the current directory");
  }

  /*for(var i = 0; i < finalFilesList.length; i++) {
    console.log(finalFilesList[i]);
  }*/

  console.log(finalFilesList.join("\r\n"));
}

//calling to the above function
filesPathGetByExtentionAndOrString();

*** Variables ***
${URL}                      http://127.0.0.1:3002

# Email and Password must be provided in "robot" command
# e.g. "robot --variable BACKENDTESTEMAIL: x --variable BACKENDTESTPASSWORD: y"
${BACKENDTESTEMAIL}         default
${BACKENDTESTPASSWORD}      default

# this will be set in initial login test
${bearerToken}              default
${userId}                   default 


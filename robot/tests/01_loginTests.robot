*** Settings ***
Library     RequestsLibrary
Library     String


*** Variables ***
${URL}      http://localhost:3000


*** Test Cases ***
Verify server requires authentication
    ${response}=    GET    ${URL}    expected_status=401

Verify user can't login with nonexistent email
    &{data}=    Create dictionary    email=nonexistent    password=randompassword
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=404
    Should Be Equal    Invalid Email or Password    ${response.json()['message']}

Verify user can't login without password
    ${data}=    Create dictionary    email=${BACKENDTESTEMAIL}
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=403
    Should Be Equal    Invalid Email or Password    ${response.json()['message']}

Verify user can't login with wrong password
    ${data}=    Create dictionary    email=${BACKENDTESTEMAIL}    password=wrongpassword
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=403
    Should Be Equal    Invalid Email or Password    ${response.json()['message']}

Verify user can login
    ${data}=    Create dictionary    email=${BACKENDTESTEMAIL}    password=${BACKENDTESTPASSWORD}
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
    Set Global Variable    ${bearerToken}    access_token=${response.json()['secret']}
    Log To Console    ${bearerToken}

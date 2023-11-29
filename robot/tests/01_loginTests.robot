*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Test Cases ***
Verify server requires authentication
    ${response}=    GET    ${URL}    expected_status=401

Verify user can't login with nonexistent user
    &{data}=    Create dictionary    email=this.user@notexist.aol    password=randompassword
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=400
    Should Be Equal    Invalid Email or Password    ${response.json()['message']}

Verify user can't login without password
    ${data}=    Create dictionary    email=${BACKENDTESTEMAIL}
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=403
    Should Be Equal    Invalid Email or Password    ${response.json()['message']}

Verify user can't login without email
    ${data}=    Create dictionary    password=${BACKENDTESTPASSWORD}
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=400
    Should Be Equal    Email and password required    ${response.json()['message']}

Verify user can't login with wrong password
    ${data}=    Create dictionary    email=${BACKENDTESTEMAIL}    password=wrongpassword
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=403
    Should Be Equal    Invalid Email or Password    ${response.json()['message']}

Verify user can login
    ${data}=    Create dictionary    email=${BACKENDTESTEMAIL}    password=${BACKENDTESTPASSWORD}
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
    Set Global Variable    ${bearerToken}    access_token=${response.json()['secret']}
    Set Global Variable    ${userId}    ${response.json()['userId']}
    Log To Console    ${bearerToken}
    Log To Console    ${userId}

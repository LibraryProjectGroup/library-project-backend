*** Settings ***
Library     RequestsLibrary
Library     String


*** Variables ***
${URL}      http://localhost:3000


*** Test Cases ***
Verify server requires authentication
    ${response}=    GET    ${URL}    expected_status=401

Verify user can't login with nonexistent username
    &{data}=    Create dictionary    username=nonexistent    password=randompassword
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=404
    Should Be Equal    No account by that username    ${response.json()['message']}

Verify user can't login without password
    ${data}=    Create dictionary    username=joonajoo
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=400
    Should Be Equal    Username and password required    ${response.json()['message']}

Verify user can't login with wrong password
    ${data}=    Create dictionary    username=joonajoo    password=wrongpassword
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=403
    Should Be Equal    Invalid password    ${response.json()['message']}

Verify user can login
    &{data}=    Create dictionary    username=joonajoo    password=soin5oeran
    ${response}=    POST    ${URL}/auth/login    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
    Set Global Variable    ${bearerToken}    access_token=${response.json()['secret']}
    Log To Console    ${bearerToken}

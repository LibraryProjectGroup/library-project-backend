*** Settings ***

Library    RequestsLibrary
Library    String

*** Variables ***

${URL}         https://libraryproject.ddns.net/


*** test cases ***

Verify server requires authentication
    ${response}=    GET  ${URL}    expected_status=401

Verify user can login
    &{data}=    Create dictionary    username=joonajoo    password=soin5oeran
    ${response}=    POST  ${URL}/auth/login   json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
    Set Global Variable    ${bearerToken}    access_token=${response.json()['secret']}
    Log To Console    ${bearerToken}

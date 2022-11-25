*** Settings ***

Library    RequestsLibrary
Library    String

*** Variables ***

${URL}         http://localhost:3000


*** test cases ***


Verify registration requires password
    &{data}=    Create dictionary    username=Raul
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Password has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires username
    &{data}=    Create dictionary    username=
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires username over 3 characters
    &{data}=    Create dictionary    username=Ra    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires password over 3 characters
    &{data}=    Create dictionary    username=username    password=pa
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Password has to be between 3 and 50 characters    ${response.json()['message']}


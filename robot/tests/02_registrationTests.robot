*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Test Cases ***
Verify registration requires password
    &{data}=    Create dictionary    email=raul@example.com    username=raul
    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Password has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires username
    &{data}=    Create dictionary    email=raul@example.com
    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires username over 3 characters
    &{data}=    Create dictionary    email=raul@example.com    username=ra    password=password
    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires password over 3 characters
    &{data}=    Create dictionary    email=raul@example.com    username=raul    password=pa
    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Password has to be between 3 and 50 characters    ${response.json()['message']}

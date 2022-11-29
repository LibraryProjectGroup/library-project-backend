*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Variables ***

${URL}         http://localhost:3000

*** Test Cases ***
Verify user can logout
    ${response}=    GET    ${URL}/auth/logout?${bearerToken}    expected_status=200
    Should Be True    ${response.json()['ok']}

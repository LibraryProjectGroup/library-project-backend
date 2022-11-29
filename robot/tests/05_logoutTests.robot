*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Variables ***

${URL}         http://localhost:3000

*** Test Cases ***
Verify user can logout
    ${headers}=    Create dictionary   Authorization=Bearer ${bearerToken}
    ${response}=    GET    ${URL}/auth/logout   headers=${headers}   expected_status=200
    Should Be True    ${response.json()['ok']}

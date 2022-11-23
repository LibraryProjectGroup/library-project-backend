*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Test Cases ***
Verify user can logout
    ${response}=    GET    ${URL}/auth/logout?${bearerToken}    expected_status=200
    Should Be True    ${response.json()['ok']}

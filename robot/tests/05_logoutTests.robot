*** Settings ***

Library    RequestsLibrary
Library    String

*** Variables ***

${URL}         http://localhost:3000


*** test cases ***



#Verify user can logout
#    ${response}=    POST  ${URL}/auth/logout?${bearerToken}   expected_status=200
#    Should Be True    ${response.json()['ok']}

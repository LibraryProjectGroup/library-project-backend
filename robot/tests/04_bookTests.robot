*** Settings ***

Library    RequestsLibrary
Library    String

*** Variables ***

${URL}         https://libraryproject.ddns.net/


*** test cases ***

Verify that all books can be found
    ${response}=    GET     url=${URL}/book/all?${bearerToken}    expected_status=200

Verify that user cannot get a nonexisting book
    ${response}=    GET     url=${URL}/book/?id=123456789&${bearerToken}    expected_status=200
    Should Be Equal  ${response.json()}  ${None} 

Verify that user can check book by id
    ${response}=    GET     url=${URL}/book/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}   ${1}

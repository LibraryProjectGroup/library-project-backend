*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String

*** Test Cases ***
Verify that all borrows can be found
    ${response}=    GET    url=${URL}/borrow/all?${bearerToken}    expected_status=200

Verify that user can find borrow by id
    ${response}=    GET    url=${URL}/borrow/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}    ${1}

Verify that user can't find borrow by non-existing id
    ${response}=    GET    url=${URL}/borrow/?id=12345&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()}    ${none}

Verify that user can check borrowed book by id
    ${response}=    GET    url=${URL}/borrow/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}    ${1}

Verify that new borrow for book can be created
    &{data}=    Create dictionary
    ...    { bookId=2 }
    ${response}=    POST    url=${URL}/borrow?${bearerToken}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that user can't delete non-existing borrow
    &{data}=    Create dictionary
    ...    { bookId=1234 }
    ${response}=    DELETE    url=${URL}/borrow?${bearerToken}    json=${data}    expected_status=200
    Should Not Be True    ${response.json()['ok']}

Verify that user can get current borrows
    ${response}=    GET    url=${URL}/borrow/current?${bearerToken}    expected_status=200

Verify that user can get borrows by session
    ${response}=    GET    url=${URL}/borrow/session${bearerToken}    expected_status=200

Verify that borrow can be returned
    &{data}=    Create dictionary
    ...    { bookId=2 }
    ${response}=    PUT    url=${URL}/borrow/return?${bearerToken}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that user can delete borrow
    &{data}=    Create dictionary
    ...    { bookId=2 }
    ${response}=    DELETE    url=${URL}/borrow?${bearerToken}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
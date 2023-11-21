*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String

*** Test Cases ***
Verify that user can add favorite
    &{data}=    Create dictionary
    ...    { bookId=3 }
    ${response}=    POST    url=${URL}/favorite?${bearerToken}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that user can get counts for all favorited books
    ${response}=    GET    url=${URL}/favorite/counts?${bearerToken}    expected_status=200

Verify that user can delete book from favorites
    &{data}=    Create dictionary
    ...    { bookId=3 }
    ${response}=    DELETE    url=${URL}/favorite?${bearerToken}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that user can't delete book that isn't favorited
    &{data}=    Create dictionary
    ...    { bookId=3123 }
    ${response}=    DELETE    url=${URL}/favorite?${bearerToken}    expected_status=400
    Should Not Be True    ${response.json()['ok']}

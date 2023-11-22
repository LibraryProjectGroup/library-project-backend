*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String

*** Test Cases ***
#Verify that user can add favorite
#    &{data}=    Create dictionary
#    ...     bookId=4 
#    ${response}=    POST    url=${URL}/favorite?${bearerToken}    expected_status=200
#    Should Be True    ${response.json()['ok']}

Verify that user can get counts for all favorited books
    ${response}=    GET    url=${URL}/favorite/counts?${bearerToken}    expected_status=200

Verify that user can get count for books
    ${response}=    GET    url=${URL}/favorite/count?${bearerToken}&bookId=4    expected_status=200
    Should Be Equal    ${response.json()['count']}    ${0}

Verify that user can check if book is favorited
    ${response}=    GET    url=${URL}/favorite/check?${bearerToken}&bookId=4    expected_status=200
    Should Be Equal    ${response.json()['isFavorited']}    ${false}

#Verify that user can delete book from favorites
#    &{data}=    Create dictionary
#    ...     bookId=4 
#    ${response}=    DELETE    url=${URL}/favorite?${bearerToken}    expected_status=200
#    Should Be True    ${response.json()['ok']}

Verify that user can't delete book that isn't favorited
    &{data}=    Create dictionary
    ...     bookId=3123 
    ${response}=    DELETE    url=${URL}/favorite?${bearerToken}    expected_status=400
    Should Not Be True    ${response.json()['ok']}

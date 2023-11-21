*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String

*** Variables ***
${okTrueJson}    {"ok":true}
${okFalseJson}    {"ok":false}
${reviewId}    {EMPTY}    #For modified value


*** Test Cases ***
Verify that user can add review to book
    ${data}=    Create dictionary
    ...    bookId=1
    ...    comment='Great book for everyone!'
    ...    rating=5    
    ${response}=    POST   url=${URL}/review?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can't add review to non-existing book
    ${data}=    Create dictionary
    ...    bookId=1124
    ...    comment='Wrong book'
    ...    rating=1   
    ${response}=    POST   url=${URL}/review?${bearerToken}    json=${data}    expected_status=500
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}

Verify that user can check all reviews
    ${response}=    GET   url=${URL}/review/all?${bearerToken}    expected_status=200
    ${json_response}=  Evaluate  json.loads('''${response.text}''')  json
    ${reviewId}=  Set Variable  ${json_response[-1]['reviewId']}

Verify that user can check reviews for all books
    ${response}=    GET   url=${URL}/review/reviews?${bearerToken}    expected_status=200   

Verify that user can modify review
    ${data}=    Create dictionary
    ...    comment='Modified book'
    ...    rating=1
    ...    reviewId=${reviewId}   
    ${response}=    POST   url=${URL}/review?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can't modify non-existing review
    ${data}=    Create dictionary
    ...    comment='Again wrong book'
    ...    rating=1
    ...    reviewId=1234   
    ${response}=    POST   url=${URL}/review?${bearerToken}    json=${data}    expected_status=400
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}
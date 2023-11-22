*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String

*** Variables ***
${okTrueJson}    {"ok":true}
${okFalseJson}    {"ok":false}

*** Test Cases ***
Verify that user can add reservations
    ${data}=    Create dictionary
    ...    bookId=2     
    ${response}=    POST   url=${URL}/bookreservation?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can't add reservations for non-existing book
    ${data}=    Create dictionary
    ...    bookId=1123     
    ${response}=    POST   url=${URL}/bookreservation?${bearerToken}    json=${data}    expected_status=500
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}

Verify that user can check all reservations
    ${response}=    GET    url=${URL}/bookreservation/all?${bearerToken}    expected_status=200
    ${list}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${list}    1

Verify that user can check all extended reservations
    ${response}=    GET    url=${URL}/bookreservation/all/extended?${bearerToken}    expected_status=200
    ${list}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${list}    1

Verify that user can check reservation based on bookId
    ${data}=    Create dictionary
    ...    bookId=2     
    ${response}=    GET   url=${URL}/bookreservation/book?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal    ${response.json()['bookId']}    ${2}

Verify that user can't check reservation based on non-existing bookId
    ${data}=    Create dictionary
    ...    bookId=33245     
    ${response}=    GET   url=${URL}/bookreservation/book?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal    ${response.json()}    ${none}

Verify that user can cancel reservation
    ${data}=    Create dictionary
    ...    bookId=1    
    ${response}=    POST   url=${URL}/bookreservation/cancel?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}
    
Verify that user can check all current reservations
    ${response}=    GET    url=${URL}/bookreservation/all/current?${bearerToken}    expected_status=200
    ${list}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${list}    0

Verify that user can loan reservation
    ${data}=    Create dictionary
    ...    bookId=1    
    ${response}=    POST   url=${URL}/bookreservation/loan?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can see their current reservations
    ${data}=    Create dictionary
    ...    userId=${userId}    
    ${response}=    POST   url=${URL}/bookreservation/user/current?${bearerToken}    json=${data}    expected_status=200
    ${list}=    Evaluate    json.loads('''${response.text}''')
    Should Be Equal    ${response.json()}    ${none}

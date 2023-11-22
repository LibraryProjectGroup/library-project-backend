*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Test Cases ***
Verify that user can add request
    ${data}=    Create dictionary
    ...    isbn='234-123-345'
    ...    title='Lizard Disco'
    ...    reason='Great book, easy to read' 
    ${response}=    POST   url=${URL}/bookrequest?${bearerToken}    expected_status=200

Verify that user can check all users booklists
    ${response}=    GET    url=${URL}/bookrequest/all?${bearerToken}    expected_status=200
    ${list}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${list}    1
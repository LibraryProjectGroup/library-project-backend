*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String

*** Variables ***
${okTrueJson}    {"ok":true}
${okFalseJson}    {"ok":false}

*** Test Cases ***
Verify that user can add booklists
    ${data}=    Create dictionary
    ...     name=Testlist     
    ${response}=    POST   url=${URL}/booklist?${bearerToken}    json=${data}    expected_status=200
    
Verify that user can check all booklists
    ${response}=    GET    url=${URL}/booklist/all?${bearerToken}    expected_status=200

Verify that user can check all users booklists
    ${response}=    GET    url=${URL}/booklist/user?${bearerToken}    expected_status=200
    ${bookList}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${bookList}    1

Verify that user can add books to list
    ${data}=    Create dictionary
    ...    list=1
    ...    book=2  
    ${response}=    POST   url=${URL}/booklistentry?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can't add non-existing books to list
    ${data}=    Create dictionary
    ...    list=1
    ...    book=2123  
    ${response}=    POST   url=${URL}/booklistentry?${bearerToken}    json=${data}    expected_status=500
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}
    
Verify that user can't add books to non-existing list
    ${data}=    Create dictionary
    ...    list=11234
    ...    book=2  
    ${response}=    POST   url=${URL}/booklistentry?${bearerToken}    json=${data}    expected_status=500
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}
    
Verify that user can get all booklistentrys
    ${response}=    GET   url=${URL}/booklistentry/all?${bearerToken}   expected_status=200
    
Verify that user get all booklistentrys based on listId
    ${response}=    GET   url=${URL}/booklistentry/list?${bearerToken}&id=1    expected_status=200
    ${bookList}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${bookList}    1
     
Verify that user get all books in list based on listId
    ${response}=    GET   url=${URL}/booklist/books?${bearerToken}&id=1    expected_status=200
    ${bookList}=    Evaluate    json.loads('''${response.text}''')
    Length Should Be    ${bookList}    1

Verify that user can modify booklist
    ${data}=    Create dictionary
    ...    id=1
    ...    name=New name  
    ${response}=    PUT   url=${URL}/booklist?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can't modify non-existing booklist
    ${data}=    Create dictionary
    ...    id=12345
    ...    name=Wrong list  
    ${response}=    PUT   url=${URL}/booklist?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}

Verify that user can delete booklist
    ${data}=    Create dictionary
    ...    id=1
    ${response}=    DELETE   url=${URL}/booklist?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okTrueJson}

Verify that user can't delete non-existing booklist
    ${data}=    Create dictionary
    ...    id=1123
    ${response}=    DELETE   url=${URL}/booklist?${bearerToken}    json=${data}    expected_status=200
    Should Be Equal As Strings    ${response.text}    ${okFalseJson}
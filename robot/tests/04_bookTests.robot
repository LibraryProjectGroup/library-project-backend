*** Settings ***
Resource    ../common.resource
Library    RequestsLibrary
Library    String


*** test cases ***

Verify that all books can be found
    ${response}=    GET     url=${URL}/book/all?${bearerToken}    expected_status=200

Verify that user cannot get a nonexisting book
    ${response}=    GET     url=${URL}/book/?id=123456789&${bearerToken}    expected_status=200
    Should Be Equal  ${response.json()}  ${None} 

Verify that new book can be created
    &{data}=    Create dictionary    { library_user=2    title=Fake Book    author=Test Author    isbn=123-242-421    topic=js    location=Fake location    deleted=0}
    ${response}=    POST    url=${URL}/book?${bearerToken}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that user can check book by id
    ${response}=    GET     url=${URL}/book/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}   ${1}


# Verify that book can be updated
#     &{data}=    Create dictionary    { library_user=2    title=Fake asdf    author=Test Author    isbn=123-242-421    topic=js    location=Fake location    deleted=0}
#     ${response}=    PUT    url=${URL}/book/?id=12&${bearerToken}    json=${data}    expected_status=200
#     Should Be True    ${response.json()['ok']}    
    
# Verify that a book can be deleted 
#     ${response}=    DELETE    url=${URL}/book/?id=10&${bearerToken}    expected_status=200
#     Should Be True    ${response.json()['ok']}

# Verify that a nonexistent book can't be deleted
#     ${response}=    DELETE    url=${URL}/book/?id=12321&${bearerToken}    expected_status=200
#     Should Be True    ${response.json()['ok']}





*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Test Cases ***
Verify that all books can be found
    ${response}=    GET    url=${URL}/book/all?${bearerToken}    expected_status=200

Verify that user cannot get a nonexisting book
    ${response}=    GET    url=${URL}/book/?id=123456789&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()}    ${None}

Verify that new book can be created
    &{data}=    Create dictionary
    ...    { library_user=2
    ...    title=Fake
    ...    image=https://images.isbndb.com/covers/91/26/9789513119126.jpg
    ...    author=Test Author
    ...    year=2023
    ...    isbn=123-242-421
    ...    topic=js
    ...    homeOfficeId=1
    ...    homeOfficeName=Helsinki
    ...    homeOfficeCountry=FIN
    ...    deleted=0}
    ${response}=    POST    url=${URL}/book?${bearerToken}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that user can check book by id
    ${response}=    GET    url=${URL}/book/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}    ${1}

Verify that a nonexistent book can't be deleted
    ${response}=    DELETE    url=${URL}/book/?id=12321&${bearerToken}    expected_status=403
    Should Not Be True    ${response.json()['ok']}

Verify that book can be updated
    &{data}=    Create dictionary    { library_user=2    title=Fake asdf    image=http://books.google.com/books/content?id=ILqrxQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api    author=Test Author     year=2022    isbn=123-242-421    topic=js    location=Fake location    deleted=0}
    ${response}=    PUT    url=${URL}/book/?id=4&${bearerToken}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

# Verify that a book can be deleted
#    ${response}=    DELETE    url=${URL}/book/?id=10&${bearerToken}    expected_status=200
#    Should Be True    ${response.json()['ok']}

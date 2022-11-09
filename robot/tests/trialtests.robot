*** Settings ***

Library    RequestsLibrary
Library    String

*** Variables ***

${URL}         http://localhost:3000


*** test cases ***

Verify user can login
    &{data}=    Create dictionary    username=joonajoo    password=soin5oeran
    ${response}=    POST  ${URL}/auth/login   json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
    Set Global Variable    ${bearerToken}    access_token=${response.json()['secret']}
    Log To Console    ${bearerToken}

Verify server requires authentication
    ${response}=    GET  ${URL}    expected_status=401

Verify registration requires username
    ${response}=    POST  ${URL}/auth/register   expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires password
    &{data}=    Create dictionary    username=Raul
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Password has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires username over 3 characters
    &{data}=    Create dictionary    username=Ra    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username has to be between 3 and 50 characters    ${response.json()['message']}

Verify registration requires password over 3 characters
    &{data}=    Create dictionary    username=username    password=pa
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Password has to be between 3 and 50 characters    ${response.json()['message']}

Create random username
        ${RDMid}=      Generate random string    9    0123456789
        Set Global Variable    ${randomUsername}    ${RDMid}

Verify user can be created
    &{data}=    Create dictionary    username=${randomUsername}    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify user cannot be duplicated
    &{data}=    Create dictionary    username=${randomUsername}    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Log    ${response}
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username is already taken    ${response.json()['message']}

Verify that all books can be found
    ${response}=    GET     url=${URL}/book/all?${bearerToken}    expected_status=200

Verify that all users can be found
    ${response}=    GET     url=${URL}/user/all?${bearerToken}    expected_status=200
    Log    ${response}

Verify that user cannot get a nonexisting book
    ${response}=    GET     url=${URL}/book/?id=123456789&${bearerToken}    expected_status=200
    Should Be Equal  ${response.json()}  ${None} 

Verify that user can check book by id
    ${response}=    GET     url=${URL}/book/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}   ${1}

Verify that user can check user by id    
    ${response}=    GET     url=${URL}/user/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}   ${1}

#Verify user can be deleted
#    &{data}=    Create dictionary    id=24
#    ${response}=    DELETE  url=${URL}/user/?${bearerToken}    json=${data}    expected_status=200
#    Should Be True    ${response.json()['ok']}    

Verify non existing user can't be deleted
    &{data}=    Create dictionary    id=-24
    ${response}=    DELETE  url=${URL}/user/?${bearerToken}    json=${data}    expected_status=200
    Should Not Be True    ${response.json()['ok']} 

Verify that user cannot get a nonexisting user
    ${response}=    GET     url=${URL}/user/?id=121&${bearerToken}    expected_status=404
    Should Not Be True    ${response.json()['ok']}

Verify user can logout
    ${response}=    POST  ${URL}/auth/logout?${bearerToken}   expected_status=200
    Should Be True    ${response.json()['ok']}




    


#Post Request Should Have Post Method
#    [Tags]    Post
#    ${resp}=    POST    url=${URL}/example
#    Should Be Equal As Strings    ${resp.json()}[method]    POST


# Post Request Expect An Error And Evaluate Response
#    [Tags]    post
#    ${resp}=    POST    url=${URL}/auth/register  expected_status=404
#    Should Be Equal As Strings    UNAUTHORIZED    ${resp.reason}
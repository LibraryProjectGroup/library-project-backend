*** Settings ***

Library  RequestsLibrary

*** Variables ***

${URL}         http://localhost:3000
${bearerToken}    "Bearer c668b8054bba2a6e520e73f0993eb4ea"

*** test cases ***

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

Verify user can be created
    &{data}=    Create dictionary    username=username    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=200
    Should True    ${response.json()['ok']}

Verify user cannot be duplicated
    &{data}=    Create dictionary    username=username    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username is already taken    ${response.json()['message']}

Verify that a book can be found
    &{data}=    Create dictionary    username=username    password=password
    &{headers}    Create dictionary    Authorization=${bearerToken}
    ${response}=    GET  url=${URL}/book/?id=1  headers=${headers}    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}
    #Should Be Equal As Strings    Username is already taken    ${response.json()['message']}

#Verify user can be deleted
 #   &{data}=    Create dictionary    username=username    password=password
 #   &{headers}    Create dictionary    Authorization=${bearerToken}
 #   ${response}=    DELETE  url=${URL}/user/?id=13  headers=${headers}    expected_status=200
 #   Should Be True    ${response.json()['ok']}

#Post Request Should Have Post Method
#    [Tags]    Post
#    ${resp}=    POST    url=${URL}/example
#    Should Be Equal As Strings    ${resp.json()}[method]    POST



# Post Request Expect An Error And Evaluate Response
#    [Tags]    post
#    ${resp}=    POST    url=${URL}/auth/register  expected_status=404
#    Should Be Equal As Strings    UNAUTHORIZED    ${resp.reason}
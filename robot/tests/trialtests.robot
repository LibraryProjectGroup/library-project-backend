*** Settings ***

Library    RequestsLibrary

*** Variables ***

${URL}         http://localhost:3000
${bearerToken}    "Bearer a80de4d40fb275eaa3ed96b57ced45d0"
${params}    access_token=abb62c774ebd8cc6e9b17ec60a7edb2f

*** test cases ***

 # BearerAuthTest
   # create session  mysession   ${URL}
    #${header}  create dictionary   Authorization=${bearerToken}    Content-Type=application/json
   # ${response}=    Post On Session    mysession   /   headers=${header}
   # log to console  ${response.status_code}
   # log to console  ${response.content}

Verify server requires authentication
    ${response}=    GET  ${URL}    expected_status=401
    Log  ${response}

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
    &{data}=    Create dictionary    username=username123    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify user cannot be duplicated
    &{data}=    Create dictionary    username=username    password=password
    ${response}=    POST  ${URL}/auth/register   json=${data}    expected_status=400
    Log    ${response}
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username is already taken    ${response.json()['message']}

Verify user can login
    &{data}=    Create dictionary    username=joonajoo    password=soin5oeran
    ${response}=    POST  ${URL}/auth/login   json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify that all books can be found
    ${response}=    GET     url=${URL}/book/all?${params}    expected_status=200
    Log    ${response}

Verify that all users can be found
    ${response}=    GET     url=${URL}/user/all?${params}    expected_status=200
    Log    ${response}

Verify that user cannot get a nonexisting book
    ${response}=    GET     url=${URL}/book/?id=123456789&${params}    expected_status=200
    Should Be Equal  ${response.json()}  ${None} 

Verify that user can check book by id
    ${response}=    GET     url=${URL}/book/?id=1&${params}    expected_status=200
    Should Be Equal    ${response.json()['id']}   ${1}

Verify that user can check user by id    
    ${response}=    GET     url=${URL}/user/?id=1&${params}    expected_status=200
    Should Be Equal    ${response.json()['id']}   ${1}

Verify user can be deleted
    ${response}=    DELETE  url=${URL}/user/?id=13&${params}    expected_status=200
    Should Be True    ${response.json()['ok']}    

 




# This one gives status code 500?
#Verify that user cannot get a nonexisting user
    #${response}=    GET     url=${URL}/user/?id=123456789&${params}    expected_status=200
    #Should Be Not True  ${response.json()['ok']} 

    # THIS ONE WORKS BUT IT REMOVES THE TOKEN AUTH
 # Verify user can logout
    # &{headers}=    Create dictionary    Authorization=${bearerToken}
    # ${response}=    POST  ${URL}/auth/logout?${params}   expected_status=200
    # Should Be True    ${response.json()['ok']}
    


#Post Request Should Have Post Method
#    [Tags]    Post
#    ${resp}=    POST    url=${URL}/example
#    Should Be Equal As Strings    ${resp.json()}[method]    POST


# Post Request Expect An Error And Evaluate Response
#    [Tags]    post
#    ${resp}=    POST    url=${URL}/auth/register  expected_status=404
#    Should Be Equal As Strings    UNAUTHORIZED    ${resp.reason}
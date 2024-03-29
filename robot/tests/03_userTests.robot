*** Settings ***
Resource    ../common.resource
Library     RequestsLibrary
Library     String


*** Test Cases ***
Create random username
    ${RDMid}=    Generate random string    9    0123456789
    Set Global Variable    ${randomUsername}    ${RDMid}

Verify user can be created
    &{data}=    Create dictionary
    ...    email=${randomUsername}@example.com
    ...    username=${randomUsername}
    ...    password=password

    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=200
    Should Be True    ${response.json()['ok']}

Verify email cannot be duplicated
    &{data}=    Create dictionary
    ...    email=${randomUsername}@example.com
    ...    username=unpocoloco
    ...    password=password
    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=400
    Log    ${response}
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Email is already taken    ${response.json()['message']}

Verify user cannot be duplicated
    &{data}=    Create dictionary
    ...    email=unpocoloco@example.com
    ...    username=${randomUsername}
    ...    password=password
    ${response}=    POST    ${URL}/auth/register    json=${data}    expected_status=400
    Log    ${response}
    Should Not Be True    ${response.json()['ok']}
    Should Be Equal As Strings    Username is already taken    ${response.json()['message']}

Verify that all users can be found
    ${response}=    GET    url=${URL}/user/all?${bearerToken}    expected_status=200
    Log    ${response}

Verify that user can check user by id
    ${response}=    GET    url=${URL}/user/?id=1&${bearerToken}    expected_status=200
    Should Be Equal    ${response.json()['id']}    ${1}

Verify non existing user can't be deleted
    &{data}=    Create dictionary    id=-24
    ${response}=    DELETE    url=${URL}/user/?${bearerToken}    json=${data}    expected_status=200
    Should Not Be True    ${response.json()['ok']}

Verify that user cannot get a nonexisting user
    ${response}=    GET    url=${URL}/user/?id=-1&${bearerToken}    expected_status=404
    Should Not Be True    ${response.json()['ok']}

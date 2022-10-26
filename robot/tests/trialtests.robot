*** Settings ***

Library  RequestsLibrary

*** Variables ***

${URL}         https://libraryproject.ddns.net

*** test cases ***

Get Request Test
    ${response}=    GET  ${URL} 

Quick Get A JSON Body Test
      ${response}=    GET  url=${URL}/example
      Should Be Equal As Strings   Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition   ${response.json()}[0][title]

Post Request Should Have Post Method
    [Tags]    Post
    ${resp}=    POST    url=${URL}/example
    Should Be Equal As Strings    ${resp.json()}[method]    POST

Post Request Expect An Error And Evaluate Response
    [Tags]    post
    ${resp}=    POST    url=${URL}/example   expected_status=404
    Should Be Equal As Strings    UNAUTHORIZED    ${resp.reason}
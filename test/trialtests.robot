*** Settings ***

Library  RequestsLibrary

*** Variables ***


*** test cases ***

Get Request Test
    ${response}=    GET  http://javaohjelmointi.net:15001/book/all

Quick Get A JSON Body Test
      ${response}=    GET  url=http://javaohjelmointi.net:15001/example
      Should Be Equal As Strings   Python Machine Learning: Machine Learning and Deep Learning with Python, scikit-learn, and TensorFlow 2, 3rd Edition   ${response.json()}[0][title]
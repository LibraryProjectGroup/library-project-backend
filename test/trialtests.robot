*** Settings ***

Library  RequestsLibrary

*** Variables ***


*** test cases ***

Get Request Test
    ${response}=    GET  http://javaohjelmointi.net:15001/book/all

Quick Get A JSON Body Test
      ${response}=    GET  url=http://javaohjelmointi.net:15001/book?id=1
      Should Be Equal As Strings   JS for Dummies   ${response.json()}[title]
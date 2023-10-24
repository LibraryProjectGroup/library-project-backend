# 🕵️ Testing in backend

Backend uses both Robotframework and Jest to test endpoints.

## ☑️ Requirements

 - Backend is running with connection to db (<a href='https://github.com/LibraryProjectGroup/library-project-backend#readme'>Instructions</a>)
 - For Robottests the required installations are (<a href='https://github.com/LibraryProjectGroup/library-project-frontend/blob/main/robot/aboutRobotTests.md'>Instructions</a>):
     - Robotframework
     - Python
     - Pip
     - Robotframework-requests (`pip install robotframework-requests==0.95`)

## 🧪 Testing
<details>
  <summary>:eject_button: Jest</summary>

  ### Run Jest mocks
  Add following lines to .env
  ```
OIDC_AUTH_BACKLINK_URL=http://localhost:3002/auth
OIDC_AUTH_REDIRECT_URL=http://localhost:3002/auth/oidc
  ```

 - Open terminal in the location where backend is running (if running in Docker container, open containers terminal)
 - Run following command to run tests:

```
npm run mock
```
</details>

<details>
  <summary>:robot: Robotframework</summary>

  ### Run Robotframwork tests

[*Updated 6.10.2023*]
  Currently not recommended, tests will fail because tests require username and password to be hard coded into package.json to pass, robottests are currently used in workflows where test can be ran with GitHub secrets.

  Testing with robot:

 - Run following command:
  ```
npm run test
  ```
</details>

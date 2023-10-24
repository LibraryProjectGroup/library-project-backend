## What the previous team used:

> Note: This was not used by the fall 2023-team.

To make SQL queries from backend, a local database isn't necessary: the backend can access remote database via PuTTY and tunneling. <br> To set up tunneling in PuTTY, have _Host Name_ set as **javaohjelmointi.net** and _Port_ as **22**. Under _Connection-> SSH -> Tunnels_, set _Source port_ as **3306** and _Destination_ as **localhost:3306**. After that, select _Session_ again, name the session under _Saved Session_, save it, select it from the list, and press **Open**. <br>
After connecting, input proper credentials from **#secrets**. The database is then available on localhost:3306.
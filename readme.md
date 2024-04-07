# This simple script makes one simple task: moves npm packages from private gitlab registry to your Nexus registry

**install dependencies:**

```console
npm install
```

**configure connection related params in move2nexus.js**

```javascript
// GitLab connection params
const gitlabRegistryUrl = "https://gitlab.some-company.com/";
const gitlabProjectId = "project ID, for example 888";
const gitlabToken = "your_personal_access_token";

// Nexus connection params
const nexusUrl = "http://nexus.some-company.com:8081";
const nexusUsername = "admin";
const nexusPassword = "password"; //sometimes it works as is =)
```

**make some coffie and start script:**

```console
node move2nexus.js
```

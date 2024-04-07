# This simple script makes one simple task: moves npm packages from a private gitlab registry to your Nexus registry
### - incredible fast* 
### - without downloading npm packages to local host

###### *tested on private registry with 4K+ npm packages moved to Nexus

**install dependencies:**

```console
npm install
```

**configure connection related params in gitlab2nexus.js**

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
node gitlab2nexus.js
```

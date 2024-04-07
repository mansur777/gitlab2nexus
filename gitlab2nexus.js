process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import axios from "axios";

const gitlabRegistryUrl = "https://gitlab.some-company.com"; // change to your actual private npm registry URL
const gitlabProjectId = "XXX"; //numeric gitlab project id
const gitlabToken = "xxxxxxxxxxxxxxx"; //PAT - your gitlab personal access token
const startFromPackageNumber = 1; //dafault value is 1, adjust if needed

const nexusUrl = "https://nexus.some-company.com"; //your Nexus instanse URL
const nexusRepository = gitlabProjectId; //just don't touch unless you really need it and undertand what you doing
const nexusUsername = "username";
const nexusPassword = "Password";

async function getPackageList() {
  let allPackages = [];
  let page = 1;
  const perPage = 100; // Adjust per page limit as needed

  while (true) {
    const response = await axios.get(
      `${gitlabRegistryUrl}/api/v4/projects/${gitlabProjectId}/packages`,
      {
        params: {
          order_by: "created_at",
          page: page,
          pagination: "keyset",
          per_page: perPage,
          sort: "asc",
        },
        headers: {
          "Private-Token": gitlabToken,
        },
      }
    );

    const packages = response.data;
    allPackages = allPackages.concat(packages);

    if (packages.length < perPage) {
      break; // Reached the end of the list
    }
    page++;
  }
  return allPackages;
}

async function transferPackage(packageId) {
  const response = await axios.get(
    `${gitlabRegistryUrl}/api/v4/projects/${gitlabProjectId}/packages/${packageId}`,
    {
      headers: {
        "Private-Token": gitlabToken,
      },
    }
  );

  const packageDetails = response.data;
  const packageName = packageDetails.name;
  console.log("packageName", packageName);
  const packageVersion = packageDetails.version;
  console.log("packageVersion", packageVersion);

  const downloadUrl = `${gitlabRegistryUrl}/api/v4/projects/${gitlabProjectId}/packages/npm/${packageName}/-/${packageName}-${packageVersion}.tgz`;

  const packageResponse = await axios.get(downloadUrl, {
    headers: {
      "Private-Token": gitlabToken,
    },
    responseType: "arraybuffer",
  });

  const arrayBuffer = packageResponse.data;
  const buffer = Buffer.from(arrayBuffer);
  const packageBlob = new Blob([buffer], { type: "application/octet-stream" });
  const formData = new FormData();
  formData.append(
    "npm.asset",
    packageBlob,
    `${packageName}-${packageVersion}.tgz`
  );

  const nexusResponse = await axios.post(
    `${nexusUrl}/service/rest/v1/components?repository=${nexusRepository}`,
    formData,
    {
      auth: {
        username: nexusUsername,
        password: nexusPassword,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log(
    `Package ${packageName} v.${packageVersion} with ID ${packageId} transferred successfully to Nexus`
  );
}

async function transferAllPackages() {
  const packageList = await getPackageList();
  for (const mypackage of packageList) {
    if (mypackage.id > startFromPackageNumber - 1) {
      await transferPackage(mypackage.id);
    }
  }
  console.log("All packages transferred successfully to Nexus");
}

transferAllPackages().catch((err) => {
  console.error("An error occurred:", err);
});

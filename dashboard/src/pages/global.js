async function credentials_object(router, fetch_properties) {
  const auth_data = JSON.parse(await localStorage.getItem("auth"));

  if (!auth_data) {
    console.log("No auth data found.");
    return null;
  }

  return { deviceid: auth_data.device_id, privatekey: auth_data.private_key, additional_data: { org: router.query.org, namespace: router.query.namespace, project_id: router.query.project }, fetch_properties };
}

function get_first_letters(sentence) {
  return sentence
    .split(' ') // Split the sentence into words
    .map(word => word.charAt(0)) // Get the first letter of each word
    .join(''); // Join them back into a string
}

export { credentials_object, get_first_letters }
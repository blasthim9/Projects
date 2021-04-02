const fetch = require("node-fetch");

let url =
  "https://pkgstore.datahub.io/machine-learning/poker/poker_json/data/a0b39c1481d8f916852869ba7ae746b9/poker_json.json";

let json;

const request = async () => {
    const response = await fetch(url);
    json = await response.json();
    
}

const useRequest = async () => {
    const res = await request()
    console.log(json)
  }
  
useRequest()
console.log(json)

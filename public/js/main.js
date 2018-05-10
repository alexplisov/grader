(() => {
  console.log("JavaScript initialized");
  fetch("http://localhost:3000/cities").then(res => {
    res.json().then( JSONData => JSONData.forEach( cityJSONData => {
      appendCity(cityJSONData);
    }));
  });
  function appendCity(cityJSONData) {
    let main = document.querySelector("main");
    let cityTemplate = document.querySelector("#city");
    let title = cityTemplate.content.querySelector(".city > .city-heading > h2");
    title.innerText = cityJSONData.name;
    let newCity = document.importNode(cityTemplate.content, true);
    main.appendChild(newCity);
  }
})();



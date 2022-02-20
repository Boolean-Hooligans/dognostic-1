//key to get into dog API
api_key = "ef3680c6-31d5-47a8-88f2-51bfa1e66f94";

var breeds;
// save breeds buttons

const saveToLocalStorage = (breed_id) => {
  localStorage.setItem("save1", "id");
};
function saveBreed(selectedButton) {
  // get selected button text content
  var button1Text = document.getElementById("save1").textContent;
  var button2Text = document.getElementById("save2").textContent;
  var button3Text = document.getElementById("save3").textContent;
  var button4Text = document.getElementById("save4").textContent;

  // check if selected button text content = "SAVE BREED" or something else...
  // If "SAVE BREED" -> save currently selected breed from drop-down to selected button

  if (selectedButton === 1) {
    if (button1Text === "SAVE BREED") {
      document.getElementById("save1").textContent = breed_select
        .children(":selected")
        .attr("id");
    } else {

      getDogByBreed(button1Text);

    }
  }
  if (selectedButton === 2) {
    if (button2Text === "SAVE BREED") {
      document.getElementById("save2").textContent = breed_select
        .children(":selected")
        .attr("id");
    } else {

      getDogByBreed(button2Text);

    }
  }
  if (selectedButton === 3) {
    if (button3Text === "SAVE BREED") {
      document.getElementById("save3").textContent = breed_select
        .children(":selected")
        .attr("id");
    } else {

      getDogByBreed(button3Text);

    }
  }
  if (selectedButton === 4) {
    if (button4Text === "SAVE BREED") {
      document.getElementById("save4").textContent = breed_select
        .children(":selected")
        .attr("id");
    } else {

      getDogByBreed(button4Text);

    }
  }
}

// Breed search

$(".breed_search").on("input", function (e) {
  var search_str = $(this).val();
});

// Setup the Controls

var breed_select = $("select.breed_select");
breed_select.change(function () {
  var id = $(this).children(":selected").attr("id"); // export jquery to save breed function
  console.log(id);
  getDogByBreed(id);
});

// Put the breeds in the Select control
function populateBreedsSelect(breeds) {
  breed_select.empty().append(function () {
    var output = "";

    $.each(breeds, function (key, value) {
      output += '<option id="' + value.name + '">' + value.name + "</option>";
    });
    return output;
  });
}
function getDogByBreed(breed_id) {
  console.log("breed_id: ", breed_id);

  // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)get dog breed vs get dog image
  fetch("https://api.thedogapi.com/v1/breeds/search?q=" + breed_id, {
    method: "GET",

    headers: {
      "Content-Type": "application/vnd.api+json",
      Authentication: "ef3680c6-31d5-47a8-88f2-51bfa1e66f94",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      var imageId = data[0].reference_image_id;
      getDogImage(imageId);
    });
}
// triggered when the breed select control changes
function getDogImage(image_id) {
  // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)
  fetch("https://api.thedogapi.com/v1/images/" + image_id, {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authentication: "ef3680c6-31d5-47a8-88f2-51bfa1e66f94",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        // if there are no images returned
        clearBreed();
        $("#breed_data_table").append(
          "<tr><td>Sorry, there is no image available for that breed yet.</td></tr>"
        );
      } else {
        //else display the breed image and data

        displayBreed(data);
      }
      //console.log('Success:', data);
    })
    .catch((error) => {});
}
// clear the image and table
function clearBreed() {
  $("#breed_image").attr("src", "");
  $("#breed_data_table div").remove();
}

// display the breed image and data
function displayBreed(info) {
  $("#breed_image").attr("src", info.url);
  $("#breed_data_table div").remove();

  var breed_data = info.breeds[0];
  var cleanData = {};

  for (var key in breed_data) {
    if (!(key === "id" || key === "reference_image_id" || key === "origin")) {
      if (key.indexOf("_") > 0) {
        var newKey = key;
        newKey = key.replace(/_/g, " ");
        cleanData[newKey] = breed_data[key];
      } else {
        if (key === "weight") {
          cleanData[key] = breed_data[key].metric + " kg";
        } else if (key === "height") {
          cleanData[key] = breed_data[key].metric + " cm";
        } else {
          cleanData[key] = breed_data[key];
        }
      }
    }
  }
  console.log(cleanData);
// Dynamically adds breed data to the breed table
  $.each(cleanData, function (key, value) {
    console.log(key, value);


    if (!(key === "id" || key === "reference image id" || key === "origin")) {
      //  add a row to the table
      $("#breed_data_table").append(
        "<div class='columns'><div class='column'>" +
          key +
          "</div><div class='column'>" +
          value +
          "</div></div>"
      );
    }
  });
}

// call the getBreeds function which will load all the Dog breeds into the select control

function dogBreedApi() {
  fetch("https://api.thedogapi.com/v1/breeds", {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authentication: "ef3680c6-31d5-47a8-88f2-51bfa1e66f94",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      populateBreedsSelect(data);
    })
    .catch((error) => {});
}

// fetch dog daily news
function randomDogNews() {
  fetch("https://daily-dog-news.p.rapidapi.com/news", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "daily-dog-news.p.rapidapi.com",
      "x-rapidapi-key": "a771196338msh274eb7df871c5dfp1ddb90jsn462f123fdc7f",
    },
  })
    .then((response) => response.json())

    .then((data) => {
      displayDogFacts(data);
    })
    .catch((error) => {});
}

//pulls the title and url from the API data
function displayDogFacts(info) {
  $(".title1").append(info[0].title);
  window.open(
    $(".title1").click(function () {
      $(this).attr("href", info[0].url);
    })
  );

  $(".title2").append(info[1].title);
  window.open(
    $(".title2").click(function () {
      $(this).attr("href", info[1].url);
    })
  );

  $(".title3").append(info[2].title);
  window.open(
    $(".title3").click(function () {
      $(this).attr("href", info[2].url);
    })
  );

  $(".title4").append(info[3].title);
  window.open(
    $(".title4").click(function () {
      $(this).attr("href", info[3].url);
    })
  );

  $(".title5").append(info[4].title);
  window.open(
    $(".title5").click(function () {
      $(this).attr("href", info[4].url);
    })
  );
}

//loads everything in order
window.onload = function () {
  dogBreedApi();
  randomDogNews();
};

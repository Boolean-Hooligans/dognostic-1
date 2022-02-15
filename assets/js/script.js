//key to get into dog API
api_key = "ef3680c6-31d5-47a8-88f2-51bfa1e66f94";

var breeds;

$(".breed_search").on("input", function (e) {
  var search_str = $(this).val();
});

// Setup the Controls
var $breed_select = $("select.breed_select");
$breed_select.change(function () {
  var id = $(this).children(":selected").attr("id");
  console.log(id);
  getDogByBreed(id);
});

// Put the breeds in the Select control
function populateBreedsSelect(breeds) {
  $breed_select.empty().append(function () {
    var output = "";
    $.each(breeds, function (key, value) {
      output += '<option id="' + value.name + '">' + value.name + "</option>";
    });
    return output;
  });
}
function getDogByBreed(breed_id) {
  console.log("breed_id: ", breed_id);

  // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)
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
      console.log(data);
    });
}
// triggered when the breed select control changes
function getDogImage(image_id) {
  console.log("breed_id: ", image_id);

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
        console.log("data: ", data);
        displayBreed(data);
      }
      //console.log('Success:', data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// clear the image and table
function clearBreed() {
  $("#breed_image").attr("src", "");
  $("#breed_data_table tr").remove();
}

// display the breed image and data
function displayBreed(info) {
  $("#breed_image").attr("src", info.url);
  $("#breed_data_table tr").remove();
  console.log(info);
  var breed_data = info.breeds[0];
  $.each(breed_data, function (key, value) {
    // as 'weight' and 'height'
    if (key == "weight" || key == "height") value = value.metric;
    // add a row to the table
    $("#breed_data_table").append(
      "<tr><td>" + key + "</td><td>" + value + "</td></tr>"
    );
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
      console.log("Success:", data);
      populateBreedsSelect(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// fetch dog daily news
function randomDogNews() {
  fetch("https://daily-dog-news.p.rapidapi.com/news", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "daily-dog-news.p.rapidapi.com",
      "x-rapidapi-key": "5f11a0be5fmsh5a12f34eab0b62bp10b603jsn304276e4e806",
    },
  })
    .then((response) => response.json())

    .then((data) => {
      displayDogFacts(data);
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("error", error);
    });
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

var height = $(window).height();
var width = $(window).width();
var totalPhotos = 20;
var flickerFeedUrl = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
var flickerFeedUrlAuthor = "http://api.flickr.com/services/feeds/photos_public.gne?id=AUTHORID&jsoncallback=?";

$(document).ready(function () {
    console.log("ready!");

    $('#loadFlickr').click(function () {
        loadFlickrAgain(flickerFeedUrl);
    });

    getData(flickerFeedUrl);
});

/* Get the images by the given Url */
function getData(Url) {
    var photosCounter = 0;
    var rowX = (width / 7);
    var rowY = 1;
    var rowXcounter = 1;

    $("#loading").show();

    $.getJSON(Url, {
        format: "json"
    })
      .done(function (data) {
          // open Box
          $('.boxCover').addClass("openBoxCover");

          // wait for the box to be open
          setTimeout(function () {

              $.each(data.items, function (i, item) {
                  var wrapper = $("<div class=\"gallery-item wrapper" + i + "\">").css("top", (height - 100) + "px").appendTo("#gallery");

                  // appending the photos to the gallery
                  setTimeout(function () {

                      var rotateSign = Math.floor((Math.random() * 2) + 1);
                      var rotateNum = Math.floor((Math.random() * 5) + 1);
                      var posY = (rowY * 22) + "px";
                      var posX = (rowX * rowXcounter) + "px";
                      var rotate;

                      if (((i + 1) % 5) === 0) {
                          rowY += 8;
                          rowXcounter = 0;
                      }

                      rowXcounter++;
					  
					  // generate random rotate degree
                      if (rotateSign == 1) rotate = rotateNum;
                      else rotate = "-" + rotateNum;

                      $("<img class=\"photo\">").attr("src", item.media.m).appendTo(".wrapper" + i).load(
                          function () {
                              photosCounter++;
                              if (photosCounter === totalPhotos) {
                                  $("#loading").hide();
                                  $('.boxCover').removeClass("openBoxCover");
                              }
                          }).parent().animate({
                              opacity: 1,
                              width: "150px",
                              height: "150px",
                              left: posX,
                              top: posY
                          },
                          {
                              step: function (now, fx) {
                                  $(this).css('padding', '5px 5px 5px 5px');
                                  $(this).css('background-color', 'white');
                                  $(this).css('-webkit-transform', 'rotate(' + rotate + 'deg)');
                                  $(this).css('-moz-transform', 'rotate(' + rotate + 'deg)');
                                  $(this).css('-ms-transform', 'rotate(' + rotate + 'deg)');
                                  $(this).css('-o-transform', 'rotate(' + rotate + 'deg)');
                                  $(this).css('transform', 'rotate(' + rotate + 'deg)');
                              },
                              duration: 'slow'
                          }, 'linear');

                      // add photo details
                      $("<span class=\"photo-details hide\">").html(generateInfo(item)).appendTo(".wrapper" + i);

                      $(".wrapper" + i).hover(function () {
                          $(this).find('.photo-details').toggleClass("hide");
                          $(this).find('img').toggleClass("fade");
                      });

                  }, (i * 100));
              });
          }, 300);
      });
}

/* Creates the photo information */
function generateInfo(item){
	var info = "<h5>Title: " + (item.title.length > 30 ? item.title.substring(0, 27) + "..." : item.title) + "</h5>" +
               "<h6>Date: " + new Date(item.date_taken).toLocaleString() + "</h6>" +
               "<h6>Author: <a href=\"#\" onclick=\"showAuthor('" + item.author_id + "')\">" + item.author.substring(item.author.indexOf("(") + 1, item.author.indexOf(")")) + "</a></h6>" +
               "<h6>Link: <a href=\"" + item.media.m + "\">Click Here</a></h6>"
			   
	return info;
}

/* Get photos by the given author */
function showAuthor(author) {
    ClearGallery();

    setTimeout(function () {
        // Clear Gallery
        $('.gallery-item').remove();
        getData(flickerFeedUrlAuthor.replace("AUTHORID", author));
    }, 3000);
}

/* Get photos from flickr (with clear) */
function loadFlickrAgain(Url) {
    ClearGallery();

    setTimeout(function () {
        // Clear Gallery
        $('.gallery-item').remove();
        getData(Url);
    }, 3000);
}

/* Clear the gallery */
function ClearGallery() {
    var rotate = "-100";

    $.each([12, 3, 7, 18, 5, 0, 16, 6, 1, 17, 11, 2, 10, 4, 8, 13, 9, 14, 15, 19], function (index, value) {
        setTimeout(function () {
            $('.wrapper' + value).animate({
                width: "150px",
                height: "150px",
                opacity: "0",
                top: height - 180
            },
                {
                    step: function (now, fx) {
                        $(this).css('padding', '5px 5px 5px 5px');
                        $(this).css('background-color', 'white');
                        $(this).css('-webkit-transform', 'rotate(' + rotate + 'deg)');
                        $(this).css('-moz-transform', 'rotate(' + rotate + 'deg)');
                        $(this).css('-ms-transform', 'rotate(' + rotate + 'deg)');
                        $(this).css('-o-transform', 'rotate(' + rotate + 'deg)');
                        $(this).css('transform', 'rotate(' + rotate + 'deg)');
                    },
                    duration: 'slow'
                }, 'linear');
        }, (index * 100));
    });
}
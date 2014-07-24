
var totalPhotos = 20,
	width = $(window).width(),
	height = $(window).height(),
	flickerFeedUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',
	flickerFeedUrlAuthor = 'http://api.flickr.com/services/feeds/photos_public.gne?id=AUTHORID&jsoncallback=?';

$(document).ready(function () {
    console.log('ready!');

    $('#loadFlickr').click(function () {
        loadFlickrAgain(flickerFeedUrl);
    });

    getData(flickerFeedUrl);
});

/* Get the images by the given Url */
function getData(Url) {
    var photosCounter = 0,
		rowXcounter = 1,
		lineheigth = 22,
		photosinrow = 5,
		rowX = (width / 7),
		rowY = 1;

    $('#loading').show();

    $.getJSON(Url, {
        format: 'json'
    })
      .done(function (data) {
          // open Box
          $('.boxCover').addClass('openBoxCover');

          // wait for the box to be open
          setTimeout(function () {

              $.each(data.items, function (i, item) {
                  $('<div class=\"gallery-item wrapper' + i + '\">').css('top', (height - 100) + 'px').appendTo('#gallery');

                  // appending the photos to the gallery
                  setTimeout(function () {
                      var posY = (rowY * lineheigth) + 'px',
                          posX = (rowX * rowXcounter) + 'px',
                          rotate = randomRotate();

                      if (((i + 1) % photosinrow) === 0) {
                          rowY += 8;
                          rowXcounter = 0;
                      }

                      rowXcounter++;

                      $('<img class=\"photo\">').attr('src', item.media.m).appendTo('.wrapper' + i).load(
                          function () {
                              photosCounter++;
                              if (photosCounter === totalPhotos) {
                                  $('#loading').hide();
                                  $('.boxCover').removeClass('openBoxCover');
                              }
                          }).parent().animate({
                              opacity: 1,
                              width: '150px',
                              height: '150px',
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
                      $('<span class=\"photo-details hide\">').html(generateInfo(item)).appendTo('.wrapper' + i);

                      $('.wrapper' + i).hover(function () {
                          $(this).find('.photo-details').toggleClass('hide');
                          $(this).find('img').toggleClass('fade');
                      });
                  }, (i * 100));
              });
          }, 300);
      });
}

function randomRotate() {
    var rotateSign = Math.floor((Math.random() * 2) + 1),
		rotateNum = Math.floor((Math.random() * 9) + 1),
		rotate;

    // generate random rotate degree
    if (rotateSign === 1) rotate = rotateNum;
    else rotate = '-' + rotateNum;

    return rotate;
}

/* Creates the photo information */
function generateInfo(item) {
    var info = '<h5>Title: ' + (item.title.length > 30 ? item.title.substring(0, 27) + '...' : item.title) + '</h5>' +
               '<h6>Date: ' + new Date(item.date_taken).toLocaleString() + '</h6>' +
               '<h6>Author: <a href=\"#\" onclick=\"showAuthor(&quot;' + item.author_id + '&quot;)\">' + item.author.substring(item.author.indexOf('(') + 1, item.author.indexOf(')')) + '</a></h6>' +
               '<h6>Link: <a href=\"' + item.media.m + '\">Click Here</a></h6>';

    return info;
}

/* Get photos by the given author */
function showAuthor(author) {
    ClearGallery();

    setTimeout(function () {
        // Clear Gallery
        $('.gallery-item').remove();
        getData(flickerFeedUrlAuthor.replace('AUTHORID', author));
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
    var rotate;

    $.each([12, 3, 7, 18, 5, 0, 16, 6, 1, 17, 11, 2, 10, 4, 8, 13, 9, 14, 15, 19], function (index, value) {
        rotate = randomRotate();
        console.log(rotate);
        setTimeout(function () {
            $('.wrapper' + value).animate({
                width: '150px',
                height: '150px',
                opacity: '0',
                top: height - 180
            },
                {
                    duration: 'slow'
                }, 'linear');
        }, (index * 100));
    });
}
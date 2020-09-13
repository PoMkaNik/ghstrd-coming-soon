$('.countdown').downCount({
  date: '10/01/2020 00:00:00',
  offset: +3,
});

// Dot Navigation

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
    placement: 'left',
  });

  $(window).bind('scroll', function (e) {
    dotnavigation();
  });

  function dotnavigation() {
    const numSections = $('section').length;

    $('#dot-nav li a').removeClass('active').parent('li').removeClass('active');
    $('section').each(function (i, item) {
      const ele = $(item);
      let nextTop;
      let thisTop;

      if (typeof ele.next().offset() != 'undefined') {
        nextTop = ele.next().offset().top;
      } else {
        nextTop = $(document).height();
      }

      if (ele.offset() !== null) {
        thisTop = ele.offset().top - (nextTop - ele.offset().top) / numSections;
      } else {
        thisTop = 0;
      }

      const docTop = $(document).scrollTop();

      if (docTop >= thisTop && docTop < nextTop) {
        $('#dot-nav li').eq(i).addClass('active');
      }
    });
  }

  /* get clicks working */
  $('#dot-nav li').click(function () {
    const id = $(this).find('a').attr('href');
    let posi;
    let ele;
    let padding = 0;

    ele = $(id);
    posi = ($(ele).offset() || 0).top - padding;

    $('html, body').animate({ scrollTop: posi }, 'slow');

    return false;
  });

  /* end dot nav */
});

// Gallery Wall
// user settings
const wallImgFolderPath = 'img/wall/resized/'; // provide path to resized images for Wall Gallery
const wallImgExtension = '.jpg';
const numberOfImgInWallFolder = 45; // number of images in wallImgFolderPath
const maxImgHeight = 100; // will effect on number of rows and actual height

let counter = 1;
let rowWidth = 0;
let rowsCreated = 0;

function initWallGallery() {
  //create first row
  createWallGalleryRow();
  rowsCreated = 1;
  //call the function
  createWallGallery();
}

function createWallGalleryRow() {
  $('#wall-gallery').append(
    $('<div></div>').addClass('row justify-content-center'),
  );
}

function createWallGallery() {
  // get height/width of #wall-gallery div
  const wallGalleryDiv = $('#wall-gallery');
  const wallGalleryDivHeight = wallGalleryDiv.height();
  const wallGalleryDivWidth = wallGalleryDiv.width();

  //one row if wallGalleryDiv cant handle 2*maxImgHeight or calculated based on wallGalleryDivHeight
  let numberOfRows;
  if (wallGalleryDivHeight < maxImgHeight * 2) {
    numberOfRows = 1;
  } else {
    numberOfRows = Math.round(wallGalleryDivHeight / maxImgHeight);
  }

  const galleryImgHeight = Math.round(wallGalleryDivHeight / numberOfRows, 0);

  const img = new Image();

  img.onload = function () {
    const sizeRatio = this.width / this.height;
    const calculatedImgWidth = Math.round(galleryImgHeight * sizeRatio, 0);
    rowWidth += calculatedImgWidth;
    counter++;

    if (counter < numberOfImgInWallFolder) {
      if (rowWidth < wallGalleryDivWidth) {
        // create img in #wall-gallery
        wallGalleryDiv
          .children()
          .last()
          .append($(img).height(`${galleryImgHeight}px`));
        //go to next loop iteration
        createWallGallery();
      } else {
        // add one more img in row to fill all the height
        wallGalleryDiv
          .children()
          .last()
          .append($(img).height(`${galleryImgHeight}px`));
        // then need to add new row
        // check if new row can be created
        if (rowsCreated < numberOfRows) {
          createWallGalleryRow();
          // increase number of rowsCreated
          rowsCreated++;
          // reset rowWidth
          rowWidth = 0;
          // run function for new row fulfillment
          createWallGallery();
        }
      }
    } else {
      //exit loop
      console.log('Not enough images in Wall folder!');
      // TODO we can decrease height based on actual number of images processed
      // and rows created
      console.log(galleryImgHeight);
      wallGalleryDiv.attr(
        'style',
        `min-height:${rowsCreated * galleryImgHeight}px; max-height:${
          rowsCreated * galleryImgHeight
        }px`,
      );
      $('#gallery').attr(
        'style',
        `min-height:${rowsCreated * galleryImgHeight}px;`,
      );
      // or change height on actual row number -1

      // or recalculate galleryImageHeight to fill all space

      // or we can process before all images to get actual row count and than
      // run actual creation of images in gallery based on the test performed

      // functionToContinueWith();
    }
  };

  img.src = wallImgFolderPath + counter + wallImgExtension;
}

function resetWallGallery() {
  // remove 'old' rows
  $('#wall-gallery').children().remove();
  // reset rowsCreated
  rowsCreated = 1;
  // reset rowWidth
  rowWidth = 0;
  // reset counter
  counter = 1;
}

// Google Static Map
// dynamic map
const mapStyle = style; // from https://mapstyle.withgoogle.com/
const mapDiv = document.getElementById('map');

const mapSettings = {
  center: { lat: 27.5, lng: -85.5 },
  zoom: 5,
  maptype: 'roadmap',
  disableDefaultUI: true,
};

const myLocations = [
  {
    name: 'Miami, FL',
    lat: 25.761681,
    lng: -80.191788,
    color: 'blue',
    // iconUrl: 'http://tinyurl.com/jrhlvu6',
  },
];

function initMap() {
  // create map based on settings and style
  const map = new google.maps.Map(mapDiv, {
    center: mapSettings.center,
    zoom: mapSettings.zoom,
    mapTypeId: mapSettings.maptype,
    styles: mapStyle,
    disableDefaultUI: mapSettings.disableDefaultUI,
  });
  // put markers on the map
  myLocations.forEach((marker, i) => {
    let markerPosition = {
      lat: marker.lat,
      lng: marker.lng,
    };
    new google.maps.Marker({ position: markerPosition, map: map });
  });
}

// init image Wall Gallery
$(document).ready(function () {
  initWallGallery();
});

// $(window).bind('resizeEnd', function () {
//   //do something, window hasn't changed size in 500ms
//   // reset gallery
//   resetWallGallery();
//   // new initiation of gallery
//   initWallGallery();
// });

// $(window).resize(function () {
//   if (this.resizeTO) clearTimeout(this.resizeTO);
//   this.resizeTO = setTimeout(function () {
//     $(this).trigger('resizeEnd');
//   }, 500);
// });

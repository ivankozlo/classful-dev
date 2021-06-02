# croppaJS

## Documentation
            

### Example

```HTML
<link href="css/croppa.css" media="screen" rel="stylesheet" type="text/css" />
<script src="https://code.jquery.com/jquery-3.4.1.min.js" ></script>
<script src="js/croppa.js"></script>

<script>
var croppa = new Croppa({
    image_url: 'img/2.jpg',
    container: '#cropping-area',
    container_size: [400, 500],
    crop_box_size: [300, 250],
    show_zoomer: true,
    cross_origin: true,
});

croppa.rotate_left();
croppa.zoom_in();
var base64 = croppa.result();

</script>

```

### Options

**image_url - Image URL**

image_url: 'https://localhost/image.jpg'

default : null

**container - Container selector**

container: '#cropping-area'

default : null

**container_size - Container max width(400) & height(300)**

container_size: [400, 300]

default : [200, 200]

**crop_box_size - crop box size width(200) & height(150) - The visible part of the image**

crop_box_size: [200, 150]

default : [100, 100]

**show_zoomer - show zoomer - range input**

show_zoomer: true

default : false

**cross_origin - enable/disable cross origin**

cross_origin: true

default : false

### Methods

**result()**

Get the resulting crop of the image. It returns base64 string.

**zoom( value )**

Set the zoom of a Croppa instance. 

min = 1.

**zoom_in()**

Zoom in.

**zoom_out()**

Zoom out.

min = 1.

**rotate(angle)**

Rotate the image by a specified degree amount.

**rotate_left()**

Rotate the image by a 90 degree left.

**rotate_right()**

Rotate the image by a 90 degree right.

**destroy()**

Destroy a Croppa instance and remove it from the DOM

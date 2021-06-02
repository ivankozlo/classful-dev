  var global_image_variable = '';
  var global_image_options_variable = '';
  
  jQuery(document).ready(function($)
  {
  
    var console = window.console || { log: function () {} };
    var URL = window.URL || window.webkitURL;
    var $image = $('#jquery_cropper_image');
    global_image_variable = $image;
    //var $download = $('#download');
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
    var options = {
      aspectRatio: 1 / 1,
      viewMode: 2,
      minCropBoxWidth: 500,
      minCropBoxHeight: 500,
      preview: '.img-preview',
      crop: function (e) {
        $dataX.val(Math.round(e.detail.x));
        $dataY.val(Math.round(e.detail.y));
        $dataHeight.val(Math.round(e.detail.height));
        $dataWidth.val(Math.round(e.detail.width));
        $dataRotate.val(e.detail.rotate);
        $dataScaleX.val(e.detail.scaleX);
        $dataScaleY.val(e.detail.scaleY);
      }
    };
    global_image_options_variable = options;
    var originalImageURL = $image.attr('src');
    var uploadedImageName = 'cropped.jpg';
    var uploadedImageType = 'image/jpeg';
    var uploadedImageURL;
  
    // Tooltip
    //$('[data-toggle="tooltip"]').tooltip();
  
    // Cropper
    $image.on({
      ready: function (e) {
        console.log(e.type);
      },
      cropstart: function (e) {
        console.log(e.type, e.detail.action);
      },
      cropmove: function (e) {
        console.log(e.type, e.detail.action);
      },
      cropend: function (e) {
        console.log(e.type, e.detail.action);
      },
      crop: function (e) {
        console.log(e.type);
      },
      zoom: function (e) {
        console.log(e.type, e.detail.ratio);
      }
    }).cropper(options);
  
    // Buttons
    if (!$.isFunction(document.createElement('canvas').getContext)) {
      $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }
  
    if (typeof document.createElement('cropper').style.transition === 'undefined') {
      $('button[data-method="rotate"]').prop('disabled', true);
      $('button[data-method="scale"]').prop('disabled', true);
    }
  
    // Download
   /*  if (typeof $download[0].download === 'undefined') {
      $download.addClass('disabled');
    } */
  
    // Options
    $('.docs-toggles').on('change', 'input', function () {
      var $this = $(this);
      var name = $this.attr('name');
      var type = $this.prop('type');
      var cropBoxData;
      var canvasData;
  
      if (!$image.data('cropper')) {
        return;
      }
  
      if (type === 'checkbox') {
        options[name] = $this.prop('checked');
        cropBoxData = $image.cropper('getCropBoxData');
        canvasData = $image.cropper('getCanvasData');
  
        options.ready = function () {
          $image.cropper('setCropBoxData', cropBoxData);
          $image.cropper('setCanvasData', canvasData);
        };
      } else if (type === 'radio') {
        options[name] = $this.val();
      }
  
      $image.cropper('destroy').cropper(options);
    });
  
    // Methods
    $('.docs-buttons').on('click', '[data-method]', function () {
      var $this = $(this);
      var data = $this.data();
      var cropper = $image.data('cropper');
      var cropped;
      var $target;
      var result;
  
      if ($this.prop('disabled') || $this.hasClass('disabled')) {
        return;
      }
  
      if (cropper && data.method) {
        data = $.extend({}, data); // Clone a new one
  
        if (typeof data.target !== 'undefined') {
          $target = $(data.target);
  
          if (typeof data.option === 'undefined') {
            try {
              data.option = JSON.parse($target.val());
            } catch (e) {
              console.log(e.message);
            }
          }
        }
  
        cropped = cropper.cropped;
  
        switch (data.method) {
          case 'rotate':
            if (cropped && options.viewMode > 0) {
              $image.cropper('clear');
            }
  
            break;
  
          case 'getCroppedCanvas':
            if (uploadedImageType === 'image/jpeg') {
              if (!data.option) {
                data.option = {};
              }
  
              data.option.fillColor = '#fff';
            }
  
            break;
  
        }
  
        result = $image.cropper(data.method, data.option, data.secondOption);
  
        switch (data.method) {
          case 'rotate':
            if (cropped && options.viewMode > 0) {
              $image.cropper('crop');
            }
  
            break;
  
          case 'scaleX':
          case 'scaleY':
            $(this).data('option', -data.option);
            break;
  
          /* case 'getCroppedCanvas':
            if (result) {
              // Bootstrap's Modal
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
  
              if (!$download.hasClass('disabled')) {
                download.download = uploadedImageName;
                $download.attr('href', result.toDataURL(uploadedImageType));
              }
            }
  
            break; */
  
          case 'destroy':
            if (uploadedImageURL) {
              URL.revokeObjectURL(uploadedImageURL);
              uploadedImageURL = '';
              $image.attr('src', originalImageURL);
            }
  
            break;
        }
  
        if ($.isPlainObject(result) && $target) {
          try {
            $target.val(JSON.stringify(result));
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    });
  
    // Keyboard
    $(document.body).on('keydown', function (e) {
      if (e.target !== this || !$image.data('cropper') || this.scrollTop > 300) {
        return;
      }
  
      switch (e.which) {
        case 37:
          e.preventDefault();
          $image.cropper('move', -1, 0);
          break;
  
        case 38:
          e.preventDefault();
          $image.cropper('move', 0, -1);
          break;
  
        case 39:
          e.preventDefault();
          $image.cropper('move', 1, 0);
          break;
  
        case 40:
          e.preventDefault();
          $image.cropper('move', 0, 1);
          break;
      }
    });
    
   
    
      $(document).on('click', '#save_cropped_avatar', function (e) {
          
          document.getElementById('success_crop_save_notice').innerText = '';
          var cropper = $image.data('cropper');
          
          var crop_box_date = cropper.getCropBoxData();
          var crop_box_width = crop_box_date.width;
          var crop_box_height = crop_box_date.height;
          
          // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
          cropper.getCroppedCanvas({
            width: 160,
            height: 90,
            minWidth: 500,
            minHeight: 500,
            maxWidth: 4096,
            maxHeight: 4096,
            fillColor: '#fff',
            imageSmoothingEnabled: false,
            imageSmoothingQuality: 'high',
          }).toBlob((blob) => {
            var formData = new FormData();
            //var image_name = document.getElementById('jquery_cropper_image').src;
            var image_name = $('#jquery_cropper_image').attr('src');
            var image_name = 'cropped_'+image_name.replace('images/','');
            
            formData.append('croppedImage', blob, image_name);
  
            // Use `jQuery.ajax` method
            $.ajax('<?php echo FMT_DASHBOARD_ROOT_URI; ?>/profile/?ajax=iuc', {
              method: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function(response){
                  
              }
            });
          });
          
      });
  });

<script type="text/javascript">
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: uploadPreset,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info, result.info.secure_url);
        document
          .getElementById("uploadedimage")
          .setAttribute("src", result.info.secure_url);
      }
    }
  );

  export default {
    data: () => ({
      open: function () {
        myWidget.open();
      },
    }),
    props: {
      msg: String,
    },
  };
</script>

<template>
  <button v-on:click="open" id="upload_widget" class="cloudinary-button">
    Upload files
  </button>
</template>

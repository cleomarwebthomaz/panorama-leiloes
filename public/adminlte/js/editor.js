// $(function () {

//     // Summernote
//     $('#editor, textarea').summernote({
//        height: "200px",
//         callbacks: {
//             onImageUpload: function(files) {
//                 // url = $(this).data('upload');

//                 url = '/admin/uploads'

//                 sendFile(files[0], url, $(this));
//             }
//         }      
//     })
//   })
//   function sendFile(file, url, editor) {
//       var data = new FormData();

//       let token = document.head.querySelector('meta[name="csrf-token"]');

//       data.append("file", file);
//       data.append('_csrf', token.content)


//       var request = new XMLHttpRequest();

//       request.open('POST', url, true);

//       request.onload = function() {
//           if (request.status >= 200 && request.status < 400) {
//               // Success!
//               // var resp = request.responseText;
//               // editor.summernote('insertImage', resp);
//               // console.log(resp);
//           } else {
//               // We reached our target server, but it returned an error
//               // var resp = request.responseText;
//               // console.log(resp);
//           }
//       };
//       request.onerror = function(jqXHR, textStatus, errorThrown) {
//           // There was a connection error of some sort
//           console.log(jqXHR);
//       };
//       request.send(data); 

// }
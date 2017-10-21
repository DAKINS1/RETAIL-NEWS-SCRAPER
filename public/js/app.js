// Delete method, and reload page.

$(document).ready(function(){
  $('.delete-button').on('click', function(e){
    e.preventDefault();
    var qURL = location.href +'/' + $(this).data('comment');
    $.ajax({
      method:"DELETE",
      url:qURL
    })
    location.reload();
  })
})
document.addEventListener('DOMContentLoaded', function () {
  const editButtons = document.querySelectorAll('.edit-post-btn');
  const saveButtons = document.querySelectorAll('.save-edit-btn');
  const likeButtons = document.querySelectorAll('.like-btn');
      
  editButtons.forEach(button => {
    button.addEventListener('click', function () {
      const postId = button.getAttribute('data-post-id');
      const postContainer = document.getElementById(`post-${postId}`);
      const editContainer = postContainer.querySelector('.edit-post-container');
      const postContent = postContainer.querySelector('.card-text');

      postContent.style.display = 'none';
      editContainer.style.display = 'block';
    });
  });

  saveButtons.forEach(button => {
    button.addEventListener('click', function () {
      const postId = button.getAttribute('data-post-id');
      const postContainer = document.getElementById(`post-${postId}`);
      const editContainer = postContainer.querySelector('.edit-post-container');
      const postContent = postContainer.querySelector('.card-text');
      const textarea = editContainer.querySelector('textarea');

      // Perform the save action using AJAX
      const url = `/save_edit/${postId}/`;  // Replace with your Django endpoint for saving edits
      const data = { post_id: postId, edited_content: textarea.value };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": window.csrf_token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          // Update the displayed content
          postContent.textContent = result.updated_content;

          // Show the updated content and hide the edit container
          postContent.style.display = "block";
          editContainer.style.display = "none";
        })
        .catch((error) => console.error("Error:", error));
    });
  });
      
  likeButtons.forEach(likeButton => {
    let likeNum = parseInt(likeButton.parentNode.querySelector('.like-num').dataset.likeNumber, 10);
    likeButton.addEventListener('click', function () {
        const postId = likeButton.getAttribute('data-post-id');
        const action = likeButton.dataset.value === 'like' ? "like" : "unlike";
        const url = action === 'like' ? `/like_post/${postId}` : `/unlike_post/${postId}`;
        const csrf_token = window.csrf_token;
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrf_token,
        };
        const options = {
            method: "POST",
            headers: headers,
        };

        fetch(url, options)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const likeNumElement = likeButton.parentNode.querySelector('.like-num');
                    if (action == 'like') {
                        likeButton.className = 'btn btn-sm btn-danger';                   
                        likeButton.dataset.value = 'unlike';
                        const new_like_num = likeNum + 1;
                        likeNumElement.innerHTML = `Likes: ${new_like_num}`;
                        likeNum++;
                        console.log(likeNum);
                    }
                    if (action == 'unlike') {
                        likeButton.className = 'btn btn-sm btn-outline-danger';
                        likeButton.dataset.value = 'like';
                        const new_like_num = likeNum - 1;
                        likeNumElement.innerHTML = `Likes: ${new_like_num}`;
                        likeNum--;
                    }
                }
            });
        });
    });

      
    });
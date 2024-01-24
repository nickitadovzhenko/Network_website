    document.addEventListener('DOMContentLoaded', function () {
        const editButtons = document.querySelectorAll('.edit-post-btn');
        const saveButtons = document.querySelectorAll('.save-edit-btn');

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
    });
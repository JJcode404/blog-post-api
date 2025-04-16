const createPost = (req, res) => {
  res.json({
    message: " you have succefully created a post and saved to the database",
  });
};
const getAllposts = (req, res) => {
  res.json({
    message: "you have accessed all posts",
  });
};
const getPost = (req, res) => {
  const { postid } = req.params;
  res.json({
    message: `you have accessed post ${postid}`,
  });
};
const updatePost = (req, res) => {
  const { postid } = req.params;
  res.json({
    message: `you have succefully updated post ${postid}`,
  });
};

const deletePost = (req, res) => {
  const { postid } = req.params;
  res.json({
    message: `you have succefully deleted post ${postid} `,
  });
};

export { createPost, deletePost, getAllposts, getPost, updatePost };
